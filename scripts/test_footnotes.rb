# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require "kramdown"
require_relative "../_plugins/jcem_footnotes"

def assert(condition, label)
  raise label unless condition
end

def assert_equal(expected, actual, label)
  return if expected == actual

  raise "#{label}: esperado #{expected.inspect}, obtido #{actual.inspect}"
end

source = <<~MARKDOWN
  A primeira chamada.[^*]
  A segunda chamada.[^*]
  Codigo preservado `[^*]`.

  ```text
  [^*]
  ```

  [^*]: Primeira nota.
  [^*]: Segunda nota.
MARKDOWN

prepared = Jcem::Footnotes.prepare(source, "teste.md")
ids = prepared.scan(/\[\^(jcem[0-9a-f]{8})\]/).flatten
definition_ids = prepared.scan(/^\[\^(jcem[0-9a-f]{8})\]:/).flatten

assert_equal(4, ids.length, "duas chamadas e duas definicoes convertidas")
assert_equal(2, ids.uniq.length, "identificadores descartaveis unicos")
assert_equal(ids[0, 2], definition_ids, "definicoes descartaveis pareadas por ordem")
assert(prepared.include?("`[^*]`"), "codigo inline preservado")
assert(prepared.include?("```text\n[^*]\n```"), "codigo fenced preservado")

html = Kramdown::Document.new(prepared, input: "GFM").to_html
assert(html.include?(">1</a></sup>"), "primeira nota numerada automaticamente")
assert(html.include?(">2</a></sup>"), "segunda nota numerada automaticamente")
assert(html.index("Primeira nota.") < html.index("Segunda nota."), "lista final em ordem numerica")

reuse = <<~MARKDOWN
  Z antes.[^z]
  A depois.[^a]
  Z reutilizada.[^z]

  [^a]: Nota A.
  [^z]: Nota Z.
MARKDOWN

reuse_html = Kramdown::Document.new(reuse, input: "GFM").to_html
assert(reuse_html.index('id="fn:z"') < reuse_html.index('id="fn:a"'), "Kramdown ordena pela primeira ocorrencia")
assert(reuse_html.scan('href="#fn:z"').length == 2, "reuso preserva numero da primeira ocorrencia")

puts "footnotes=ok"
