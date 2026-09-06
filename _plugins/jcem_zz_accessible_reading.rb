# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/

require "digest"
require "fileutils"
require "json"
require "nokogiri"
require "pathname"
require "jekyll"

module Jcem
  module AccessibleReading
    ARTICLE_SELECTOR = "article.jcem-post"
    CONTENT_SELECTOR = "article.jcem-post .page__content"
    TOC_SELECTOR = "[data-jcem-article-toc]"

    module_function

    def fatal(message)
      raise Jekyll::Errors::FatalException, "jcem_accessibility=#{message}"
    end

    def compact_text(node)
      node.text.to_s.gsub(/\s+/, " ").strip
    end

    def footnote_definition(document, id)
      document.xpath('//*[@id]').find { |node| node["id"] == id }
    end

    def text_before(link)
      container = link.ancestors.find { |node| %w[p td li].include?(node.name) } || link.parent
      cursor = link
      segments = []
      while cursor && cursor != container
        siblings = cursor.xpath("preceding-sibling::node()").map(&:text).join(" ")
        segments.unshift(siblings) unless siblings.empty?
        cursor = cursor.parent
      end
      segments.join(" ").gsub(/\s+/, " ").strip
    end

    def bible_reference(link)
      context = text_before(link)
      match = context.match(/—\s*Bíblia\.\s*([^.\d]+?)(?:\s+\d+)?\s*\.\s*([^—]{2,120})\s*\z/i)
      return nil unless match

      version = match[1].strip
      reference = match[2].strip.sub(/[.;,]\z/, "")
      "#{reference} #{version}"
    end

    def summarize_reference(full, link)
      bible_reference(link) || begin
        year = full.match(/\b(?:18|19|20)\d{2}[a-z]?\b/i)&.to_s
        author = full.match(/\A(?:[^\p{L}]*)([\p{L}][\p{L}'’.-]+)(?:\s*,|\s+et\s+al\.?)/iu)&.captures&.first
        author && year ? "#{author}, #{year}" : nil
      end
    end

    def reference_text(document, link)
      target_id = link["href"].to_s.sub(/\A#/, "")
      fatal("nota_sem_destino href=#{link['href']}") if target_id.empty?
      note = footnote_definition(document, target_id)
      fatal("nota_ausente id=#{target_id}") unless note

      clone = note.dup
      clone.css('[role="doc-backlink"], .reversefootnote, .jcem-footnote-backref, .jcem-footnote-backrefs, .jcem-spoken-reference').remove
      fallback = compact_text(clone).sub(/[.;,]+\z/, "")
      fatal("nota_vazia id=#{target_id}") if fallback.empty?
      [summarize_reference(fallback, link), fallback, target_id]
    end

    def normalize_noteref(document, link, summary = nil, full = nil, target_id = nil)
      summary, full, target_id = reference_text(document, link) unless full && target_id
      link.remove_attribute("aria-describedby")
      link["aria-details"] = target_id
      link["data-jcem-spoken-reference"] = summary if summary
      link["data-jcem-reference-summary"] = summary if summary
      link["data-jcem-reference-full"] = full
    end

    def normalize_table(document, table)
      return if table["role"] == "presentation"

      local_caption = table["data-jcem-caption"].to_s.strip
      table.remove_attribute("data-jcem-caption")
      caption = table.at_xpath("./caption")
      if caption.nil? && !local_caption.empty?
        caption = Nokogiri::XML::Node.new("caption", document)
        caption.content = local_caption
        table.prepend_child(caption)
      end
      fatal("tabela_sem_caption") unless caption && !compact_text(caption).empty?
      table["data-jcem-accessible-table"] = "true"
      table.xpath("./thead/tr/th").each_with_index do |header, index|
        header["scope"] ||= "col"
        next unless index.zero? && compact_text(header).empty?

        label = Nokogiri::XML::Node.new("span", document)
        label["class"] = "visually-hidden"
        label.content = "Linha"
        header.add_child(label)
      end
      table.xpath("./tbody/tr/th[1]").each { |header| header["scope"] ||= "row" }
    end

    def normalize_image(image)
      alt = image["alt"]
      decorative = image["data-jcem-decorative"] == "true" || image["role"] == "presentation"
      fatal("imagem_sem_alt src=#{image['src']}") if alt.nil?
      fatal("imagem_informativa_sem_alt src=#{image['src']}") if alt.to_s.strip.empty? && !decorative
      image["data-jcem-accessible-image"] = decorative ? "decorative" : "informative"
    end

    def normalize_custom_speech(element)
      required = %w[lang data-jcem-spoken-purpose data-jcem-spoken-source data-jcem-spoken-review]
      missing = required.reject { |attribute| !element[attribute].to_s.strip.empty? }
      fatal("fala_personalizada_incompleta campos=#{missing.join(',')}") unless missing.empty?
    end

    def quoted_paragraph?(paragraph, content)
      paragraph.ancestors.take_while { |ancestor| ancestor != content }.any? do |ancestor|
        %w[blockquote q].include?(ancestor.name) ||
          ancestor["role"] == "blockquote" ||
          ancestor.key?("data-jcem-blockquote") ||
          ancestor.key?("data-jcem-subquote")
      end
    end

    def build_toc(document, content, label)
      return if content.at_css(TOC_SELECTOR)

      headings = content.css("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]").reject do |heading|
        heading["id"].to_s.strip.empty? ||
          heading.ancestors.any? { |ancestor| ancestor["data-jcem-article-toc"] == "true" }
      end
      return if headings.empty?

      details = Nokogiri::XML::Node.new("details", document)
      details["class"] = "jcem-article-toc"
      details["data-jcem-article-toc"] = "true"
      details["data-jcem-tts"] = "full-only"

      summary = Nokogiri::XML::Node.new("summary", document)
      summary.content = label
      details.add_child(summary)

      nav = Nokogiri::XML::Node.new("nav", document)
      nav["aria-label"] = "Sumário do artigo"
      list = Nokogiri::XML::Node.new("ol", document)
      headings.each do |heading|
        item = Nokogiri::XML::Node.new("li", document)
        item["data-jcem-toc-level"] = heading.name.delete_prefix("h")
        link = Nokogiri::XML::Node.new("a", document)
        link["href"] = "##{heading['id']}"
        link.content = compact_text(heading)
        item.add_child(link)
        list.add_child(item)
      end
      nav.add_child(list)
      details.add_child(nav)

      paragraph = content.css("p").find do |candidate|
        !quoted_paragraph?(candidate, content) &&
          candidate.ancestors.none? { |ancestor| %w[aside nav figure table li details].include?(ancestor.name) }
      end
      if paragraph
        paragraph.add_next_sibling(details)
      elsif content.element_children.first
        content.element_children.first.add_previous_sibling(details)
      else
        content.add_child(details)
      end
    end

    def normalize_html(html, locale: "pt-BR", toc: false, toc_label: "Sumário do artigo")
      document = Nokogiri::HTML.parse(html, nil, "UTF-8")
      article = document.at_css(ARTICLE_SELECTOR)
      return html unless article

      title = article.at_css("#page-title") || article.at_css("h1")
      fatal("artigo_sem_titulo") unless title
      title["id"] = "page-title" if title["id"].to_s.empty?
      article["aria-labelledby"] = title["id"]
      article["lang"] ||= locale
      article["data-jcem-accessible-document"] = "1"

      content = document.at_css(CONTENT_SELECTOR)
      fatal("artigo_sem_conteudo") unless content
      content.css('table').each { |table| normalize_table(document, table) }
      content.css('img').each { |image| normalize_image(image) }
      references = content.css('a[role="doc-noteref"]').map do |link|
        summary, full, target_id = reference_text(document, link)
        [link, summary, full, target_id]
      end
      references.each { |link, summary, full, target_id| normalize_noteref(document, link, summary, full, target_id) }
      content.css('[role="blockquote"]').each do |quote|
        quote["aria-roledescription"] ||= "citação"
        quote["data-jcem-spoken-kind"] = "block-quote"
      end
      content.css('.jcem-inline-quote').each { |quote| quote["data-jcem-spoken-kind"] = "inline-quote" }
      content.css('[data-jcem-spoken-form]').each { |element| normalize_custom_speech(element) }
      build_toc(document, content, toc_label) if toc

      document.to_html
    end

    def normalize_document(document)
      return unless document.output_ext == ".html"
      return unless document.output.to_s.include?("jcem-post")

      locale = document.data["locale"] || document.site.config["locale"] || "pt-BR"
      toc_label = document.data["toc_label"].to_s.strip
      toc_label = "Sumário do artigo" if toc_label.empty?
      document.output = normalize_html(
        document.output.to_s,
        locale: locale,
        toc: document.data["toc"] == true,
        toc_label: toc_label
      )
    end

    def public_url(relative)
      normalized = relative.tr("\\", "/")
      return "/" if normalized == "index.html"
      return "/#{normalized.delete_suffix('index.html')}" if normalized.end_with?("/index.html")

      "/#{normalized}"
    end

    def page_manifest(path, destination)
      html = File.binread(path).force_encoding(Encoding::UTF_8)
      document = Nokogiri::HTML.parse(html, nil, "UTF-8")
      article = document.at_css('[data-jcem-accessible-document="1"]')
      return nil unless article

      content = article.at_css('.page__content')
      charts = content.css('[data-jcem-chart]')
      chart_assets = document.css('[data-jcem-chart-renderer], [data-jcem-chart-adapter]')
      fatal("grafico_sem_assets path=#{path}") if charts.any? && chart_assets.empty?
      fatal("asset_grafico_orfao path=#{path}") if charts.empty? && chart_assets.any?

      relative = Pathname.new(path).relative_path_from(Pathname.new(destination)).to_s
      {
        "url" => public_url(relative),
        "sha256" => Digest::SHA256.hexdigest(html),
        "language" => article["lang"],
        "capabilities" => {
          "block_quotes" => content.css('[data-jcem-spoken-kind="block-quote"]').length,
          "inline_quotes" => content.css('[data-jcem-spoken-kind="inline-quote"]').length,
          "references" => content.css('[data-jcem-reference-full]').length,
          "toc" => content.css(TOC_SELECTOR).length,
          "tables" => content.css('[data-jcem-accessible-table="true"]').length,
          "images" => content.css('[data-jcem-accessible-image]').length,
          "language_changes" => content.css('[lang]').length,
          "charts" => charts.length
        },
        "assets" => chart_assets.map { |node| node["src"] }.compact.uniq.sort
      }
    end

    def write_manifest(site)
      relative_paths = Dir.glob(File.join("**", "*.html"), base: site.dest).sort
      pages = relative_paths.filter_map do |relative_path|
        page_manifest(File.join(site.dest, relative_path), site.dest)
      end.sort_by { |entry| entry["url"] }
      fatal("manifesto_sem_publicacoes") if pages.empty?

      target = File.join(site.dest, "assets", "jcem", "accessibility-manifest.json")
      FileUtils.mkdir_p(File.dirname(target))
      payload = {
        "schema" => "jcem-accessibility/v1",
        "generated_by" => "jcem_zz_accessible_reading.rb",
        "chartjs_effective_version" => Jcem::Charts::VERSION,
        "pages" => pages
      }
      File.binwrite(target, "#{JSON.pretty_generate(payload)}\n")
    end
  end
end

Jekyll::Hooks.register :documents, :post_render do |document|
  Jcem::AccessibleReading.normalize_document(document)
end

Jekyll::Hooks.register :pages, :post_render do |document|
  Jcem::AccessibleReading.normalize_document(document)
end

Jekyll::Hooks.register :site, :post_write do |site|
  Jcem::AccessibleReading.write_manifest(site)
end
