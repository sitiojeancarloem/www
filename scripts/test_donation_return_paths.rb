# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Uso: ruby -rbundler/setup scripts/test_donation_return_paths.rb. Sem IO de dados/build/rede.
# Fixtures de destino em memória; 0+marcador ou 1. Não prova pipeline completo Jekyll.
require_relative '../_plugins/jcem_donation_return_paths'

DestinationEntry = Struct.new(:relative) do
  def destination(base)
    File.join(base, relative)
  end
end
DestinationSite = Struct.new(:dest, :pages, :static_files)

def check_path(condition, message)
  raise message unless condition
end

def rejects_destination(site, page)
  Jcem::DonationReturn.validate_destination!(site, page)
  raise 'Colisão aceita indevidamente'
rescue Jekyll::Errors::FatalException
  true
end

base = File.expand_path('../.ia.rules/cache/FT-109/U2E/destination', __dir__)
page = DestinationEntry.new('doe/obrigado/index.html')
site = DestinationSite.new(base, [page], [])
check_path(Jcem::DonationReturn.validate_destination!(site, page).equal?(page), 'ignorar somente a própria instância')
duplicate = DestinationEntry.new('doe/obrigado/index.html')
site.pages << duplicate
rejects_destination(site, page)
site.pages = [page]
site.static_files << duplicate
rejects_destination(site, page)
site.static_files.clear
site.static_files << DestinationEntry.new('doe/obrigado')
rejects_destination(site, page)
site.static_files.clear
site.static_files << DestinationEntry.new('doe/sub/../obrigado/index.html')
rejects_destination(site, page)
site.static_files.clear
site.static_files.concat([DestinationEntry.new('doe/obrigado-extra/index.html'),
                          DestinationEntry.new('doe/obrigad'),
                          DestinationEntry.new('doe/obrigado/icon.svg')])
before_pages = site.pages.dup
before_static = site.static_files.dup
check_path(Jcem::DonationReturn.validate_destination!(site, page).equal?(page), 'fronteira de diretório e vizinhos permitidos')
check_path(site.pages == before_pages && site.static_files == before_static, 'não modificar coleções')
site.static_files = [DestinationEntry.new('DOE/OBRIGADO/INDEX.HTML')]
if Gem.win_platform?
  rejects_destination(site, page)
else
  check_path(Jcem::DonationReturn.validate_destination!(site, page).equal?(page), 'preservar caixa fora do Windows')
end
puts 'DONATION_RETURN_DESTINATION_EQUAL_ANCESTOR_BOUNDARY_CASE_AND_NO_MUTATION_OK'
