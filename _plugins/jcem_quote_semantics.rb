# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.

require "json"

module Jcem
  module QuoteSemantics
    CONFIG_PATH = "config/editorial-quotes.json"
    MODEL_ATTRIBUTE = /\bdata-jcem-quote-model=(?<quote>['"])(?<model>[a-z0-9][a-z0-9_-]*)\k<quote>/i
    CODE_ELEMENT = /<code(?<attributes>\s[^>]*)?>(?<content>.*?)<\/code>/mi
    CLASS_ATTRIBUTE = /\sclass=(?<quote>['"])(?<classes>.*?)\k<quote>/mi

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
      collection&.respond_to?(:label) && collection.label == "posts"
    end

    def normalize_html(html, config)
      validate_models!(html, config.fetch("models").keys)
      promote_explicit_inline_quotes(html)
    end

    def validate_models!(html, allowed_models)
      html.to_enum(:scan, MODEL_ATTRIBUTE).each do
        model = Regexp.last_match[:model]
        next if allowed_models.include?(model)

        raise Jekyll::Errors::FatalException,
              "quote_semantics=modelo_desconhecido model=#{model}"
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
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  site.config["jcem_quote_semantics"] = Jcem::QuoteSemantics.load_config(site.source)
end

Jekyll::Hooks.register :documents, :post_convert do |document|
  Jcem::QuoteSemantics.apply!(document)
end
