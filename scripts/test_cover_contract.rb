# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require_relative "../_plugins/jcem_cover_contract"

ROOT = File.expand_path("..", __dir__)
Site = Struct.new(:source)
Document = Struct.new(:data, :site, :relative_path)

def document(data, path)
  Document.new(data, Site.new(ROOT), path)
end

legacy = document(
  { "header" => { "image" => "/assets/images/posts/eventos-finais/a-heranca-dos-santos.png" } },
  "legacy.md"
)
Jcem::CoverContract.validate(legacy)
raise "hero legado reclassificado" unless Jcem::CoverContract.style_for(legacy).empty?

content = document(
  {
    "featured_image_style" => "content",
    "header" => { "image" => "/assets/images/posts/eventos-finais/a-heranca-dos-santos.png" }
  },
  "content.md"
)
Jcem::CoverContract.validate(content)
raise "content reclassificado" unless Jcem::CoverContract.style_for(content) == "content"

fallback = Document.new(
  {
    "featured_image_style" => "wide",
    "header" => { "image" => "/assets/images/posts/eventos-finais/a-heranca-dos-santos.png", "image_wide_mode" => "triptych" }
  },
  Site.new(ROOT),
  "fallback.md"
)
Jcem::CoverContract.validate(fallback)
raise "fallback triptych ausente" unless fallback.data.dig("header", "image_wide_mode") == "single"

partial = Document.new(
  {
    "featured_image_style" => "wide",
    "header" => {
      "image" => "/assets/images/posts/eventos-finais/a-heranca-dos-santos.png",
      "image_wide_mode" => "triptych",
      "image_wide_left" => "/assets/images/posts/eventos-finais/overlay.png"
    }
  },
  Site.new(ROOT),
  "partial.md"
)
begin
  Jcem::CoverContract.validate(partial)
  raise "triptych parcial aceito"
rescue Jekyll::Errors::FatalException => error
  raise unless error.message.include?("triptych_incompleto")
end

leak = document(
  {
    "featured_image_style" => "content",
    "header" => {
      "image" => "/assets/images/fixtures/covers/triptych-central.svg",
      "image_wide_mode" => "triptych",
      "image_wide_left" => "/assets/images/fixtures/covers/triptych-left.svg",
      "image_wide_right" => "/assets/images/fixtures/covers/triptych-right.svg"
    }
  },
  "leak.md"
)
begin
  Jcem::CoverContract.validate(leak)
  raise "campos wide vazaram para content"
rescue Jekyll::Errors::FatalException => error
  raise unless error.message.include?("wide_requer_estilo_wide")
end

triptych = document(
  {
    "featured_image_style" => "wide",
    "header" => {
      "image" => "/assets/images/fixtures/covers/triptych-central.svg",
      "image_wide_mode" => "triptych",
      "image_wide_left" => "/assets/images/fixtures/covers/triptych-left.svg",
      "image_wide_right" => "/assets/images/fixtures/covers/triptych-right.svg"
    }
  },
  "triptych.md"
)
Jcem::CoverContract.validate(triptych)

restored_posts = %w[
  _posts/2026-08-11-bate-papo-eventos-finais-a-heranca-dos-santos.md
  _posts/2026-08-11-bate-papo-eventos-finais-rumo-ao-lar-viagem-dos-remidos-coroas-e-recompensa-celestial.md
]
restored_posts.each do |relative_path|
  source = File.read(File.join(ROOT, relative_path), encoding: "UTF-8")
  raise "post ainda reclassificado como wide: #{relative_path}" if source.match?(/^featured_image_style:\s*wide\s*$/)
end

puts "cover_contract=ok modes=4 fallback=single partial=rejected leak=rejected"
