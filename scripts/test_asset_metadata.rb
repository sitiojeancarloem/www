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

puts "asset_metadata=ok"
