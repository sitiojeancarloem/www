# frozen_string_literal: true
# JeanCarloEM — https://www.jeancarloem.com | https://github.com/sitiojeancarloem/www
# MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md.
# Uso: ruby -rbundler/setup scripts/test_donation_return_presentation.rb.
require 'json'
require_relative '../_plugins/jcem_donation_return_presentation'
def check(ok, message)
  raise message unless ok
end
root = File.realpath(File.join(__dir__, '..'))
s = JSON.parse(File.read(File.join(root, '_data/donations.json'))).fetch('thankYou')
defaults = { 'future' => { 'items' => ['future-original'] }, 'jcem_cover' => { 'stale-default' => true } }
h = { 'layout' => 'home', 'entries_layout' => 'grid', 'author_profile' => true, 'custom' => { 'items' => ['original'] }, 'header' => { 'overlay_image' => '/old.webp', 'video' => {}, 'actions' => [], 'caption' => 'old' }, 'cover' => { 'hero' => { 'content' => 'old' } }, 'jcem_cover' => { 'stale' => true } }
h.default_proc = proc { |_, key| defaults[key] }
snapshots = [JSON.generate(h), JSON.generate(s), JSON.generate(defaults)]
h.freeze
s.freeze
out = Jcem::DonationReturn::Presentation.data_for(h, s)
allowed = %w[title description jcem_donation_thank_you featured_image featured_image_style header cover jcem_cover]
check(out.keys.sort == (h.keys + allowed).uniq.sort, 'root key set')
%w[layout entries_layout author_profile custom].each { |key| check(out[key] == h[key], "unrelated field #{key}") }
check(out['title'] == s.fetch('title') && out['description'] == s.fetch('message') && out['jcem_donation_thank_you'] == s, 'canonical text and metadata')
i = s.fetch('image'); c = s.fetch('cover'); p = c.fetch('patterns')
check(out['featured_image'] == i.fetch('src') && out['featured_image_style'] == c.fetch('mode'), 'featured fields')
expected_header = { 'image' => i.fetch('src'), 'image_description' => i.fetch('alt'), 'image_style' => c.fetch('mode'), 'image_wide_mode' => c.fetch('composition'), 'image_wide_left' => p.fetch('left'), 'image_wide_right' => p.fetch('right') }
check(out['header'] == expected_header && out['cover'] == c, 'complete header and cover replacement')
check(out.key?('jcem_cover') && out['jcem_cover'].nil? && out.default_proc, 'resolved cover shadow and lazy defaults')
out['custom']['items'][0].replace('changed'); out['title'].replace('changed'); out['header']['image'].replace('changed'); out['jcem_donation_thank_you']['message'].replace('changed'); out['future']['items'][0].replace('changed')
check([JSON.generate(h), JSON.generate(s), JSON.generate(defaults)] == snapshots, 'source isolation by mutation')
[[nil, s], [[], s], [h, nil], [h, []]].each do |args|
  begin
    Jcem::DonationReturn::Presentation.data_for(*args)
  rescue ArgumentError
    next
  end
  raise 'invalid root accepted'
end
bad = s.dup; bad.delete('message')
begin
  Jcem::DonationReturn::Presentation.data_for(h, bad)
  raise 'missing required field accepted'
rescue KeyError
end
puts 'DONATION_RETURN_PRESENTATION_CANONICAL_MAPPING_HOME_DEFAULTS_AND_ISOLATION_OK'
