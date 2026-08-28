# frozen_string_literal: true

require_relative "jcem_asset_metadata"
require "open3"

module Jcem
  module CoverContract
    module_function

    def source_path(site, public_path)
      File.join(site.source, public_path.to_s.sub(%r{\A/+}, ""))
    end

    def validate(document)
      header = document.data["header"]
      return unless header.is_a?(Hash) && header["image_wide_mode"] == "triptych"

      left = header["image_wide_left"].to_s
      right = header["image_wide_right"].to_s
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
