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

legacy_markdown = "> -- texto\n>    -- outro\r\n>\t-- terceiro\n> --\tquarto\n"
normalized_markdown = Jcem::QuoteSemantics.normalize_markdown_speech_openers(legacy_markdown)
assert(
  normalized_markdown == "> — texto\n> — outro\r\n> — terceiro\n> —\tquarto\n",
  "prefixos legados não convergiram sem alterar conteúdo ou EOL"
)
assert(
  Jcem::QuoteSemantics.normalize_markdown_speech_openers(normalized_markdown) == normalized_markdown,
  "normalização Markdown não é idempotente"
)
normalized_html = Kramdown::Document.new(normalized_markdown, input: "GFM").to_html
assert(
  normalized_html.include?("— texto") && !normalized_html.include?("-- texto"),
  "conversão estática não recebeu o travessão normalizado"
)

preserved_markdown = <<~MARKDOWN
  -- texto comum
  texto -- interno
  > ---
  >> -- bloco aninhado
  > > -- bloco aninhado espaçado
  > --texto sem separador
  `> -- código inline`
MARKDOWN
assert(
  Jcem::QuoteSemantics.normalize_markdown_speech_openers(preserved_markdown) == preserved_markdown,
  "normalização Markdown alcançou contexto proibido"
)

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

alias_markdown = <<~MARKDOWN
  > Modelo primário.

  > Modelo de destaque.
  {: data-jcem-quote-model="destaque"}

  > Card ciano.
  {: data-jcem-quote-model="framed-accent" data-jcem-quote-accent="cyan"}

  > Modelo concreto.
  {: data-jcem-quote-model="pull-quote"}
MARKDOWN
alias_html = Kramdown::Document.new(alias_markdown, input: "GFM").to_html
alias_normalized = Jcem::QuoteSemantics.normalize_html(alias_html, config)
alias_rendered = Jcem::QuoteSemantics.render_structural_quotes(alias_normalized, "primary", config)
assert(alias_rendered.match?(/data-jcem-quote-model="thematic-rail"[^>]*data-jcem-quote-alias="primary"/), "primário não materializou thematic-rail")
assert(alias_rendered.match?(/data-jcem-quote-model="futuristic"[^>]*data-jcem-quote-alias="destaque"/), "destaque não materializou futuristic")
assert(alias_rendered.include?('jcem-quote-model--framed-accent jcem-quote-accent--cyan'), "accent ciano não foi materializado")
assert(alias_rendered.include?('data-jcem-quote-model="pull-quote"'), "modelo concreto deixou de prevalecer")

reconfigured = Marshal.load(Marshal.dump(config))
reconfigured.fetch("aliases")["primary"] = "centered-mark"
reconfigured.fetch("aliases")["destaque"] = "editorial-statement"
rebuilt = Jcem::QuoteSemantics.render_structural_quotes(alias_normalized, "primary", reconfigured)
assert(rebuilt.match?(/data-jcem-quote-model="centered-mark"[^>]*data-jcem-quote-alias="primary"/), "troca do primário não regenerou dependências")
assert(rebuilt.match?(/data-jcem-quote-model="editorial-statement"[^>]*data-jcem-quote-alias="destaque"/), "troca do destaque não regenerou dependências")

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

begin
  Jcem::QuoteSemantics.normalize_html(
    '<blockquote data-jcem-quote-model="framed-accent" data-jcem-quote-accent="inexistente">x</blockquote>',
    config
  )
  abort "quote_semantics=erro detalhe=accent desconhecido foi aceito"
rescue Jekyll::Errors::FatalException => error
  assert(error.message.include?("accent_desconhecido"), "accent desconhecido perdeu diagnóstico")
end

puts "quote_semantics=ok"
