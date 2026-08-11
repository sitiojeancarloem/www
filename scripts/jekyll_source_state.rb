#!/usr/bin/env ruby
# frozen_string_literal: true

require "open3"

module JcemSourceState
  IGNORED_FILES = [".jcem-publication.json", ".jcem-published-posts.txt"].freeze
  IGNORED_PREFIXES = ["_site/"].freeze

  def self.include_path?(path)
    !path.empty? &&
      !IGNORED_FILES.include?(path) &&
      IGNORED_PREFIXES.none? { |prefix| path.start_with?(prefix) }
  end

  def self.files(root)
    stdout, stderr, status = Open3.capture3("git", "ls-files", "-z", chdir: root)
    raise "git ls-files failed: #{stderr}" unless status.success?

    stdout.split("\0").select { |path| include_path?(path) }.sort
  end
end
