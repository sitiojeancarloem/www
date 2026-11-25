# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Auxiliar interno: copia Hash/Array/String; demais objetos conservam identidade.
module Jcem
  module DonationReturn
    module_function

    # Mantém defaults preguiçosos e ciclos sem compartilhar coleções com a origem.
    def copy_data(value, memo = {}.compare_by_identity)
      return memo[value] if memo.key?(value)

      case value
      when Hash
        copy = {}
        memo[value] = copy
        value.each { |key, item| copy[copy_data(key, memo)] = copy_data(item, memo) }
        if value.default_proc
          copy.default_proc = proc { |_, key| copy_data(value[key]) }
        else
          copy.default = copy_data(value.default, memo)
        end
        copy
      when Array
        copy = []
        memo[value] = copy
        value.each { |item| copy << copy_data(item, memo) }
        copy
      when String
        memo[value] = value.dup
      else
        value
      end
    end
  end
end
