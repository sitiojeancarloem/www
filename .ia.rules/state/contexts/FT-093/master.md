# Contexto mestre — FT-093 a FT-095

Estado: fases registradas; FT-093 apta à equalização após o commit exclusivo de inicialização; FT-094 e FT-095 bloqueadas por dependência e autorização. Fonte material: `TODO.ia.md` no commit `d6e48a9b90defd21b6ff07760b82cec1456c4362`.

## Objetivo

Formalizar e materializar uma política editorial que diferencie síntese conversacional de edição de conteúdo autoral, preserve voz e pontuação quando houver autoria humana e torne a linguagem acessível a leitores com baixa escolaridade sem reduzir substância.

## Estado real inventariado

- `.ia.rules/resources/editorial-authoring.md` é a autoridade canônica para transformação autoral e já exige preservação de conteúdo, voz, ambiguidades e referências.
- `RCFs/bate-papo.md` rege sínteses conversacionais, distingue fala, síntese e inferência e já exige linguagem acessível sem rebuscamento dispensável.
- `RCFs/operacao-da-ia.md` e `agents.local.md` roteiam transformação editorial ao recurso canônico antes das especializações locais.
- A Skill `reverential-editorial-review` é delta estreito e posterior ao recurso canônico; não deve ser ampliada para virar política editorial geral.
- Não há contrato local específico para baixa escolaridade, glossas no primeiro uso ou alternativa autoral explicitamente marcada.

## Fases

1. FT-093 — equalização e normatização: consolidar categorias de origem, preservação, exceção marcada, acessibilidade e limites, sem runtime local.
2. FT-094 — implementação: escolher o menor mecanismo oficial apenas para o delta que a norma canônica não cobre, após autorização humana nova.
3. FT-095 — integração e validação: provar síntese, texto autoral, alternativa marcada, glossas e regressões em amostras controladas.

## Limites

- Síntese sem autor originário não autoriza inventar fatos, citações, consenso, autoria intelectual ou conclusões ausentes.
- Clareza de linguagem não autoriza simplificação de conteúdo, redução de força, remoção de nuance ou generalização indevida.
- Reescrita alternativa de trecho autoral é exceção pontual e deve preservar o original comentado, marcar inequivocamente a alternativa e declarar a alteração de estilo.
- Regra genérica reutilizável não será adicionada ao núcleo gerenciado deste repositório Final; eventual proposta upstream pertence à FT-097 e será apenas material local.

## Próxima retomada

Após autorização explícita do commit de inicialização, criar o commit exclusivo das FTs. Só então iniciar FT-093, normatizar o delta do produto e interromper novamente antes da implementação.
