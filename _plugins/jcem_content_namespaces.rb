# frozen_string_literal: true

module Jcem
  module ContentNamespaces
    DATE_PREFIX = /\A\d{4}-\d{2}-\d{2}-/.freeze

    module_function

    def definitions(config)
      config.fetch("content_namespaces", {})
    end

    def source_basename(document)
      File.basename(document.relative_path.to_s, File.extname(document.relative_path.to_s)).sub(DATE_PREFIX, "")
    end

    def resolve(document)
      basename = source_basename(document)
      explicit = document.data["content_namespace"].to_s
      key = explicit unless explicit.empty?
      key ||= definitions(document.site.config).find do |_name, definition|
        basename.start_with?(definition.fetch("source_prefix"))
      end&.first
      return unless key

      definition = definitions(document.site.config)[key]
      raise Jekyll::Errors::FatalException, "Namespace editorial desconhecido: #{key}" unless definition

      prefix = definition.fetch("source_prefix")
      unless basename.start_with?(prefix)
        raise Jekyll::Errors::FatalException,
              "Fonte do namespace #{key} deve iniciar com #{prefix}: #{document.relative_path}"
      end

      [key, definition, basename.delete_prefix(prefix)]
    end

    def apply!(document)
      resolved = resolve(document)
      return unless resolved

      key, definition, slug = resolved
      logical_segment = "#{definition.fetch("url_prefix")}#{slug}"
      physical_segment = "#{definition.fetch("physical_prefix")}#{slug}"
      route_prefix = definition.fetch("route_prefix", "/p/").sub(%r!/*\z!, "/")

      document.data["content_namespace"] = key
      document.data["permalink"] = "#{route_prefix}#{logical_segment}/"
      document.data["jcem_namespace_logical_segment"] = logical_segment
      document.data["jcem_namespace_physical_segment"] = physical_segment
      document.instance_variable_set(:@url, nil)
    end

    def validate!(document)
      resolved = resolve(document)
      return unless resolved

      _key, definition, = resolved
      title_prefix = definition.fetch("title_prefix")
      disclaimer = definition.fetch("disclaimer")
      title = document.data["title"].to_s
      content = document.content.to_s

      unless title.start_with?(title_prefix)
        raise Jekyll::Errors::FatalException,
              "Título de #{document.relative_path} deve iniciar com #{title_prefix}"
      end
      return if content.include?(disclaimer)

      raise Jekyll::Errors::FatalException,
            "Disclaimer do namespace ausente em #{document.relative_path}"
    end

    def physical_path_for(path, config, windows: Gem.win_platform?)
      return path unless windows

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
        Jcem::ContentNamespaces.physical_path_for(logical_path, site.config)
      end
    end
  end
end

Jekyll::Document.prepend(Jcem::ContentNamespaces::DocumentDestination)
Jekyll::Hooks.register :documents, :post_init, &Jcem::ContentNamespaces.method(:apply!)
Jekyll::Hooks.register :documents, :pre_render, &Jcem::ContentNamespaces.method(:validate!)
