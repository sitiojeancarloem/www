# frozen_string_literal: true

require_relative 'jekyll_compat'
require 'jekyll'
require_relative '../_plugins/jcem_html_compactor'

def assert_equal(expected, actual, label)
  return if expected == actual

  raise "#{label}: esperado #{expected.inspect}, obtido #{actual.inspect}"
end

def assert_includes(content, fragment, label)
  raise "#{label}: fragmento ausente #{fragment.inspect}" unless content.include?(fragment)
end

def refute_includes(content, fragment, label)
  raise "#{label}: fragmento indevido #{fragment.inspect}" if content.include?(fragment)
end

source = "  <main>  \n\n\t<p>Texto</p>\t\n  </main>  \n"
assert_equal(
  "<main>\n<p>Texto</p>\n</main>\n",
  Jcem::HtmlCompactor.compact(source),
  'compactacao de margens e linhas vazias'
)

source = <<~HTML
  <main>

    <script>
      const template = `  valor  `;

      const base64 = "data:text/plain;base64,ICB4ICA=";
    </script>
    <style>
      .x { white-space: pre; }
    </style>
    <pre>
      linha identada

    </pre>
  </main>
HTML
compacted = Jcem::HtmlCompactor.compact(source)
%w[script style pre].each do |tag|
  source_body = source.match(%r{<#{tag}>\n(.*?)</#{tag}>}m)[1]
  compacted_body = compacted.match(%r{<#{tag}>\n(.*?)</#{tag}>}m)[1]
  assert_equal(source_body, compacted_body, "bloco #{tag} preservado")
end
refute_includes(compacted, "\n\n<pre>", 'linha vazia externa removida')

source = " <script> const x = '  '; </script> \n <p> ok </p> \n"
assert_equal(
  "<script> const x = '  '; </script>\n<p> ok </p>\n",
  Jcem::HtmlCompactor.compact(source),
  'bloco sensivel em linha unica'
)

home = '<html><head><noscript data-jcem-fragment="noscript-style"><style>origem</style></noscript></head><body><noscript><main>origem</main></noscript></body></html>'
not_found = '<html><head><noscript data-jcem-fragment="noscript-style"><style>antigo</style></noscript></head><body><noscript data-jcem-fragment="noscript-content"><main>antigo</main></noscript></body></html>'
synchronized = Jcem::HtmlCompactor.sync_noscript_style(home, not_found)
synchronized = Jcem::HtmlCompactor.sync_noscript_content(home, synchronized)
assert_includes(
  synchronized,
  '<noscript data-jcem-fragment="noscript-style"><style>origem</style></noscript>',
  'estilo noscript da 404 sincronizado com a home'
)
assert_includes(
  synchronized,
  '<noscript data-jcem-fragment="noscript-content"><main>origem</main></noscript>',
  'noscript da 404 sincronizado com a home'
)
refute_includes(synchronized, '<main>antigo</main>', 'fallback noscript antigo removido')

puts 'html_compactor=ok'
