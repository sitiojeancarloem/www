# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Página virtual derivada da raiz; não se registra nem escreve arquivos sozinha.
require 'jekyll'
require_relative 'jcem_donation_return_presentation'
require_relative 'jcem_donation_return_rendered_cover'

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
        home_content = canonical_home.content
        home_content = '' if home_content.nil?
        self.content = "{% include jcem/donation-thanks.html %}" + DonationReturn.copy_data(home_content)
        self.data = Presentation.data_for(canonical_home.data, site.data.fetch('donations').fetch('thankYou'))
        data['permalink'] = '/doe/obrigado/'
        data['jcem_donation_return'] = true
      end

      # O Site usa renderer.run; conserva os hooks antes do COVER desta instância.
      def trigger_hooks(hook_name, *args)
        result = super
        self.output = RenderedCover.apply(self, renderer.payload) if hook_name == :post_render
        result
      end

      # Chamado após geração/paginação; conserva o objeto canônico, inclusive nil.
      def sync_pager!
        self.pager = canonical_home.pager
      end
    end
  end
end
