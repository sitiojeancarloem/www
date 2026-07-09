# AGENTS.md — Governança Operacional Global

## 0. Finalidade, autoridade e portabilidade

Este arquivo normatiza o comportamento operacional da IA/Codex sem alterar instruções intrínsecas da plataforma, atuais ou futuras. Deve ser copiável entre repositórios sem adaptação.

- **Desacoplamento:** proibidos URLs, paths físicos, nomes próprios ou regras exclusivas do repositório.
- **Referências universais:** permitidos conceitos não arbitrários do ecossistema, como `.gitignore`, `AGENTS.md`, `agents.local.md`, `continue.ia`, `continue.dev`, RCF, build, cache, branch, commit e CI/CD, sem localização concreta.
- **Especialidade:** este arquivo governa método de trabalho, raciocínio operacional, cache, FT, codificação, distribuição, transpilação, build e validação; não substitui RCF nem define negócio.
- **Extensão local:** `agents.local.md`, quando existente, é incluído pelo AGENTS global e contém somente particularidades não replicáveis do repositório. Regra, conceito ou refinamento útil a múltiplos projetos pertence ao AGENTS global, nunca ao local.
- **Código de terceiros:** conteúdo importado (`node_modules/` e equivalentes) não deve ser analisado como alvo de manutenção, editado ou programado. Torna-se elegível apenas após incorporação definitiva ao código pertencente ao repositório.

## 1. Domínios normativos e precedência

### 1.1 Separação de matéria

- **AGENTS:** soberano sobre sua governança intrínseca e seus subordinados operacionais diretos; RCF não pode reescrevê-los, convertê-los em regra local nem particularizá-los.
- **RCF:** soberano no escopo do projeto: arquitetura, comportamento, negócio, contratos, requisitos e arquivos especializados correlatos. Pode ser modularizado em vários `.md` para indexação seletiva e menor reprocessamento.
- **Exceção:** arquivos locais criados pelo RCF para regras de negócio submetem-se ao RCF, sem alterar o AGENTS global.
- **Compatibilização:** AGENTS define **como executar**; RCF define **o que o projeto exige**. Aplicar ambos. AGENTS não altera negócio; RCF não altera a identidade operacional do AGENTS.

### 1.2 Ordem aplicável

Após instruções superiores da plataforma, resolver conflitos conforme a matéria:

1. **Governança operacional:** `AGENTS.md` → RCF global → RCF específicos → `README.md` → `continue.ia`/`continue.dev` → demais documentos formais.
2. **Projeto, arquitetura e negócio:** RCF global → RCF específicos → `README.md` → `continue.ia`/`continue.dev` → demais documentos; o AGENTS permanece obrigatório quanto ao método, sem substituir a norma material.
3. **Regra local não replicável:** `agents.local.md`, limitada pelo AGENTS global e pelos RCFs aplicáveis.

Conflitos transversais devem ser resolvidos sem alterar o comportamento do projeto nem o conteúdo intrínseco do AGENTS. Persistindo ambiguidade, aplicar §12.5.

## 2. Edição normativa e densidade textual

Esta seção é a autoridade global para edição de RCFs, AGENTS, `agents.local.md`, `continue.ia`/`continue.dev`, README e documentação análoga; substitui regras editoriais inferiores conflitantes.

### 2.1 Regra de ouro

Maximizar informação por caractere: eliminar redundância, introduções longas, floreios, preenchimento e explicações óbvias; preservar integralmente regras, restrições, exceções, prioridades, precedências, condicionantes, dependências, precisão, profundidade, contexto, rastreabilidade, nuances interpretativas, exemplos, analogias, contraexemplos e referências úteis. **Concisão reduz forma, nunca substância.** Preferir referências internas e microexplicações quando reduzirem tokens sem perda semântica.

### 2.2 Perfis obrigatórios

- `AGENTS.md`, `agents.local.md`, `continue.ia`/`continue.dev` e associados: **90% máquina/IA; 10% humano** — sintaxe diretiva, estrutural e maximamente densa.
- RCFs: **75% máquina/IA; 25% humano** — alta densidade técnica com contexto humano mínimo suficiente.
- README e documentação análoga: **50% máquina/IA; 50% humano** — equilíbrio entre didática e indexação limpa.

### 2.3 Preservação de autoria e rastreabilidade editorial

- Alterações manuais do desenvolvedor não podem regredir.
- Marcação de processamento por IA aplica-se exclusivamente a conteúdo editorial, documentação destinada a consumo humano ou artefato textual de FT com escopo `Negócio`, quando houver geração ou transformação semântica.
- Não aplicar marcadores de IA a `AGENTS.md`, `agents.local.md`, RCFs, `continue.ia`/`continue.dev`, código, configurações, manifestos, workflows ou artefatos técnicos/normativos análogos, salvo exigência explícita do RCF aplicável.
- Correções exclusivamente ortográficas, gramaticais, tipográficas, de links ou metadados não exigem marcação.
- O cenário ou RCF aplicável define formato, granularidade e persistência da marcação; ela deve ser invisível ao leitor, pesquisável por automação e incapaz de alterar conteúdo renderizado, build ou publicação.
- Cabeçalhos, comentários úteis e convenções existentes devem ser preservados. Comentário só muda se ficar incorreto ou induzir interpretação errada.

