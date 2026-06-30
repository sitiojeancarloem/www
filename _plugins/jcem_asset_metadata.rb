# frozen_string_literal: true

require "json"
require "fileutils"
require "time"
require "uri"

module Jcem
  module AssetMetadata
    IMAGE_EXTENSIONS = %w[.gif .jpg .jpeg .png .svg .webp].freeze
    EXCLUDED_PREFIXES = %w[
      /.jekyll-cache/
      /_site/
      /node_modules/
      /old-root/
      /tmp/
      /vendor/
      /visual-artifacts/
    ].freeze
    CACHE_PATH = File.join(".jekyll-cache", "jcem-asset-metadata.json").freeze
    INDEX_PATH = File.join("assets", "jcem", "asset-metadata.json").freeze
    MEDIA_TYPES = {
      ".gif" => "image/gif",
      ".jpg" => "image/jpeg",
      ".jpeg" => "image/jpeg",
      ".png" => "image/png",
      ".svg" => "image/svg+xml",
      ".webp" => "image/webp"
    }.freeze

    module_function

    def public_path(static_file)
      path = static_file.relative_path.to_s.tr("\\", "/")
      path = path.delete_prefix("/")
      "/#{path}"
    end

    def relevant?(static_file)
      extension = File.extname(static_file.path.to_s).downcase
      public = public_path(static_file)
      IMAGE_EXTENSIONS.include?(extension) &&
        public.start_with?("/assets/") &&
        EXCLUDED_PREFIXES.none? { |prefix| public.start_with?(prefix) }
    end

    def signature_for(path)
      stat = File.stat(path)
      {
        "mtime" => stat.mtime.to_f,
        "size" => stat.size
      }
    rescue StandardError
      nil
    end

    def read_u16_be(bytes, offset)
      bytes.byteslice(offset, 2).unpack1("n")
    end

    def read_u16_le(bytes, offset)
      bytes.byteslice(offset, 2).unpack1("v")
    end

    def read_u24_le(bytes, offset)
      chunk = bytes.byteslice(offset, 3).bytes
      chunk[0] + (chunk[1] << 8) + (chunk[2] << 16)
    end

    def read_u32_be(bytes, offset)
      bytes.byteslice(offset, 4).unpack1("N")
    end

    def dimensions_png(path)
      header = File.binread(path, 24)
      return nil unless header&.start_with?("\x89PNG\r\n\x1A\n".b)

      [read_u32_be(header, 16), read_u32_be(header, 20)]
    end

    def dimensions_gif(path)
      header = File.binread(path, 10)
      return nil unless header&.start_with?("GIF87a", "GIF89a")

      [read_u16_le(header, 6), read_u16_le(header, 8)]
    end

    def dimensions_jpeg(path)
      File.open(path, "rb") do |file|
        return nil unless file.read(2) == "\xFF\xD8".b

        loop do
          marker_prefix = file.read(1)
          return nil unless marker_prefix
          next unless marker_prefix == "\xFF".b

          marker = file.read(1)&.ord
          return nil unless marker
          next if marker == 0xFF
          return nil if marker == 0xD9 || marker == 0xDA

          length_bytes = file.read(2)
          return nil unless length_bytes&.bytesize == 2

          length = length_bytes.unpack1("n")
          return nil if length < 2

          if marker.between?(0xC0, 0xC3) || marker.between?(0xC5, 0xC7) ||
             marker.between?(0xC9, 0xCB) || marker.between?(0xCD, 0xCF)
            data = file.read(5)
            return nil unless data&.bytesize == 5

            return [read_u16_be(data, 3), read_u16_be(data, 1)]
          end

          file.seek(length - 2, IO::SEEK_CUR)
        end
      end
    rescue StandardError
      nil
    end

    def dimensions_webp(path)
      bytes = File.binread(path, 32)
      return nil unless bytes&.start_with?("RIFF") && bytes.byteslice(8, 4) == "WEBP"

      case bytes.byteslice(12, 4)
      when "VP8X"
        [read_u24_le(bytes, 24) + 1, read_u24_le(bytes, 27) + 1]
      when "VP8L"
        packed = bytes.byteslice(21, 4).unpack1("V")
        [((packed & 0x3fff) + 1), (((packed >> 14) & 0x3fff) + 1)]
      when "VP8 "
        frame = File.binread(path, 30)
        return nil unless frame&.bytesize.to_i >= 30

        [read_u16_le(frame, 26) & 0x3fff, read_u16_le(frame, 28) & 0x3fff]
      end
    rescue StandardError
      nil
    end

    def svg_number(value)
      value.to_s.strip.sub(/px\z/i, "").to_f
    end

    def dimensions_svg(path)
      content = File.binread(path, 262_144).force_encoding(Encoding::UTF_8)
      svg = content.match(/<svg\b[^>]*>/i)&.to_s
      return nil unless svg

      width = svg[/\bwidth=["']([^"']+)["']/i, 1]
      height = svg[/\bheight=["']([^"']+)["']/i, 1]
      if width && height && width !~ /%/ && height !~ /%/
        parsed = [svg_number(width), svg_number(height)]
        return parsed if parsed.all?(&:positive?)
      end

      view_box = svg[/\bviewBox=["']([^"']+)["']/i, 1]
      return nil unless view_box

      values = view_box.split(/[,\s]+/).map(&:to_f)
      return nil unless values.length >= 4 && values[2].positive? && values[3].positive?

      [values[2], values[3]]
    rescue StandardError
      nil
    end

    def dimensions_for(path, extension)
      case extension
      when ".png" then dimensions_png(path)
      when ".gif" then dimensions_gif(path)
      when ".jpg", ".jpeg" then dimensions_jpeg(path)
      when ".webp" then dimensions_webp(path)
      when ".svg" then dimensions_svg(path)
      end
    end

    def orientation(width, height)
      return nil unless width && height
      return "square" if (width.to_f - height.to_f).abs < 0.001

      width.to_f > height.to_f ? "landscape" : "portrait"
    end

    def build_metadata(path, public_path)
      extension = File.extname(path).downcase
      signature = signature_for(path)
      dimensions = dimensions_for(path, extension)
      width = dimensions&.[](0)
      height = dimensions&.[](1)
      metadata = {
        "path" => public_path,
        "media_type" => MEDIA_TYPES.fetch(extension, "application/octet-stream"),
        "extension" => extension.delete_prefix("."),
        "byte_size" => signature&.fetch("size", nil)
      }

      if width && height
        metadata["width"] = width.round(3)
        metadata["height"] = height.round(3)
        metadata["aspect_ratio"] = (width.to_f / height.to_f).round(6)
        metadata["aspect_ratio_css"] = "#{width.round(3)} / #{height.round(3)}"
        metadata["orientation"] = orientation(width, height)
      end

      metadata
    end

    def load_cache(site)
      path = File.join(site.source, CACHE_PATH)
      return {} unless File.file?(path)

      JSON.parse(File.binread(path))
    rescue StandardError
      {}
    end

    def write_cache(site, cache)
      path = File.join(site.source, CACHE_PATH)
      FileUtils.mkdir_p(File.dirname(path))
      File.binwrite(path, JSON.pretty_generate(cache.sort.to_h))
    end

    def write_index(site, assets)
      path = File.join(site.dest, INDEX_PATH)
      FileUtils.mkdir_p(File.dirname(path))
      payload = {
        "version" => 1,
        "generated_at" => Time.now.utc.iso8601,
        "assets" => assets.sort.to_h
      }
      File.binwrite(path, JSON.generate(payload))
    end

    def build(site)
      cache = load_cache(site)
      next_cache = {}
      assets = {}

      site.static_files.select { |file| relevant?(file) }.each do |file|
        public = public_path(file)
        signature = signature_for(file.path)
        next unless signature

        cached = cache[public]
        metadata =
          if cached && cached["signature"] == signature && cached["metadata"]
            cached["metadata"]
          else
            build_metadata(file.path, public)
          end

        assets[public] = metadata
        next_cache[public] = {
          "signature" => signature,
          "metadata" => metadata
        }
      end

      site.data["jcem_asset_metadata"] = {
        "version" => 1,
        "assets" => assets
      }
      write_cache(site, next_cache)
    end

    def metadata_for(site, input)
      assets = site.data.dig("jcem_asset_metadata", "assets") || {}
      value = input.to_s.strip
      return {} if value.empty?

      candidates = [value]
      begin
        uri = URI.parse(value)
        candidates << uri.path if uri&.path
      rescue StandardError
        nil
      end

      candidates.map { |candidate| normalize_path(candidate) }.each do |candidate|
        return assets[candidate] if assets.key?(candidate)
      end

      {}
    end

    def normalize_path(value)
      path = value.to_s.split("?").first.to_s
      path = path.start_with?("/") ? path : "/#{path}"
      path.squeeze("/")
    end
  end
end

module JcemAssetMetadataFilter
  def jcem_asset_metadata(input)
    site = @context.registers[:site]
    Jcem::AssetMetadata.metadata_for(site, input)
  end
end

class JcemAssetMetadataGenerator < Jekyll::Generator
  safe true
  priority :low

  def generate(site)
    Jcem::AssetMetadata.build(site)
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  assets = site.data.dig("jcem_asset_metadata", "assets") || {}
  Jcem::AssetMetadata.write_index(site, assets)
end

Liquid::Template.register_filter(JcemAssetMetadataFilter)
