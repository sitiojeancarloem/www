# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Uso: ruby -rbundler/setup scripts/test_donation_return_generator.rb. 0+marcador ou 1.
# Processa apenas fixtures em cache/U2F, com layouts mínimos; não é build do blog.
require 'tmpdir'
require 'fileutils'
require 'date'
require 'json'
require 'nokogiri'
require 'jekyll'
require 'jekyll-paginate'
require_relative '../_plugins/jcem_donation_return_generator'

# Observa o argumento real escolhido antes de o upstream criar páginas adicionais.
module DonationReturnTemplateProbe
  def paginate(site, template)
    roots = site.pages.reject { |item| item.is_a?(Jcem::DonationReturn::Page) }.select { |item| item.url == '/' }
    raise 'Template inicial não é a home canônica' unless roots.length == 1 && roots.first.equal?(template)
    site.instance_variable_set(:@ft109_template_observed, template)
    super
  end
end
Jekyll::Paginate::Pagination.prepend(DonationReturnTemplateProbe)

def check_generator(condition, message)
  raise message unless condition
end

def expect_generator_fatal
  yield
  raise 'Estado inválido foi aceito'
rescue Jekyll::Errors::FatalException
  true
end

root = File.realpath(File.expand_path('..', __dir__))
check_generator(File.realpath(Dir.pwd) == root, 'executar na raiz deste checkout')
cache = root
%w[.ia.rules cache FT-109 U2F].each do |part|
  cache = File.join(cache, part)
  next unless File.exist?(cache) || File.symlink?(cache)
  physical = File.realpath(cache)
  expected = File.expand_path(cache)
  same = Gem.win_platform? ? physical.casecmp?(expected) : physical == expected
  check_generator(!File.symlink?(cache) && File.directory?(cache) && same, 'ancestral redirecionado')
