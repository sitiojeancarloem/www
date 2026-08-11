# frozen_string_literal: true

require "json"
require "open3"
require "tempfile"

source = "_posts/2026-08-11-bate-papo-eventos-finais-a-heranca-dos-santos.md"

Tempfile.create(["published-posts-files", ".txt"]) do |files|
  Tempfile.create(["published-posts", ".json"]) do |output|
    files.puts(source)
    files.flush

    stdout, stderr, status = Open3.capture3(
      "ruby",
      "scripts/collect_published_posts.rb",
      "--files-file",
      files.path,
      "--site-url",
      "https://www.jeancarloem.com",
      "--out",
      output.path
    )
    abort stderr unless status.success?

    posts = JSON.parse(File.read(output.path))
    expected = "https://www.jeancarloem.com/p/bate-papo:eventos-finais/a-heranca-dos-santos/"
    actual = posts.dig(0, "url")
    abort "published_posts=erro esperado=#{expected} atual=#{actual}" unless actual == expected
    abort "published_posts=erro saída_vazia" if stdout.strip.empty?
  end
end

puts "published_posts=ok"
