# frozen_string_literal: true

require_relative "jcem_content_namespace_core"

module Jcem
  module ContentNamespaces
    module_function

    def definitions(config)
      ContentNamespaceCore.definitions(config)
    end

    def source_basename(document)
      ContentNamespaceCore.source_basename(document.relative_path)
    end

    def normalize_subnamespaces(document)
      ContentNamespaceCore.normalize_subnamespaces(
        document.data.fetch("content_subnamespaces", []),
        document.relative_path
      )
    rescue ContentNamespaceCore::ContractError => error
      raise Jekyll::Errors::FatalException, error.message
    end

    def resolve(document)
      ContentNamespaceCore.resolve(document.relative_path, document.data, document.site.config)
    rescue ContentNamespaceCore::ContractError => error
      raise Jekyll::Errors::FatalException, error.message
    end

    def apply!(document)
      resolved = resolve(document)
      return unless resolved

      document.data["content_namespace"] = resolved.fetch(:key)
      document.data.delete("permalink")
      document.data["jcem_namespace_url"] = resolved.fetch(:url)
      document.data["jcem_namespace_logical_segment"] = resolved.fetch(:logical_segment)
      document.data["jcem_namespace_physical_segment"] = resolved.fetch(:physical_segment)
      document.data["jcem_namespace_subnamespaces"] = resolved.fetch(:subnamespaces)
      document.instance_variable_set(:@url, nil)
    end

    def apply_site!(site)
      site.collections.each_value do |collection|
        collection.docs.each { |document| apply!(document) }
      end
    end

    def validate!(document, *_payload)
      resolved = resolve(document)
      return unless resolved

      definition = resolved.fetch(:definition)
      title_prefix = definition.fetch("title_prefix")
      disclaimer = definition.fetch("disclaimer")
      title = document.data["title"].to_s
      content = document.content.to_s.gsub("**", "")

      unless title.start_with?(title_prefix)
        raise Jekyll::Errors::FatalException,
              "Título de #{document.relative_path} deve iniciar com #{title_prefix}"
      end
      return if content.include?(disclaimer)

      raise Jekyll::Errors::FatalException,
            "Disclaimer do namespace ausente em #{document.relative_path}"
    end

    def physical_path_for(path, config, windows: Gem.win_platform?, namespace_data: nil)
      return path unless windows

      logical_segment = namespace_data&.fetch("jcem_namespace_logical_segment", nil)
      physical_segment = namespace_data&.fetch("jcem_namespace_physical_segment", nil)
      if logical_segment && physical_segment && path.include?(logical_segment)
        return path.sub(logical_segment, physical_segment)
      end

      definitions(config).each_value do |definition|
        logical = definition.fetch("url_prefix")
        physical = definition.fetch("physical_prefix")
        return path.sub(logical, physical) if path.include?(logical)
      end
      path
    end

    module DocumentDestination
      def destination(base_directory)
        logical_path = super
        Jcem::ContentNamespaces.physical_path_for(
          logical_path,
          site.config,
          namespace_data: data
        )
      end
    end

    module DocumentUrl
      def url
        data["jcem_namespace_url"] || super
      end
    end
  end
end

Jekyll::Document.prepend(Jcem::ContentNamespaces::DocumentUrl)
Jekyll::Document.prepend(Jcem::ContentNamespaces::DocumentDestination)
Jekyll::Hooks.register :site, :post_read, &Jcem::ContentNamespaces.method(:apply_site!)
Jekyll::Hooks.register :documents, :pre_render, &Jcem::ContentNamespaces.method(:validate!)
