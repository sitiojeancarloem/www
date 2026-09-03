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

extended_modes = {
  "FullWindow" => ["full-window", "external", "auto"],
  "windowHeight" => ["window-height", "external", "height"],
  "windowWidth" => ["window-width", "external", "width"],
  "innerFullWindow" => ["inner-full-window", "inner", "auto"],
  "innerWindowHeight" => ["inner-window-height", "inner", "height"],
  "innerWindowWidth" => ["inner-window-width", "inner", "width"]
}
extended_modes.each do |input, expected|
  extended = document(
    {
      "featured_image" => { "path" => "/assets/images/fixtures/covers/triptych-central.svg" },
      "cover" => { "mode" => input }
    },
    "#{input}.md"
  )
  Jcem::CoverContract.validate(extended)
  actual = extended.data.fetch("jcem_cover").values_at("mode", "scope", "axis")
  raise "modo estendido divergente #{input}: #{actual}" unless actual == expected
end

patterned = document(
  {
    "featured_image" => { "path" => "/assets/images/fixtures/covers/triptych-central.svg" },
    "cover" => {
      "mode" => "wide",
      "composition" => "triptych",
      "patterns" => {
        "left" => "#202735",
        "right" => "linear-gradient(90deg, #202735 0%, #35435a 100%)"
      }
    }
  },
  "patterns.md"
)
Jcem::CoverContract.validate(patterned)
raise "pattern hexadecimal ausente" unless patterned.data.dig("jcem_cover", "patterns", "left", "kind") == "hex"
raise "pattern gradiente ausente" unless patterned.data.dig("jcem_cover", "patterns", "right", "kind") == "linear-gradient"

invalid_pattern = document(
  {
    "featured_image" => { "path" => "/assets/images/fixtures/covers/triptych-central.svg" },
    "cover" => {
      "mode" => "wide",
      "composition" => "triptych",
      "patterns" => { "left" => "url(javascript:alert(1))", "right" => "#000" }
    }
  },
  "invalid-pattern.md"
)
begin
  Jcem::CoverContract.validate(invalid_pattern)
  raise "pattern inseguro aceito"
rescue Jekyll::Errors::FatalException => error
  raise unless error.message.include?("pattern_invalido")
end

%w[top-left top-right bottom-left bottom-right center full].each do |zone|
  hero = document(
    {
      "header" => { "image" => "/assets/images/fixtures/covers/triptych-central.svg" },
      "cover" => {
        "hero" => {
          "zone" => zone,
          "content" => "## Título\n\nTexto <script>alert(1)</script> com [link](#alvo).",
          "cta" => { "label" => "Continuar", "url" => "#alvo" }
        }
      }
    },
    "hero-#{zone}.md"
  )
  Jcem::CoverContract.validate(hero)
  resolved = hero.data.fetch("jcem_cover")
  raise "hero alterou legado" unless resolved["mode"] == "legacy"
  raise "zona hero divergente" unless resolved.dig("hero", "zone") == zone
  raise "hero não sanitizado" if resolved.dig("hero", "html").include?("script")
  raise "CTA ausente" unless resolved.dig("hero", "cta", "url") == "#alvo"
end

restored_posts = %w[
  _posts/2026-08-11-bate-papo-eventos-finais-a-heranca-dos-santos.md
  _posts/2026-08-11-bate-papo-eventos-finais-rumo-ao-lar-viagem-dos-remidos-coroas-e-recompensa-celestial.md
]
restored_posts.each do |relative_path|
  source = File.read(File.join(ROOT, relative_path), encoding: "UTF-8")
  raise "post ainda reclassificado como wide: #{relative_path}" if source.match?(/^featured_image_style:\s*wide\s*$/)
end

sola_scriptura = File.read(File.join(ROOT, "_posts/2020-05-22-sola-scriptura.md"), encoding: "UTF-8")
raise "Sola Scriptura fora da zona do artigo" unless sola_scriptura.match?(/^featured_image_style:\s*content\s*$/)

puts "cover_contract=ok legacy=4 extended=6 hero_zones=6 patterns=3 fallback=single"
