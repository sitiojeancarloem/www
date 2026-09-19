# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/www
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/

require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)
SKILL_ROOT = File.join(ROOT, ".ia.rules", "local", "skills", "reverential-editorial-review")

def assert(condition, message)
  raise message unless condition
end

def read_utf8(path)
  content = File.read(path, encoding: "bom|utf-8")
  assert(content.valid_encoding?, "UTF8_INVALIDO:#{path}")
  content
end

skill_path = File.join(SKILL_ROOT, "SKILL.md")
descriptor_path = File.join(SKILL_ROOT, "descriptor.json")
openai_path = File.join(SKILL_ROOT, "agents", "openai.yaml")
rcf_path = File.join(ROOT, "RCFs", "revisao-editorial-reverencial.md")
adapter_path = File.join(ROOT, "agents.local.md")

[skill_path, descriptor_path, openai_path, rcf_path, adapter_path].each do |path|
  assert(File.file?(path), "ARTEFATO_AUSENTE:#{path}")
end

skill = read_utf8(skill_path)
rcf = read_utf8(rcf_path)
adapter = read_utf8(adapter_path)
descriptor = JSON.parse(read_utf8(descriptor_path))
openai = YAML.safe_load(read_utf8(openai_path), permitted_classes: [], aliases: false)

frontmatter = skill.match(/\A---\n(?<yaml>.*?)\n---\n/m)
assert(frontmatter, "FRONTMATTER_AUSENTE")
frontmatter_data = YAML.safe_load(frontmatter[:yaml], permitted_classes: [], aliases: false)
assert(frontmatter_data.keys.sort == %w[description name], "FRONTMATTER_CAMPOS_INVALIDOS")
assert(frontmatter_data["name"] == "reverential-editorial-review", "SKILL_NAME_INVALIDO")

required_descriptor_fields = %w[
  schema name description version purpose positiveTriggers negativeTriggers roles authority
  inputs output requires resources scripts hooks permissions effects limits validation origin
  license trust clients precedence merge update removal
]
assert(descriptor.keys.sort == required_descriptor_fields.sort, "DESCRITOR_CAMPOS_INVALIDOS")
assert(descriptor["schema"] == "agents-skill-descriptor/v1", "DESCRITOR_SCHEMA_INVALIDO")
assert(descriptor["name"] == frontmatter_data["name"], "DESCRITOR_NOME_DIVERGENTE")
assert(descriptor["positiveTriggers"].length >= 3, "GATILHOS_POSITIVOS_INSUFICIENTES")
assert(descriptor["negativeTriggers"].length >= 3, "GATILHOS_NEGATIVOS_INSUFICIENTES")
assert(descriptor["requires"].include?(".ia.rules/resources/editorial-authoring.md"), "DEPENDENCIA_EDITORIAL_AUSENTE")
assert(descriptor["limits"].values_at("automaticCorpusScan", "blindReplacement", "inferAmbiguousReferent", "managedCoreMutation").all?(false), "LIMITES_PRESERVADORES_INVALIDOS")
assert(descriptor["hooks"].empty?, "HOOK_NAO_AUTORIZADO")
assert(descriptor["scripts"].empty?, "SCRIPT_AUTOMATICO_NAO_AUTORIZADO")

assert(openai.dig("interface", "default_prompt").include?("$reverential-editorial-review"), "PROMPT_SKILL_INVALIDO")
assert(openai.dig("policy", "allow_implicit_invocation") == true, "INVOCACAO_IMPLICITA_INVALIDA")

positive_cases = ["DEUS", "JESUS", "JESUS CRISTO", "CRISTO", "ESPÍRITO SANTO", "JEOVÁ", "JAVÉ", "YHWH", "variante aberta", "título", "pronome ou contração"]
negative_cases = ["Baal", "deuses gregos", "outra religião", "divindade genérica", "ser humano", "homógrafo", "antecedente ambíguo", "citação inline", "bloco de citação"]
combined_cases = ["aquele JESUS", "aquele ESPÍRITO SANTO", "o próprio JEOVÁ", "ênfase localizada", "reescrita equivalente", "sentença integral em caixa alta"]

(positive_cases + negative_cases + combined_cases).each do |example|
  assert(skill.include?(example), "CASO_NAO_COBERTO:#{example}")
end

%w[citação ambíguo contexto Regex].each do |term|
  assert(skill.include?(term) && rcf.include?(term), "CONTRATO_NAO_PROJETADO:#{term}")
end

assert(skill.include?("editorial-authoring.md"), "PRECEDENCIA_CANONICA_AUSENTE")
assert(skill.include?("alterações propostas ou aplicadas"), "SAIDA_ALTERACOES_AUSENTE")
assert(skill.include?("formas preservadas"), "SAIDA_PRESERVACOES_AUSENTE")
assert(skill.include?("ambiguidades mantidas"), "SAIDA_AMBIGUIDADES_AUSENTE")
assert(adapter.include?(".ia.rules/local/skills/reverential-editorial-review/SKILL.md"), "ROTA_LOCAL_AUSENTE")
assert(adapter.index("editorial-authoring.md") < adapter.index("reverential-editorial-review/SKILL.md"), "ORDEM_DA_ROTA_INVALIDA")
assert(!Dir.exist?(File.join(ROOT, ".ia.rules", "local", "subagents")), "SUBAGENT_REDUNDANTE_PRESENTE")

puts "OK: política editorial reverencial, descritor, rota e matriz preservadora validados"
