#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative "jekyll_source_state"

ROOT = File.expand_path("..", __dir__)

raise "arquivo de publicacao entrou no estado de fonte" if JcemSourceState.include_path?(".jcem-publication.json")
raise "saida _site entrou no estado de fonte" if JcemSourceState.include_path?("_site/index.html")
raise "fonte real foi excluida" unless JcemSourceState.include_path?("assets/jcem/ts/site.ts")

files = JcemSourceState.files(ROOT)
raise "estado de fonte contem _site" if files.any? { |path| path.start_with?("_site/") }
raise "estado de fonte perdeu arquivos reais" unless files.include?("scripts/jekyll_build_manifest.rb")

puts "jekyll-source-state: ok (#{files.length} fontes; _site excluido)"
