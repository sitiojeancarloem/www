# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/www
# Autor: JeanCarloEM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.

require_relative "jekyll_compat"
require "json"
require "jekyll"
require "kramdown"
require "open3"
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

cover_doc_path = "docs/MODO-DE-USO-COVER-E-HERO.md"
quote_doc_path = "docs/MODO-DE-USO-BLOCKQUOTE.md"
print_doc_path = "docs/MODO-DE-USO-IMPRESSAO-IEEE.md"
readme = read("README.md")
cover_doc = read(cover_doc_path)
quote_doc = read(quote_doc_path)
cover_config = JSON.parse(read("config/cover-system.json"))
quote_config = JSON.parse(read("config/editorial-quotes.json"))

usage_inventory, usage_status = Open3.capture2("git", "ls-files", "--cached", "--others", "--exclude-standard", chdir: ROOT)
assert(usage_status.success?, "inventário Git dos modos de uso falhou")
usage_docs = usage_inventory.lines(chomp: true).select do |path|
  File.file?(File.join(ROOT, path)) && File.basename(path).match?(/\AMODO-DE-USO-.*\.md\z/)
end
assert(usage_docs.length == 4, "inventário de modos de uso divergente")
usage_docs.each do |path|
  assert(File.dirname(path).tr("\\", "/") == "docs", "modo de uso fora de ./docs/: #{path}")
end
assert(Dir.glob(File.join(ROOT, "docs", "MODO-DE-USO-COVER*.md")).length == 1, "página canônica de COVER não é única")
assert(Dir.glob(File.join(ROOT, "docs", "MODO-DE-USO-BLOCKQUOTE*.md")).length == 1, "página canônica de blockquote não é única")
assert(Dir.glob(File.join(ROOT, "docs", "MODO-DE-USO-IMPRESSAO-IEEE*.md")).length == 1, "página canônica de impressão IEEE não é única")

