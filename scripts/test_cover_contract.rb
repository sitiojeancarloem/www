# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require_relative "../_plugins/jcem_cover_contract"

ROOT = File.expand_path("..", __dir__)
Site = Struct.new(:source)
Document = Struct.new(:data, :site, :relative_path)

fallback = Document.new(
  { "header" => { "image" => "/assets/images/posts/eventos-finais/a-heranca-dos-santos.png", "image_wide_mode" => "triptych" } },
  Site.new(ROOT),
  "fallback.md"
)
Jcem::CoverContract.validate(fallback)
raise "fallback triptych ausente" unless fallback.data.dig("header", "image_wide_mode") == "single"

partial = Document.new(
  { "header" => {
    "image" => "/assets/images/posts/eventos-finais/a-heranca-dos-santos.png",
    "image_wide_mode" => "triptych",
    "image_wide_left" => "/assets/images/posts/eventos-finais/overlay.png"
  } },
  Site.new(ROOT),
  "partial.md"
)
begin
  Jcem::CoverContract.validate(partial)
  raise "triptych parcial aceito"
rescue Jekyll::Errors::FatalException => error
  raise unless error.message.include?("triptych_incompleto")
end

puts "cover_contract=ok fallback=single partial=rejected"
