# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/

require_relative "jekyll_compat"
require "jekyll"
require_relative "../_plugins/jcem_charts"
require_relative "../_plugins/jcem_zz_accessible_reading"

def assert(condition, message)
  abort "accessible_reading=erro detalhe=#{message}" unless condition
end

html = <<~HTML
  <!doctype html><html lang="pt-BR"><body>
  <article class="jcem-post"><h1 id="page-title">Artigo</h1><section class="page__content">
  <div role="blockquote"><p>Texto citado.</p></div>
  <table><caption>Valores</caption><thead><tr><th></th><th>Total</th></tr></thead><tbody><tr><th>A</th><td>2</td></tr></tbody></table>
  <img src="/informativa.svg" alt="Informação suficiente">
  <p>— Bíblia. NVI. Isaías 53:10<sup><a href="#fn:1" role="doc-noteref">1</a></sup> e reuso<sup><a href="#fn:1" role="doc-noteref">1</a></sup>.</p>
  <div class="footnotes"><ol><li id="fn:1">Bíblia, NVI, Isaías 12:3; 53:10.</li></ol></div>
  </section></article></body></html>
HTML

normalized = Jcem::AccessibleReading.normalize_html(html)
assert(normalized.include?('data-jcem-accessible-document="1"'), "artigo não foi marcado")
assert(normalized.include?('aria-roledescription="citação"'), "citação perdeu distinção")
assert(normalized.include?('data-jcem-spoken-reference="Isaías 53:10 NVI"'), "referência bíblica por ocorrência não foi reduzida")
assert(!normalized.include?("Referência: Isaías 53:10 NVI Referência:"), "referências reutilizadas contaminaram a ocorrência seguinte")
assert(normalized.include?('scope="col"'), "cabeçalho de coluna sem scope")
assert(normalized.include?('scope="row"'), "cabeçalho de linha sem scope")
assert(normalized.include?('>Linha</span>'), "cabeçalho vazio não recebeu nome")

begin
  Jcem::AccessibleReading.normalize_html(html.sub(' alt="Informação suficiente"', ' alt=""'))
  abort "accessible_reading=erro detalhe=imagem informativa vazia foi aceita"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("imagem_informativa_sem_alt"), "diagnóstico de imagem foi perdido")
end

begin
  Jcem::AccessibleReading.normalize_html(html.sub("<caption>Valores</caption>", ""))
  abort "accessible_reading=erro detalhe=tabela sem caption foi aceita"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("tabela_sem_caption"), "diagnóstico de tabela foi perdido")
end

dataset = Jcem::Charts.load_dataset(File.expand_path("..", __dir__), "assets/data/charts/tts-accessibility.json")
chart = Jcem::Charts.render(dataset, emit_assets: true)
assert(chart.include?('data-jcem-chart-renderer="4.5.1"'), "versão efetiva do renderer ausente")
assert(chart.include?("<caption>Exemplo controlado de leituras mensais — dados</caption>"), "gráfico sem tabela estática")
assert(chart.include?('aria-hidden="true"'), "canvas duplicado permaneceu na árvore acessível")

puts "accessible_reading=ok"
