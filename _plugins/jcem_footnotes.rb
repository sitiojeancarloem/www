# frozen_string_literal: true

require "digest"

module Jcem
  module Footnotes
    DISPOSABLE_MARKER = /(?<!\\)\[\^\*\]/.freeze
    DISPOSABLE_DEFINITION = /^(\s{0,3})\[\^\*\](:)/.freeze
    FENCE = /^\s*(`{3,}|~{3,})/.freeze
    MARKDOWN_EXTENSIONS = %w[markdown mkdown mkdn mkd md].freeze

    module_function

    def markdown?(item)
      path = item.respond_to?(:path) ? item.path.to_s : ""
      extension = File.extname(path).delete_prefix(".").downcase
      MARKDOWN_EXTENSIONS.include?(extension)
    end

    def prepare_document(item)
      return unless item.respond_to?(:content) && markdown?(item)

      item.content = prepare(item.content.to_s, item.respond_to?(:path) ? item.path.to_s : "")
    end

    def prepare(content, seed = "")
      return content unless content.include?("[^*]")

      lines = content.lines
      assignments = collect_assignments(lines, seed)
      rewrite(lines, assignments, seed)
    end

    def collect_assignments(lines, seed)
      assignments = []
      used = existing_ids(lines.join)
      fenced = false

      lines.each_with_index do |line, line_index|
        fence = line.match(FENCE)
        if fence
          fenced = !fenced
          next
        end

        next if fenced || line.match?(DISPOSABLE_DEFINITION)

        replace_outside_code(line) do |_marker, offset|
          assignments << unique_id(seed, assignments.length, line_index, offset, used)
        end
      end

      assignments
    end

    def rewrite(lines, assignments, seed)
      call_index = 0
      definition_index = 0
      used = existing_ids(lines.join) + assignments
      fenced = false

      lines.map.with_index do |line, line_index|
        fence = line.match(FENCE)
        if fence
          fenced = !fenced
          next line
        end

        next line if fenced

        if line.match?(DISPOSABLE_DEFINITION)
          id = assignments[definition_index] || unique_id(seed, definition_index, line_index, 0, used)
          definition_index += 1
          line.sub(DISPOSABLE_DEFINITION, "\\1[^#{id}]\\2")
        else
          replace_outside_code(line) do |_marker, offset|
            id = assignments[call_index] || unique_id(seed, call_index, line_index, offset, used)
            call_index += 1
            "[^#{id}]"
          end
        end
      end.join
    end

    def existing_ids(content)
      content.scan(/(?<!\\)\[\^([0-9A-Za-z]+)\]/).flatten.uniq
    end

    def unique_id(seed, ordinal, line_index, offset, used)
      suffix = 0

      loop do
        source = "#{seed}:#{ordinal}:#{line_index}:#{offset}:#{suffix}"
        candidate = "jcem#{Digest::SHA1.hexdigest(source)[0, 8]}"
        next suffix += 1 if used.include?(candidate)

        used << candidate
        return candidate
      end
    end

    def replace_outside_code(line)
      output = +""
      cursor = 0
      code_ticks = nil

      while cursor < line.length
        if line[cursor] == "`"
          ticks = line[cursor..].match(/\A`+/)[0]
          output << ticks
          cursor += ticks.length
          code_ticks = code_ticks == ticks ? nil : ticks
          next
        end

        start = cursor
        cursor += 1 while cursor < line.length && line[cursor] != "`"
        segment = line[start...cursor]

        if code_ticks
          output << segment
        else
          output << segment.gsub(DISPOSABLE_MARKER) do |marker|
            replacement = yield(marker, start + Regexp.last_match.begin(0))
            replacement || marker
          end
        end
      end

      output
    end
  end
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  Jcem::Footnotes.prepare_document(page)
end

Jekyll::Hooks.register :documents, :pre_render do |document|
  Jcem::Footnotes.prepare_document(document)
end
