#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "digest"
require "open3"
require "shellwords"
require "yaml"

ROOT = File.expand_path("..", __dir__)
MAP_PATH = File.join(ROOT, ".github", "jekyll-build-impact.yml")
ZERO_SHA = "0000000000000000000000000000000000000000"
SOURCE_STATE_PATH = File.join(ROOT, ".jekyll-cache", "jcem-source-state.json")
IGNORED_SOURCE_STATE_FILES = [".jcem-publication.json", ".jcem-published-posts.txt"].freeze

def run_git(*args)
  stdout, stderr, status = Open3.capture3("git", *args, chdir: ROOT)
  raise "git #{args.shelljoin} failed: #{stderr}" unless status.success?

  stdout
end

def git_commit?(sha)
  return false if sha.nil? || sha.empty? || sha == ZERO_SHA

  _stdout, _stderr, status = Open3.capture3("git", "cat-file", "-e", "#{sha}^{commit}", chdir: ROOT)
  status.success?
end

def emit(outputs)
  outputs.each do |key, value|
    puts "#{key}=#{value}"
  end

  output_path = ENV["GITHUB_OUTPUT"]
  return if output_path.nil? || output_path.empty?

  File.open(output_path, "a") do |file|
    outputs.each do |key, value|
      file.puts("#{key}=#{value}")
    end
  end
end

def load_map
  YAML.load_file(MAP_PATH)
end

def matches_any?(path, patterns)
  patterns.any? do |pattern|
    File.fnmatch?(pattern, path, File::FNM_PATHNAME | File::FNM_DOTMATCH) ||
      File.fnmatch?(pattern, path, File::FNM_DOTMATCH)
  end
end

def changed_paths(before, head)
  lines = run_git("diff", "--name-status", "--find-renames", before, head).lines.map(&:strip).reject(&:empty?)

  lines.map do |line|
    parts = line.split(/\t/)
    status = parts[0]
    path = parts[-1]
    { status: status, path: path }
  end
end

def source_files
  run_git("ls-files", "-z")
    .split("\0")
    .reject { |path| path.empty? || IGNORED_SOURCE_STATE_FILES.include?(path) }
    .sort
end

def current_source_state
  source_files.to_h do |path|
    absolute = File.join(ROOT, path)
    next [path, nil] unless File.file?(absolute)

    [path, Digest::SHA256.file(absolute).hexdigest]
  end.compact
end

def cached_changed_paths
  return nil unless File.file?(SOURCE_STATE_PATH)

  previous = JSON.parse(File.read(SOURCE_STATE_PATH))
  files = previous["files"]
  return nil unless files.is_a?(Hash)

  current = current_source_state
  paths = (files.keys + current.keys).uniq.sort
  paths.filter_map do |path|
    next if files[path] == current[path]

    status =
      if current[path].nil?
        "D"
      elsif files[path].nil?
        "A"
      else
        "M"
      end

    { status: status, path: path }
  end
rescue JSON::ParserError
  nil
end

def classify_changes(changes, full_patterns, incremental_patterns)
  return ["full", "deleted_file_requires_full_build"] if changes.any? { |change| change[:status].start_with?("D") }
  return ["full", "no_changed_files_detected"] if changes.empty?

  changes.each do |change|
    path = change[:path]

    if matches_any?(path, full_patterns)
      return ["full", "structural_change:#{path}"]
    end

    next if matches_any?(path, incremental_patterns)

    return ["full", "unclassified_change:#{path}"]
  end

  ["incremental", "safe_incremental_paths"]
end

def trusted_local_site?(head)
  manifest_path = File.join(ROOT, "_site", ".jcem-build-manifest.json")
  site_dir = File.join(ROOT, "_site")

  return false unless File.file?(manifest_path)

  manifest = JSON.parse(File.read(manifest_path))

  return false unless manifest["source_sha"] == head
  return false unless manifest["complete"] == true
  return false unless File.file?(File.join(site_dir, "CNAME"))
  return false unless File.file?(File.join(site_dir, "index.html"))
  return false unless File.file?(File.join(site_dir, "404.html"))

  files = manifest["files"]
  return false unless files.is_a?(Hash) && !files.empty?

  files.all? do |relative_path, expected_digest|
    path = File.join(site_dir, relative_path)
    File.file?(path) && Digest::SHA256.file(path).hexdigest == expected_digest
  end
rescue JSON::ParserError
  false
end

def detect
  before = ENV.fetch("BEFORE", "")
  head = ENV.fetch("HEAD", "")
  map = load_map
  full_patterns = map.dig("impact", "full_build", "patterns") || []
  incremental_patterns = map.dig("impact", "incremental_allowed", "patterns") || []
  mode = "full"
  reason = "manual_dispatch"

  if git_commit?(before) && git_commit?(head)
    mode, reason = classify_changes(changed_paths(before, head), full_patterns, incremental_patterns)
  else
    cached_changes = cached_changed_paths
    if cached_changes
      mode, reason = classify_changes(cached_changes, full_patterns, incremental_patterns)
      reason = "cached_source_state:#{reason}"
    else
      reason = "missing_diff_base"
    end
  end

  emit("mode" => mode, "reason" => reason)
end

def resolve
  tentative_mode = ENV.fetch("TENTATIVE_MODE", "full")
  tentative_reason = ENV.fetch("TENTATIVE_REASON", "unknown")
  before = ENV.fetch("BEFORE", "")
  head = ENV.fetch("HEAD", "")
  cache_state = File.join(ROOT, ".jekyll-cache", "jcem-build-state.json")
  metadata = File.join(ROOT, ".jekyll-metadata")
  site_dir = File.join(ROOT, "_site")

  if trusted_local_site?(head)
    emit(
      "mode" => "trusted_site",
      "reason" => "trusted_committed_site_manifest",
      "reset_site" => "false"
    )
    return
  end

  if tentative_mode != "incremental"
    emit("mode" => "full", "reason" => tentative_reason, "reset_site" => "true")
    return
  end

  unless File.directory?(site_dir) && File.file?(metadata) && File.file?(cache_state)
    emit("mode" => "full", "reason" => "render_cache_missing", "reset_site" => "true")
    return
  end

  state = JSON.parse(File.read(cache_state))

  expected_source_sha =
    if git_commit?(before)
      before
    elsif File.file?(SOURCE_STATE_PATH)
      JSON.parse(File.read(SOURCE_STATE_PATH))["source_sha"]
    end

  unless expected_source_sha
    emit("mode" => "full", "reason" => "render_cache_source_state_missing", "reset_site" => "true")
    return
  end

  if state["source_sha"] == expected_source_sha
    emit("mode" => "incremental", "reason" => tentative_reason, "reset_site" => "false")
  else
    emit("mode" => "full", "reason" => "render_cache_not_from_diff_base", "reset_site" => "true")
  end
rescue JSON::ParserError
  emit("mode" => "full", "reason" => "render_cache_state_invalid", "reset_site" => "true")
end

def local
  head = ENV.fetch("HEAD", "")
  trusted = trusted_local_site?(head)

  emit(
    "trusted" => trusted ? "true" : "false",
    "reason" => trusted ? "trusted_committed_site_manifest" : "no_trusted_committed_site"
  )
end

command = ARGV.fetch(0, "detect")

case command
when "detect"
  detect
when "local"
  local
when "resolve"
  resolve
else
  raise "Comando invalido: #{command}"
end