%w[
  docs/MODO-DE-USO-COVER-E-HERO.md
  docs/MODO-DE-USO-BLOCKQUOTE.md
  docs/MODO-DE-USO-LEITURA-ACESSIVEL-E-TTS.md
  docs/MODO-DE-USO-IMPRESSAO-IEEE.md
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
  assert(cover_doc.include?("../#{relative}"), "ilustração #{slug} não ligada pela documentação")
  verify_svg(relative)
end
cover_config.fetch("aliases").each do |name, canonical|
  assert(cover_doc.include?("`#{name}`") && cover_doc.include?("`#{canonical}`"), "alias de COVER não documentado: #{name}")
end
cover_config.fetch("fits").each { |fit| assert(cover_doc.include?("`#{fit}`"), "fit não documentado: #{fit}") }
cover_config.dig("hero", "zones").each { |zone| assert(cover_doc.include?("`#{zone}`"), "zona Hero não documentada: #{zone}") }
assert(cover_doc.include?("16,85%") && cover_doc.include?("base horizontal do triângulo traseiro"), "sustentação real da FLAG não documentada")
assert(cover_doc.include?("região superior de vidro fumê") && cover_doc.include?("região inferior sólida"), "duas regiões da barra não documentadas")
%w[legacy-hero content wide-single wide-triptych].each do |slug|
  svg = File.read(File.join(ROOT, "assets/images/documentacao/cover/#{slug}.svg"), encoding: "UTF-8")
  assert(svg.include?('class="glass"') && svg.include?('class="flag"'), "barra/FLAG não representadas em #{slug}")
end

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
  assert(quote_doc.include?("data-jcem-quote-model=\"#{model}\""), "seleção direta de blockquote não documentada: #{model}")
  assert(quote_doc.include?("../#{relative}"), "ilustração de blockquote ausente: #{model}")
  assert(quote_doc.include?(definition["defaultIcon"]), "ícone padrão não documentado: #{model}") if definition["defaultIcon"]
  verify_svg(relative)
end
thematic_rail_illustration = read("assets/images/documentacao/blockquote/thematic-rail.svg")
assert(thematic_rail_illustration.include?('x="68" y="178">”</text>'), "ilustração thematic-rail não centraliza o glifo de aspas duplas")
assert(quote_doc.include?("opticamente centralizado") && quote_doc.include?("corpo justificado"), "contrato visual do thematic-rail não documentado")
quote_config.fetch("aliases").each do |name, target|
  assert(quote_doc.include?("`#{name}`") && quote_doc.include?("`#{target}`"), "alias de blockquote não documentado: #{name}")
end
quote_config.dig("accents", "tokens").each do |name, definition|
  assert(quote_doc.include?("`#{name}`") && quote_doc.include?(definition.fetch("color")), "accent de blockquote não documentado: #{name}")
end
%w[#64748b #1673a5 #b66a00 #b4232f].each do |color|
  assert(quote_doc.include?(color), "cor tipada não documentada: #{color}")
end

quote_example = quote_doc.match(/## Exemplo copiável e funcional.*?```markdown\s+(.*?)\s+```/m)
assert(quote_example, "exemplo Markdown de blockquote não localizado")
quote_html = Kramdown::Document.new(quote_example[1], input: "GFM").to_html
normalized_quote = Jcem::QuoteSemantics.normalize_html(quote_html, quote_config)
rendered_quote = Jcem::QuoteSemantics.render_structural_quotes(normalized_quote, "primary", quote_config)
assert(rendered_quote.include?('data-jcem-quote-model="alerta1"'), "exemplo de blockquote perdeu o modelo")
assert(rendered_quote.include?("🔎"), "exemplo de blockquote perdeu o ícone")

internal_icon = quote_doc.scan(/data-jcem-quote-icon-src="([^"]+)"/).flatten.find { |source| source.start_with?("/") }
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

todo_operational = read("TODO.ia.md").split(/^# TO-DOs\s*$/, 2).last
status_markers = "⬜|📌|📜|⚖️|⏳|🔄|🔎|✅"
assert(!todo_operational.match?(/^- \[[ x]\]/), "item operacional ainda usa checkbox em vez de emoji isolado")
assert(!todo_operational.match?(/^(?:#{status_markers}) \*\*[^*]+:\*\*/), "item operacional ainda repete o nome textual do status")
operational_items = todo_operational.lines.grep(/^(?:#{status_markers}) /)
assert(!operational_items.empty?, "TO-DO operacional sem item")
operational_items.each do |line|
  assert(line.match?(/^(?:#{status_markers}) \S/), "item operacional sem emoji de status isolado: #{line.strip}")
end

print_doc = read(print_doc_path)
assert(print_doc.include?("desktop e mobile"), "equivalência móvel da impressão não documentada")
assert(print_doc.include?("`window.load`") && print_doc.include?("`requestIdleCallback`"), "ciclo pós-crítico da impressão não documentado")
assert(print_doc.include?('data-print-span="all"') && print_doc.include?('data-print-span="column"'), "marcação manual de figura larga não documentada")
assert(print_doc.include?("35%") && print_doc.include?("sharp/libvips") && print_doc.include?("jsdom"), "automarcação conservadora não documentada")
print_illustration = "assets/images/documentacao/impressao-ieee/figura-largura-total.svg"
assert(print_doc.include?("../#{print_illustration}") || print_doc.include?("/#{print_illustration}"), "ilustração de figura larga não ligada")
assert(File.file?(File.join(ROOT, print_illustration)), "ilustração de figura larga ausente")

%w[README.md docs/MODO-DE-USO-COVER-E-HERO.md docs/MODO-DE-USO-BLOCKQUOTE.md docs/MODO-DE-USO-IMPRESSAO-IEEE.md RCFs/carregamento-progressivo.md RCFs/citacoes.md].each do |path|
  verify_local_links(path)
end
assert(readme.include?("11 modelos concretos"), "README não reflete o inventário completo de blockquotes")

puts "documentation=ok covers=#{cover_visuals.length} quotes=#{quote_config.fetch("models").length} manifests=2"
