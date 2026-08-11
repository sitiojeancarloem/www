# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require_relative "../_plugins/jcem_asset_metadata"

ROOT = File.expand_path("..", __dir__)

def assert(condition, message)
  raise message unless condition
end

samples = {
  "assets/jcem/img/e-o-fim-da-rosca-ccbysanc-jcem.png" => "image/png",
  "assets/jcem/img/logo-animado.gif" => "image/gif",
  "assets/jcem/img/painel.svg" => "image/svg+xml"
}

samples.each do |relative, media_type|
  path = File.join(ROOT, relative)
  metadata = Jcem::AssetMetadata.build_metadata(path, "/#{relative}")

  assert(metadata["media_type"] == media_type, "media_type invalido para #{relative}")
  assert(metadata["width"].to_f.positive?, "width ausente para #{relative}")
  assert(metadata["height"].to_f.positive?, "height ausente para #{relative}")
  assert(metadata["aspect_ratio"].to_f.positive?, "aspect_ratio ausente para #{relative}")
  assert(metadata["orientation"].to_s != "", "orientation ausente para #{relative}")
end

normalized = Jcem::AssetMetadata.normalize_path("assets/jcem/img/painel.svg?x=1")
assert(normalized == "/assets/jcem/img/painel.svg", "normalizacao de caminho invalida")
wayback_path = Jcem::AssetMetadata.normalize_path(
  "/web/20201006232837im_/https://blog.jeancarloem.com/wp-content/uploads/2020/04/COVER.png"
)
assert(
  wayback_path.include?("https://blog.jeancarloem.com"),
  "normalizacao de caminho Wayback invalida"
)

declared = Jcem::AssetMetadata.build_declared_assets(
  "assets" => {
    "https://web.archive.org/web/20201006232837im_/https://blog.jeancarloem.com/wp-content/uploads/2020/04/COVER.png" => {
      "width" => 1200,
      "height" => 630
    }
  }
)
declared_site = Struct.new(:data).new({ "jcem_asset_metadata" => { "assets" => declared } })
declared_meta = Jcem::AssetMetadata.metadata_for(
  declared_site,
  "https://web.archive.org/web/20201006232837im_/https://blog.jeancarloem.com/wp-content/uploads/2020/04/COVER.png"
)
assert(declared_meta["width"] == 1200, "metadata declarado nao localizado por URL Wayback")
original_meta = Jcem::AssetMetadata.metadata_for(
  declared_site,
  "https://blog.jeancarloem.com/wp-content/uploads/2020/04/COVER.png"
)
assert(original_meta["height"] == 630, "metadata declarado nao localizado por URL original")
path_meta = Jcem::AssetMetadata.metadata_for(
  declared_site,
  "/wp-content/uploads/2020/04/COVER.png"
)
assert(path_meta["aspect_ratio_css"] == "1200 / 630", "metadata declarado nao localizado por caminho")

responsive_path = File.join(ROOT, "_data", "jcem_responsive_images.json")
responsive_data = JSON.parse(File.binread(responsive_path))
responsive_assets = {}
responsive_data.fetch("assets").each do |canonical, definition|
  first = definition.fetch("variants").first
  metadata = Jcem::AssetMetadata.build_declared_metadata(
    canonical,
    "width" => first.fetch("width"), "height" => first.fetch("height")
  )
  Jcem::AssetMetadata.asset_lookup_keys(canonical).each { |key| responsive_assets[key] = metadata }
end
Jcem::AssetMetadata.attach_responsive_variants!(responsive_assets, responsive_data)
assert(responsive_data.fetch("assets").size == 11, "catalogo responsivo deve cobrir onze imagens publicadas")

responsive_data.fetch("assets").each do |canonical, definition|
  metadata = Jcem::AssetMetadata.metadata_for(
    Struct.new(:data).new({ "jcem_asset_metadata" => { "assets" => responsive_assets } }),
    canonical
  )
  variants = metadata.fetch("variants")
  assert(variants.size >= 2, "variantes insuficientes para #{canonical}")
  assert(variants.map { |variant| variant.fetch("width") } == variants.map { |variant| variant.fetch("width") }.sort,
         "variantes fora de ordem para #{canonical}")
  variants.each do |variant|
    file = File.join(ROOT, variant.fetch("path").delete_prefix("/"))
    assert(File.file?(file) && File.size(file).positive?, "variante ausente para #{canonical}: #{file}")
    measured = Jcem::AssetMetadata.build_metadata(file, variant.fetch("path"))
    assert(measured["width"] == variant["width"] && measured["height"] == variant["height"],
           "dimensoes responsivas divergentes para #{canonical}")
  end
  assert(metadata.fetch("srcset").include?("#{variants.first.fetch("width")}w"),
         "srcset ausente para #{canonical}")
end

delivery_site = Struct.new(:data).new({ "jcem_asset_metadata" => { "assets" => responsive_assets } })
delivery_html = Jcem::AssetMetadata.normalize_post_images(
  '<p><img src="/assets/images/posts/devaneios/observador-restaurantes-jcem-ccbysa.png" alt="Teste"></p>',
  delivery_site
)
assert(delivery_html.include?('loading="lazy"'), "imagem editorial deve nascer lazy no HTML")
assert(delivery_html.include?('decoding="async"'), "imagem editorial deve nascer com decoding async")
assert(delivery_html.include?('srcset="'), "imagem editorial responsiva deve emitir srcset")
assert(delivery_html.include?('sizes="'), "imagem editorial responsiva deve emitir sizes")
assert(delivery_html.include?('width="'), "imagem editorial deve reservar largura")
assert(delivery_html.include?('height="'), "imagem editorial deve reservar altura")
assert(!delivery_html.include?('/ loading='), "atributos devem preceder o fechamento da imagem")

puts "asset_metadata=ok"
