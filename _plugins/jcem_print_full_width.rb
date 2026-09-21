# frozen_string_literal: true

require "nokogiri"
require "uri"

module Jcem
  module PrintFullWidth
    module_function

    def normalize_public_path(value)
      raw = value.to_s.strip
      return nil if raw.empty? || raw.start_with?("data:")

      uri = URI.parse(raw)
      path = uri.path.to_s
      return nil unless path.start_with?("/assets/images/")

      path
    rescue URI::InvalidURIError
      nil
    end

    def semantic_owner(image)
      image.ancestors.find { |ancestor| ancestor.name == "figure" } ||
        image.ancestors.find { |ancestor| ancestor.name == "picture" } ||
        image
    end

    def manual_owner(image)
      ([image] + image.ancestors.select { |ancestor| %w[figure picture].include?(ancestor.name) }).find do |candidate|
        candidate["data-print-span"] && candidate["data-print-span-source"] != "auto"
      end
    end

    def decorate_image!(image, manifest)
      owner = semantic_owner(image)
      explicit = manual_owner(image)
      manual_value = explicit&.[]("data-print-span").to_s

      if manual_value == "all"
        owner["data-print-span"] = "all"
        owner["data-print-span-source"] = "manual"
        image.remove_attribute("data-print-span") unless owner == image
        image.remove_attribute("data-print-span-source") unless owner == image
        return
      end

      return if manual_value == "column" || owner["data-print-span"].to_s == "column"
      return if owner["data-print-span"] == "all" && owner["data-print-span-source"] == "auto"

      public_path = normalize_public_path(image["src"])
      analysis = public_path && manifest.fetch("assets", {})[public_path]
      return unless analysis && analysis["autoFullWidth"] == true

      owner["data-print-span"] = "all"
      owner["data-print-span-source"] = "auto"
      owner["data-print-span-reason"] = analysis["reason"].to_s
    end

    def decorate_html(html, manifest)
      return html unless manifest.is_a?(Hash) && manifest["schema"] == 1
      return html unless html.to_s.include?("<img")

      fragment = Nokogiri::HTML::DocumentFragment.parse(html.to_s)
      fragment.css("img[src]").each { |image| decorate_image!(image, manifest) }
      fragment.to_html
    end

    def apply!(document)
      manifest = document.site.data["jcem_print_full_width"]
      document.output = decorate_html(document.output, manifest)
    end
  end
end

Jekyll::Hooks.register :documents, :post_render do |document|
  Jcem::PrintFullWidth.apply!(document)
end

Jekyll::Hooks.register :pages, :post_render do |document|
  Jcem::PrintFullWidth.apply!(document)
end