## 3. Mapa de arquivos, leitura e cache

Manter em contexto um mapa estrutural ultra-sucinto dos **arquivos úteis**: somente fontes, normas, configurações e artefatos necessários ao desenvolvimento e à retomada.

- Excluir do mapa builds, transpilações, compilações, testes intermediários, temporários, lixo e artefatos sem valor histórico.
- Avaliar arquivos novos/modificados para distinguir alterações manuais e atualizar o mapa quando úteis.
- Ler fisicamente apenas arquivo indispensável ausente do contexto ou divergente da versão física.
- Em contexto parcial, processar somente faltantes/modificados necessários.
- Não reler, reanalisar ou reexecutar norma, arquivo, comando, tentativa, verificação, planejamento ou raciocínio já suficiente, salvo mudança observável, nova evidência, decurso relevante, atualização de versão ou ganho concreto esperado.
- Persistir no contexto disponível: AGENTS, RCFs, FTs, decisões, arquivos já analisados, alterações, comandos falhos e resultados. `continue.ia`/`continue.dev` é a memória durável; o cache da IA é complementar, nunca substituto.
- Otimização não autoriza superficialidade: quando o contexto for insuficiente, executar toda leitura, análise e validação necessárias para maximizar eficiência, desempenho, acerto, segurança e aderência, buscando erro nulo.

## 4. Modelo de execução orientado por estado

Ciclo obrigatório:

`Solicitação → intenção → FT → planejamento/atualização → execução incremental → atualização contínua do continue → validação → commit → push → próxima etapa`

Antes de implementar:

1. identificar intenção, contexto e objetivos;
2. localizar a FT correspondente no `continue.ia`/`continue.dev`;
3. classificá-la como continuação, ampliação, dependência ou nova FT;
4. identificar etapa e tarefa atuais;
5. atualizar o planejamento quando necessário;
6. executar exatamente do estado registrado.

Não reiniciar análise, verificação ou planejamento concluído sem justificativa técnica objetiva. Concluir integralmente as pendências da FT correspondente antes de iniciar implementação posterior incompatível com ela.

## 5. Frentes de Trabalho (FT)

Toda solicitação pertence a exatamente uma FT; várias FTs podem coexistir.

### 5.1 Estrutura mínima

Cada FT deve conter:

- `id` permanente e imutável (`FT-001`, `FT-002`...);
- nome descritivo, evolutivo quando representar melhor o objetivo;
- objetivo sucinto, evolutivo quando representar melhor o contexto;
- prioridade e status;
- escopo `Técnico` ou `Negócio`;
- início, última atualização e conclusão em timestamp;
- planejamento integral de etapas e tarefas;
- estado de interrupção/retomada, quando aplicável.

Uma FT contém uma ou mais etapas; cada etapa, uma ou mais tarefas. Só conclui quando todas as etapas planejadas estiverem concluídas.

### 5.2 Escopo universal

1. **Técnico — estrutura/mecanismo (The Engine):** construir, programar, projetar, corrigir ou estruturar ferramenta, lógica ou sistema. Objetivo: fazer a engrenagem funcionar. Exemplos: software, cálculo estrutural, planilha automatizada, roteador, blueprint mecânico.
2. **Negócio — conteúdo/substância (The Substance):** preencher, comunicar, pesquisar ou produzir o material que trafega na estrutura. Objetivo: gerar informação/mensagem final. Exemplos: artigo, pesquisa histórica, relatório de vendas, roteiro, campanha.

### 5.3 Segregação

Quando reduzir contexto e processamento, cada FT pode residir em subarquivo próprio, dentro de subdiretório claramente nomeado na raiz. Esses arquivos devem permanecer versionados; se padrões do `.gitignore` os alcançarem, usar exceção explícita (`!`) para impedir exclusão acidental.

## 6. Planejamento, etapas e tarefas

### 6.1 Planejamento

Criar o planejamento inicial antes da implementação. Cada etapa deve registrar nome, posição `X/N`, objetivo sucinto e dependências técnicas existentes. Exemplo ilustrativo:

```text
FT-003 — Centralização das Configurações
1/8 Levantamento
2/8 Estrutura JSON
3/8 Migração das Validações
4/8 Atualização da UI
5/8 Ajustes do Build
6/8 Testes
7/8 Documentação
8/8 Validação Final
```

O planejamento é dinâmico e pode ser expandido, reduzido, reorganizado, renumerado, dividido ou consolidado; toda mudança deve ser imediatamente refletida no `continue.ia`/`continue.dev`. Manter sempre a lista prevista de etapas e tarefas. Itens concluídos não podem ser eliminados enquanto a FT estiver ativa.

Após a conclusão:

- resumir o registro integral com compressão médio-agressiva, sem omissão material;
- manter o histórico por **exatamente 15 dias**;
- remover integralmente FTs concluídas há mais de 15 dias.

### 6.2 Etapas

Toda implementação relevante deve ser dividida em etapas pequenas, independentes, verificáveis e ajustadas ao contexto.

Cada etapa:

- pertence obrigatoriamente a uma FT;
- possui nome e posição `X/N`;
- discrimina todas as tarefas previstas;
- termina em estado funcional: sistema executável e consistente, ainda que não implemente toda a FT ou todo o RCF.

### 6.3 Tarefas

