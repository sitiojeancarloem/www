# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require_relative "../_plugins/jcem_math"

def assert(condition, message)
  raise message unless condition
end

rendered = Jcem::Math.prepare(<<~MARKDOWN, "math-test.md")
  Formula em bloco:

  \\[a^2 + b^2 = c^2\\]

  Inline \\(x + y\\) preservado.

  Colchete editorial \\[algo\\] preservado.

  `\\(codigo\\)` preservado.

  ![\\begin{equation*} x=y \\end{equation*}](quicklatex.png "Rendered by QuickLaTeX.com")
MARKDOWN

assert(rendered.include?('class="jcem-math jcem-math--display"'), "Formula em bloco nao renderizada")
assert(rendered.include?('class="jcem-math jcem-math--inline"'), "Formula inline nao renderizada")
assert(rendered.include?("Colchete editorial \\[algo\\] preservado."), "Colchete editorial foi tratado como formula")
assert(rendered.include?("`\\(codigo\\)`"), "Codigo inline foi alterado")
assert(
  rendered.include?('![\\begin{equation*} x=y \\end{equation*}](quicklatex.png "Rendered by QuickLaTeX.com")'),
  "Imagem QuickLaTeX legada foi corrompida"
)

legacy = Jcem::Math.prepare("\\[latexpage\\]\n\\begin{equation}q=r^p\\end{equation}", "legacy.md")
assert(!legacy.include?("[latexpage]"), "Marcador latexpage nao foi removido")
assert(legacy.include?('class="jcem-math jcem-math--display"'), "Ambiente equation legado nao renderizado")

shortcode = Jcem::Math.prepare(
  'Antes \[latex\] \\begin{equation}x=y\\end{equation} \[/latex\] depois',
  "shortcode.md"
)
assert(shortcode.include?('class="jcem-math jcem-math--display"'), "Shortcode latex escapado nao renderizado")
assert(!shortcode.include?("[latex]"), "Shortcode latex escapado nao foi removido")

puts "math_test=ok"
