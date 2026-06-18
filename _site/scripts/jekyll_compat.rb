# frozen_string_literal: true

return unless Gem::Version.new(RUBY_VERSION) >= Gem::Version.new("4.0.0")

require "forwardable"
require "liquid"
require "liquid/tags/assign"
require "liquid/tags/break"
require "liquid/tags/capture"
require "liquid/tags/case"
require "liquid/tags/comment"
require "liquid/tags/continue"
require "liquid/tags/cycle"
require "liquid/tags/decrement"
require "liquid/tags/for"
require "liquid/tags/if"
require "liquid/tags/ifchanged"
require "liquid/tags/include"
require "liquid/tags/increment"
require "liquid/tags/raw"
require "liquid/tags/table_row"
require "liquid/tags/unless"

module Liquid
  class BlockBody
    Continue = Liquid::Continue unless const_defined?(:Continue, false)
    Break = Liquid::Break unless const_defined?(:Break, false)
  end
end

require "jekyll/plugin"
require "jekyll/converter"
require "kramdown"
require "jekyll/converters/identity"
require "jekyll/converters/markdown"
require "jekyll/converters/markdown/kramdown_parser"
require "jekyll/converters/smartypants"
require "jekyll/filters/date_filters"
require "jekyll/filters/grouping_filters"
require "jekyll/filters/url_filters"
require "jekyll/drops/drop"
require "jekyll/drops/url_drop"
require "jekyll/drops/collection_drop"
require "jekyll/drops/document_drop"
require "jekyll/drops/excerpt_drop"
require "jekyll/drops/jekyll_drop"
require "jekyll/drops/site_drop"
require "jekyll/drops/static_file_drop"
require "jekyll/drops/theme_drop"
require "jekyll/drops/unified_payload_drop"
require "jekyll/tags/include"
