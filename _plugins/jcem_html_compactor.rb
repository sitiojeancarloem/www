# frozen_string_literal: true

module Jcem
  module HtmlCompactor
    RAW_TAGS = %w[pre script style template textarea].freeze
    RAW_OPEN = /<(#{RAW_TAGS.join('|')})\b/i

    module_function

    def sync_noscript_content(home, not_found)
      source = home.match(%r{<body\b[^>]*>.*?(<noscript\b[^>]*>.*?</noscript>)}im)
      return not_found unless source

      fragment = source[1].sub(/\A<noscript\b[^>]*>/i, '<noscript data-jcem-fragment="noscript-content">')
      not_found.sub(
        %r{<noscript\b[^>]*data-jcem-fragment=["']noscript-content["'][^>]*>.*?</noscript>}im,
        fragment
      )
    end

    def sync_noscript_style(home, not_found)
      source = home.match(
        %r{<noscript\b[^>]*data-jcem-fragment=["']noscript-style["'][^>]*>.*?</noscript>}im
      )
      return not_found unless source

      not_found.sub(
        %r{<noscript\b[^>]*data-jcem-fragment=["']noscript-style["'][^>]*>.*?</noscript>}im,
        source[0]
      )
    end

    def sync_404_noscript(site)
      home_path = File.join(site.dest, 'index.html')
      not_found_path = File.join(site.dest, '404.html')
      return unless File.file?(home_path) && File.file?(not_found_path)

      original = File.binread(not_found_path).force_encoding(Encoding::UTF_8)
      home = File.binread(home_path).force_encoding(Encoding::UTF_8)
      synchronized = sync_noscript_style(home, original)
      synchronized = sync_noscript_content(home, synchronized)
      File.binwrite(not_found_path, synchronized) unless synchronized == original
    end

    def compact(content)
      raw_tag = nil
      output = []

      content.each_line do |line|
        if raw_tag
          output << line.delete_suffix("\n").delete_suffix("\r")
          raw_tag = nil if line.match?(%r{</#{Regexp.escape(raw_tag)}\s*>}i)
          next
        end

        stripped = line.strip
        next if stripped.empty?

        output << stripped
        opening = stripped.match(RAW_OPEN)
        next unless opening

        candidate = opening[1]
        raw_tag = candidate unless stripped.match?(%r{</#{Regexp.escape(candidate)}\s*>}i)
      end

      output.join("\n") << "\n"
    end

    def enabled?(site)
      config = site.config.fetch('jcem_html_compactor', {})
      config.fetch('enabled', true) && Jekyll.env == config.fetch('environment', 'production')
    end

    def compact_site(site)
      sync_404_noscript(site)
      return unless enabled?(site)

      Dir.glob(File.join(site.dest, '**', '*.html')).sort.each do |path|
        original = File.binread(path).force_encoding(Encoding::UTF_8)
        compacted = compact(original)
        File.binwrite(path, compacted) unless compacted == original
      end
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  Jcem::HtmlCompactor.compact_site(site)
end
