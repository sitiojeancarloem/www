# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
# Finalidade: Testar normalização de tabelas Markdown com IAL e captions

require_relative "jekyll_compat"
require "kramdown"
require "kramdown-parser-gfm"
require_relative "../_plugins/jcem_zz_accessible_reading"

# Interrompe a fixture com diagnóstico legível e código de falha.
def abort_with(msg)
  $stderr.puts msg
  exit 1
end

# Renderiza autoria GFM no contexto de artigo efetivamente normalizado.
def run_test(name, markdown, &block)
  html = Kramdown::Document.new(markdown, input: "GFM").to_html
  article = %(<article class="jcem-post"><h1>Tabelas</h1><section class="page__content">#{html}</section></article>)
  normalized = Jcem::AccessibleReading.normalize_html(article)
  doc = Nokogiri::HTML.parse(normalized)
  block.call(doc, normalized)
rescue => e
  abort_with "#{name} falhou: #{e.class} - #{e.message}"
end

# Fixture compacta: duas tabelas próximas com captions diferentes
markdown = <<~MARKDOWN
  | Coluna A | Coluna B |
  |----------|----------|
  | 1        | 2        |
  | 3        | 4        |
  {: #dados .compact data-jcem-caption="Valores reais" }

  | X | Y |
  |---|---|
  | a | b |
  {: #letras .compact data-jcem-caption="Caracteres" }
MARKDOWN

run_test("duas tabelas com captions", markdown) do |doc, html|
  tables = doc.css("table")
  abort_with "esperado 2 tabelas, encontrou #{tables.length}" if tables.length != 2

  captions = doc.css("caption")
  abort_with "esperado 2 captions, encontrou #{captions.length}" if captions.length != 2

  caption_texts = captions.map { |c| c.text.strip }
  abort_with "captions incorretas" unless caption_texts.include?("Valores reais") && caption_texts.include?("Caracteres")
end

# Fixture: tabela com id/class/alinhamento/right/strong/link preservados
markdown_preserva = <<~MARKDOWN
  | Esquerda | Direita | Centro |
  |:---------|--------:|:------:|
  | a        | b       | c      |
  | **d**    | _e_     | [f](g) |
  {: #preserva .compact data-jcem-caption="Preserva formatação" }
MARKDOWN

run_test("preservação de formatação", markdown_preserva) do |doc, html|
  table = doc.css("#preserva").first
  abort_with "tabela #preserva não encontrada" unless table

  strongs = table.css("strong")
  abort_with "esperado 1 <strong>, encontrou #{strongs.length}" if strongs.length != 1

  links = table.css("a")
  abort_with "esperado 1 link, encontrou #{links.length}" if links.length != 1
end

# Fixture: tabela com footnote link e definição associada
markdown_footnote = <<~MARKDOWN
  | Valor |
  |-------|
  | A[^1] |
  {: #footnote-test .compact data-jcem-caption="Com footnote" }

  [^1]: Definição da footnote.
MARKDOWN

run_test("footnote link associado", markdown_footnote) do |doc, html|
  table = doc.css("#footnote-test").first
  abort_with "tabela #footnote-test não encontrada" unless table

  refs = table.css("sup a")
  abort_with "esperado 1 referência de footnote, encontrou #{refs.length}" if refs.length != 1

  footnote_def = doc.css(".footnotes li")
  abort_with "esperado 1 definição de footnote, encontrou #{footnote_def.length}" if footnote_def.length != 1
end

# Fixture: tabela sem caption e sem data-jcem-caption deve falhar
markdown_sem_caption = <<~MARKDOWN
  | A | B |
  |---|---|
  | 1 | 2 |
MARKDOWN

begin
  html = Kramdown::Document.new(markdown_sem_caption, input: "GFM").to_html
  article = %(<article class="jcem-post"><h1>Tabelas</h1><section class="page__content">#{html}</section></article>)
  normalized = Jcem::AccessibleReading.normalize_html(article)
  doc = Nokogiri::HTML.parse(normalized)
  caption = doc.css("caption").first
  abort_with "esperado FatalException tabela_sem_caption; normalização aceitou tabela sem legenda"
rescue Jekyll::Errors::FatalException => e
  abort_with "diagnóstico de caption incompleto: #{e.message}" unless e.message.include?("tabela_sem_caption") && e.message.include?("data-jcem-caption")
end

# Fixture: normalização repetida deve manter 1 caption/tabela
normalized_once = nil
run_test("normalização repetida", markdown) do |doc, html|
  normalized_once = html
end

normalized_twice = Jcem::AccessibleReading.normalize_html(normalized_once)
doc_twice = Nokogiri::HTML.parse(normalized_twice)
tables_twice = doc_twice.css("table")
captions_twice = doc_twice.css("caption")
abort_with "normalização repetida deve manter 1 caption/tabela" if tables_twice.length != 2 || captions_twice.length != 2

# Fixture: HTML existente com caption, thead th scope="col" e tbody td
run_test('HTML existente', '<table id="html"><caption>Real</caption><thead><tr><th scope="col">A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>') do |doc, html|
  table = doc.css("table#html").first
  abort_with "tabela #html não encontrada" unless table

  caption = doc.css("caption").first
  abort_with "caption único textoReal" unless caption && caption.text.strip == "Real"

  thead_th = doc.css("thead th")
  abort_with "thead th scope col" unless thead_th.length == 1 && thead_th.first["scope"] == "col"

  tbody_td = doc.css("tbody td")
  abort_with "tbody td1" unless tbody_td.length == 1 && tbody_td.first.text.strip == "1"
end


# Legendas vazias continuam inválidas, inclusive metadata só com espaços.
["", "   "].each do |caption|
  input = markdown_sem_caption.chomp + "\n{: data-jcem-caption=\"#{caption}\"}\n"
  begin
    rendered = Kramdown::Document.new(input, input: "GFM").to_html
    Jcem::AccessibleReading.normalize_html(%(<article class="jcem-post"><h1>Tabelas</h1><section class="page__content">#{rendered}</section></article>))
    abort_with "metadata de caption vazia foi aceita"
  rescue Jekyll::Errors::FatalException => e
    abort_with "erro inesperado de caption vazia: #{e.message}" unless e.message.include?("tabela_sem_caption")
  end
end

# A normalização deve preservar os atributos e a autoria do parser.
run_test("atributos e conteúdo preservados", markdown_preserva) do |doc, _|
  table = doc.at_css("table#preserva")
  abort_with "class perdida" unless table && table["class"].to_s.split.include?("compact")
  abort_with "metadata não consumida" if table.key?("data-jcem-caption")
  abort_with "caption duplicada ou alterada" unless table.css("caption").map(&:text) == ["Preserva formatação"]
  abort_with "ênfase alterada" unless table.css("em").map(&:text) == ["e"]
  abort_with "strong alterado" unless table.css("strong").map(&:text) == ["d"]
  link = table.at_css("a")
  abort_with "link alterado" unless link && link.text == "f" && link["href"] == "g"
  %w[left right center].each_with_index do |alignment, i|
    abort_with "alinhamento #{alignment} perdido" unless table.css("thead th")[i]["style"].to_s.match?(/text-align:\s*#{alignment}/)
  end
end

run_test("legendas associadas à tabela correta", markdown) do |doc, _|
  {"dados" => "Valores reais", "letras" => "Caracteres"}.each do |id, caption|
    abort_with "caption associada incorretamente: #{id}" unless doc.at_css("table##{id}").css("caption").map(&:text) == [caption]
  end
end

run_test("caption HTML única", '<table id="html"><caption>Real</caption><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>') do |doc, _|
  abort_with "caption HTML duplicada" unless doc.at_css("table#html").css("caption").map(&:text) == ["Real"]
end

puts "markdown_tables=ok"
exit 0
