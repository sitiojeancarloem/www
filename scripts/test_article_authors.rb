# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require "liquid"

source = File.read(File.expand_path("../_includes/jcem/article-authors.html", __dir__))
site = Jekyll::Site.new(Jekyll.configuration("source" => File.expand_path("..", __dir__)))

def render_authors(source, site, authors)
  Liquid::Template.parse(source).render!(
    { "page" => { "article_authors" => authors } },
    registers: { site: site }
  )
end

def assert(condition, message)
  abort(message) unless condition
end

invalid = render_authors(source, site, [{ "name" => "Sem biografia" }])
assert(!invalid.include?("jcem-article-authors"), "autor invalido foi renderizado")

single = render_authors(source, site, [{ "name" => "Autor Um", "bio" => "Bio um." }])
assert(single.include?("jcem-article-author--primary"), "autor principal ausente")
assert(single.include?("author-placeholder.svg"), "avatar padrao ausente")
assert(single.include?("https://schema.org/Person"), "semantica Person ausente")

multiple = render_authors(
  source,
  site,
  [
    { "name" => "Autor Um", "bio" => "Bio um.", "url" => "https://example.com/um", "avatar" => "/um.png" },
    { "name" => "Autor Dois", "bio" => "Bio dois." },
    { "name" => "Autor Tres", "bio" => "Bio tres." }
  ]
)
assert(multiple.include?("jcem-article-authors--compact"), "modo compacto ausente")
assert(multiple.scan("jcem-article-author--primary").length == 1, "destaque principal invalido")
assert(multiple.scan("jcem-article-author--secondary").length == 2, "coautores invalidos")
assert(multiple.include?("https://example.com/um"), "link opcional ausente")

puts "article_authors=ok"
