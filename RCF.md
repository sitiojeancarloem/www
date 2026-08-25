<!-- AI-PROCESSED -->
# RCF — Índice normativo do JeanCarloEM Blog

Status: vigente.

Escopo: autoridade arquitetural superior, precedência e roteamento dos contratos especializados deste produto.

## Autoridade e precedência

- Este arquivo é a SSOT superior do produto e governa requisitos, negócio, arquitetura, contratos e critérios verificáveis, ressalvado o domínio operacional de `AGENTS.md` e associados.
- A ordem aplicável é `AGENTS.md` → este índice RCF → sub-RCF roteada → configuração e implementação → README e demais documentos subordinados.
- Cada sub-RCF especializa somente o domínio indicado. Regra transversal deste índice prevalece; conflito entre especializações deve ser resolvido pelo escopo mais específico sem reduzir contrato superior.
- Sub-RCF nova ou alterada deve residir em `./RCFs/`, possuir link relativo real neste índice, declarar escopo e não duplicar regra já centralizada.
- Mudança material deve atualizar no mesmo ciclo a sub-RCF aplicável, implementação, validação, rastreabilidade e documentação de uso.

## Contratos transversais

- Comportamento e conteúdo vigentes devem ser preservados durante modularização, roteamento, refatoração e evolução.
- Visualização web e impressão são contextos estritamente isolados conforme a sub-RCF de impressão; compartilhamento somente pode ser semântico, deliberado e normatizado.
- Mecanismo, configuração, plugin, componente ou pipeline existente deve ser reutilizado e ampliado antes da criação de fluxo paralelo.
- Implementação deve ser determinística, portável entre Windows/Linux e GitHub Pages, progressiva, acessível, responsiva e validada no artefato renderizado quando visível.
- Exceção deve permanecer no ponto único definido pela sub-RCF competente, com escopo e evidência rastreáveis.

## Roteamento

| Domínio ou gatilho | Sub-RCF autoritativa |
|---|---|
| Masthead, rodapé, 404, noscript e componentes comuns | [Componentes compartilhados](./RCFs/componentes-compartilhados.md) |
| Notas, referências, bibliografia e Kramdown | [Referências e footnotes](./RCFs/referencias-e-footnotes.md) |
| Citações inline, blocos, subcitações e modelos tipados | [Citações](./RCFs/citacoes.md) |
| Impressão, PDF, perfil IEEE e isolamento tela/impressão | [Impressão IEEE](./RCFs/impressao-ieee.md) |
| Namespaces editoriais, subnamespaces e conversão de rotas | [Namespaces editoriais](./RCFs/namespaces-editoriais.md) |
| Sínteses editoriais `bate-papo:` | [Bate-papo](./RCFs/bate-papo.md) |
| PageSpeed, dependências, reflow e orçamento client-side | [Desempenho e dependências](./RCFs/desempenho-e-dependencias.md) |
| Loader, skeleton, recursos pesados e imagens responsivas | [Carregamento progressivo](./RCFs/carregamento-progressivo.md) |
| Build, workflows, GitHub Pages e distribuição | [Publicação](./RCFs/publicacao.md) |
| Página `/mapa/` e taxonomias navegáveis | [Mapa HTML](./RCFs/mapa-html.md) |
| Modus operandi especializado da IA e projeção local | [Operação especializada da IA](./RCFs/operacao-da-ia.md) |
| Leitura acessível, TTS, pronúncia e gráficos semânticos | [Leitura acessível e TTS](./RCFs/leitura-acessivel-e-tts.md) |

## Validação do roteamento

- Todo link da tabela deve existir e resolver localmente.
- Cada identificador RCF deve ocorrer em uma única sub-RCF.
- O índice deve permanecer compacto e não repetir regras especializadas.
- `npm run agent:rcf`, a validação de links e os testes do domínio alterado devem bloquear divergência.
