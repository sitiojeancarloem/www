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

root = File.expand_path('..', __dir__)
not_found_source = File.join(root, '404.html')
not_found_template = File.join(root, '404.main.html')
raise '404.html nao deve existir como fonte editavel' if File.exist?(not_found_source)
raise '404.main.html ausente' unless File.file?(not_found_template)

template = File.read(not_found_template)
assert_includes(template, 'permalink: /404.html', '404 transpilado para /404.html')
assert_includes(template, '{% include masthead.html reduced=true %}', '404 usa masthead compartilhado')
assert_includes(template, '{% include jcem/footer-shell.html %}', '404 usa footer compartilhado')
assert_includes(template, '{% include jcem/noscript-content.html %}', '404 usa noscript compartilhado')
assert_includes(template, '{% include jcem/noscript-style.html %}', '404 usa estilo noscript compartilhado')
refute_includes(template, 'hydrateFragments', '404 nao hidrata componentes compartilhados em runtime')
refute_includes(template, 'jcem-fragments=1', '404 nao busca fragmentos compartilhados da home')

puts 'html_compactor=ok'
