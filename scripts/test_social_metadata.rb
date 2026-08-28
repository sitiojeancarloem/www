# frozen_string_literal: true

require_relative "jekyll_compat"
require "json"
require "jekyll"
require_relative "../_plugins/jcem_social_images"

def assert(condition, message)
  abort "social_metadata=erro detalhe=#{message}" unless condition
end

manifest = JSON.parse(File.read(File.expand_path("../_data/jcem_social_images.json", __dir__)))
site = Struct.new(:config, :data).new(
  { "url" => "https://www.jeancarloem.com", "baseurl" => "" },
  { "jcem_social_images" => manifest }
)
canonical = manifest.fetch("assets").keys.first
document = Struct.new(:data, :site).new(
  { "title" => "Teste", "header" => { "image" => canonical, "image_description" => "Descrição" } },
  site
)
Jcem::SocialImages.connect(document)
html = Jcem::SocialImages.normalize_metadata(
  '<!doctype html><html><head><meta property="og:image" content="antiga"><meta name="twitter:card" content="summary"></head><body></body></html>',
  document
)
parsed = Nokogiri::HTML.parse(html)
images = parsed.css('meta[property="og:image"]')
assert(images.length == 2, "wide e square não foram emitidas")
assert(parsed.css('meta[property="og:image:width"]')[0]["content"] == "1200", "wide não é 1200")
assert(parsed.css('meta[property="og:image:height"]')[0]["content"] == "630", "wide não é 630")
assert(parsed.css('meta[property="og:image:width"]')[1]["content"] == "400", "square não é 400")
assert(parsed.at_css('meta[name="twitter:card"]')["content"] == "summary_large_image", "card X incoerente")
assert(parsed.at_css('meta[name="twitter:image"]')["content"] == images.first["content"], "X large não usa wide")
assert(!html.include?("antiga"), "metadado social legado permaneceu")

document.data["header"]["twitter_card"] = "summary"
summary = Nokogiri::HTML.parse(Jcem::SocialImages.normalize_metadata(html, document))
assert(summary.at_css('meta[name="twitter:image"]')["content"] == images.last["content"], "X summary não usa square")
puts "social_metadata=ok"
