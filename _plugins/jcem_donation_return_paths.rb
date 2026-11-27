# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Validação interna de destinos Jekyll; somente objetos/strings, sem IO ou escrita.
require 'jekyll'

module Jcem
  module DonationReturn
    module_function

    def normalized_destination(site, item)
      result = File.expand_path(item.destination(site.dest))
      Gem.win_platform? ? result.downcase : result
    end

    def validate_destination!(site, page)
      target = normalized_destination(site, page)
      (site.pages + site.static_files).each do |item|
        next if item.equal?(page)
        other = normalized_destination(site, item)
        if target == other || target.start_with?(other + File::SEPARATOR)
          raise Jekyll::Errors::FatalException, 'Destino de agradecimento em conflito: ' + other
        end
      end
      page
    end
  end
end
