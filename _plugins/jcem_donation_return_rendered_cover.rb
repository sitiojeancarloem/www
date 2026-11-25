# frozen_string_literal: true
# JeanCarloEM — MPL-2.0; integração COVER da página de agradecimento.
require 'jekyll'
require 'nokogiri'

module Jcem
  module DonationReturn
    module RenderedCover
      module_function

      def apply(page, site_payload)
        doc = Nokogiri::HTML.parse(page.output, nil, 'UTF-8')
        hero_nodes = doc.css('.page__hero, .page__hero--overlay')

        if hero_nodes.length != 1
          raise Jekyll::Errors::FatalException,
                "[jcem/donation-return-cover] Esperado exatamente 1 nó .page__hero ou .page__hero--overlay; encontrado #{hero_nodes.length}."
        end

        hero_node = hero_nodes.first

        template = '{% include jcem/post-featured-image.html %}'
        rendered = Jekyll::Renderer.new(page.site, page, site_payload).render_liquid(template, site_payload, { registers: { site: page.site, page: site_payload['page'] } }, 'jcem/donation-return-cover')

        fragment = Nokogiri::HTML.fragment(rendered)
        children = fragment.element_children

        if children.length != 1 || children.first.name != 'figure' || !children.first.key?('data-jcem-cover')
          raise Jekyll::Errors::FatalException,
                "[jcem/donation-return-cover] Resultado do template não é um único elemento <figure> com data-jcem-cover."
        end

        new_figure = children.first
        hero_node.replace(new_figure)

        doc.to_html
      end
    end
  end
end
