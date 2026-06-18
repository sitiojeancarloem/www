#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "date"
require "optparse"
require "open3"
require "pathname"
require "time"
require "uri"
require "yaml"

options = {
  out: "published-posts.json",
  github_output: ENV["GITHUB_OUTPUT"],
  site_url: ENV["SITE_URL"].to_s
}

OptionParser.new do |parser|
  parser.on("--files-file PATH") { |value| options[:files_file] = value }
  parser.on("--diff-base SHA") { |value| options[:diff_base] = value }
  parser.on("--diff-head SHA") { |value| options[:diff_head] = value }
  parser.on("--site-url URL") { |value| options[:site_url] = value.to_s }
  parser.on("--out PATH") { |value| options[:out] = value }
  parser.on("--github-output PATH") { |value| options[:github_output] = value }
end.parse!

root = Pathname.new(Dir.pwd).realpath
site_url = options[:site_url].sub(%r{/+\z}, "")

def front_matter_for(path)
  content = File.read(path)
  return [{}, content] unless content.start_with?("---\n")

  parts = content.split(/^---\s*$/, 3)
  return [{}, content] if parts.length < 3

  [YAML.safe_load(parts[1], permitted_classes: [Date, Time], aliases: false) || {}, parts[2]]
rescue Psych::SyntaxError
  [{}, content]
end

def text_excerpt(body)
  body
    .gsub(/```.*?```/m, "")
    .gsub(/<[^>]+>/, " ")
    .lines
    .map(&:strip)
    .reject { |line| line.empty? || line.start_with?("#", "{%", "<!--") }
    .first
    .to_s
    .gsub(/\s+/, " ")
    .slice(0, 220)
end

def slug_for(path)
  File.basename(path, File.extname(path)).sub(/\A\d{4}-\d{2}-\d{2}-/, "")
end

def relative_post_categories(path)
  parts = Pathname.new(path).each_filename.to_a
  posts_index = parts.index("_posts")
  return [] unless posts_index

  parts[(posts_index + 1)...-1] || []
end

def absolute_url(site_url, path)
  return path if path.to_s.match?(%r{\Ahttps?://}i)

  normalized = "/#{path}".gsub(%r{/+}, "/")
  site_url.empty? ? normalized : "#{site_url}#{normalized}"
end

def post_url(site_url, path, data)
  permalink = data["permalink"].to_s
  return absolute_url(site_url, permalink) unless permalink.empty?

  category_path = relative_post_categories(path).join("/")
  title_path = slug_for(path)
  url_path = ["/p", category_path, title_path].reject(&:empty?).join("/")
  absolute_url(site_url, "#{url_path}/")
end

def image_url(site_url, data)
  image = data["image"]
  image = image["path"] || image["url"] if image.is_a?(Hash)
  header = data["header"]
  image ||= header["teaser"] || header["image"] if header.is_a?(Hash)
  image ||= data["og_image"]
  return "" if image.to_s.empty?

  absolute_url(site_url, image.to_s)
end

def tags_for(data)
  values = Array(data["tags"]) + Array(data["categories"])
  values
    .map(&:to_s)
    .map { |tag| tag.unicode_normalize(:nfkd).encode("ASCII", invalid: :replace, undef: :replace, replace: "") }
    .map { |tag| tag.gsub(/[^A-Za-z0-9_]/, "") }
    .reject(&:empty?)
    .uniq
    .first(6)
end

def diff_files(base, head)
  return [] if base.to_s.empty? || head.to_s.empty? || base.match?(/\A0+\z/)

  stdout, stderr, status = Open3.capture3("git", "diff", "--name-status", "--diff-filter=AR", base, head)
  abort stderr unless status.success?

  stdout.lines.filter_map do |line|
    parts = line.split(/\s+/)
    path = parts[-1]
    path if path&.match?(%r{\A_posts/.+\.(md|markdown)\z}i)
  end
end

files =
  if options[:files_file]
    File.exist?(options[:files_file]) ? File.readlines(options[:files_file], chomp: true) : []
  else
    diff_files(options[:diff_base], options[:diff_head])
  end

posts = files.uniq.filter_map do |relative|
  path = root.join(relative)
  next unless path.file?
  next unless relative.match?(%r{\A_posts/.+\.(md|markdown)\z}i)

  data, body = front_matter_for(path)
  title = data["title"].to_s.strip
  title = slug_for(path).tr("-", " ") if title.empty?

  {
    "title" => title,
    "summary" => data["excerpt"].to_s.strip.empty? ? text_excerpt(body) : data["excerpt"].to_s.strip,
    "url" => post_url(site_url, relative, data),
    "image" => image_url(site_url, data),
    "hashtags" => tags_for(data),
    "source_path" => relative
  }
end

json = JSON.generate(posts)
File.write(options[:out], JSON.pretty_generate(posts))

if options[:github_output]
  File.open(options[:github_output], "a") do |output|
    output.puts "has_posts=#{posts.any?}"
    output.puts "post_count=#{posts.length}"
    output.puts "posts_json<<POSTS_JSON"
    output.puts json
    output.puts "POSTS_JSON"
  end
end

puts json