Tarefa é a granularidade mínima de execução e retomada. Cada tarefa:

- pertence a uma etapa de uma FT;
- possui nome e posição `X/N`;
- deve ser prevista e discriminada;
- preferencialmente deixa estado funcional, sem obrigatoriedade equivalente à etapa.

### 6.4 Conclusão incremental

Ao concluir tarefa ou etapa:

1. validar consistência e impacto;
2. atualizar imediatamente o `continue.ia`/`continue.dev`;
3. aplicar commit conforme RCF; na ausência de regra completa, usar PT-BR, até 512 caracteres, distinguindo `fix`, melhoria/aprimoramento e ajuste;
4. executar commit e push imediatamente, quando tecnicamente possível;
5. só então iniciar o próximo item.

Regras adicionais:

- Não acumular várias etapas antes do commit.
- Commit de etapa deve representar estado funcional.
- Tarefa pequena/sutil — inclusive múltiplos ajustes mínimos de texto/posição — pode dispensar validação, commit e push próprios e ser consolidada na conclusão da etapa, quando isso reduzir custo sem afetar rastreabilidade.
- Alteração moderada exige no mínimo 2 commits; agressiva, 4, sem substituir commits obrigatórios por etapa.

## 7. `continue.ia` / `continue.dev`: memória operacional oficial

No repositório deve existir **exatamente um** arquivo canônico: `continue.ia` ou `continue.dev`; referências legadas a `continua.ia` designam o mesmo conceito e devem convergir ao nome canônico adotado. O arquivo complementa, sem eliminar, a memória contextual da IA.

### 7.1 Formato

Deve ser rastreável, indexável, legível por humanos/máquinas/IAs e segregável em conjuntos/subconjuntos. Aceitos: sintaxe própria, YAML, JSON ou formato equivalente. Evitar XML por ineficiência, salvo justificativa técnica. Compatibilidade com IDEs que leiam Continue/continue.dev é desejável, não obrigatória. Aplicar o perfil editorial 90/10.

### 7.2 Objetivos

- retomada praticamente exata após interrupção;
- mínimo reprocessamento e repetição;
- preservação de decisões, verificações e falhas;
- redução de processamento sem perda de qualidade.

### 7.3 Registro mínimo por FT

Registrar separadamente:

- id, nome, escopo, objetivo, prioridade e status;
- timestamps de início, última atualização e conclusão;
- etapa atual `X/N` e nome;
- lista integral de etapas;
- tarefas planejadas, atual/em execução e concluídas;
- progresso parcial e próximo ponto executável;
- linha de raciocínio adotada em forma objetiva e retomável;
- decisões arquiteturais;
- verificações concluídas;
- comandos relevantes;
- pendências, limitações e dependências;
- hipóteses descartadas;
- causas objetivas de falhas;
- decisões antirretrabalho.

Nunca registrar somente `3/12`. Registrar, no mínimo:

```text
FT-00X — <nome>
Etapa X/N — <nome>
Tarefa Y/M — <nome>
```

### 7.4 Atualização contínua

Atualizar durante toda a execução, não apenas ao concluir etapa/tarefa, incluindo:

- conclusão de tarefa ou etapa;
- evolução do planejamento;
- decisão relevante;
- hipótese descartada;
- verificação que elimina possibilidades;
- falha, causa e solução;
- qualquer dado que permita retomada sem reprocessamento.

### 7.5 Aprendizado de ambiente

Manter base concisa e dinâmica de problemas, tentativas, soluções e ajustes:

- `MACHINE_ID`: vincular cada registro à máquina/sistema. Tratar falha como local por padrão; classificá-la global somente com evidência de recorrência em múltiplas máquinas.
- `DATA_REF`: última atualização obrigatória em `YYYYMMDDHHMM`, permitindo expurgo de registros obsoletos.
- `CACHE`: manter no contexto quando disponível; reprocessar integralmente apenas após atualização da base ou quando um subarquivo dedicado exigir recarga.
- Bloquear repetição de ação historicamente falha/insuficiente. Retentar somente após decurso significativo, alteração documentada do ambiente, nova evidência ou atualização de versão.

## 8. Interrupção e retomada

Ao detectar iminente esgotamento de tempo, créditos, contexto ou trava de custo computacional:

1. interromper controladamente;
2. salvar no arquivo canônico todo progresso real, estado, decisões, histórico e pendências imediatas;
3. anexar ao id da tarefa atual a flag `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]` e resumo ultra-sucinto do próximo passo.

Na interação subsequente, antes de implementar:

1. procurar a flag;
2. carregar o estado e validar alterações manuais ocorridas durante a pausa;
3. se a nova solicitação equivaler a continuar, retomar imediatamente; caso contrário, apresentar resumo mínimo do ponto de parada e solicitar decisão de retomada;
4. remover a flag somente após retomada bem-sucedida.

Sem flag, localizar FT, etapa e tarefa correspondentes e continuar exatamente do registro. Nova FT deve ser registrada com objetivo, planejamento, etapas e tarefas previstas antes da execução. Mudança significativa de escopo exige reorganização e registro objetivos.

## 9. Branches, commits, push e merge

- Todo desenvolvimento ocorre no branch `dev`.
- Ao concluir uma FT, realizar merge em `main` ou `master` somente se o sistema global estiver funcional; considerar outras FTs em andamento cujo estado torne o merge inseguro.
- Antes de alterar, verificar branch e working tree.

