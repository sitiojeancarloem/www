# frozen_string_literal: true

module Jcem
  module SiteMap
    DEFAULT_PER_PAGE = 50
    DEFAULT_PATH = "/mapa/"

    module_function

    def config(site)
      raw = site.config.dig("jcem", "mapa") || {}
      per_page = raw["posts_per_page"].to_i
      {
        "enabled" => raw.fetch("enabled", true),
        "path" => normalize_path(raw["path"] || DEFAULT_PATH),
        "posts_per_page" => per_page.positive? ? per_page : DEFAULT_PER_PAGE,
        "title" => raw["title"].to_s.strip.empty? ? "Mapa do Site" : raw["title"].to_s.strip,
        "description" => raw["description"].to_s.strip.empty? ? "Representação HTML indexável do mapa do site." : raw["description"].to_s.strip,
        "taxonomies" => taxonomy_config(site, raw["taxonomies"])
      }
    end

    def normalize_path(value)
      path = value.to_s.strip
      path = DEFAULT_PATH if path.empty?
      path = "/#{path}" unless path.start_with?("/")
      path = "#{path}/" unless path.end_with?("/")
      path.squeeze("/")
    end

    def dir_for(path, page_number)
      base = path.delete_prefix("/").delete_suffix("/")
      page_number <= 1 ? base : File.join(base, page_number.to_s)
    end

    def taxonomy_config(site, raw)
      configured = Array(raw).filter_map do |item|
        next unless item.is_a?(Hash)

        key = item["key"].to_s.strip
        next if key.empty?

        {
          "key" => key,
          "title" => item["title"].to_s.strip.empty? ? key.capitalize : item["title"].to_s.strip,
          "path" => normalize_path(item["path"] || "/#{key[0]}/")
        }
      end

      return configured unless configured.empty?

      [
        {
          "key" => "categories",
          "title" => "Categorias",
          "path" => normalize_path(site.config.dig("category_archive", "path") || "/c/")
        },
        {
          "key" => "tags",
          "title" => "Assuntos",
          "path" => normalize_path(site.config.dig("tag_archive", "path") || "/t/")
        }
      ]
    end

    def post_terms(post, key)
      Array(post.data[key]).compact.map { |term| term.to_s.strip }.reject(&:empty?)
    end

    def taxonomy_items(posts, taxonomy)
      counts = Hash.new(0)
      posts.each do |post|
        post_terms(post, taxonomy["key"]).each { |term| counts[term] += 1 }
      end

      counts.keys.sort_by(&:downcase).map do |term|
        {
          "title" => term,
          "count" => counts[term],
          "url" => "#{taxonomy["path"]}##{Jekyll::Utils.slugify(term)}"
        }
      end
    end

    def taxonomies(posts, config)
      config["taxonomies"].filter_map do |taxonomy|
        items = taxonomy_items(posts, taxonomy)
        next if items.empty?

        taxonomy.merge("items" => items)
      end
    end

    def navigation_groups(config)
      [
        {
          "title" => "Navegação",
          "links" => [
            { "title" => "Início", "url" => "/" },
            { "title" => "Sobre", "url" => "/sobre/" },
            { "title" => "Mapa do Site", "url" => config["path"] },
            { "title" => "Categorias", "url" => "/c/" },
            { "title" => "Assuntos", "url" => "/t/" }
          ]
        },
        {
          "title" => "Dados e políticas",
          "links" => [
            { "title" => "Feed RSS", "url" => "/feed.xml" },
            { "title" => "Feed JSON", "url" => "/recent-posts.json" },
            { "title" => "Termos de Uso", "url" => "https://jeancarloem.com/termos-de-uso" },
            { "title" => "Advertências", "url" => "https://jeancarloem.com/avisos-gerais/" },
            { "title" => "Privacidade", "url" => "https://jeancarloem.com/privacidade/" },
            { "title" => "Licença", "url" => "https://jeancarloem.com/licenca/" }
          ]
        }
      ]
    end
  end
end

class JcemSiteMapPage < Jekyll::PageWithoutAFile
  def initialize(site, base, dir, name, data)
    super(site, base, dir, name)
    self.data.merge!(data)
    self.content = ""
  end
end

class JcemSiteMapGenerator < Jekyll::Generator
  safe true
  priority :low

  def generate(site)
    config = Jcem::SiteMap.config(site)
    return unless config["enabled"]

    posts = site.posts.docs.sort_by { |post| post.date || Time.at(0) }.reverse
    page_count = [(posts.length.to_f / config["posts_per_page"]).ceil, 1].max
    taxonomies = Jcem::SiteMap.taxonomies(posts, config)
    navigation_groups = Jcem::SiteMap.navigation_groups(config)

    page_count.times do |index|
      page_number = index + 1
      offset = index * config["posts_per_page"]
      dir = Jcem::SiteMap.dir_for(config["path"], page_number)
      url = page_number == 1 ? config["path"] : "#{config["path"]}#{page_number}/"

      site.pages << JcemSiteMapPage.new(
        site,
        site.source,
        dir,
        "index.html",
        {
          "layout" => "mapa",
          "title" => page_number == 1 ? config["title"] : "#{config["title"]} - página #{page_number}",
          "description" => config["description"],
          "author_profile" => false,
          "sidebar" => false,
          "sitemap" => true,
          "jcem_mapa" => {
            "title" => config["title"],
            "description" => config["description"],
            "posts" => posts.slice(offset, config["posts_per_page"]) || [],
            "post_total" => posts.length,
            "posts_per_page" => config["posts_per_page"],
            "page" => page_number,
            "page_count" => page_count,
            "offset" => offset,
            "path" => config["path"],
            "url" => url,
            "prev_url" => page_number > 1 ? (page_number == 2 ? config["path"] : "#{config["path"]}#{page_number - 1}/") : nil,
            "next_url" => page_number < page_count ? "#{config["path"]}#{page_number + 1}/" : nil,
            "taxonomies" => taxonomies,
            "navigation_groups" => navigation_groups
          }
        }
      )
    end
  end
end
