# frozen_string_literal: true

require "json"

module Jekyll
  module Hooks
    def self.register(*); end
  end
end

require_relative "../_plugins/jcem_print_full_width"

def assert(condition, message)
  abort "print_full_width=erro detalhe=#{message}" unless condition
end

manifest = {
  "schema" => 1,
  "assets" => {
    "/assets/images/fixtures/auto.svg" => {
      "autoFullWidth" => true,
      "reason" => "geometry-and-text-density"
    },
    "/assets/images/fixtures/simple.svg" => {
      "autoFullWidth" => false,
      "reason" => "information-density-insufficient"
    }
  }
}

html = <<~HTML
  <figure id="manual"><img src="/assets/images/fixtures/simple.svg" data-print-span="all"><figcaption>Manual</figcaption></figure>
  <figure id="automatic"><picture><img src="/assets/images/fixtures/auto.svg?version=1"></picture><figcaption>Automática</figcaption></figure>
  <figure id="negative"><img src="/assets/images/fixtures/simple.svg"><figcaption>Comum</figcaption></figure>
  <figure id="override"><img src="/assets/images/fixtures/auto.svg" data-print-span="column"><figcaption>Bloqueada</figcaption></figure>
HTML

first = Jcem::PrintFullWidth.decorate_html(html, manifest)
second = Jcem::PrintFullWidth.decorate_html(first, manifest)
document = Nokogiri::HTML::DocumentFragment.parse(first)

manual = document.at_css("#manual")
automatic = document.at_css("#automatic")
negative = document.at_css("#negative")
override = document.at_css("#override")

assert(manual["data-print-span"] == "all", "marcação manual não foi promovida ao figure")
assert(manual["data-print-span-source"] == "manual", "precedência manual não foi registrada")
assert(manual.at_css("img")["data-print-span"].nil?, "marcação manual duplicada permaneceu na imagem")
assert(automatic["data-print-span"] == "all", "automarcação positiva ausente")
assert(automatic["data-print-span-source"] == "auto", "origem automática ausente")
assert(automatic["data-print-span-reason"] == "geometry-and-text-density", "evidência automática ausente")
assert(negative["data-print-span"].nil?, "falso positivo em figura simples")
assert(override["data-print-span"].nil?, "override de uma coluna foi desrespeitado")
assert(second == first, "transformação estática não é idempotente")

puts "print_full_width_adapter=ok manual=1 auto=1 negative=2 idempotent=true"
