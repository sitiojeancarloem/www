#!/usr/bin/env ruby
# frozen_string_literal: true

SITE_DIR = "_site"
EXPECTED_CNAME = "www.jeancarloem.com"
BLOG_PATH_PATTERN = %r{((href|src)=["']/blog/|url\(["']?/blog/)}

def fail_action(message)
  warn "::error::#{message}"
  exit 1
end

cname_path = File.join(SITE_DIR, "CNAME")
fail_action("CNAME ausente em #{SITE_DIR}.") unless File.file?(cname_path)

cname = File.read(cname_path, mode: "rb").strip
fail_action("CNAME invalido: #{cname.inspect}; esperado #{EXPECTED_CNAME.inspect}.") unless cname == EXPECTED_CNAME

matches = []
Dir.glob(File.join(SITE_DIR, "**", "*"), File::FNM_DOTMATCH).each do |path|
  next unless File.file?(path)

  content = File.binread(path).encode("UTF-8", invalid: :replace, undef: :replace)
  content.each_line.with_index(1) do |line, line_number|
    next unless BLOG_PATH_PATTERN.match?(line)

    matches << "#{path}:#{line_number}:#{line.strip}"
    break if matches.size >= 20
  end
end

unless matches.empty?
  puts matches.join("\n")
  fail_action("O site foi gerado com caminhos sob /blog. O deploy deve ficar na raiz do dominio.")
end

puts "Deploy raiz validado: CNAME e caminhos sem /blog."
