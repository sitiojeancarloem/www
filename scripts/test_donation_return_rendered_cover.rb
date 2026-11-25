# frozen_string_literal: true
# JeanCarloEM — MPL-2.0; contrato: RCFs/doacoes.md.
# Uso: ruby -rbundler/setup scripts/test_donation_return_rendered_cover.rb.
# Fixtures somente no cache da FT-109; sem build, rede ou alteração de fontes.
require 'json'
require 'tmpdir'
require 'fileutils'
require_relative 'jekyll_compat'
require_relative '../_plugins/jcem_donation_return_page'
require_relative '../_plugins/jcem_donation_return_rendered_cover'
require_relative '../_plugins/jcem_cover_contract'
require_relative '../_plugins/jcem_asset_metadata'

def check_cover(condition, message)
  raise "donation_return_cover=erro #{message}" unless condition
end

def expect_cover_fatal
  yield
  raise 'Era esperada rejeição fatal do contrato COVER.'
rescue Jekyll::Errors::FatalException
  true
end

root = File.expand_path('..', __dir__)
check_cover(File.realpath(root).casecmp(File.realpath('.')).zero?, 'executar na raiz')
cache = File.join(root, '.ia.rules/cache/FT-109/rendered-cover-tests')
current = root
%w[.ia.rules cache FT-109 rendered-cover-tests].each do |part|
  current = File.join(current, part)
  next unless File.exist?(current)
  check_cover(File.realpath(current).casecmp(File.expand_path(current)).zero?, 'cache redirecionado')
end
FileUtils.mkdir_p(cache)
settings_data = JSON.parse(File.read(File.join(root, '_data/donations.json'), encoding: 'UTF-8'))
settings = settings_data.fetch('thankYou')
provenance = JSON.parse(File.read(File.join(root, '.ia.rules/state/requests/FT-106/agradecimento-imagegen.json'), encoding: 'UTF-8'))
image_metadata = provenance.fetch('outputs').find { |item| '/' + item.fetch('path') == settings.fetch('image').fetch('src') }
check_cover(!image_metadata.nil?, 'metadados derivados da proveniência canônica')

def cover_site(source, destination, baseurl)
  Jekyll::Site.new(Jekyll.configuration({
    'source' => source, 'destination' => destination, 'config' => [],
    'plugins_dir' => [], 'plugins' => [], 'theme' => nil, 'quiet' => true,
    'baseurl' => baseurl, 'disable_disk_cache' => true,
    'cache_dir' => File.join(destination, '.jekyll-cache')
  }))
end

%w[/ /prefixo].each do |prefix|
  baseurl = prefix == '/' ? '' : prefix
  fixture = Dir.mktmpdir('cover-', cache)
  site = cover_site(root, File.join(fixture, '_site'), baseurl)
  site.data['donations'] = JSON.parse(JSON.generate(settings_data))
  metadata = image_metadata.slice('width', 'height').merge('aspect_ratio_css' => "#{image_metadata.fetch('width')} / #{image_metadata.fetch('height')}")
  site.data['jcem_asset_metadata'] = { 'assets' => { settings.fetch('image').fetch('src') => metadata } }
  home = Jekyll::PageWithoutAFile.new(site, root, '', 'index.html')
  home.data = { 'title' => 'Home preservada', 'layout' => 'home', 'entries_layout' => 'grid' }
  home.content = '<section id="origin">Conteúdo da home &amp; origem.</section>'
  page = Jcem::DonationReturn::Page.new(site, home)
  Jcem::CoverContract.validate(page)
  page.output = '<!doctype html><html><head><title>Preservar</title></head><body><header id="masthead">Menu</header><div class="page__hero"><img src="legado.png" alt="Legado"></div><main id="main"><h1>Obrigado</h1><p>Texto &amp; dados.</p><a href="/page-2/">Próxima</a></main><footer>Rodapé</footer></body></html>'
  # O pós-render social real já serializa HTML em UTF-8; reproduz essa entrada.
  page.output = Nokogiri::HTML.parse(page.output, nil, 'UTF-8').to_html
  original_output = page.output.dup
  page_before = JSON.generate(page.data)
  home_before = [JSON.generate(home.data), home.content.dup]
  config_before = JSON.generate(site.data['donations'])
  payload = site.site_payload
  payload['page'] = page.to_liquid
  page_drop = payload['page']
  result = Jcem::DonationReturn::RenderedCover.apply(page, payload)
  doc = Nokogiri::HTML.parse(result, nil, 'UTF-8')
  original = Nokogiri::HTML.parse(original_output, nil, 'UTF-8')
  covers = doc.css('figure[data-jcem-cover]')
  check_cover(covers.length == 1 && covers.first['data-jcem-cover-mode'] == settings.fetch('cover').fetch('mode'), 'COVER canônico único')
  check_cover(covers.first['class'].split.include?('jcem-featured-image--' + settings.fetch('cover').fetch('composition')), 'composição canônica')
  check_cover(doc.css('.page__hero, .page__hero--overlay').empty?, 'hero legado removido')
  image = covers.first.at_css('img')
  check_cover(image['src'] == baseurl + settings.fetch('image').fetch('src') && image['alt'] == settings.fetch('image').fetch('alt'), 'imagem/alt/baseurl da fonte')
  check_cover(image['loading'] == 'eager' && image['fetchpriority'] == 'high', 'política do partial oficial')
  check_cover(image['width'] == image_metadata.fetch('width').to_s && image['height'] == image_metadata.fetch('height').to_s, 'dimensões da proveniência')
  %w[head #masthead #main footer].each { |selector| check_cover(doc.at_css(selector).to_html == original.at_css(selector).to_html, "preservação #{selector}") }
  check_cover(page.output == original_output && JSON.generate(page.data) == page_before, 'helper não altera Page')
  check_cover([JSON.generate(home.data), home.content] == home_before && JSON.generate(site.data['donations']) == config_before, 'home/config intactas')
  check_cover(payload['page'].equal?(page_drop), 'payload preservado')
  ['<html><body>Sem hero</body></html>', '<div class="page__hero"></div><div class="page__hero--overlay"></div>'].each do |invalid|
    page.output = invalid
    expect_cover_fatal { Jcem::DonationReturn::RenderedCover.apply(page, payload) }
    check_cover(page.output == invalid, 'rejeição não altera origem')
  end
end

# Controle negativo do retorno do include; templates artificiais somente no cache.
['', '<div data-jcem-cover></div>', '<figure data-jcem-cover></figure><figure data-jcem-cover></figure>'].each do |invalid|
  fixture = Dir.mktmpdir('invalid-fragment-', cache)
  include_dir = File.join(fixture, '_includes/jcem')
  FileUtils.mkdir_p(include_dir)
  File.write(File.join(include_dir, 'post-featured-image.html'), invalid)
  site = cover_site(fixture, File.join(fixture, '_site'), '')
  page = Jekyll::PageWithoutAFile.new(site, fixture, '', 'index.html')
  page.output = '<html><body><div class="page__hero"></div><main>Intacto</main></body></html>'
  payload = site.site_payload
  payload['page'] = page.to_liquid
  expect_cover_fatal { Jcem::DonationReturn::RenderedCover.apply(page, payload) }
end
puts 'DONATION_RETURN_RENDERED_COVER_REAL_LIQUID_TWO_BASEURLS_PRESERVATION_AND_NEGATIVE_CONTRACTS_OK'
