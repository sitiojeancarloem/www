# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/www
# Autor: JeanCarloEM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.

require_relative "jekyll_compat"
require "json"
require "jekyll"
require "kramdown"
require "rexml/document"
require "yaml"
require_relative "../_plugins/jcem_cover_contract"
require_relative "../_plugins/jcem_quote_semantics"

ROOT = File.expand_path("..", __dir__)
Site = Struct.new(:source)
Document = Struct.new(:data, :site, :relative_path)

def assert(condition, message)
  abort "documentation=erro detalhe=#{message}" unless condition
end

def read(relative_path)
  File.read(File.join(ROOT, relative_path), encoding: "UTF-8")
end

def verify_local_links(relative_path)
  content = read(relative_path)
  content.scan(/!?(?:\[[^\]]*\])\(([^)]+)\)/).flatten.each do |target|
    clean = target.split("#", 2).first
    next if clean.empty? || clean.match?(%r{\A(?:https?:|mailto:)})

    resolved = File.expand_path(clean, File.dirname(File.join(ROOT, relative_path)))
    assert(resolved.start_with?(ROOT + File::SEPARATOR), "link escapou do repositório em #{relative_path}: #{target}")
    assert(File.exist?(resolved), "link local ausente em #{relative_path}: #{target}")
  end
end

def verify_svg(relative_path)
  source = read(relative_path)
  svg = REXML::Document.new(source).root
  assert(svg&.name == "svg", "SVG inválido: #{relative_path}")
  assert(svg.attributes["width"] == "560" && svg.attributes["height"] == "315", "dimensão divergente: #{relative_path}")
  assert(svg.attributes["viewBox"] == "0 0 560 315", "viewBox divergente: #{relative_path}")
  assert(!REXML::XPath.first(svg, "title").text.to_s.strip.empty?, "title ausente: #{relative_path}")
  style = REXML::XPath.first(svg, "style")&.text.to_s
  assert(style.include?("prefers-color-scheme:dark"), "tema escuro ausente: #{relative_path}")
  %w[frame label note].each do |token|
    assert(style.include?(".#{token}"), "token visual #{token} ausente: #{relative_path}")
  end
end

cover_doc_path = "MODO-DE-USO-COVER-E-HERO.md"
quote_doc_path = "MODO-DE-USO-BLOCKQUOTE.md"
readme = read("README.md")
cover_doc = read(cover_doc_path)
quote_doc = read(quote_doc_path)
cover_config = JSON.parse(read("config/cover-system.json"))
quote_config = JSON.parse(read("config/editorial-quotes.json"))

assert(Dir.glob(File.join(ROOT, "MODO-DE-USO-COVER*.md")).length == 1, "página canônica de COVER não é única")
assert(Dir.glob(File.join(ROOT, "MODO-DE-USO-BLOCKQUOTE*.md")).length == 1, "página canônica de blockquote não é única")

%w[
  MODO-DE-USO-COVER-E-HERO.md
  MODO-DE-USO-BLOCKQUOTE.md
  MODO-DE-USO-LEITURA-ACESSIVEL-E-TTS.md
  src/jcem-print-ieee/README.md
  RCF.md
].each do |link|
  assert(readme.include?("](#{link})"), "README não indexa #{link}")
end
assert(readme.include?("https://github.com/sitiojeancarloem/www"), "README sem upstream canônico")

cover_visuals = {
  "legacy-hero" => "hero legado",
  "content" => "content",
  "wide-single" => "wide single",
  "wide-triptych" => "wide triptych",
  "full-window" => "full-window",
  "window-height" => "window-height",
  "window-width" => "window-width",
  "inner-full-window" => "inner-full-window",
  "inner-window-height" => "inner-window-height",
  "inner-window-width" => "inner-window-width"
}
assert(cover_config.fetch("modes").keys.sort == %w[content full-window inner-full-window inner-window-height inner-window-width wide window-height window-width].sort, "inventário canônico de COVER divergente")
cover_visuals.each do |slug, label|
  relative = "assets/images/documentacao/cover/#{slug}.svg"
  assert(cover_doc.downcase.include?(label), "comportamento #{label} ausente da documentação")
  assert(cover_doc.include?(relative), "ilustração #{slug} não ligada pela documentação")
  verify_svg(relative)
end
cover_config.fetch("aliases").each do |name, canonical|
  assert(cover_doc.include?("`#{name}`") && cover_doc.include?("`#{canonical}`"), "alias de COVER não documentado: #{name}")
