#!/usr/bin/env ruby
# frozen_string_literal: true

require "digest"
require "fileutils"
require "json"
require "open3"
require "time"

ROOT = File.expand_path("..", __dir__)
SITE_DIR = File.join(ROOT, "_site")
MANIFEST_PATH = File.join(SITE_DIR, ".jcem-build-manifest.json")
STATE_PATH = File.join(ROOT, ".jekyll-cache", "jcem-build-state.json")
SOURCE_STATE_PATH = File.join(ROOT, ".jekyll-cache", "jcem-source-state.json")
IGNORED_SOURCE_STATE_FILES = [".jcem-publication.json", ".jcem-published-posts.txt"].freeze

def git_head
  stdout, _stderr, status = Open3.capture3("git", "rev-parse", "HEAD", chdir: ROOT)
  status.success? ? stdout.strip : ""
end

def site_files
  Dir.chdir(SITE_DIR) do
    Dir.glob("**/*", File::FNM_DOTMATCH)
      .reject { |path| path == "." || path == ".jcem-build-manifest.json" }
      .select { |path| File.file?(path) }
      .sort
  end
end

def file_digest(relative_path)
  Digest::SHA256.file(File.join(SITE_DIR, relative_path)).hexdigest
end

def source_files
  stdout, stderr, status = Open3.capture3("git", "ls-files", "-z", chdir: ROOT)
  raise "git ls-files failed: #{stderr}" unless status.success?

  stdout
    .split("\0")
    .reject { |path| path.empty? || IGNORED_SOURCE_STATE_FILES.include?(path) }
    .sort
end

def source_file_digest(relative_path)
  Digest::SHA256.file(File.join(ROOT, relative_path)).hexdigest
end

def write_manifest
  raise "_site inexistente; execute o build antes do manifesto" unless Dir.exist?(SITE_DIR)

  source_sha = ENV["SOURCE_SHA"].to_s.empty? ? git_head : ENV["SOURCE_SHA"]
  build_mode = ENV.fetch("BUILD_MODE", "unknown")
  build_reason = ENV.fetch("BUILD_REASON", "unknown")
  files = site_files.to_h { |path| [path, file_digest(path)] }
  complete = File.file?(File.join(SITE_DIR, "CNAME")) &&
    File.file?(File.join(SITE_DIR, "index.html")) &&
    File.file?(File.join(SITE_DIR, "404.html"))
  manifest = {
    "version" => 1,
    "source_sha" => source_sha,
    "build_mode" => build_mode,
    "build_reason" => build_reason,
    "created_at" => Time.now.utc.iso8601,
    "complete" => complete,
    "file_count" => files.length,
    "files" => files
  }

  File.write(MANIFEST_PATH, JSON.pretty_generate(manifest))
  FileUtils.mkdir_p(File.dirname(STATE_PATH))
  File.write(
    STATE_PATH,
    JSON.pretty_generate(
      {
        "version" => 1,
        "source_sha" => source_sha,
        "build_mode" => build_mode,
        "build_reason" => build_reason,
        "created_at" => manifest["created_at"],
        "site_manifest" => MANIFEST_PATH.sub("#{ROOT}/", "")
      }
    )
  )
  File.write(
    SOURCE_STATE_PATH,
    JSON.pretty_generate(
      {
        "version" => 1,
        "source_sha" => source_sha,
        "created_at" => manifest["created_at"],
        "files" => source_files.to_h { |path| [path, source_file_digest(path)] }
      }
    )
  )

  puts "manifest=#{MANIFEST_PATH}"
  puts "state=#{STATE_PATH}"
  puts "source_state=#{SOURCE_STATE_PATH}"
  puts "complete=#{complete}"
end

command = ARGV.fetch(0, "write")

case command
when "write"
  write_manifest
else
  raise "Comando invalido: #{command}"
end