Se o branch atual não for `dev` e houver alterações unstaged, parar e solicitar escolha explícita, ignorando qualquer opção da IDE que dispense a pergunta:

1. alternar para `dev`, preservando seu conteúdo original;
2. criar/atualizar `dev` a partir do último commit de `main`/`master`;
3. alternar para `dev`, levando o estado atual e mesclando-o;
4. continuar no branch atual.

Quando tecnicamente possível, cada tarefa e, obrigatoriamente com maior prioridade, cada etapa terminam em commit seguido de push. Não declarar commit/push/merge sem comprovação objetiva. Quando o cenário aplicável normatizar interface npm, criar e reutilizar os comandos Git obrigatórios desse cenário para automatizar a sequência e reduzir comandos, erros, tempo e processamento da IA.

## 10. Implementação, regressão e sincronização

Nenhuma implementação pode regredir:

- arquitetura, negócio, UX ou API pública;
- build, cache, desempenho ou compatibilidade;
- CI/CD, GitHub Actions, GitHub Pages, publicação, workflows e pipelines;
- bundles offline;
- `_site`, `dist/` ou diretório equivalente de produto final.

Objetivo permanente: melhorar e evoluir. Regressão só é admissível mediante solicitação explícita do desenvolvedor; confirmar expressamente para eliminar possível incompreensão.

Sempre que arquitetura, regras, comportamento, build, fluxo, UX, UI, operadores, notações, recursos ou documentação mudarem, sincronizar automaticamente, conforme aplicabilidade:

- `AGENTS.md` e `agents.local.md`;
- README;
- RCFs pertinentes;
- `continue.ia`/`continue.dev`;
- implementação e UI afetadas.

## 11. Build, runtime e produto final

### 11.1 Restrições gerais

Proibido:

- alterar negócio sem autorização normativa;
- introduzir regressão;
- duplicar código;
- adicionar dependência desnecessária;
- aumentar complexidade sem benefício técnico;
- realizar refatoração ampla, reorganização gratuita ou mudança comportamental não solicitada.

Manter, quando aplicável e conforme RCF: ES2020+ ou versão definida, GitHub Pages, GitHub Actions, bundles offline, workflows, pipelines e diretório final (`_site`, `dist/` ou equivalente).

Priorizar: menor build, instalação, download, consumo, latência e tempo de carregamento; maior autonomia do produto final; evolução contínua do RCF sem perda de princípios.

### 11.2 Segregação runtime/build

O diretório final deve ser autônomo e conter somente artefatos/assets finais, scripts necessários e dependências indispensáveis ao runtime. Nada usado exclusivamente em desenvolvimento, build, transpilação, bundling, minificação, otimização, geração de assets, documentação, lint, testes ou automação pode integrá-lo nem ser instalado nele.

Sempre que tecnicamente possível, incorporar ao artefato final os recursos resolvidos na compilação, eliminando dependência de runtime e materializando somente partes usadas. Exemplo: se apenas alguns SVGs, ícones, fontes, CSS, componentes ou templates da Font Awesome forem usados, incorporar somente esses itens; não incluir a biblioteca integral nem mantê-la em runtime quando o build absorveu sua função. Aplicar o mesmo princípio a toda biblioteca/framework, preservando funcionalidade.

### 11.3 CDN

O RCF decide sobre CDN. Em silêncio ou incongruência:

- produto deliberadamente online: CDN é padrão quando a URL compartilhada puder aproveitar cache do navegador;
- preferir incorporação local parcial/customizada quando reduzir tamanho, latência ou banda;
- bundle offline: manter todos os recursos necessários localmente e evitar rede por definição;
- bundle não é necessariamente offline; o RCF deve explicitar a finalidade quando a decisão não for inequívoca.

## 12. Padrões de implementação

### 12.1 Análise

- Idioma obrigatório: PT-BR.
- Antes de alterar: detectar falhas, prevenir regressões, validar impacto e entregar solução final.
- Não apresentar hipótese como conclusão sem validação.
- Aplicar rigor, minúcia, melhores práticas e codificação defensiva contra bugs/falhas previsíveis.

### 12.2 Alteração

Objetivo: diff mínimo.

Preservar estrutura, fluxo, comentários úteis, contratos, convenções e compatibilidade. Permitida somente refatoração cirúrgica: localizada, mesmo objetivo e mesmo contrato. Documentar motivo, objetivo, impacto e validação. Após estabilização, manter apenas comentários necessários.

### 12.3 Bugs e proteções

Código aparentemente redundante pode conter correção não documentada. Na dúvida, preservar e marcar:

```text
// PRESERVADO: potencial correção de bug não documentada
```

Correção/prevenção nova deve usar, em uma linha salvo necessidade estrita:

```text
// FIX-BUG: <descrição mínima>
// PROTECAO: <descrição mínima>
```

Não remover sem análise: `catch` vazio, tratamento de erro ou validação existente.

### 12.4 Estilo

- Proibidos pronomes autorreferenciais/interlocutórios: “eu”, “você”, “nós”.
- Evitar “talvez”, “pode ser”, “provavelmente” e adjetivos subjetivos.
- Priorizar declarações determinísticas, baixa redundância, baixo acoplamento e baixo custo cognitivo.

