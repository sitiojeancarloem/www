# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Uso: ruby scripts/test_donation_return.rb. Sem IO de dados, rede ou build.
# Saída 0 + marcador: invariantes válidas; 1: assert/erro. Fixtures em memória.
require_relative '../_plugins/jcem_donation_return'

def check(condition, message)
  raise message unless condition
end

source = { 'layout' => 'home', 'nested' => { 'items' => ['original'.dup] } }
copy = Jcem::DonationReturn.copy_data(source)
check(copy == source && !copy.equal?(source), 'conteúdo canônico/raiz')
copy['nested']['items'][0].replace('alterado')
copy['nested']['items'] << 'novo'
check(source['nested']['items'] == ['original'], 'sem alias de Hash/Array/String')

calls = 0
defaults = { 'future' => { 'items' => ['canônico'.dup] } }
lazy = Hash.new { |_, key| calls += 1; defaults[key] }
lazy['title'] = 'Home'
derived = Jcem::DonationReturn.copy_data(lazy)
check(calls.zero?, 'não avaliar default_proc durante a cópia')
derived['future']['items'][0].replace('local')
check(calls == 1 && defaults['future']['items'] == ['canônico'], 'default preguiçoso sem alias')
check(derived['future'] == defaults['future'] && calls == 2, 'preservar resolução a cada consulta')
check(lazy.keys == ['title'], 'não materializar defaults na origem')

constant = Hash.new({ 'items' => ['base'.dup] })
detached = Jcem::DonationReturn.copy_data(constant)
detached['missing']['items'][0].replace('local')
check(constant.default['items'] == ['base'], 'default constante independente')

cycle = {}
cycle['self'] = cycle
cycle['array'] = [cycle]
replica = Jcem::DonationReturn.copy_data(cycle)
check(replica['self'].equal?(replica) && replica['array'][0].equal?(replica), 'preservar grafo cíclico')
check(!replica.equal?(cycle) && !replica['array'].equal?(cycle['array']), 'ciclo desconectado da origem')
marker = Object.new
check(Jcem::DonationReturn.copy_data(marker).equal?(marker), 'outros objetos mantêm identidade')
check(Jcem::DonationReturn.copy_data([nil, true, false, 7, :key]) == [nil, true, false, 7, :key], 'escalares')
puts 'DONATION_RETURN_COPY_DATA_DEFAULTS_ALIASES_CYCLES_OK'
