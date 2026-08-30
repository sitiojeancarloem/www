# frozen_string_literal: true

require_relative "jcem_asset_metadata"
require "open3"

module Jcem
  module CoverContract
    module_function

    STYLE_ALIASES = {
      "inline" => "content",
      "full" => "wide",
      "full-width" => "wide",
      "bleed" => "wide"
    }.freeze

    # Resolve um path público de asset sem permitir que a validação saia da raiz-fonte.
    def source_path(site, public_path)
      File.join(site.source, public_path.to_s.sub(%r{\A/+}, ""))
    end

    # Reproduz a precedência de estilo do layout para validar a modalidade efetivamente selecionada.
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

    # Valida que os campos especializados de wide não reclassifiquem nem contaminem outra modalidade.
    def validate(document)
      header = document.data["header"]
      return unless header.is_a?(Hash)

      mode = header["image_wide_mode"].to_s.downcase
      left = header["image_wide_left"].to_s
      right = header["image_wide_right"].to_s
      has_wide_fields = !mode.empty? || !left.empty? || !right.empty?
      if has_wide_fields && style_for(document) != "wide"
        raise Jekyll::Errors::FatalException, "jcem_cover=wide_requer_estilo_wide path=#{document.relative_path}"
      end
      return if !has_wide_fields || mode.empty? || mode == "single"
      unless mode == "triptych"
        raise Jekyll::Errors::FatalException, "jcem_cover=modo_wide_invalido path=#{document.relative_path} modo=#{mode}"
      end

      if left.empty? && right.empty?
        header["image_wide_mode"] = "single"
        return
      end
      if left.empty? || right.empty?
        raise Jekyll::Errors::FatalException, "jcem_cover=triptych_incompleto path=#{document.relative_path}"
      end
      paths = [left, header["image"].to_s, right]
      if paths.any?(&:empty?)
        raise Jekyll::Errors::FatalException, "jcem_cover=triptych_incompleto path=#{document.relative_path}"
      end
      dimensions = paths.map do |public_path|
        path = source_path(document.site, public_path)
        raise Jekyll::Errors::FatalException, "jcem_cover=asset_ausente path=#{public_path}" unless File.file?(path)

        Jcem::AssetMetadata.dimensions_for(path, File.extname(path).downcase)
      end
      unless dimensions.all? && dimensions.map(&:last).uniq.length == 1
        raise Jekyll::Errors::FatalException, "jcem_cover=alturas_incompativeis path=#{document.relative_path}"
      end

      edge_script = File.join(document.site.source, "scripts", "check-cover-edges.mjs")
      stdout, stderr, status = Open3.capture3(
        "node", edge_script, *paths.map { |public_path| source_path(document.site, public_path) }
      )
      return if status.success?

      detail = [stdout, stderr].join(" ").strip.gsub(/\s+/, " ")
      raise Jekyll::Errors::FatalException,
            "jcem_cover=bordas_incompativeis path=#{document.relative_path} detalhe=#{detail}"
    end
  end
end

Jekyll::Hooks.register :documents, :pre_render do |document|
  Jcem::CoverContract.validate(document)
end
