#!/usr/bin/env ruby
# frozen_string_literal: true

require "digest"
require "fileutils"
require "json"
require "open3"
require "optparse"
require "pathname"
require "shellwords"
require "tmpdir"
require "time"

ZERO_SHA = "0000000000000000000000000000000000000000"
CONTROL_FILE = "publicar"
PUBLICATION_STATE = ".jcem-publication.json"
PUBLISHED_POSTS_FILE = ".jcem-published-posts.txt"

options = {
  branch: ENV.fetch("PUBLISH_BRANCH", "gh-pages"),
  remote: "origin",
  cleanup: true
}

OptionParser.new do |parser|
  parser.on("--commit COMMIT") { |value| options[:commit] = value.to_s.strip }
  parser.on("--branch BRANCH") { |value| options[:branch] = value.to_s.strip }
  parser.on("--remote REMOTE") { |value| options[:remote] = value.to_s.strip }
  parser.on("--no-cleanup") { options[:cleanup] = false }
end.parse!

if ARGV.length > 1
  abort "[publish] erro=argumentos excedentes: #{ARGV.shelljoin}"
elsif ARGV.length == 1
  options[:commit] = ARGV.first.to_s.strip
end

def run_git(*args, chdir: Dir.pwd, capture: true, allow_failure: false)
  stdout, stderr, status = Open3.capture3("git", *args, chdir: chdir)
  stdout = stdout.encode("UTF-8", invalid: :replace, undef: :replace)
  stderr = stderr.encode("UTF-8", invalid: :replace, undef: :replace)
  return [stdout, stderr, status] if allow_failure
  return stdout if status.success?

  abort "[publish] erro=git #{args.shelljoin} falhou: #{stderr.strip}"
end

def run_command(*args, chdir: Dir.pwd)
  stdout, stderr, status = Open3.capture3(*args, chdir: chdir)
  stdout = stdout.encode("UTF-8", invalid: :replace, undef: :replace)
  stderr = stderr.encode("UTF-8", invalid: :replace, undef: :replace)
  return stdout if status.success?

  abort "[publish] erro=#{args.shelljoin} falhou: #{stderr.strip}"
end

def emit(outputs)
  outputs.each { |key, value| puts "#{key}=#{value}" }
  output_path = ENV["GITHUB_OUTPUT"]
  return if output_path.to_s.empty?

  File.open(output_path, "a") do |file|
    outputs.each { |key, value| file.puts("#{key}=#{value}") }
  end
end