### 12.5 Ambiguidade

Aplicar a interpretação mais restritiva, de menor alteração e maior preservação. Em conflito interno, prevalece a regra que menos altera comportamento. Se insolúvel, registrar exatamente:

```text
AMBIGUIDADE INSOLUVEL: <ponto>. Preservando original.
```

## 13. Validação

Comprovar objetivamente, conforme finalidade e RCF:

- ausência de regressões;
- produto final autônomo;
- presença exclusiva de dependências de runtime no diretório final;
- ausência de dependências de desenvolvimento no produto final;
- preservação de comportamento após incorporação de recursos no build;
- independência dos bundles;
- funcionamento de GitHub Pages, Actions, publicação, workflows e pipelines;
- reprodutibilidade do build;
- redução do tamanho final sempre que tecnicamente possível;
- funcionamento dos critérios específicos previstos pelo RCF, inclusive exemplos como links de ajuda, painel retrátil sem JavaScript, validações centralizadas e hierarquia `Global → Sessão → Execução`, quando existentes.

## 14. Documentação e RCF

Os RCFs pertinentes devem normatizar, quando aplicável:

- segregação runtime/build;
- proibição de dependência de desenvolvimento no produto final, salvo justificativa técnica explícita;
- centralização das regras de validação em arquivo único;
- hierarquia de configuração `Global → Sessão → Execução`;
- gestão de implementações por FT no arquivo canônico;
- atualização contínua da memória operacional, inclusive ao concluir tarefas;
- sincronização entre implementação, UI, documentação, AGENTS e RCF quando arquitetura, operadores, notações, recursos ou fluxos mudarem.

## 15. “Implementações em andamento”

Manter na raiz um `.md` gerado automaticamente do `continue.ia`/`continue.dev` por script NPM, nunca editado manualmente, e linkado diretamente no README. Finalidade exclusiva: resumo visual ultra-sucinto das FTs em andamento; por padrão, omitir FTs de escopo `Negócio`, salvo regra diversa do RCF.

### 15.1 Conteúdo

- texto introdutório curto antes da listagem;
- subtítulo próprio por FT;
- objetivo resumido;
- escopo, quando o RCF determinar sua exibição;
- nenhuma informação alheia ao progresso.

### 15.2 Tabela

Usar HTML, não tabela Markdown, para permitir `rowspan`/`colspan`:

- uma linha por etapa, com nome;
- tarefas vinculadas, individualizadas por nome;
- status de etapa e tarefa limitado a `pendente`, `em andamento` ou `concluído`;
- ícone/emoji com cor correspondente e mapeamento único definido pelo gerador;
- dentro da tabela, somente nome da etapa, nome da tarefa e ícone de status.

O detalhamento da memória operacional não pode ser reproduzido nesse arquivo.

## 17. Cenários

Cenário é especialização normativa reutilizável aplicável somente ao tipo de projeto, repositório, entrega ou contexto correspondente. A lista é aberta, cumulativa e não exaustiva; novos cenários podem ser adicionados sem alterar a governança global, desde que preservem portabilidade, não dupliquem normas existentes e declarem escopo, contratos, exceções e validações.

O AGENTS permanece agnóstico ao projeto. É proibido incorporar URL concreta, URI local, caminho específico, módulo exclusivo, página própria, workflow particular, valor visual arbitrário, limite editorial local, nome de artefato contextual ou decisão arquitetural exclusiva de um repositório.

Tecnologias, bibliotecas, plataformas, formatos e ferramentas amplamente difundidos podem aparecer como exemplos, alternativas ou preferências técnicas. Não são obrigatórios, não sobrepõem o RCF e devem ser substituídos quando solução comprovadamente superior atender melhor desempenho, arquitetura, segurança, manutenção, acessibilidade, privacidade ou compatibilidade.

Excepcionalmente, cada cenário pode estabelecer convenções operacionais reutilizáveis — comandos, grupos de comandos, nomenclatura, parâmetros, portas padrão, capacidades e contratos públicos — quando isso favorecer uniformidade entre projetos da mesma categoria. Essas convenções:

1. devem ser independentes de repositório;
2. aplicam-se somente ao cenário;
3. subordinam-se ao RCF;
4. não impedem equivalência técnica ou solução superior;
5. não autorizam paths, URLs, módulos ou valores exclusivos de projeto.

### 17.1 Diretrizes gerais dos cenários

#### 17.1.1 Finalidade, alcance e extensibilidade

Aplicar as diretrizes do cenário quando técnica e semanticamente pertinentes, sem substituir, contrariar ou enfraquecer normas superiores, RCF, requisitos específicos, plataforma, ambiente ou contrato de distribuição.

Cenários podem coexistir e aplicam-se cumulativamente. Regra específica restringe ou especializa regra geral somente quando:

1. estiver em seu escopo declarado;
2. for tecnicamente justificada;
3. não contradizer norma superior;
4. preservar o objetivo original sempre que possível.

Dispensa exige incompatibilidade real, irrelevância ou custo desproporcional verificável; preferência ou conveniência não bastam.

Novo cenário deve declarar: finalidade, aplicabilidade, limites, relação cumulativa, dependências, contratos públicos, artefatos conceituais afetados, regras, exceções, precedência local, segurança, privacidade, acessibilidade, desempenho, compatibilidade, validações e conclusão. Particularidade não replicável pertence ao RCF ou extensão local.

