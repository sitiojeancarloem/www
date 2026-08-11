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
    },
    "ensaio" => {
      "title_prefix" => "Ensaio:",
      "source_prefix" => "ensaio-",
      "url_prefix" => "ensaio:",
      "physical_prefix" => "ensaio-",
      "route_prefix" => "/p/",
      "disclaimer" => "aviso ensaio"
    }
  }
}

repository_config = File.read(File.expand_path("../_config.yml", __dir__))
bate_papo_rcf = File.read(File.expand_path("../RCFs/bate-papo.md", __dir__))
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
assert(
  bate_papo_rcf.include?("mera referência bibliográfica") &&
    bate_papo_rcf.include?("recompor a íntegra material") &&
    bate_papo_rcf.include?("bloqueia a publicação"),
  "RCF perdeu o contrato de citação integral e recomposição obrigatória"
)
eventos_finais_posts = [
  "../_posts/2026-08-11-bate-papo-eventos-finais-a-heranca-dos-santos.md",
  "../_posts/" \
    "2026-08-11-bate-papo-eventos-finais-rumo-ao-lar-viagem-dos-remidos-coroas-e-recompensa-celestial.md"
]
eventos_finais_posts.each do |relative_path|
  post = File.binread(File.expand_path(relative_path, __dir__)).force_encoding(Encoding::UTF_8)
  assert(post.include?('data-jcem-quote-model="alerta1"'), "disclaimer bate-papo não usa alerta1")
  assert(
    post.match?(/^content_subnamespaces:\R  - eventos-finais\R/),
    "obra-base Eventos Finais perdeu o subnamespace"
  )
  assert(
    !post.match?(/^(?:##|###|####|#####|######) .*\[\^[^\]]+\]\s*$/),
    "bate-papo contém título com mera referência"
  )
  assert(!post.include?("[...]"), "bate-papo contém corte editorial em citação")
end

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

subdocument = Struct.new(:relative_path, :data, :site, :content) do
  attr_accessor :url
end.new(
  "_posts/2026-08-08-bate-papo-tema.md",
  {
    "title" => "Bate-papo: tema",
    "content_subnamespaces" => ["O Grande Conflito", "Capítulo 42"]
  },
  site,
  "> aviso automatizado"
)
Jcem::ContentNamespaces.apply!(subdocument)
assert(
  subdocument.data["jcem_namespace_url"] ==
    "/p/bate-papo:o-grande-conflito/capitulo-42/tema/",
  "subnamespaces não preservaram profundidade e ordem: #{subdocument.data["jcem_namespace_url"]}"
)
assert(
  Jcem::ContentNamespaces.physical_path_for(
    "C:/site/p/bate-papo:o-grande-conflito/capitulo-42/tema/index.html",
    config,
    windows: true,
    namespace_data: subdocument.data
  ) == "C:/site/p/bate-papo/o-grande-conflito/capitulo-42/tema/index.html",
  "subnamespaces não produziram diretórios físicos portáveis"
)
assert(
  Jcem::ContentNamespaces.physical_path_for(
    "/site/p/bate-papo:o-grande-conflito/capitulo-42/tema/index.html",
    config,
    windows: false,
    namespace_data: subdocument.data
  ).include?("bate-papo:o-grande-conflito"),
  "destino compatível perdeu namespace literal com subnamespace"
)

site_collection = Struct.new(:docs).new([subdocument])
site_with_collections = Struct.new(:config, :collections).new(
  config,
  { "posts" => site_collection }
)
subdocument.data.delete("jcem_namespace_url")
Jcem::ContentNamespaces.apply_site!(site_with_collections)
assert(
  subdocument.data["jcem_namespace_url"] ==
    "/p/bate-papo:o-grande-conflito/capitulo-42/tema/",
  "post_read não aplicou subnamespaces após o front matter"
)

explicit = Struct.new(:relative_path, :data, :site, :content) do
  attr_accessor :url
end.new(
  "_posts/2026-08-08-ensaio-teste.md",
  { "title" => "Ensaio: teste", "content_namespace" => "ensaio" },
  site,
  "> aviso ensaio"
)
Jcem::ContentNamespaces.apply!(explicit)
assert(explicit.data["jcem_namespace_url"] == "/p/ensaio:teste/", "segunda classe ficou acoplada a bate-papo")

begin
  invalid = Struct.new(:relative_path, :data, :site, :content) do
    attr_accessor :url
  end.new(
    "_posts/2026-08-08-bate-papo-invalido.md",
    { "title" => "Bate-papo: inválido", "content_subnamespaces" => ["../segredo"] },
    site,
    "> aviso automatizado"
  )
  Jcem::ContentNamespaces.apply!(invalid)
  abort "content_namespaces=erro detalhe=subnamespace inseguro foi aceito"
rescue Jekyll::Errors::FatalException
  # esperado
end

puts "content_namespaces=ok"
