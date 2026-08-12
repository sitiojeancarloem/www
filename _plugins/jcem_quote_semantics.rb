# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.

require "json"
require "uri"
require "cgi"

module Jcem
  module QuoteSemantics
    CONFIG_PATH = "config/editorial-quotes.json"
    MODEL_ATTRIBUTE = /\bdata-jcem-quote-model=(?<quote>['"])(?<model>[a-z0-9][a-z0-9_-]*)\k<quote>/i
    CODE_ELEMENT = /<code(?<attributes>\s[^>]*)?>(?<content>.*?)<\/code>/mi
    CLASS_ATTRIBUTE = /\sclass=(?<quote>['"])(?<classes>.*?)\k<quote>/mi
    ICON_SOURCE_ATTRIBUTE = /\bdata-jcem-quote-icon-src=(?<quote>['"])(?<source>.*?)\k<quote>/i
    ICON_ALT_ATTRIBUTE = /\bdata-jcem-quote-icon-alt=(?<quote>['"])(?<alt>.*?)\k<quote>/i
	BLOCKQUOTE_TAG = /<\/?blockquote\b[^>]*>/i

    module_function

    def load_config(root)
      path = File.join(root, CONFIG_PATH)
      config = JSON.parse(File.read(path, encoding: "UTF-8"))
      validate_config!(config, path)
      config
    end

    def validate_config!(config, path = CONFIG_PATH)
      models = config.fetch("models", {})
      default_model = config["defaultModel"]
      return if config["schema"] == 1 && models.is_a?(Hash) && models.key?(default_model)

      raise Jekyll::Errors::FatalException,
            "quote_semantics=config_invalida path=#{path}"
    end

    def article?(document)
      collection = document.respond_to?(:collection) ? document.collection : nil
	  is_post = collection&.respond_to?(:label) && collection.label == "posts"
	  is_post || document.data["pagespeed_layout"] == "article"
    end

    def normalize_html(html, config)
      validate_models!(html, config.fetch("models").keys)
      validate_icons!(html)
      promote_explicit_inline_quotes(html)
    end

	def attribute_value(tag, name)
	  match = tag.match(/\b#{Regexp.escape(name)}=(['"])(.*?)\1/i)
	  match && match[2]
	end

	def augment_tag(tag, attributes, classes = [])
	  existing_classes = attribute_value(tag, "class").to_s.split
	  merged_classes = (existing_classes + classes).uniq
	  normalized = tag
	  if merged_classes.any?
		if attribute_value(normalized, "class")
		  normalized = normalized.sub(/\sclass=(['"])(.*?)\1/i, %( class="#{CGI.escapeHTML(merged_classes.join(" "))}"))
		else
		  attributes = attributes.merge("class" => merged_classes.join(" "))
		end
	  end
	  attributes.each do |name, value|
		next if attribute_value(normalized, name)
		normalized = normalized.sub(/>\z/, %( #{name}="#{CGI.escapeHTML(value.to_s)}">))
	  end
	  normalized
	end

	def typed_icon(tag, model, config)
	  source = attribute_value(tag, "data-jcem-quote-icon-src").to_s
	  alt = attribute_value(tag, "data-jcem-quote-icon-alt").to_s
	  if !source.empty?
		return %(<span class="jcem-quote__icon"><img src="#{CGI.escapeHTML(source)}" alt="#{CGI.escapeHTML(alt)}" loading="lazy" decoding="async"></span>)
	  end
	  icon = attribute_value(tag, "data-jcem-quote-icon") || config.dig("models", model, "defaultIcon")
	  %(<span class="jcem-quote__icon" aria-hidden="true">#{CGI.escapeHTML(icon.to_s)}</span>)
	end

	def futuristic_panel_open(tag)
	  classes = attribute_value(tag, "class").to_s.split
	  panel_classes = (["painel", "jcem-panel", "jcem-panel--blockquote", "jcem-panel--futuristic", "jcem-quote-model--futuristic"] + classes).uniq.join(" ")
	  id = attribute_value(tag, "id")
	  body_attributes = %w[cite lang dir aria-label aria-labelledby].filter_map do |name|
		value = attribute_value(tag, name)
		%( #{name}="#{CGI.escapeHTML(value)}") if value
	  end.join
	  id_attribute = id ? %( id="#{CGI.escapeHTML(id)}") : ""
	  <<~HTML.delete("\n")
		<div class="#{CGI.escapeHTML(panel_classes)}"#{id_attribute} data-jcem-panel-source="blockquote" data-jcem-blockquote="" data-jcem-quote-model="futuristic" data-jcem-quote-processed="true" role="blockquote"><table class="nohover jcem-panel__table" cellspacing="0" cellpadding="0" border="0" role="presentation"><colgroup><col class="jcem-panel__column jcem-panel__column--left"><col class="jcem-panel__column jcem-panel__column--center"><col class="jcem-panel__column jcem-panel__column--right"></colgroup><tbody><tr class="jcem-panel__edge jcem-panel__edge--top"><td class="jcem-panel__corner jcem-panel__corner--top-left"></td><td class="jcem-panel__edge-fill jcem-panel__edge-fill--top"></td><td class="f3 jcem-panel__corner jcem-panel__corner--top-right"></td></tr><tr class="content jcem-panel__content-row"><td class="jcem-panel__body" colspan="3" data-jcem-blockquote-body=""#{body_attributes}>
	  HTML
	end

	def render_structural_quotes(html, default_model, config)
	  stack = []
	  html.gsub(BLOCKQUOTE_TAG) do |tag|
		if tag.match?(%r{\A</}i)
		  structural = stack.pop
		  structural ? %(</td></tr><tr class="final jcem-panel__edge jcem-panel__edge--bottom"><td class="jcem-panel__corner jcem-panel__corner--bottom-left"></td><td class="jcem-panel__edge-fill jcem-panel__edge-fill--bottom"><div aria-hidden="true"></div></td><td class="f3 jcem-panel__corner jcem-panel__corner--bottom-right"></td></tr></tbody></table></div>) : tag
		else
		  model = attribute_value(tag, "data-jcem-quote-model") || default_model
		  structural = model == "futuristic"
		  stack << structural
		  if structural
			futuristic_panel_open(tag)
		  else
			classes = ["jcem-quote-model--#{model}"]
			classes += ["jcem-quote--typed", "jcem-quote--runtime-icon"] unless %w[standard futuristic].include?(model)
			opening = augment_tag(tag, {
			  "data-jcem-blockquote" => "",
			  "data-jcem-quote-model" => model,
			  "data-jcem-quote-processed" => "true"
			}, classes)
			%w[standard futuristic].include?(model) ? opening : opening + typed_icon(tag, model, config)
		  end
		end
	  end
	end

	def default_model_for(document)
	  panels = document.site.config.dig("jcem", "blockquote_panels") != false
	  panels = document.data["blockquote_panels"] unless document.data["blockquote_panels"].nil?
	  panels = document.data.dig("jcem", "blockquote_panels") if document.data["jcem"].is_a?(Hash) && !document.data.dig("jcem", "blockquote_panels").nil?
	  panels ? "futuristic" : "standard"
	end

    def validate_models!(html, allowed_models)
      html.to_enum(:scan, MODEL_ATTRIBUTE).each do
        model = Regexp.last_match[:model]
        next if allowed_models.include?(model)

        raise Jekyll::Errors::FatalException,
              "quote_semantics=modelo_desconhecido model=#{model}"
      end
    end

    def validate_icons!(html)
      html.to_enum(:scan, ICON_SOURCE_ATTRIBUTE).each do
        source = Regexp.last_match[:source].to_s.strip
        element_start = html.rindex("<", Regexp.last_match.begin(0)) || 0
        element_end = html.index(">", Regexp.last_match.end(0)) || Regexp.last_match.end(0)
        attributes = html[element_start..element_end]
        alt = attributes.match(ICON_ALT_ATTRIBUTE)&.[](:alt).to_s.strip
        valid_source =
          begin
            uri = URI.parse(source)
            (
              !uri.absolute? &&
              !source.start_with?("//") &&
              !source.split("/").include?("..")
            ) || uri.scheme == "https"
          rescue URI::InvalidURIError
            false
          end
        next if valid_source && !alt.empty?

        raise Jekyll::Errors::FatalException,
              "quote_semantics=icone_invalido source=#{source.inspect}"
      end
    end

    def promote_explicit_inline_quotes(html)
      html.gsub(CODE_ELEMENT) do |element|
        attributes = Regexp.last_match[:attributes].to_s
        content = Regexp.last_match[:content]
        class_match = attributes.match(CLASS_ATTRIBUTE)
        classes = class_match ? class_match[:classes].split : []
        next element unless classes.include?("jcem-inline-quote")

        preserved_classes = classes.reject { |name| name == "jcem-inline-quote" }
        remaining = class_match ? attributes.sub(class_match[0], "") : attributes
        class_value = (["jcem-inline-quote"] + preserved_classes).join(" ")
        "<em#{remaining} class=\"#{class_value}\" data-jcem-inline-quote=\"explicit\">#{content}</em>"
      end
    end

    def apply!(document)
      return unless article?(document)

      config = document.site.config.fetch("jcem_quote_semantics")
	  document.output = normalize_html(document.output.to_s, config)
	end

	def render!(document)
	  return unless article?(document)

	  config = document.site.config.fetch("jcem_quote_semantics")
	  document.output = render_structural_quotes(document.output.to_s, default_model_for(document), config)
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  site.config["jcem_quote_semantics"] = Jcem::QuoteSemantics.load_config(site.source)
end

Jekyll::Hooks.register :documents, :post_convert do |document|
  Jcem::QuoteSemantics.apply!(document)
end

Jekyll::Hooks.register :documents, :post_render do |document|
  Jcem::QuoteSemantics.render!(document)
end

Jekyll::Hooks.register :pages, :post_render do |document|
  Jcem::QuoteSemantics.render!(document)
end
