# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.

require_relative "jekyll_compat"
require "jekyll"
require "kramdown"
require_relative "../_plugins/jcem_quote_semantics"

def assert(condition, message)
  abort "quote_semantics=erro detalhe=#{message}" unless condition
end

root = File.expand_path("..", __dir__)
config = Jcem::QuoteSemantics.load_config(root)
rcf = File.read(File.join(root, "RCFs", "citacoes.md"))
assert(rcf.include?("profundidade um"), "RCF perdeu a subcitação imediata mínima")
assert(rcf.include?("profundidade dois ou superior"), "RCF perdeu o fundo hierárquico")
assert(rcf.include?("NÃO DEVE herdar, repetir ou receber `border-left`"), "RCF perdeu isolamento da borda")

markdown = <<~MARKDOWN
  > Citação por ocorrência.
  {: data-jcem-quote-model="standard"}

  > Aviso tipado.
  {: data-jcem-quote-model="alerta1" data-jcem-quote-icon="⚠️"}

  > Painel pelo modelo padrão do artigo.

  Parágrafo com `fala citada`{:.jcem-inline-quote} e `codigo_preservado`.
MARKDOWN

html = Kramdown::Document.new(markdown, input: "GFM").to_html
normalized = Jcem::QuoteSemantics.normalize_html(html, config)
rendered = Jcem::QuoteSemantics.render_structural_quotes(normalized, "futuristic", config)

assert(
  normalized.include?('data-jcem-quote-model="standard"'),
  "IAL do modelo por ocorrência não foi preservada"
)
assert(
  normalized.include?('data-jcem-quote-model="alerta1"'),
  "modelo tipado não foi preservado"
)
assert(
  normalized.include?('<em class="jcem-inline-quote" data-jcem-inline-quote="explicit">fala citada</em>'),
  "backtick explicitamente classificado não foi promovido"
)
assert(
  normalized.include?("<code>codigo_preservado</code>"),
  "backtick comum deixou de representar código"
)
assert(rendered.include?('class="painel jcem-panel jcem-panel--blockquote'), "painel futurista não foi renderizado no build")
assert(rendered.include?('data-jcem-quote-model="alerta1" data-jcem-quote-icon="⚠️"'), "modelo tipado perdeu atributos")
assert(rendered.include?('<span class="jcem-quote__icon" aria-hidden="true">⚠️</span>'), "ícone tipado não foi renderizado no build")
assert(!rendered.include?("<blockquote>Citação por ocorrência"), "blockquote futurista permaneceu para mutação client-side")

begin
  Jcem::QuoteSemantics.normalize_html(
    '<blockquote data-jcem-quote-model="inexistente">x</blockquote>',
    config
  )
  abort "quote_semantics=erro detalhe=modelo desconhecido foi aceito"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("modelo_desconhecido"), "falha desconhecida perdeu diagnóstico")
end

begin
  Jcem::QuoteSemantics.normalize_html(
    '<blockquote data-jcem-quote-model="info" data-jcem-quote-icon-src="javascript:alert(1)" data-jcem-quote-icon-alt="x">x</blockquote>',
    config
  )
  abort "quote_semantics=erro detalhe=icone inseguro foi aceito"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("icone_invalido"), "ícone inseguro perdeu diagnóstico")
end

puts "quote_semantics=ok"