end
cover_config.fetch("fits").each { |fit| assert(cover_doc.include?("`#{fit}`"), "fit não documentado: #{fit}") }
cover_config.dig("hero", "zones").each { |zone| assert(cover_doc.include?("`#{zone}`"), "zona Hero não documentada: #{zone}") }

cover_example = cover_doc.match(/## Exemplo copiável e funcional.*?```yaml\s+---\s+(.*?)\s+---\s+```/m)
assert(cover_example, "exemplo YAML de COVER não localizado")
cover_data = YAML.safe_load(cover_example[1], permitted_classes: [], aliases: false)
cover_document = Document.new(cover_data, Site.new(ROOT), "documentacao-cover.md")
Jcem::CoverContract.validate(cover_document)
resolved_cover = cover_document.data.fetch("jcem_cover")
assert(resolved_cover.values_at("mode", "composition") == %w[wide triptych], "exemplo de COVER não resolve para wide triptych")
assert(resolved_cover.dig("hero", "cta", "url") == "#inicio-do-artigo", "CTA do exemplo de COVER divergente")

quote_config.fetch("models").each do |model, definition|
  relative = "assets/images/documentacao/blockquote/#{model}.svg"
  assert(quote_doc.include?("`#{model}`"), "modelo de blockquote não documentado: #{model}")
  assert(quote_doc.include?(relative), "ilustração de blockquote ausente: #{model}")
  assert(quote_doc.include?(definition["defaultIcon"]), "ícone padrão não documentado: #{model}") if definition["defaultIcon"]
  verify_svg(relative)
end
%w[#64748b #1673a5 #b66a00 #b4232f].each do |color|
  assert(quote_doc.include?(color), "cor tipada não documentada: #{color}")
end

quote_example = quote_doc.match(/## Exemplo copiável e funcional.*?```markdown\s+(.*?)\s+```/m)
assert(quote_example, "exemplo Markdown de blockquote não localizado")
quote_html = Kramdown::Document.new(quote_example[1], input: "GFM").to_html
normalized_quote = Jcem::QuoteSemantics.normalize_html(quote_html, quote_config)
rendered_quote = Jcem::QuoteSemantics.render_structural_quotes(normalized_quote, quote_config.fetch("defaultModel"), quote_config)
assert(rendered_quote.include?('data-jcem-quote-model="alerta1"'), "exemplo de blockquote perdeu o modelo")
assert(rendered_quote.include?("🔎"), "exemplo de blockquote perdeu o ícone")

internal_icon = quote_doc.match(/data-jcem-quote-icon-src=\"([^\"]+)\"/)&.[](1)
assert(internal_icon&.start_with?("/"), "exemplo de ícone interno ausente")
assert(File.file?(File.join(ROOT, internal_icon.delete_prefix("/"))), "asset interno do exemplo não existe")

root_package = JSON.parse(read("package.json"))
print_package = JSON.parse(read("src/jcem-print-ieee/package.json"))
[root_package, print_package].each do |package|
  assert(package["license"] == "MPL-2.0", "licença de manifesto divergente: #{package["name"]}")
  assert(package.dig("repository", "url") == "git+https://github.com/sitiojeancarloem/www.git", "upstream de manifesto divergente: #{package["name"]}")
  assert(package.dig("author", "name") == "JeanCarloEM", "autor de manifesto divergente: #{package["name"]}")
  assert(package.dig("author", "url") == "https://www.jeancarloem.com", "URL de autoria divergente: #{package["name"]}")
end
private_package = JSON.parse(read("scripts/lib/package.json"))
assert(private_package == { "private" => true, "type" => "commonjs" }, "manifesto técnico privado deixou de ser fronteira mínima")

todo_operational = read("TODO.ia.md").split("# TO-DOs", 2).last
assert(!todo_operational.match?(/^\s+- \[[ x]\]/), "subitem operacional ainda usa checkbox em vez da nomenclatura da seção 2")
todo_operational.lines.grep(/^- \[[ x]\]/).each do |line|
  assert(line.match?(/^- \[[ x]\] (?:⬜|📌|📜|⚖️|⏳|🔄|🔎|✅) \*\*[^*]+:\*\*/), "item de topo sem status nomeado: #{line.strip}")
end

%w[README.md MODO-DE-USO-COVER-E-HERO.md MODO-DE-USO-BLOCKQUOTE.md RCFs/carregamento-progressivo.md RCFs/citacoes.md].each do |path|
  verify_local_links(path)
end

puts "documentation=ok covers=#{cover_visuals.length} quotes=#{quote_config.fetch("models").length} manifests=2"
