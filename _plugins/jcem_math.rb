# frozen_string_literal: true

require "cgi"
require "json"
require "open3"

module Jcem
  module Math
    MARKDOWN_EXTENSIONS = %w[markdown mkdown mkdn mkd md].freeze
    SCRIPT_PATH = File.expand_path("../scripts/render_math.mjs", __dir__).freeze
    DISPLAY_ENVIRONMENTS = %w[equation equation* align align* gather gather* multline multline*].freeze
    PROTECTED_PATTERNS = [
      /!?\[[^\]\n]*\]\([^)]+\)/,
      /<[^>\n]+>/
    ].freeze
    INLINE_CODE = /`+/.freeze
    LATEXPAGE_MARKER = /\\?\[latexpage\\?\]/i

    module_function

    def markdown?(item)
      path = item.respond_to?(:path) ? item.path.to_s : ""
      extension = File.extname(path).delete_prefix(".").downcase
      MARKDOWN_EXTENSIONS.include?(extension)
    end

    def prepare_document(item)
      return unless item.respond_to?(:content) && markdown?(item)

      rendered = prepare(item.content.to_s, item.respond_to?(:path) ? item.path.to_s : "")
      return if rendered == item.content

      item.content = rendered
      item.data["jcem_math"] = true if item.respond_to?(:data)
    end

    def prepare(content, seed = "")
      protected_ranges = collect_protected_ranges(content)
      content = remove_latexpage_markers(content, protected_ranges)
      protected_ranges = collect_protected_ranges(content)
      matches = collect_matches(content, protected_ranges)
      return content if matches.empty?

      rendered = render_matches(matches, seed)
      replace_matches(content, matches, rendered)
    end

    def collect_protected_ranges(content)
      ranges = fenced_code_ranges(content)
      ranges.concat(inline_code_ranges(content, ranges))

      PROTECTED_PATTERNS.each do |pattern|
        content.to_enum(:scan, pattern).each do
          range = Regexp.last_match.begin(0)...Regexp.last_match.end(0)
          ranges << range unless protected?(Regexp.last_match.begin(0), ranges)
        end
      end

      ranges.sort_by(&:begin)
    end

    def fenced_code_ranges(content)
      ranges = []
      start_index = nil
      fence = nil
      offset = 0

      content.each_line do |line|
        match = line.match(/^\s*(`{3,}|~{3,})/)
        if match
          marker = match[1][0]
          length = match[1].length

          if start_index.nil?
            start_index = offset
            fence = [marker, length]
          elsif fence && marker == fence[0] && length >= fence[1]
            ranges << (start_index...(offset + line.length))
            start_index = nil
            fence = nil
          end
        end

        offset += line.length
      end

      ranges << (start_index...content.length) if start_index
      ranges
    end

    def inline_code_ranges(content, protected_ranges)
      ranges = []
      cursor = 0
      code_start = nil
      code_ticks = nil

      while cursor < content.length
        if protected?(cursor, protected_ranges) || content[cursor] != "`"
          cursor += 1
          next
        end

        ticks = content[cursor..].match(INLINE_CODE)[0]

        if code_start && ticks == code_ticks
          ranges << (code_start...(cursor + ticks.length))
          code_start = nil
          code_ticks = nil
        elsif code_start.nil?
          code_start = cursor
          code_ticks = ticks
        end

        cursor += ticks.length
      end

      ranges
    end

    def remove_latexpage_markers(content, protected_ranges)
      replace_unprotected(content, LATEXPAGE_MARKER, protected_ranges) { "" }
    end

    def replace_unprotected(content, pattern, protected_ranges)
      output = +""
      cursor = 0

      content.to_enum(:scan, pattern).each do
        start_index = Regexp.last_match.begin(0)
        end_index = Regexp.last_match.end(0)
        next if protected?(start_index, protected_ranges)

        output << content[cursor...start_index]
        output << yield(Regexp.last_match)
        cursor = end_index
      end

      return content if cursor.zero?

      output << content[cursor..]
    end

    def collect_matches(content, protected_ranges)
      patterns = [
        { display: true, regex: /\\?\[latex\\?\](.*?)\\?\[\/latex\\?\]/mi, tex_index: 1 },
        { display: true, regex: /\\\[(.+?)\\\]/m, tex_index: 1, block_delimiter: true },
        { display: true, regex: /\$\$(.+?)\$\$/m, tex_index: 1, block_delimiter: true },
        { display: false, regex: /\\\((.+?)\\\)/m, tex_index: 1 },
        { display: true, regex: /\\begin\{(equation\*?|align\*?|gather\*?|multline\*?)\}.*?\\end\{\1\}/m, tex_index: 0 }
      ]
      matches = []

      patterns.each do |pattern|
        content.to_enum(:scan, pattern[:regex]).each do
          start_index = Regexp.last_match.begin(0)
          end_index = Regexp.last_match.end(0)
          next if protected?(start_index, protected_ranges)
          next if pattern[:block_delimiter] && !block_delimiter?(content, start_index, end_index)

          tex = Regexp.last_match[pattern[:tex_index]].to_s.strip
          next if tex.empty?

          matches << {
            start: start_index,
            end: end_index,
            tex: tex,
            display: pattern[:display]
          }
        end
      end

      non_overlapping(matches)
    end

    def block_delimiter?(content, start_index, end_index)
      before = content[0...start_index].to_s.rpartition("\n").last
      after = content[end_index..].to_s.partition("\n").first

      before.strip.empty? && after.strip.empty?
    end

    def non_overlapping(matches)
      selected = []
      last_end = -1

      matches.sort_by { |match| [match[:start], -(match[:end] - match[:start])] }.each do |match|
        next if match[:start] < last_end

        selected << match
        last_end = match[:end]
      end

      selected
    end

    def protected?(index, ranges)
      ranges.any? { |range| range.begin <= index && index < range.end }
    end

    def render_matches(matches, seed)
      payload = JSON.generate(
        items: matches.map { |match| { tex: match[:tex], displayMode: match[:display] } }
      )
      stdout, stderr, status = Open3.capture3("node", SCRIPT_PATH, stdin_data: payload)

      unless status.success?
        Jekyll.logger.warn "JCEM Math:", "falha ao renderizar #{seed}: #{stderr}"
        return matches.map { |match| fallback_html(match) }
      end

      parsed = JSON.parse(stdout)
      parsed.fetch("items", []).each_with_index.map do |item, index|
        html = item["html"].to_s
        html.empty? ? fallback_html(matches[index]) : wrap_html(html, matches[index])
      end
    rescue StandardError => error
      Jekyll.logger.warn "JCEM Math:", "falha ao renderizar #{seed}: #{error.message}"
      matches.map { |match| fallback_html(match) }
    end

    def replace_matches(content, matches, rendered)
      output = +""
      cursor = 0

      matches.each_with_index do |match, index|
        output << content[cursor...match[:start]]
        output << rendered[index].to_s
        cursor = match[:end]
      end

      output << content[cursor..]
    end

    def wrap_html(html, match)
      if match[:display]
        <<~HTML

        <div class="jcem-math jcem-math--display" data-jcem-math data-jcem-math-display="true" role="group" aria-label="Fórmula matemática">
          <div class="jcem-math__viewport">#{html}</div>
        </div>
        HTML
      else
        %(<span class="jcem-math jcem-math--inline" data-jcem-math>#{html}</span>)
      end
    end

    def fallback_html(match)
      escaped = CGI.escapeHTML(match[:tex])

      if match[:display]
        <<~HTML

        <pre class="jcem-math jcem-math--display jcem-math--fallback" data-jcem-math data-jcem-math-display="true"><code>#{escaped}</code></pre>
        HTML
      else
        %(<code class="jcem-math jcem-math--inline jcem-math--fallback" data-jcem-math>#{escaped}</code>)
      end
    end
  end
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  Jcem::Math.prepare_document(page)
end

Jekyll::Hooks.register :documents, :pre_render do |document|
  Jcem::Math.prepare_document(document)
end