end
FileUtils.mkdir_p(cache)
canonical = Jekyll.configuration('source' => root, 'config' => [File.join(root, '_config.yml')], 'quiet' => true)
per_page = Integer(canonical.fetch('paginate'))
check_generator(per_page.between?(1, 100), 'limite explícito da fixture: paginate de 1 a 100')
index_source = File.read(File.join(root, 'index.html'), encoding: 'UTF-8')
thank_you_source = JSON.parse(File.read(File.join(root, '_data/donations.json'), encoding: 'UTF-8')).fetch('thankYou')
layout_source = '<h1>{{ page.title }}</h1>{{ content }}<ul id="posts">{% for post in paginator.posts %}<li>{{ post.title }}</li>{% endfor %}</ul><a id="next" href="{{ paginator.next_page_path | relative_url }}">Mais</a>'
records = []
['', '/prefixo'].each do |baseurl|
  source = Dir.mktmpdir('generator-', cache)
  FileUtils.mkdir_p(File.join(source, '_layouts'))
  FileUtils.mkdir_p(File.join(source, '_posts'))
  FileUtils.mkdir_p(File.join(source, '_data'))
  File.write(File.join(source, '_data/donations.json'), JSON.generate({ 'thankYou' => thank_you_source }))
  FileUtils.mkdir_p(File.join(source, '_includes/jcem'))
  FileUtils.cp(File.join(root, '_includes/jcem/donation-thanks.html'), File.join(source, '_includes/jcem/donation-thanks.html'))
  extra = baseurl.empty? ? '' : '<p id="home-extra">Conteúdo futuro da home</p>'
  File.binwrite(File.join(source, 'index.html'), index_source + extra)
  File.write(File.join(source, '_layouts/home.html'), "---\n---\n" + layout_source)
  (per_page + 2).times do |i|
    name = (Date.new(2000, 1, 1) + i).iso8601 + '-post.md'
    File.write(File.join(source, '_posts', name), "---\ntitle: Post #{i}\n---\nConteúdo de fixture.\n")
  end
  config = Jekyll.configuration({
    'source' => source, 'destination' => File.join(source, '_site'), 'config' => [],
    'plugins_dir' => [], 'plugins' => [], 'theme' => nil, 'quiet' => true,
    'disable_disk_cache' => true, 'cache_dir' => File.join(source, '.jekyll-cache'),
    'url' => 'https://example.test', 'baseurl' => baseurl,
    'paginate' => per_page, 'paginate_path' => canonical.fetch('paginate_path')
  })
  site = Jekyll::Site.new(config)
  site.process
  home = site.pages.find { |p| p.url == '/' }
  derived = site.pages.grep(Jcem::DonationReturn::Page)
  check_generator(derived.length == 1, 'uma página derivada')
  page = derived.first
  check_generator(page.data['jcem_donation_thank_you'] == thank_you_source && page.data.dig('header', 'image') == thank_you_source.fetch('image').fetch('src'), 'projeção canônica chegou ao gerador real')
  check_generator(page.canonical_home.equal?(home), 'mesma origem canônica')
  check_generator(home.pager.is_a?(Jekyll::Paginate::Pager) && page.pager.equal?(home.pager), 'Pager real compartilhado')
  check_generator(site.instance_variable_get(:@ft109_template_observed).equal?(home), 'template real escolhido antes da paginação')
  check_generator(!Jekyll::Paginate::Pager.pagination_candidate?(site.config, page), 'clone não é candidato à paginação')
  check_generator(page.pager.posts.length == per_page && page.pager.total_posts == per_page + 2, 'contagens derivadas da configuração')
  # O renderer Jekyll já substituiu content; a paridade é conferida no DOM abaixo.
  check_generator(page.data['entries_layout'] == home.data['entries_layout'], 'layout de entradas canônico')
  home_html = Nokogiri::HTML.fragment(File.read(home.destination(site.dest), encoding: 'UTF-8'))
  return_file = page.destination(site.dest)
  return_bytes = File.binread(return_file)
  return_html = Nokogiri::HTML.fragment(return_bytes.dup.force_encoding(Encoding::UTF_8))
  check_generator(return_html.at_css('h1').text == thank_you_source.fetch('title') && home_html.at_css('h1').text == home.data['title'], 'títulos distintos')
  check_generator(return_html.css('#posts li').length == per_page, 'posts renderizados pelo pager')
  check_generator(return_html.at_css('#next')['href'] == home_html.at_css('#next')['href'], 'links canônicos com baseurl')
  check_generator(extra.empty? || return_html.at_css('#home-extra'), 'propagação de mudança no conteúdo')
  messages = return_html.css('[data-jcem-donation-thanks]')
  check_generator(messages.length == 1 && messages.first.name == 'p' && messages.first.text == thank_you_source.fetch('message'), 'mensagem única canônica renderizada')
  check_generator(home_html.css('[data-jcem-donation-thanks]').empty?, 'home não recebeu mensagem')
  messages.remove
  home_html.css('h1').remove
  return_html.css('h1').remove
  check_generator(home_html.to_html == return_html.to_html, 'restante da home equivalente')
  generator = Jcem::DonationReturn::Generator.new
  before = site.pages.dup
  generator.generate(site)
  check_generator(site.pages == before && site.pages.grep(Jcem::DonationReturn::Page).first.equal?(page), 'geração idempotente')
  collision = Jekyll::PageWithoutAFile.new(site, source, 'collision', 'index.html')
  collision.data['permalink'] = '/doe/obrigado/'
  site.pages << collision
  expect_generator_fatal { generator.generate(site) }
  expect_generator_fatal { Jekyll::Hooks.trigger(:site, :pre_render, site, site.site_payload) }
  site.pages = before.dup
  FileUtils.mkdir_p(File.join(source, 'doe'))
  File.write(File.join(source, 'doe/obrigado'), 'arquivo ancestral')
  static = Jekyll::StaticFile.new(site, source, 'doe', 'obrigado')
  site.static_files << static
  expect_generator_fatal { generator.generate(site) }
  site.static_files.delete_if { |item| item.equal?(static) }
  site.pages = before.reject { |item| item.equal?(home) }
  expect_generator_fatal { generator.generate(site) }
  site.pages = before.dup
  ambiguous = Jekyll::PageWithoutAFile.new(site, source, 'ambiguous', 'index.html')
  ambiguous.data['permalink'] = '/'
  site.pages << ambiguous
  expect_generator_fatal { generator.generate(site) }
  site.pages = before.dup
  stale = Jcem::DonationReturn::Page.new(site, ambiguous)
  site.pages.map! { |item| item.equal?(page) ? stale : item }
  expect_generator_fatal { generator.generate(site) }
  check_generator(File.binread(return_file) == return_bytes, 'colisões não sobrescrevem resultado')
  records << { 'baseurl' => baseurl, 'posts' => per_page, 'total_posts' => per_page + 2 }
end
puts 'DONATION_RETURN_REAL_PAGINATION_IDEMPOTENCE_COLLISIONS_AND_HOME_PARITY_OK'
unsafe_message = %q{</p><script>alert(1)</script><img src=x onerror="alert(1)"> & " '}
partial_source = File.read(File.join(root, '_includes/jcem/donation-thanks.html'), encoding: 'UTF-8')
escaped_html = Liquid::Template.parse(partial_source).render!({ 'page' => { 'jcem_donation_thank_you' => { 'message' => unsafe_message } } })
escaped_fragment = Nokogiri::HTML.fragment(escaped_html)
check_generator(escaped_fragment.css('[data-jcem-donation-thanks]').length == 1 && escaped_fragment.at_css('[data-jcem-donation-thanks]').text == unsafe_message, 'texto HTML é mostrado literalmente')
check_generator(escaped_fragment.css('script, img').empty?, 'mensagem não cria marcação executável')
puts 'DONATION_RETURN_SHARED_MESSAGE_CANONICAL_TEXT_AND_HTML_ESCAPING_OK'
puts records.inspect
