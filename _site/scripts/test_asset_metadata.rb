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

puts "asset_metadata=ok"