#### 17.1.2 Precedência e contradições

Aplicar §1.2. No mesmo nível, regra específica prevalece sobre geral somente em seu escopo. Contradição material deve ser registrada:

```text
CONTRADIÇÃO DETECTADA: <origem> vs <regra> — Aplicando a regra de maior precedência.
```

#### 17.1.3 Objetivos normativos

Toda decisão de cenário deve, conforme aplicável:

1. preservar conformidade;
2. maximizar reutilização e generalização sem apagar requisitos reais;
3. reduzir interfaces, comandos e fluxos distintos;
4. eliminar duplicidade funcional;
5. privilegiar composição;
6. reduzir decisões recorrentes e processamento humano, automático e por IA;
7. reduzir tokens e contexto;
8. permitir evolução tecnológica sem quebra desnecessária de interface;
9. preservar acessibilidade, segurança, privacidade, desempenho e manutenção.

Simplificação não pode remover capacidade obrigatória, ocultar erro, reduzir rastreabilidade ou concentrar responsabilidades incompatíveis.

#### 17.1.4 Ordem de generalização

Antes de criar interface, comando, componente, biblioteca, workflow ou convenção:

1. reutilizar solução universal existente;
2. reutilizar solução do grupo funcional;
3. compor soluções existentes;
4. especializar por configuração ou parâmetro;
5. criar nova solução somente quando as anteriores forem insuficientes.

É vedado refletir tecnologia interna em nova interface quando a semântica pública permanecer igual. Exemplos inadequados, havendo equivalentes universais:

```text
vite-dev
react-build
jekyll-build
publish-react
```

#### 17.1.5 Interface pública estável

Toda interface exposta a pessoas, automações, CI/CD ou IA é API pública: nomenclatura semântica, previsível e estável; implementação interna variável; incompatibilidade somente por necessidade técnica real, com justificativa, documentação e transição compatível quando viável.

```text
Hoje:   build → ferramenta A
Amanhã: build → ferramenta B
```

A intenção pública permanece; o mecanismo é interno.

#### 17.1.6 Composição e não duplicação

Fluxos compostos reutilizam operações existentes:

```text
release → clean → check → build → publish
```

Podem coordenar, parametrizar e tratar falhas; não podem copiar lógica nem manter implementações divergentes.

#### 17.1.7 Escolha tecnológica, preferências e proporcionalidade

Não adotar tecnologia por preferência, popularidade ou mera possibilidade. Avaliar requisito, arquitetura, hospedagem, publicação, desenvolvimento local, CI/CD, custo operacional/cognitivo, manutenção, segurança, privacidade, acessibilidade, peso ao cliente, degradação segura e alternativa nativa/local.

Preferir a solução mais simples que cumpra integralmente o contrato. Avaliar solução madura antes de implementação própria; não adicionar dependência quando solução local pequena, testável e menos arriscada cumprir o mesmo contrato. Não duplicar bibliotecas equivalentes.

Cenário pode indicar biblioteca, pacote ou ferramenta preferencial para padronização, qualidade ou desempenho, desde que:

- seja amplamente reutilizável;
- permaneça preferência, não obrigação absoluta;
- não sobreponha RCF;
- não dispense análise técnica;
- seja substituída quando alternativa comprovadamente superior atender melhor o contexto.

#### 17.1.8 Processos existentes e validação local

Antes de iniciar servidor, watcher ou processo, verificar instância adequada em execução. Não encerrar, reiniciar ou substituir processo existente sem necessidade técnica ou autorização, especialmente se puder pertencer a outra atividade. Preferir ambiente ativo e registrar limitações frente à produção.

#### 17.1.9 Correções textuais incidentais

Ao alterar texto no escopo autorizado, corrigir erros ortográficos, gramaticais e tipográficos apenas na região modificada, sem reescrita extrínseca, alteração semântica não solicitada ou perda de terminologia/voz. Informar arquivos corrigidos, natureza da correção e eventual reorganização ou mudança semântica.

### 17.2 Cenário Específicos

### 17.3 Web Page Like com gerador estático ou hospedagem de páginas

#### 17.3.1 Aplicabilidade

Complementa §17.2 quando houver gerador estático, templates ou hospedagem de páginas. Jekyll e GitHub Pages são exemplos, não requisitos.

Aplicar somente quando compatível com a plataforma; não contrariar diretrizes gerais, cenário Web ou restrições de hospedagem.

#### 17.3.2 Toolchain e compatibilidade

Antes de introduzir ou alterar bundler, framework ou runtime, validar:

- compatibilidade com gerador, tema e hospedagem;
- custo operacional;
- impacto no build remoto;
- links, base paths e assets;
- configuração adicional;
- benefício frente à solução nativa.

Em projeto predominantemente estático, preferir templates nativos, estilos compiláveis, código cliente estático e ausência de bundler quando suficiente. Bundler pode ser preferido quando demonstrar vantagem arquitetural e redução de complexidade total.

#### 17.3.3 Dependências do gerador

Manter dependências em manifestos e locks próprios do ecossistema. Ambientes local e remoto devem usar versões compatíveis. Respeitar plugins, versões e limitações suportadas. Plugin incompatível exige pipeline alternativo controlado ou não deve ser adotado.

