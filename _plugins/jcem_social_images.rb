# frozen_string_literal: true

module Jcem
  module SocialImages
    module_function

    def connect(document)
      header = document.data["header"]
      return unless header.is_a?(Hash) && header["og_image"].to_s.empty?

      canonical = header["image"] || header["overlay_image"]
      record = document.site.data.dig("jcem_social_images", "assets", canonical.to_s)
      header["og_image"] = record["target"] if record.is_a?(Hash) && record["target"]
    end
  end
end

Jekyll::Hooks.register :documents, :pre_render do |document|
  Jcem::SocialImages.connect(document)
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  Jcem::SocialImages.connect(page)
end
