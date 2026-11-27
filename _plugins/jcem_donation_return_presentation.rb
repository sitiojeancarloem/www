# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Projetor de dados puro para apresentação do retorno de agradecimento.
require_relative 'jcem_donation_return'

module Jcem
  module DonationReturn
    module Presentation
      module_function

      # Retorna Hash novo com dados de apresentação para o retorno de agradecimento.
      # home_data e settings são Hash; ArgumentError caso contrário.
      # settings é bloco thankYou já validado pelo contrato canônico; não duplica validador.
      # Usa DonationReturn.copy_data para preservar fontes e home/config independentes.
      def data_for(home_data, settings)
        raise ArgumentError, 'home_data deve ser Hash' unless home_data.is_a?(Hash)
        raise ArgumentError, 'settings deve ser Hash' unless settings.is_a?(Hash)

        settings_copiado = Jcem::DonationReturn.copy_data(settings)
        home_copiado = Jcem::DonationReturn.copy_data(home_data)

        # Mapeamento EXATO de apresentação, valores da cópia settings:
        result = home_copiado
        result.merge!({
          'title' => settings_copiado.fetch('title'),
          'description' => settings_copiado.fetch('message'),
          'jcem_donation_thank_you' => settings_copiado,
          'featured_image' => settings_copiado.fetch('image').fetch('src'),
          'featured_image_style' => settings_copiado.fetch('cover').fetch('mode')
        })

        # header substituído INTEGRALMENTE por estrutura específica
        cover_copiado = settings_copiado.fetch('cover')
        image_copiado = settings_copiado.fetch('image')
        result['header'] = {
          'image' => image_copiado.fetch('src'),
          'image_description' => image_copiado.fetch('alt'),
          'image_style' => cover_copiado.fetch('mode'),
          'image_wide_mode' => cover_copiado.fetch('composition'),
          'image_wide_left' => cover_copiado.fetch('patterns').fetch('left'),
          'image_wide_right' => cover_copiado.fetch('patterns').fetch('right')
        }

        # cover substituído INTEGRALMENTE por {mode,composition,patterns:{left,right}}
        result['cover'] = {
          'mode' => cover_copiado.fetch('mode'),
          'composition' => cover_copiado.fetch('composition'),
          'patterns' => {
            'left' => cover_copiado.fetch('patterns').fetch('left'),
            'right' => cover_copiado.fetch('patterns').fetch('right')
          }
        }

        # jcem_cover←nil EXPLÍCITO, com key?true (delete ressuscitaria default_proc antigo)
        result['jcem_cover'] = nil

        result
      end

    end
  end
end
