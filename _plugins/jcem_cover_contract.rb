# frozen_string_literal: true

require "json"
require "nokogiri"
require "open3"
require "uri"
require_relative "jcem_asset_metadata"

module Jcem
  module CoverContract
    module_function

    STYLE_ALIASES = {
      "inline" => "content",
      "full" => "wide",
      "full-width" => "wide",
      "bleed" => "wide"
    }.freeze
    SAFE_HERO_TAGS = %w[a blockquote br code em h2 h3 h4 h5 h6 li ol p strong ul].freeze
    SAFE_HERO_ATTRIBUTES = %w[aria-label href id lang rel target title].freeze
    SAFE_LENGTH = /\A(?:\d+(?:\.\d+)?)(?:ch|em|rem|px|%)\z/
    SAFE_IMAGE = /\.(?:avif|gif|jpe?g|png|svg|webp)\z/i

    def fatal(document, code, detail = nil)
      suffix = detail.to_s.empty? ? "" : " #{detail}"
      raise Jekyll::Errors::FatalException,
            "jcem_cover=#{code} path=#{document.relative_path}#{suffix}"
    end

    def source_path(site, public_path)
      File.join(site.source, public_path.to_s.sub(%r{\A/+}, ""))
    end

    def config_for(document)
      path = File.join(document.site.source, "config", "cover-system.json")
      config = JSON.parse(File.read(path, encoding: "UTF-8"))
      fatal(document, "config_invalida") unless config["schema"] == 1
      ratio = config["aspect_ratio"]
      fatal(document, "proporcao_invalida") unless ratio == { "width" => 1200, "height" => 630 }
      config
    rescue Errno::ENOENT, JSON::ParserError
      fatal(document, "config_ausente_ou_invalida")
    end

    def style_for(document)
      data = document.data
      featured = data["featured_image"]
      header = data["header"].is_a?(Hash) ? data["header"] : {}
      value = data["featured_image_style"]
      value = featured["style"] if value.to_s.empty? && featured.is_a?(Hash)
      value = header["image_style"] if value.to_s.empty?
      value = header["featured_style"] if value.to_s.empty?
      normalized = value.to_s.downcase
      STYLE_ALIASES.fetch(normalized, normalized)
    end

    def image_for(document)
      data = document.data
      featured = data["featured_image"]
      return featured if featured.is_a?(String)
      if featured.is_a?(Hash)
        %w[path url src image].each do |key|
          return featured[key] unless featured[key].to_s.empty?
        end
      end
      header = data["header"].is_a?(Hash) ? data["header"] : {}
      header["image"] || header["overlay_image"]
    end

    def canonical_mode(value, config)
      raw = value.to_s.strip
      return "" if raw.empty?

      normalized = raw.downcase
      alias_key = normalized.delete(" _-")
      aliases = config.fetch("aliases")
      aliases[normalized] || aliases[alias_key] || (config.fetch("modes").key?(normalized) ? normalized : nil)
    end

    def validate_public_image(document, value, code)
      path = value.to_s.strip
      fatal(document, code, "valor=vazio") if path.empty?
      fatal(document, code, "valor=#{path}") unless path.start_with?("/") && path.match?(SAFE_IMAGE)
      fatal(document, "asset_ausente", "asset=#{path}") unless File.file?(source_path(document.site, path))
      path
    end

    def pattern_for(document, value)
      raw = value.to_s.strip
      return nil if raw.empty?
      return { "kind" => "hex", "value" => raw } if raw.match?(/\A#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\z/i)
      if raw.match?(/\Alinear-gradient\([#(),.%\s\da-z+-]+\)\z/i) &&
         !raw.match?(/(?:expression|url|var)\s*\(/i)
        return { "kind" => "linear-gradient", "value" => raw }
      end
      path = validate_public_image(document, raw, "pattern_invalido")
      { "kind" => "image", "value" => path }
    end

    def safe_url?(value)
      raw = value.to_s.strip
      return false if raw.empty? || raw.match?(/[\u0000-\u001f]/)
      return true if raw.start_with?("#", "/")

      uri = URI.parse(raw)
      %w[http https].include?(uri.scheme)
    rescue URI::InvalidURIError
      false
    end

    def sanitize_hero_html(html)
      fragment = Nokogiri::HTML::DocumentFragment.parse(html.to_s)
      fragment.css("script, style, iframe, object, embed, form").remove
      fragment.traverse do |node|
        next unless node.element?
        unless SAFE_HERO_TAGS.include?(node.name)
          node.replace(node.children)
          next
        end
        node.attribute_nodes.each do |attribute|
          node.remove_attribute(attribute.name) unless SAFE_HERO_ATTRIBUTES.include?(attribute.name)
        end
        if node.name == "a"
          node.remove_attribute("href") unless safe_url?(node["href"])
          node["rel"] = "noopener noreferrer" if node["target"] == "_blank"
        end
      end
      fragment.to_html
    end

    def markdown_html(document, content)
      converter = if document.site.respond_to?(:find_converter_instance)
                  document.site.find_converter_instance(Jekyll::Converters::Markdown)
                  else
                    Jekyll::Converters::Markdown.new("markdown" => "kramdown")
                  end
      sanitize_hero_html(converter.convert(content.to_s))
    end

    def hero_for(document, raw, config)
      return nil if raw.nil?
      fatal(document, "hero_invalido") unless raw.is_a?(Hash)
      content = raw["content"].to_s.strip
      return nil if content.empty?

      defaults = config.dig("defaults", "hero")
      rules = config.fetch("hero")
      zone = (raw["zone"] || defaults["zone"]).to_s.downcase
      align = (raw["align"] || defaults["align"]).to_s.downcase
      valign = (raw["valign"] || defaults["valign"]).to_s.downcase
      protection = (raw["protection"] || defaults["protection"]).to_s.downcase
      fatal(document, "hero_zone_invalida", "zone=#{zone}") unless rules.fetch("zones").include?(zone)
      fatal(document, "hero_align_invalido", "align=#{align}") unless rules.fetch("alignments").include?(align)
      fatal(document, "hero_valign_invalido", "valign=#{valign}") unless rules.fetch("vertical_alignments").include?(valign)
      fatal(document, "hero_protection_invalida", "protection=#{protection}") unless rules.fetch("protections").include?(protection)

      max_width = (raw["max_width"] || defaults["max_width"]).to_s.downcase
      fatal(document, "hero_largura_invalida", "max_width=#{max_width}") unless max_width.match?(SAFE_LENGTH)
      cta = raw["cta"]
      if cta && (!cta.is_a?(Hash) || cta["label"].to_s.strip.empty? || !safe_url?(cta["url"]))
        fatal(document, "hero_cta_incompleto")
      end

      {
        "zone" => zone,
        "align" => align,
        "valign" => valign,
        "max_width" => max_width,
        "protection" => protection,
        "html" => markdown_html(document, content),
        "cta" => cta && { "label" => cta["label"].to_s.strip, "url" => cta["url"].to_s.strip }
      }
    end

    def validate_legacy_wide(document)
      header = document.data["header"]
      return unless header.is_a?(Hash)

      mode = header["image_wide_mode"].to_s.downcase
      left = header["image_wide_left"].to_s
      right = header["image_wide_right"].to_s
      has_wide_fields = !mode.empty? || !left.empty? || !right.empty?
      fatal(document, "wide_requer_estilo_wide") if has_wide_fields && style_for(document) != "wide"
      return if !has_wide_fields || mode.empty? || mode == "single"
      fatal(document, "modo_wide_invalido", "modo=#{mode}") unless mode == "triptych"

      if left.empty? && right.empty?
        header["image_wide_mode"] = "single"
        return
      end
      fatal(document, "triptych_incompleto") if left.empty? || right.empty?
      validate_image_triptych(document, [left, header["image"].to_s, right])
    end

    def validate_image_triptych(document, paths)
      fatal(document, "triptych_incompleto") if paths.any?(&:empty?)
      dimensions = paths.map do |public_path|
        path = validate_public_image(document, public_path, "asset_invalido")
        Jcem::AssetMetadata.dimensions_for(source_path(document.site, path), File.extname(path).downcase)
      end
      fatal(document, "alturas_incompativeis") unless dimensions.all? && dimensions.map(&:last).uniq.length == 1

      edge_script = File.join(document.site.source, "scripts", "check-cover-edges.mjs")
      stdout, stderr, status = Open3.capture3(
        "node", edge_script, *paths.map { |public_path| source_path(document.site, public_path) }
      )
      return if status.success?

      detail = [stdout, stderr].join(" ").strip.gsub(/\s+/, " ")
      fatal(document, "bordas_incompativeis", "detalhe=#{detail}")
    end

    def resolve_cover(document)
      raw = document.data["cover"]
      return unless raw
      fatal(document, "configuracao_de_pagina_invalida") unless raw.is_a?(Hash)

      config = config_for(document)
      legacy_style = style_for(document)
      requested_mode = raw.key?("mode") ? raw["mode"] : legacy_style
      mode = requested_mode.to_s.empty? ? "legacy" : canonical_mode(requested_mode, config)
      fatal(document, "modo_invalido", "modo=#{requested_mode}") unless mode
      mode_definition = mode == "legacy" ? { "scope" => "legacy", "axis" => "natural" } : config.dig("modes", mode)

      composition = (raw["composition"] || document.data.dig("header", "image_wide_mode") || config.dig("defaults", "composition")).to_s.downcase
      fatal(document, "composicao_invalida", "composition=#{composition}") unless config.fetch("compositions").include?(composition)
      if composition == "triptych" && %w[content legacy].include?(mode)
        fatal(document, "triptych_requer_cover_de_janela")
      end
      fit = (raw["fit"] || config.dig("defaults", "fit")).to_s.downcase
      fatal(document, "fit_invalido", "fit=#{fit}") unless config.fetch("fits").include?(fit)

      opacity = raw.key?("header_opacity") ? Float(raw["header_opacity"]) : config.dig("defaults", "header_opacity")
      fatal(document, "opacidade_invalida") unless opacity.between?(0.0, 1.0)
      patterns = raw["patterns"].is_a?(Hash) ? raw["patterns"] : {}
      left_value = patterns["left"] || document.data.dig("header", "image_wide_left")
      right_value = patterns["right"] || document.data.dig("header", "image_wide_right")
      left = pattern_for(document, left_value)
      right = pattern_for(document, right_value)
      fatal(document, "triptych_incompleto") if composition == "triptych" && (!left || !right)
      fatal(document, "patterns_exigem_triptych") if composition != "triptych" && (left || right)

      image = image_for(document).to_s
      validate_public_image(document, image, "imagem_central_invalida")
      if composition == "triptych" && left["kind"] == "image" && right["kind"] == "image"
        validate_image_triptych(document, [left["value"], image, right["value"]])
      end

      og = raw["og"].is_a?(Hash) ? raw["og"] : {}
      wide_source = og["wide_source"] && validate_public_image(document, og["wide_source"], "og_wide_invalida")
      square_source = og["square_source"] && validate_public_image(document, og["square_source"], "og_square_invalida")
      resolved = {
        "schema" => config["schema"],
        "mode" => mode,
        "scope" => mode_definition["scope"],
        "axis" => mode_definition["axis"],
        "style" => mode == "content" ? "content" : (mode == "legacy" ? legacy_style : "wide"),
        "composition" => composition,
        "fit" => fit,
        "header_opacity" => format("%.2f", opacity),
        "aspect_ratio" => "#{config.dig('aspect_ratio', 'width')} / #{config.dig('aspect_ratio', 'height')}",
        "patterns" => { "left" => left, "right" => right },
        "hero" => hero_for(document, raw["hero"], config),
        "og" => { "wide_source" => wide_source, "square_source" => square_source }.compact
      }
      document.data["jcem_cover"] = resolved
    rescue ArgumentError, TypeError
      fatal(document, "valor_numerico_invalido")
    end

    def validate(document)
      validate_legacy_wide(document)
      resolve_cover(document)
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  (site.pages + site.documents).each do |document|
    Jcem::CoverContract.validate(document)
  end
end
