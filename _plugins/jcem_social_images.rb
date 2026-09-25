# frozen_string_literal: true

require "cgi"
require "nokogiri"

module Jcem
  module SocialImages
    module_function

    def record_for_source(document, source)
      assets = document.site.data.dig("jcem_social_images", "assets")
      return unless assets.is_a?(Hash) && !source.to_s.empty?

      normalized = source.to_s.sub(%r{\A/+}, "")
      assets[source.to_s] || assets.find do |_canonical, record|
        record.is_a?(Hash) && record.values.any? do |variant|
          variant.is_a?(Hash) && variant["source"].to_s.sub(%r{\A/+}, "") == normalized
        end
      end&.last
    end

    def context_key(document)
      namespace = document.data["content_namespace"].to_s.strip
      return "" if namespace.empty?

      subnamespaces = Array(document.data["content_subnamespaces"]).map { |value| value.to_s.strip }.reject(&:empty?)
      ([namespace] + subnamespaces).join("/")
    end

    def contextual_record(document, record)
      return unless record.is_a?(Hash)

      contextual = record.dig("contexts", context_key(document))
      contextual.is_a?(Hash) ? contextual : record
    end

    def original_image(document)
      featured = document.data["featured_image"]
      return featured if featured.is_a?(String)
      if featured.is_a?(Hash)
        %w[path url src image].each do |key|
          return featured[key] unless featured[key].to_s.empty?
        end
      end
      header = document.data["header"].is_a?(Hash) ? document.data["header"] : {}
      header["image"] || header["overlay_image"]
    end

    def record_for(document)
      header = document.data["header"].is_a?(Hash) ? document.data["header"] : {}
      canonical = original_image(document)
      base = record_for_source(document, canonical)
      overrides = document.data.dig("jcem_cover", "og") || {}
      wide_source = overrides["wide_source"]
      portrait_source = overrides["portrait_source"] || overrides["square_source"]
      wide_record = contextual_record(document, wide_source ? record_for_source(document, wide_source) : base)
      portrait_record = contextual_record(document, portrait_source ? record_for_source(document, portrait_source) : base)
      cover_record = contextual_record(document, base)
      if wide_source && !wide_record
        raise Jekyll::Errors::FatalException, "jcem_social=override_wide_ausente source=#{wide_source}"
      end
      if portrait_source && !portrait_record
        raise Jekyll::Errors::FatalException, "jcem_social=override_portrait_ausente source=#{portrait_source}"
      end
      return unless wide_record || portrait_record

      {
        "wide" => wide_record && wide_record["wide"],
        "portrait" => portrait_record && (portrait_record["portrait"] || portrait_record["square"]),
        "cover" => cover_record && cover_record["cover"]
      }
    end

    def connect(document)
      document.data["header"] = {} unless document.data["header"].is_a?(Hash)
      header = document.data["header"]
      record = record_for(document)
      return unless header.is_a?(Hash) && record.is_a?(Hash)

      wide = record["wide"]
      portrait = record["portrait"]
      header["og_image"] ||= wide["target"] if wide.is_a?(Hash)
      if portrait.is_a?(Hash)
        header["og_image_portrait"] ||= portrait["target"]
        header["og_image_square"] ||= portrait["target"]
      end
      document.data["jcem_cover_image"] ||= record.dig("cover", "target") if record["cover"].is_a?(Hash)
      header["twitter_card"] ||= "summary_large_image"
    end

    def absolute_url(site, target)
      return target if target.to_s.match?(%r{\Ahttps://}i)

      base = "#{site.config['url']}#{site.config['baseurl']}".sub(%r{/+\z}, "")
      "#{base}/#{target.to_s.sub(%r{\A/+}, '')}"
    end

    def meta(document, property, content, kind: "property")
      %(<meta #{kind}="#{CGI.escapeHTML(property)}" content="#{CGI.escapeHTML(content.to_s)}">)
    end

    def image_tags(document, variant)
      return [] unless variant.is_a?(Hash)

      url = absolute_url(document.site, variant["target"])
      alt = document.data.dig("header", "image_description") || document.data["title"]
      [
        meta(document, "og:image", url),
        meta(document, "og:image:secure_url", url),
        meta(document, "og:image:type", variant["mediaType"]),
        meta(document, "og:image:width", variant["width"]),
        meta(document, "og:image:height", variant["height"]),
        meta(document, "og:image:alt", alt)
      ]
    end

    def normalize_metadata(html, document)
      record = record_for(document)
      return html unless record.is_a?(Hash) && record["wide"].is_a?(Hash)

      parsed = Nokogiri::HTML.parse(html, nil, "UTF-8")
      head = parsed.at_css("head")
      return html unless head

      head.css('meta[property^="og:image"], meta[name="twitter:card"], meta[name="twitter:image"], meta[name="twitter:image:alt"]').remove
      wide = record["wide"]
      portrait = record["portrait"]
      card = document.data.dig("header", "twitter_card") == "summary" ? "summary" : "summary_large_image"
      twitter_variant = card == "summary" && portrait.is_a?(Hash) ? portrait : wide
      alt = document.data.dig("header", "image_description") || document.data["title"]
      tags = [
        *image_tags(document, wide),
        *image_tags(document, portrait),
        meta(document, "twitter:card", card, kind: "name"),
        meta(document, "twitter:image", absolute_url(document.site, twitter_variant["target"]), kind: "name"),
        meta(document, "twitter:image:alt", alt, kind: "name")
      ]
      head.add_child("\n#{tags.join("\n")}\n")
      parsed.to_html
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  (site.pages + site.documents).each do |document|
    Jcem::SocialImages.connect(document)
  end
end

Jekyll::Hooks.register :documents, :pre_render do |document|
  Jcem::SocialImages.connect(document)
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  Jcem::SocialImages.connect(page)
end

Jekyll::Hooks.register :documents, :post_render do |document|
  document.output = Jcem::SocialImages.normalize_metadata(document.output.to_s, document) if document.output_ext == ".html"
end

Jekyll::Hooks.register :pages, :post_render do |page|
  page.output = Jcem::SocialImages.normalize_metadata(page.output.to_s, page) if page.output_ext == ".html"
end
