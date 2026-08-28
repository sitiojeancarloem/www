# frozen_string_literal: true

require "yaml"

root = File.expand_path("..", __dir__)
entries = YAML.safe_load_file(File.join(root, "_data", "jcem_attributions.yml"))
texts = YAML.safe_load_file(File.join(root, "_data", "jcem_license_texts.yml"))

def assert(condition, message)
  abort "attributions=erro detalhe=#{message}" unless condition
end

required = %w[id name resource author origin license license_url copyright evidence]
entries.each do |entry|
  missing = required.reject { |key| entry[key] && !Array(entry[key]).empty? }
  assert(missing.empty?, "campos ausentes id=#{entry['id']} campos=#{missing.join(',')}")
  assert(entry["origin"].start_with?("https://"), "origem não HTTPS id=#{entry['id']}")
  assert(entry["license_url"].start_with?("https://"), "licença não HTTPS id=#{entry['id']}")
  assert(entry["evidence"].all? { |path| File.file?(File.join(root, path)) }, "evidência ausente id=#{entry['id']}")
  assert(texts.key?(entry["notice_ref"]), "texto obrigatório ausente id=#{entry['id']}") if entry["notice_ref"]
end

ids = entries.map { |entry| entry["id"] }
assert(ids.uniq.length == ids.length, "IDs duplicados")
assert(ids.include?("minimal-mistakes"), "tema distribuído sem atribuição")
assert(ids.include?("chartjs"), "Chart.js distribuído sem atribuição")
assert(ids.include?("silktide-consent-manager"), "Silktide distribuído sem atribuição")
assert(ids.include?("font-awesome-free"), "Font Awesome distribuído sem atribuição")

page = File.read(File.join(root, "_pages", "atribuicoes.md"))
footer = File.read(File.join(root, "_includes", "footer", "after_footer.html"))
assert(page.include?("site.data.jcem_attributions"), "página não consome inventário")
assert(footer.include?("'/atribuicoes/' | relative_url"), "rodapé não alcança atribuições")
puts "attributions=ok entries=#{entries.length}"
