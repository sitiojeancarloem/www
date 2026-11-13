# FT-116 — Integração preservadora de origin/dev e evolução local

Tipo: operacional; escopo: Técnico; prioridade: solicitação corrente.
criado_em: 2026-11-13T13:35:00-03:00.
Fonte: .ia.rules/state/requests/FT-116/prompt.md.
SHA256 da fonte (bytes): b6880dbe84ce71d3400ee17d62c5d7cf1029d7d6c955d8951307f409fcd90256.
Autorização: merge, resolução preservadora, validação, commit e push explicitamente solicitados.
Triagem: índice local de recusas inexistente; acervo vazio conforme cenário oficial.
Contratos: RCF.md, RCFs/operacao-da-ia.md e RCFs/publicacao.md; nenhuma mudança comportamental proposta.

## Estado inicial e escopo

- Repositório corrente: C:/LOCAL/jcem/blog; branch dev; origin=https://github.com/sitiojeancarloem/blog.git.
- Merge previamente iniciado: HEAD=21e9cd33c7973849fe9f33bec3088f64c397a5e2; MERGE_HEAD=ae258c8cde7d47ec7e6bb737d1751a5be6ebb62b.
- Fetch concluído: origin/dev coincide com MERGE_HEAD. origin/main=ce1f9e4006b54f01337d029b05166454431415b0.
- Dois conflitos: estado canônico e projeção legada de continue.ia, exclusivamente no registro da FT-101.
- Delta local preservado: TODO.ia.md e assets/data/anexos/anuncios/uber/modelo-adesivo-18x5.cdr.
- Evolução remota: implementação EGW, resiliência, tabelas/TTS, draft e evidências editoriais; preservar bytes integralmente, salvo conciliação do estado.

## Plano e aceite

1. Registrar fonte/FT e resolver estado: conclusão técnica da FT-101 comprovada pelos arquivos recebidos; conservar contexto, dependência e autorização de retomada locais sem reabrir implementação concluída. FT-102 e aceite humano permanecem pendentes.
2. Provar preservação de todo arquivo contra o remoto e do delta local contra HEAD; ausência de conflitos, integridade da projeção e hashes do histórico.
3. Executar gates disponíveis e build conforme dependências locais; registrar limitações reais sem declarar aprovação inexistente.
4. Finalizar merge e fazer push sem force para origin/dev; convergência de main somente com sistema global funcional conforme Norma.

Fluxo reduzido: integração mecânica, sem nova norma ou implementação de recurso. O merge já em andamento impede commit inicial exclusivo sem interromper/reconstruir operação herdada; registro acompanha o merge preservador.
Ferramentas: agent:git-fetch retorna COMMAND_DEGRADED sem executar rede; Git nativo encapsulado por to-ia fornece a operação ausente, sem neutralizar guarda ou autorização. Primeiro fetch foi negado pelo sandbox em .git/FETCH_HEAD; repetição autorizada com escalonamento concluiu.
Fora do escopo: edição editorial, implementação de FTs pendentes, atualização de governança, dependências externas, publicação/deploy do site e qualquer escrita fora desta raiz.

## Resultado técnico e verificações

- Conflitos conciliados em ambos os estados: conclusão técnica remota da FT-101, contexto/dependência e autorização de retomada locais preservados. FT-102 não foi declarada concluída.
- Auditoria comparou todos os arquivos rastreados com MERGE_HEAD: nenhuma diferença além dos estados e do delta local já existente. TODO.ia.md e arquivo CDR têm os mesmos blobs de HEAD; projeções de continue.ia são idênticas. Hash do histórico FT-101 conferido com normalização LF oficial: a4a785b52928cea2f81b45eb646f1ce97e977f65c7ebfc7913b2976947d3911d.
- Ambiente: Windows, Node 24.16.0, Ruby 4.0.5, Bundler 4.0.10; dependências Ruby satisfeitas. Nenhuma dependência instalada.
- Build público isolado aprovado: bundle exec ruby scripts/jekyll_local.rb build --destination .ia.rules/cache/FT-116/site (22,816 s).
- EGW: EGW_SOURCE_VERIFICATION_OK; temporários confinados ao cache desta FT.
- Resiliência: cinco suítes aprovadas, incluindo alternativas finitas, esgotamento, timeout, isolamento e integração real entre processos. Execução via TypeScript/transpileModule CommonJS e Module._compile com identidade original; execução TS direta é incompatível com require nos testes recebidos.
- npm run check com JCEM_SITE_ROOT apontando ao build novo aprovou tipos, HTML, footnotes, matemática, assets, autoria, namespaces, publicação de posts, citações, acessibilidade, tabelas Markdown, referências bíblicas, fala de tabelas, runtime acessível (23 unidades), inline quotes, impressão e desempenho. Interrompeu em SOCIAL_IMAGE_DESATUALIZADA:cover-cover-a92cce47:wide:base; não se declara gate integral aprovado.
- Falha inicial de runtime desapareceu ao usar o build novo; _site versionado antigo não foi reescrito.
- Build --drafts permanece bloqueado por tabela_sem_caption no draft remoto da carta. Draft, plugin e configuração são idênticos ao remoto; a falha não decorre da conciliação Git. Conteúdo editorial não foi alterado.
- Gate documental permanece bloqueado por inventário de modos de uso divergente: cinco guias presentes e teste remoto exige quatro, conforme diagnóstico anterior FT-113. Teste e guias foram preservados.
- Comandos em lote .cmd/.bat exigiram cmd.exe /d /c pelo spawnSync do encapsulador; chamada direta retornou EINVAL. Tentativa de hash bruto de histórico CRLF foi substituída pela normalização LF do mecanismo oficial.
- Derivados de impressão regravados pelo gate são restaurados ao índice preexistente; nenhum artefato de validação integra o commit.
- Exceções cirúrgicas no .gitignore incluem somente fonte e contexto desta FT, fora da região gerenciada.

Estado: integração tecnicamente pronta para commit/push em origin/dev, sem força; validações globais parciais declaradas acima. A confirmação do SHA remoto será entregue no chat. Main permanece fora desta integração porque o sistema global não satisfaz os gates obrigatórios de convergência; nenhum deploy foi solicitado.
Retomada: resolver geração social, legenda editorial e inventário documental em seus próprios escopos antes de alegar aceite global/convergir main. A FT-116 não concede aceite humano às FTs herdadas.
