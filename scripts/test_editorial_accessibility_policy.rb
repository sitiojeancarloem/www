# frozen_string_literal: true

require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)
SKILL_ROOT = File.join(ROOT, ".ia.rules", "local", "skills", "editorial-accessibility-review")

def assert(condition, message)
  raise message unless condition
end

def read_utf8(path)
  content = File.read(path, encoding: "bom|utf-8")
  assert(content.valid_encoding?, "UTF8_INVALIDO:#{path}")
  content
end

skill = read_utf8(File.join(SKILL_ROOT, "SKILL.md"))
descriptor = JSON.parse(read_utf8(File.join(SKILL_ROOT, "descriptor.json")))
openai = YAML.safe_load(read_utf8(File.join(SKILL_ROOT, "agents", "openai.yaml")), permitted_classes: [], aliases: false)
canonical = read_utf8(File.join(ROOT, ".ia.rules", "resources", "editorial-authoring.md"))
conversation = read_utf8(File.join(ROOT, "RCFs", "bate-papo.md"))
operation = read_utf8(File.join(ROOT, "RCFs", "operacao-da-ia.md"))
adapter = read_utf8(File.join(ROOT, "agents.local.md"))

frontmatter = skill.match(/\A---\n(?<yaml>.*?)\n---\n/m)
assert(frontmatter, "FRONTMATTER_AUSENTE")
frontmatter_data = YAML.safe_load(frontmatter[:yaml], permitted_classes: [], aliases: false)
assert(frontmatter_data["name"] == "editorial-accessibility-review", "SKILL_NAME_INVALIDO")
assert(descriptor["schema"] == "agents-skill-descriptor/v1", "DESCRITOR_SCHEMA_INVALIDO")
assert(descriptor["name"] == frontmatter_data["name"], "DESCRITOR_NOME_DIVERGENTE")
assert(descriptor["requires"].include?(".ia.rules/resources/editorial-authoring.md"), "DEPENDENCIA_CANONICA_AUSENTE")
assert(descriptor["limits"].values_at("automaticCorpusScan", "blindReplacement", "inventSource", "managedCoreMutation").all?(false), "LIMITES_INVALIDOS")
assert(descriptor["hooks"].empty? && descriptor["scripts"].empty?, "AUTOMACAO_EDITORIAL_INDEVIDA")
assert(openai.dig("policy", "allow_implicit_invocation") == true, "INVOCACAO_IMPLICITA_INVALIDA")

%w[sintese-conversacional texto-autoral ambigua].each { |category| assert(skill.include?(category), "CATEGORIA_AUSENTE:#{category}") }
%w[vocabulário pontuação cadência intensidade oralidade personalidade].each { |term| assert(skill.include?(term), "VOZ_NAO_COBERTA:#{term}") }
%w[força nuance precisão infantilize substância].each { |term| assert(skill.include?(term), "RIGOR_NAO_COBERTO:#{term}") }
assert(skill.include?("primeira ocorrência pertinente") && skill.include?("não circular"), "GLOSSA_INICIAL_INCOMPLETA")
assert(skill.include?("JCEM-ORIGINAL-AUTORAL:START") && skill.include?("JCEM-ALTERNATIVA-ESTILISTICA"), "ALTERNATIVA_NAO_MARCADA")
assert(skill.index("editorial-authoring.md") < skill.index("RCFs/bate-papo.md"), "PRECEDENCIA_INVALIDA")
assert(canonical.include?("analfabetismo funcional") && canonical.include?("quarta série"), "CAPACIDADE_CANONICA_ENFRAQUECIDA")
assert(conversation.include?("áudios transcritos") && conversation.include?("não possui autor originário"), "SINTESE_NAO_ESPECIALIZADA")
assert(operation.include?("Edição de conteúdo humano e síntese conversacional são categorias distintas"), "ROTA_OPERACIONAL_AUSENTE")
assert(adapter.include?("editorial-accessibility-review/SKILL.md"), "ROTA_LOCAL_AUSENTE")

puts "editorial_accessibility=ok categories=3 voice=6 rigor=5 alternative=marked"