#### 17.3.4 Página de erro em hospedagem estática

Quando a plataforma exigir artefato de erro em localização convencional:

- produzir o artefato no local exigido pela plataforma;
- usar formato estático puro quando necessário;
- herdar estilos por configuração resolvida;
- evitar cópia integral de recursos globais;
- usar recursos locais mínimos;
- permitir fonte parcial quando isso reduzir risco;
- refletir fragmentos compartilhados;
- não depender de recurso que a rota de erro possa não carregar.

Conteúdo dinâmico auxiliar, quando permitido, deve iniciar após o conteúdo essencial, usar criação segura de DOM, não bloquear a página e falhar controladamente.

#### 17.3.5 Sincronização de fallback

Quando houver fragmento compartilhado para fallback sem script, sua fonte deve ser componente, include, partial ou equivalente claramente definido. Artefatos gerados devem receber automaticamente o mesmo conteúdo e estilo quando possível. Não depender de cópia manual recorrente.

### 17.4 Sites e blogs com conteúdo editorial

#### 17.4.1 Aplicabilidade

Complementa os cenários anteriores para projetos que publiquem artigos, posts, sermões, ensaios, notícias ou conteúdo editorial equivalente. Não se aplica a páginas sem relação editorial.

#### 17.4.2 Conteúdo agendado

Pode existir área separada para conteúdo concluído aguardando publicação. Nome e localização pertencem ao RCF.

Distinguir inequivocamente:

- rascunho;
- conteúdo aprovado/agendado;
- conteúdo publicado.

Conteúdo agendado:

- não aparece no build público padrão;
- não é acessível antes da data;
- retorna indisponibilidade apropriada;
- permanece isolado até publicação;
- possui data futura verificável em metadado ou convenção.

A data determina elegibilidade e migração.

#### 17.4.3 Publicação agendada

Quando houver agendamento, manter automação com cadência suficiente para cumprir a data sem exposição antecipada. Horário, frequência e zona pertencem ao RCF.

O fluxo deve:

1. verificar conteúdo agendado;
2. identificar elegíveis ainda não publicados;
3. preparar;
4. compilar;
5. atualizar saída pública;
6. publicar;
7. validar disponibilidade;
8. registrar estado final.

Usar permissões mínimas e proteção adequada. Ferramentas de CI/CD concretas são alternativas, não obrigações.

#### 17.4.4 Publicação e distribuição

Distribuição externa somente inicia após compilação, publicação e validação de disponibilidade. Falha anterior bloqueia as etapas dependentes sem estado parcial silencioso. Workflow dependente exige estado final conhecido e dados necessários.

#### 17.4.5 Distribuição social

Quando adotada, executar somente para nova publicação elegível. Cada plataforma configurada deve possuir tratamento próprio.

Prioridade:

1. solução aberta madura e compatível;
2. método oficial;
3. integração previamente configurada;
4. fallback controlado.

Publicar, conforme disponibilidade: título, resumo, imagem, marcadores temáticos e link canônico.

Cada integração deve possuir configuração, segredos isolados, erro específico, idempotência, tentativas limitadas, recuperação, fallback e registro final.

Proibidos: travamento indefinido, repetição ilimitada, encerramento sem registro, duplicação e wrapper desnecessário.

Plataformas concretas pertencem ao RCF.

#### 17.4.6 Listagens editoriais

Grades, colunas e cards devem respeitar a largura disponível. Títulos, excertos e metadados não podem impor largura indevida nem overflow e devem ser validados na menor viewport suportada.

Quantidades máximas por página, relacionados e recentes pertencem ao RCF; devem ser limitadas, parametrizáveis e proporcionais ao layout.

Relacionados:

- usar título localizado;
- não repetir o conteúdo atual;
- respeitar limite configurado.

Recentes:

- usar título localizado;
- carregar quantidade configurada por fonte interna;
- iniciar após conteúdo essencial;
- reutilizar componentes existentes;
- criar DOM com segurança;
- não depender de armazenamento para conteúdo essencial;
- falhar sem prejudicar leitura.

#### 17.4.7 Autores

Conteúdo pode declarar lista ordenada de autores por metadados. Cada autor válido deve possuir identificação e biografia; link e imagem são opcionais.

Não renderizar entrada incompleta nem bloco sem autor válido. Na ausência de imagem, usar fallback local ou apresentação sem imagem.

A composição deve:

- distinguir autoria principal quando editorialmente aplicável;
- apresentar autores adicionais responsivamente;
- aumentar densidade quando a quantidade exigir;
- usar semântica de pessoa compatível;
- não exigir migração artificial de conteúdo antigo.

Nomes de campos, schema e layout pertencem ao RCF.

#### 17.4.8 Formatação de artigos

Aplica-se ao corpo editorial, não à navegação, cabeçalho, rodapé, metadados, embeds ou componentes externos.

Quando houver indentação de primeira linha:

- usar token editorial definido;
- aplicar por estilos, nunca espaços manuais;
- excluir títulos, listas, tabelas, imagens, legendas, notas, blockquotes e painéis equivalentes.

Em citações:

- não tornar todo o bloco itálico por padrão;
- permitir itálico semântico em subcitação;
- separar referência visualmente;
- usar sinal tipográfico adequado;
- manter referência menos proeminente;
- contextualizar autor somente com base segura.

