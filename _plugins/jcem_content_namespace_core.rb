# frozen_string_literal: true

module Jcem
  module ContentNamespaceCore
    DATE_PREFIX = /\A\d{4}-\d{2}-\d{2}-/.freeze
    INVALID_SEGMENT = %r{[\\/]|\A\.{1,2}\z}.freeze

    class ContractError < StandardError; end

    module_function

    def definitions(config)
      config.fetch("content_namespaces", {})
    end

    def source_basename(relative_path)
      File.basename(relative_path.to_s, File.extname(relative_path.to_s)).sub(DATE_PREFIX, "")
    end

    def slugify(value)
      value
        .to_s
        .unicode_normalize(:nfkd)
        .encode("ASCII", invalid: :replace, undef: :replace, replace: "")
        .downcase
        .gsub(/[^a-z0-9]+/, "-")
        .gsub(/\A-+|-+\z/, "")
    end

    def normalize_subnamespaces(raw, relative_path)
      raw = [raw] if raw.is_a?(String)
      unless raw.is_a?(Array)
        raise ContractError, "content_subnamespaces deve ser lista em #{relative_path}"
      end

      normalized = raw.map do |value|
        source = value.to_s.strip
        if source.empty? || source.match?(INVALID_SEGMENT)
          raise ContractError, "Subnamespace editorial invalido em #{relative_path}: #{value.inspect}"
        end

        slug = slugify(source)
        raise ContractError, "Subnamespace editorial vazio apos normalizacao em #{relative_path}" if slug.empty?

        slug
      end
      if normalized.uniq.length != normalized.length
        raise ContractError, "Subnamespace editorial duplicado em #{relative_path}"
      end

      normalized
    end

    def resolve(relative_path, data, config)
      basename = source_basename(relative_path)
      explicit = data["content_namespace"].to_s
      key = explicit unless explicit.empty?
      key ||= definitions(config).find do |_name, definition|
        basename.start_with?(definition.fetch("source_prefix"))
      end&.first
      return unless key

      definition = definitions(config)[key]
      raise ContractError, "Namespace editorial desconhecido: #{key}" unless definition

      prefix = definition.fetch("source_prefix")
      unless basename.start_with?(prefix)
        raise ContractError, "Fonte do namespace #{key} deve iniciar com #{prefix}: #{relative_path}"
      end

      slug = basename.delete_prefix(prefix)
      subnamespaces = normalize_subnamespaces(data.fetch("content_subnamespaces", []), relative_path)
      physical_subnamespace_prefix = "#{subnamespaces.join("-")}-"
      if subnamespaces.any? && slug.start_with?(physical_subnamespace_prefix)
        slug = slug.delete_prefix(physical_subnamespace_prefix)
      end
      raise ContractError, "Titulo editorial vazio em #{relative_path}" if slug.empty?

      logical_segment = if subnamespaces.empty?
                          "#{definition.fetch("url_prefix")}#{slug}"
                        else
                          ["#{definition.fetch("url_prefix")}#{subnamespaces.first}", *subnamespaces.drop(1), slug].join("/")
                        end
      physical_segment = if subnamespaces.empty?
                           "#{definition.fetch("physical_prefix")}#{slug}"
                         else
                           [definition.fetch("physical_prefix").sub(/[-_:]+\z/, ""), *subnamespaces, slug].join("/")
                         end
      route_prefix = definition.fetch("route_prefix", "/p/").sub(%r!/*\z!, "/")

      {
        key: key,
        definition: definition,
        slug: slug,
        subnamespaces: subnamespaces,
        logical_segment: logical_segment,
        physical_segment: physical_segment,
        url: "#{route_prefix}#{logical_segment}/"
      }
    end
  end
end
