#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "optparse"
require "pathname"

options = {
	date: ENV.fetch("SCHEDULED_DATE", Time.now.utc.strftime("%Y-%m-%d")),
	mode: "copy",
	out: ".scheduled-posts.txt"
}

OptionParser.new do |parser|
	parser.on("--date DATE") { |value| options[:date] = value }
	parser.on("--mode MODE") { |value| options[:mode] = value }
	parser.on("--out PATH") { |value| options[:out] = value }
end.parse!

root = Pathname.new(Dir.pwd).realpath
scheduled_dir = root.join("_scheduled")
posts_dir = root.join("_posts")
out_path = root.join(options[:out])
target_date = options[:date]

abort "Data invalida: #{target_date}" unless target_date.match?(/\A\d{4}-\d{2}-\d{2}\z/)
abort "Modo invalido: #{options[:mode]}" unless %w[copy move].include?(options[:mode])

FileUtils.mkdir_p(scheduled_dir)
FileUtils.mkdir_p(posts_dir)

published = []

Dir.children(scheduled_dir).sort.each do |entry|
  next if entry.start_with?(".")

  match = entry.match(/\A(\d{4}-\d{2}-\d{2})/)
  next unless match && match[1] == target_date

  source = scheduled_dir.join(entry)
  destination = posts_dir.join(entry)
  destination_real_parent = destination.dirname.expand_path

  unless destination_real_parent.to_s.start_with?(posts_dir.expand_path.to_s)
    abort "Destino fora de _posts: #{destination}"
  end

	if options[:mode] == "move" && destination.exist?
		abort "Destino ja existe em _posts: #{destination.relative_path_from(root)}"
	end

	FileUtils.rm_rf(destination) if options[:mode] == "copy"
	if options[:mode] == "copy"
		FileUtils.cp_r(source, destination)
	else
		FileUtils.mv(source, destination)
	end

  markdown_files =
    if destination.directory?
      Dir.glob(destination.join("**/*.{md,markdown}").to_s)
    else
      [destination.to_s].select { |path| path.match?(/\.(md|markdown)\z/i) }
    end

  valid_posts = markdown_files.select do |path|
    File.basename(path).start_with?(target_date)
  end

  if valid_posts.empty?
    abort "Item agendado sem post Markdown datado para #{target_date}: #{source.relative_path_from(root)}"
  end

  published.concat(valid_posts.map { |path| Pathname.new(path).relative_path_from(root).to_s.tr("\\", "/") })
end

File.write(out_path, published.join("\n"))
puts "scheduled_posts=#{published.length}"
