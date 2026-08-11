# frozen_string_literal: true

module Jcem
  module ContentNamespaces
    DATE_PREFIX = /\A\d{4}-\d{2}-\d{2}-/.freeze
    INVALID_SEGMENT = %r{[\\/]|\A\.{1,2}\z}.freeze

    module_function

    def definitions(config)
      config.fetch("content_namespaces", {})
    end

    def source_basename(document)
      File.basename(document.relative_path.to_s, File.extname(document.relative_path.to_s)).sub(DATE_PREFIX, "")
    end

    def normalize_subnamespaces(document)
      raw = document.data.fetch("content_subnamespaces", [])
      raw = [raw] if raw.is_a?(String)
      unless raw.is_a?(Array)
        raise Jekyll::Errors::FatalException,
              "content_subnamespaces deve ser lista em #{document.relative_path}"
      end

      normalized = raw.map do |value|
        source = value.to_s.strip
        if source.empty? || source.match?(INVALID_SEGMENT)
          raise Jekyll::Errors::FatalException,
                "Subnamespace editorial invalido em #{document.relative_path}: #{value.inspect}"
        end

        slug = Jekyll::Utils.slugify(source, mode: "latin", cased: false)
        if slug.empty?
          raise Jekyll::Errors::FatalException,
                "Subnamespace editorial vazio apos normalizacao em #{document.relative_path}"
        end
        slug
      end

      if normalized.uniq.length != normalized.length
        raise Jekyll::Errors::FatalException,
              "Subnamespace editorial duplicado em #{document.relative_path}"
      end
      normalized
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
      subnamespaces = normalize_subnamespaces(document)
      all_subnamespaces = subnamespaces.dup
      logical_segment =
        if subnamespaces.empty?
          "#{definition.fetch("url_prefix")}#{slug}"
        else
          [
            "#{definition.fetch("url_prefix")}#{subnamespaces.shift}",
            *subnamespaces,
            slug
          ].join("/")
        end
      physical_segment =
        if all_subnamespaces.empty?
          "#{definition.fetch("physical_prefix")}#{slug}"
        else
          [
            definition.fetch("physical_prefix").sub(/[-_:]+\z/, ""),
            *all_subnamespaces,
            slug
          ].join("/")
        end
      route_prefix = definition.fetch("route_prefix", "/p/").sub(%r!/*\z!, "/")

      document.data["content_namespace"] = key
      document.data.delete("permalink")
      document.data["jcem_namespace_url"] = "#{route_prefix}#{logical_segment}/"
      document.data["jcem_namespace_logical_segment"] = logical_segment
      document.data["jcem_namespace_physical_segment"] = physical_segment
      document.data["jcem_namespace_subnamespaces"] = all_subnamespaces
      document.instance_variable_set(:@url, nil)
    end

    def validate!(document, *_payload)
      resolved = resolve(document)
      return unless resolved

      _key, definition, = resolved
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
Jekyll::Hooks.register :documents, :post_init, &Jcem::ContentNamespaces.method(:apply!)
Jekyll::Hooks.register :documents, :pre_render, &Jcem::ContentNamespaces.method(:validate!)