No texto comum, não aplicar itálico automático; preservar uso semântico/autoral. Marcadores de nota devem permanecer compactos e proporcionais.

Valores concretos de indentação, escala e espaçamento pertencem ao design editorial.

#### 17.4.9 Preservação autoral

Em revisão, reorganização, melhoria, ajuste semântico ou reescrita, preservar:

- estilo;
- vocabulário;
- ritmo;
- argumentação;
- estrutura de raciocínio;
- pontuação;
- pausas intencionais;
- características literárias;
- recursos retóricos.

Proibido padronizar artificialmente a voz, homogeneizar autores, substituir identidade por formulação genérica ou corrigir peculiaridade intencional como erro.

Considerar parágrafo, seção, obra e contexto editorial. Prioridade:

1. identidade;
2. intenção;
3. correção de problemas reais;
4. clareza;
5. organização sem descaracterização.

#### 17.4.10 Rastreabilidade por IA

Conforme §2.3, trecho editorial ou de FT `Negócio` transformado semanticamente por IA deve receber marcação persistente.

A marcação deve:

- permanecer na fonte;
- sobreviver a rebuilds;
- ser invisível ao leitor;
- não alterar renderização;
- ser legível por automação;
- identificar a menor região processada.

Aplica-se a reescrita, reorganização, expansão, resumo, simplificação, ajuste semântico, adaptação de estilo e geração parcial/integral. Dispensa correções exclusivamente ortográficas, gramaticais, tipográficas, de links ou metadados.

Formato concreto pertence ao RCF ou fluxo editorial; comentário invisível ou metadado estruturado são alternativas.

#### 17.4.11 Referência de estilo

Ao inferir estilo, priorizar:

1. conteúdo original não processado;
2. rascunhos originais;
3. publicações originais;
4. conteúdo apenas corrigido mecanicamente;
5. conteúdo processado por IA.

Observar vocabulário, argumentação, estilo literário/técnico, pontuação, transições, ritmo e ênfase. Conteúdo assistido serve somente como contexto complementar.

#### 17.4.12 Rigor e verificabilidade

Exceto reflexão pessoal, testemunho, opinião, narrativa literária ou poesia explicitamente classificados, conteúdo deve buscar rigor documental.

Referenciar, quando houver fonte adequada:

- fatos;
- história;
- estatísticas;
- estudos;
- argumentos técnicos;
- citações;
- traduções não triviais;
- afirmações controversas.

Fontes devem ser válidas, verificáveis, confiáveis, rastreáveis e proporcionais. Referência não substitui avaliação crítica.

#### 17.4.13 Citações imediatas

Conteúdo técnico, acadêmico ou homilético deve, quando aplicável, seguir:

```text
Afirmação → referência correspondente
```

Inserir referência próxima da alegação. Evitar concentração exclusiva ao final, afirmação relevante sem fonte disponível, referência distante para alegações heterogêneas e fonte que não sustente o texto.

Sistemas conhecidos de referência podem inspirar a UX, sem impor plataforma ou dependência específica.

#### 17.4.14 Notas de rodapé

Oferecer suporte por mecanismo nativo ou amplamente adotado, compatível com gerador e hospedagem.

Evitar implementação manual repetitiva, pipeline incompatível, identificadores instáveis e navegação sem retorno.

Cada chamada deve apontar à nota, permitir retorno, ser acessível por teclado e previsível em dispositivos suportados. Resumo em foco/hover é opcional.

#### 17.4.15 Bibliografia e referências

Conteúdo com fontes deve suportar Referências e, quando aplicável, Bibliografia. Gerar a partir de notas e metadados quando isso reduzir duplicação.

Adotar padrão definido pelo RCF, instituição, publicação ou contexto regional; padrões como ABNT são exemplos, não fallback universal obrigatório.

Ferramentas devem ser compatíveis, maduras, mantidas, acessíveis e capazes de degradar sem invalidar o conteúdo.

#### 17.4.16 Privacidade e armazenamento

Conteúdo essencial, páginas de erro, listagens e fallbacks não podem depender de cookies ou armazenamento persistente. Consentimento, analytics e integrações somente são carregados quando exigidos e compatíveis com a política de privacidade. Em fallback e erro, recursos dependentes devem ser omitidos, desativados ou silenciados.

#### 17.4.17 Critérios de conclusão

Alteração editorial somente conclui quando, conforme aplicável:

- conteúdo estiver compilado ou publicado corretamente;
- links e referências forem válidos;
- listagens não causarem overflow;
- fallback sem script estiver legível;
- página de erro permanecer útil após falha auxiliar;
- automações produzirem estado final conhecido;
- marcações de IA estiverem nas regiões semanticamente processadas;
- correções textuais estiverem relatadas;
- normas superiores, cenários e RCF estiverem validados.

````

```markdown
## 18. Saída final

Toda entrega deve incluir:

```text
COMMIT_SUGERIDO: <mensagem PT-BR concisa, objetiva e compatível com o limite da plataforma/RCF; distinguir correção, melhoria e ajuste quando aplicável>
PENDENCIAS: <etapas, tarefas ou pendências restantes; usar “nenhuma” quando concluído>
````

A saída não pode declarar ação não comprovada. Limites concretos de tamanho, formato adicional ou convenção de commit pertencem ao RCF, plataforma ou cenário aplicável.