def validate_branch!(branch)
  invalid = branch.empty? ||
    branch.start_with?("-") ||
    branch.end_with?("/") ||
    branch.include?("..") ||
    branch.include?("@{") ||
    branch.match?(/[[:space:]~^:?*\[\\]/)

  abort "[publish] erro=branch de publicacao invalido: #{branch.inspect}" if invalid
end

def validate_remote!(remote)
  remotes = run_git("remote").lines.map(&:strip)
  abort "[publish] erro=remote inexistente: #{remote}" unless remotes.include?(remote)
end

def validate_commit(commit)
  return "" if commit.to_s.empty?

  _stdout, stderr, status = run_git("cat-file", "-e", "#{commit}^{commit}", allow_failure: true)
  abort "[publish] erro=commit invalido ou inacessivel: #{commit}: #{stderr.strip}" unless status.success?

  run_git("rev-parse", "#{commit}^{commit}").strip
end

def remote_branch_sha(remote, branch)
  stdout = run_git("ls-remote", "--heads", remote, branch)
  line = stdout.lines.first.to_s
  line.empty? ? ZERO_SHA : line.split(/\s+/).first
end

def token_remote_url(remote)
  if ENV["GITHUB_TOKEN"].to_s != "" && ENV["GITHUB_REPOSITORY"].to_s != ""
    "https://x-access-token:#{ENV.fetch("GITHUB_TOKEN")}@github.com/#{ENV.fetch("GITHUB_REPOSITORY")}.git"
  else
    run_git("remote", "get-url", remote).strip
  end
end

def fetch_previous_branch(remote, branch)
  stdout, _stderr, status = run_git(
    "fetch",
    "--no-tags",
    remote,
    "refs/heads/#{branch}:refs/remotes/#{remote}/#{branch}",
    allow_failure: true
  )

  status.success? ? stdout : ""
end

def previous_publication_state(remote, branch)
  fetch_previous_branch(remote, branch)
  stdout, _stderr, status = run_git("show", "refs/remotes/#{remote}/#{branch}:#{PUBLICATION_STATE}", allow_failure: true)
  return {} unless status.success?

  JSON.parse(stdout)
rescue JSON::ParserError
  {}
end

def ensure_inside!(root, path)
  root_path = Pathname.new(root).expand_path.to_s
  path_path = Pathname.new(path).expand_path.to_s
  return if path_path == root_path || path_path.start_with?("#{root_path}#{File::SEPARATOR}")

  abort "[publish] erro=caminho fora da area temporaria: #{path_path}"
end

def copy_file(source_root, target_root, relative_path)
  source = File.join(source_root, relative_path)
  return unless File.file?(source)

  target = File.join(target_root, relative_path)
  ensure_inside!(target_root, target)
  FileUtils.mkdir_p(File.dirname(target))
  FileUtils.copy_file(source, target)
end

def copy_working_tree(root, target_root)
  files = run_git("ls-files", "--cached", "--others", "--exclude-standard", "-z", chdir: root).split("\0")
  files.each do |relative|
    next if relative.empty? || relative == CONTROL_FILE

    copy_file(root, target_root, relative)
  end
end

def copy_commit_tree(commit, target_root)
  archive = File.join(File.dirname(target_root), "source.tar")
  run_git("archive", "--format=tar", "--output", archive, commit)
  run_command("tar", "-xf", archive, "-C", target_root)
end

def file_digests(root, pattern)
  Dir.chdir(root) do
    Dir.glob(pattern, File::FNM_DOTMATCH)
      .select { |path| File.file?(path) }
      .sort
      .to_h { |path| [path.tr("\\", "/"), Digest::SHA256.file(path).hexdigest] }
  end
end

def current_post_digests(root)
  file_digests(root, "_posts/**/*.{md,markdown}")
end

def changed_post_files(current_posts, previous_state)
  previous_posts = previous_state["post_files"].is_a?(Hash) ? previous_state["post_files"] : {}
  current_posts.keys.select { |path| !previous_posts.key?(path) }.sort
end

def write_publication_state(target_root, options, source_sha, previous_publish_sha, previous_state, current_posts)
  source_kind = source_sha.empty? ? "working_tree" : "commit"
  source_label = source_sha.empty? ? "working-tree" : source_sha
  changed_posts = changed_post_files(current_posts, previous_state)
  state = {
    "version" => 1,
    "branch" => options[:branch],
    "source_kind" => source_kind,
    "source_sha" => source_sha,
    "source_label" => source_label,
    "previous_publish_sha" => previous_publish_sha,
    "previous_source_sha" => previous_state["source_sha"].to_s,
    "created_at" => Time.now.utc.iso8601,
    "post_files" => current_posts,
    "changed_post_files" => changed_posts
  }

  File.write(File.join(target_root, PUBLICATION_STATE), JSON.pretty_generate(state))
  File.write(File.join(target_root, PUBLISHED_POSTS_FILE), "#{changed_posts.join("\n")}\n")
  state
end

def configure_publication_repo(target_root, remote, branch, remote_url)
  run_git("init", chdir: target_root, capture: false)
  run_git("checkout", "-B", branch, chdir: target_root, capture: false)
  run_git("remote", "add", remote, remote_url, chdir: target_root, capture: false)
  run_git("config", "user.name", ENV.fetch("GIT_AUTHOR_NAME", "jcem-publish"), chdir: target_root, capture: false)
  run_git("config", "user.email", ENV.fetch("GIT_AUTHOR_EMAIL", "jcem-publish@users.noreply.github.com"), chdir: target_root, capture: false)
end

def commit_publication(target_root)
  run_git("add", "-A", chdir: target_root, capture: false)
  status = run_git("status", "--porcelain", chdir: target_root).strip
  abort "[publish] erro=nenhum arquivo encontrado para publicacao" if status.empty?

  run_git("commit", "-m", "Publica site", chdir: target_root, capture: false)
  run_git("rev-parse", "HEAD", chdir: target_root).strip
end

def push_publication(target_root, remote, branch, previous_sha)
  lease = previous_sha == ZERO_SHA ? "refs/heads/#{branch}:" : "refs/heads/#{branch}:#{previous_sha}"
  run_git(
    "push",
    "--force-with-lease=#{lease}",
    remote,
    "HEAD:refs/heads/#{branch}",
    chdir: target_root,
    capture: false
  )
end

def delete_local_publication_branch(root, branch)
  current = run_git("rev-parse", "--abbrev-ref", "HEAD", chdir: root).strip
  return if current == branch

  _stdout, _stderr, status = run_git("show-ref", "--verify", "--quiet", "refs/heads/#{branch}", chdir: root, allow_failure: true)
  return unless status.success?

  run_git("branch", "-D", branch, chdir: root, capture: false)
end

validate_branch!(options[:branch])
root = run_git("rev-parse", "--show-toplevel").strip
Dir.chdir(root)
validate_remote!(options[:remote])

source_sha = validate_commit(options[:commit])
previous_publish_sha = remote_branch_sha(options[:remote], options[:branch])
previous_state = previous_publish_sha == ZERO_SHA ? {} : previous_publication_state(options[:remote], options[:branch])
remote_url = token_remote_url(options[:remote])
temp_root = Dir.mktmpdir("jcem-publish-")
source_root = File.join(temp_root, "source")
FileUtils.mkdir_p(source_root)

begin
  if source_sha.empty?
    copy_working_tree(root, source_root)
  else
    copy_commit_tree(source_sha, source_root)
    FileUtils.rm_f(File.join(source_root, CONTROL_FILE))
  end

  current_posts = current_post_digests(source_root)
  state = write_publication_state(source_root, options, source_sha, previous_publish_sha, previous_state, current_posts)
  configure_publication_repo(source_root, options[:remote], options[:branch], remote_url)
  publish_sha = commit_publication(source_root)
  push_publication(source_root, options[:remote], options[:branch], previous_publish_sha)
  delete_local_publication_branch(root, options[:branch])

  emit(
    "should_publish" => "true",
    "branch" => options[:branch],
    "checkout_ref" => options[:branch],
    "before" => previous_publish_sha,
    "head" => publish_sha,
    "source_sha" => source_sha,
    "source_label" => state["source_label"],
    "previous_publish_sha" => previous_publish_sha,
    "publish_sha" => publish_sha,
    "changed_posts_file" => PUBLISHED_POSTS_FILE
  )
ensure
  if options[:cleanup]
    FileUtils.rm_rf(temp_root)
  else
    puts "temp_root=#{temp_root}"
  end
end
