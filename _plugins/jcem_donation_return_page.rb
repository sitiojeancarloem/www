# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Página virtual derivada da raiz; não se registra nem escreve arquivos sozinha.
require 'jekyll'
require_relative 'jcem_donation_return_presentation'

module Jcem
  module DonationReturn
    class Page < Jekyll::PageWithoutAFile
      attr_reader :canonical_home

      def initialize(site, canonical_home)
        unless canonical_home.is_a?(Jekyll::Page) && canonical_home.site.equal?(site) && canonical_home.url == '/'
          raise ArgumentError, 'A origem deve ser a página raiz deste site.'
        end
        @canonical_home = canonical_home
        super(site, site.source, 'doe/obrigado', 'index.html')
        self.content = DonationReturn.copy_data(canonical_home.content)
        self.data = Presentation.data_for(canonical_home.data, site.data.fetch('donations').fetch('thankYou'))
        data['permalink'] = '/doe/obrigado/'
        data['jcem_donation_return'] = true
      end

      # Chamado após geração/paginação; conserva o objeto canônico, inclusive nil.
      def sync_pager!
        self.pager = canonical_home.pager
      end
    end
  end
end
