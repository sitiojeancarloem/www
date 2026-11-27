# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Deriva a raiz em memória; a escrita e a renderização pertencem ao Jekyll.
require_relative 'jcem_donation_return_page'
require_relative 'jcem_donation_return_paths'

module Jcem
  module DonationReturn
    class Generator < Jekyll::Generator
      safe true
      priority :low

      def generate(site)
        homes = site.pages.reject { |item| item.is_a?(Page) }.select { |item| item.url == '/' }
        raise Jekyll::Errors::FatalException, 'A home canônica deve ser única.' unless homes.length == 1
        home = homes.first
        existing = site.pages.grep(Page)
        if existing.length > 1 || (existing.first && !existing.first.canonical_home.equal?(home))
          raise Jekyll::Errors::FatalException, 'Página de agradecimento própria incompatível.'
        end
        page = existing.first || Page.new(site, home)
        DonationReturn.validate_destination!(site, page)
        site.pages << page if existing.empty?
      end
    end

    Jekyll::Hooks.register :site, :pre_render do |site|
      site.pages.grep(Page).each do |page|
        DonationReturn.validate_destination!(site, page)
        page.sync_pager!
      end
    end
  end
end
