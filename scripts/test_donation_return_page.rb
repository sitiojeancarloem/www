# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Uso: ruby -rbundler/setup scripts/test_donation_return_page.rb. Saída 0+marcador ou 1.
# Fixtures persistem somente em .ia.rules/cache/FT-109/U2C; sem build/rede/fontes/Git.
require 'tmpdir'
require 'fileutils'
require_relative '../_plugins/jcem_donation_return_page'

def check_page(condition, message)
  raise message unless condition
end

root = File.realpath(File.expand_path('..', __dir__))
check_page(File.realpath(Dir.pwd) == root, 'executar na raiz deste checkout')
cache = root
%w[.ia.rules cache FT-109 U2C].each do |part|
  cache = File.join(cache, part)
  next unless File.exist?(cache) || File.symlink?(cache)
  physical = File.realpath(cache)
  expected = File.expand_path(cache)
  same = Gem.win_platform? ? physical.casecmp?(expected) : physical == expected
  check_page(!File.symlink?(cache) && File.directory?(cache) && same, 'ancestral redirecionado')
end
FileUtils.mkdir_p(cache)
source = Dir.mktmpdir('page-', cache)
config = Jekyll.configuration({
  'source' => source, 'destination' => File.join(source, '_site'),
  'config' => [], 'plugins_dir' => [], 'plugins' => [], 'theme' => nil,
  'quiet' => true, 'baseurl' => '/prefixo', 'disable_disk_cache' => true,
  'cache_dir' => File.join(source, '.jekyll-cache'),
  'defaults' => [
    { 'scope' => { 'path' => '', 'type' => 'pages' },
      'values' => { 'canonical_default' => { 'items' => ['home-default'.dup] } } },
    { 'scope' => { 'path' => 'doe/obrigado', 'type' => 'pages' },
      'values' => { 'canonical_default' => { 'items' => ['route-default'.dup] } } }
  ]
})
site = Jekyll::Site.new(config)
home = Jekyll::PageWithoutAFile.new(site, source, '', 'index.html')
home.content = '<p>Conteúdo canônico</p>'.dup
home.data.merge!({ 'layout' => 'home', 'title' => 'Home', 'entries_layout' => 'grid',
                   'author_profile' => true, 'custom' => { 'items' => ['original'.dup] } })
site.pages << home
page = Jcem::DonationReturn::Page.new(site, home)
check_page(page.canonical_home.equal?(home), 'referência canônica')
check_page(page.url == '/doe/obrigado/' && home.url == '/', 'rotas independentes de baseurl')
check_page(page.data['title'] == 'Obrigado' && page.data['jcem_donation_return'] == true, 'especialização declarada')
%w[layout entries_layout author_profile custom].each do |key|
  check_page(page.data[key] == home.data[key], 'fidelidade: ' + key)
end
check_page(page.content == home.content, 'conteúdo derivado')
check_page(page.data['canonical_default'] == home.data['canonical_default'], 'defaults da origem, não da rota')
page.content.replace('<p>Somente cópia</p>')
page.data['custom']['items'][0].replace('somente cópia')
page.data['canonical_default']['items'][0].replace('somente cópia')
check_page(home.content == '<p>Conteúdo canônico</p>' && home.data['custom']['items'] == ['original'], 'origem intacta')
check_page(home.data['canonical_default']['items'] == ['home-default'], 'default original intacto')
check_page(home.data['title'] == 'Home' && home.data['permalink'].nil? && home.data['jcem_donation_return'].nil?, 'sem especializações na origem')
home.content = '<p>Home futura</p>'
home.data['layout'] = 'future-home'
home.data['future'] = { 'value' => 'metadado novo' }
future = Jcem::DonationReturn::Page.new(site, home)
check_page(future.content == home.content && future.data['layout'] == 'future-home' && future.data['future'] == home.data['future'], 'propagação em nova derivação')
pager = Object.new
home.pager = pager
check_page(page.pager.nil?, 'sem instantâneo prematuro do pager')
page.sync_pager!
check_page(page.pager.equal?(pager), 'pager por identidade')
home.pager = nil
page.sync_pager!
check_page(page.pager.nil?, 'sincronização atual, inclusive nil')
other = Jekyll::PageWithoutAFile.new(site, source, 'outra', 'index.html')
begin
  Jcem::DonationReturn::Page.new(site, other)
  raise 'origem não raiz foi aceita'
rescue ArgumentError
end
check_page(site.pages == [home], 'classe não se registra por conta própria')
puts 'DONATION_RETURN_REAL_PAGE_DEFAULTS_SOURCE_COPY_AND_PAGER_REFERENCE_OK'
