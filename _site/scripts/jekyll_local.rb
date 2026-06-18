# frozen_string_literal: true

require_relative "jekyll_compat"
require "jekyll"
require "jekyll/commands/build"
require "jekyll/commands/doctor"
require "jekyll/commands/serve"

command = ARGV.shift || "build"

options = {}
until ARGV.empty?
  arg = ARGV.shift
  case arg
  when "--drafts", "-D"
    options["show_drafts"] = true
  when "--future"
    options["future"] = true
  when "--unpublished"
    options["unpublished"] = true
  when "--livereload", "-l"
    options["livereload"] = true
  when "--force_polling"
    options["force_polling"] = true
  when "--watch", "-w"
    options["watch"] = true
  when "--no-watch"
    options["watch"] = false
  when "--host", "-H"
    options["host"] = ARGV.shift
  when "--port", "-P"
    options["port"] = ARGV.shift.to_i
  when "--baseurl", "-b"
    options["baseurl"] = ARGV.shift
  when "--destination", "-d"
    options["destination"] = ARGV.shift
  when "--source", "-s"
    options["source"] = ARGV.shift
  when "--config"
    options["config"] = ARGV.shift.split(",")
  when "--incremental", "-I"
    options["incremental"] = true
  when "--quiet", "-q"
    options["quiet"] = true
  when "--verbose", "-V"
    options["verbose"] = true
  when "--strict_front_matter"
    options["strict_front_matter"] = true
  end
end

case command
when "build"
  options["serving"] = false
  Jekyll::Commands::Build.process(options)
when "serve", "server", "s"
  options["serving"] = true
  options["watch"] = true unless options.key?("watch")
  config = Jekyll::Commands::Serve.configuration_from_options(options)
  Jekyll::Commands::Build.process(config)
  Jekyll::Commands::Serve.process(config)
else
  warn "Comando Jekyll local não suportado: #{command}"
  exit 1
end
