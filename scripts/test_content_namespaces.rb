# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require_relative "../_plugins/jcem_content_namespaces"

def assert(condition, message)
  abort "content_namespaces=erro detalhe=#{message}" unless condition
end

config = {
  "content_namespaces" => {
    "bate-papo" => {
      "title_prefix" => "Bate-papo:",
      "source_prefix" => "bate-papo-",
      "url_prefix" => "bate-papo:",
      "physical_prefix" => "bate-papo-",
      "route_prefix" => "/p/",
      "disclaimer" => "aviso automatizado"
    }
  }
}

repository_config = File.read(File.expand_path("../_config.yml", __dir__))
assert(
  repository_config.include?("Esta é uma síntese fiel de um bate-papo"),
  "disclaimer perdeu a declaração de fidelidade"
)
assert(
  repository_config.include?("produzido e processado de forma automatizada"),
  "disclaimer perdeu a advertência de automação"
)
assert(
  repository_config.include?("formulações coletivas não significam unanimidade"),
  "disclaimer perdeu a ressalva sobre formulações coletivas"
)

site = Struct.new(:config).new(config)
document = Struct.new(:relative_path, :data, :site, :content) do
  attr_accessor :url
end.new(
  "_posts/2026-08-08-bate-papo-tema.md",
  { "title" => "Bate-papo: tema" },
  site,
  "> aviso automatizado"
)

Jcem::ContentNamespaces.apply!(document)
Jcem::ContentNamespaces.validate!(document, { "layout" => "single" })

assert(document.data["jcem_namespace_url"] == "/p/bate-papo:tema/", "URL lógica não preservou dois-pontos")
assert(
  Jcem::ContentNamespaces.physical_path_for(
    "C:/site/p/bate-papo:tema/index.html",
    config,
    windows: true
  ) == "C:/site/p/bate-papo-tema/index.html",
  "path físico Windows não foi hifenizado"
)
assert(
  Jcem::ContentNamespaces.physical_path_for(
    "/site/p/bate-papo:tema/index.html",
    config,
    windows: false
  ) == "/site/p/bate-papo:tema/index.html",
  "path publicável compatível perdeu o namespace literal"
)

puts "content_namespaces=ok"
