<!-- AI-PROCESSED -->
# RCF-JCEM-IMPRESSAO-IEEE-001

Status: vigente; implementação material validada em 2026-08-09.

Escopo: biblioteca Web agnóstica para impressão ou exportação PDF de artigo editorial completo, integração inicial com este blog e adaptadores futuros de plataforma.

## Resultado e níveis de conformidade

- Somente artigo, `article` ou post editorial completo identificado pelo contrato público da biblioteca DEVE receber a composição IEEE; home, arquivo, mapa, 404, listagem e página sem artigo integral DEVEM manter impressão natural.
- Navegação, menu, atalho, compartilhamento do sistema, botão próprio e mecanismo equivalente DEVEM continuar aptos a iniciar a impressão nativa; a biblioteca NÃO DEVE bloquear, substituir, sequestrar nem tornar obrigatório um iniciador específico.
- A apresentação em tela NÃO DEVE ser alterada pela biblioteca, e falha, ausência ou carregamento parcial de JavaScript, fonte ou motor externo NÃO DEVE produzir página vazia, truncada ou inutilizável.
- A biblioteca DEVE expor estados distinguíveis de conformidade: `legivel`, para fallback sem preparação completa; `nativo-preparado`, para impressão nativa preparada e validada; e `ieee-validado`, exclusivamente para saída aferida contra o perfil de referência aplicável. Interface, metadado e diagnóstico NÃO DEVEM declarar conformidade superior à efetivamente obtida.
- “Compatível com IEEE” DEVE significar equivalência física, estrutural e composicional mensurável no PDF ou papel final, ressalvadas somente Noto Sans, chamadas referenciais sobrescritas, preservação controlada de cores, tabelas e avisos institucionais e demais exceções expressas neste RCF.

## Perfil de referência e determinismo

- Geometria, composição, hierarquia, paginação e tolerâncias DEVEM provir de perfil externo versionado, formado por identificador, título, edição, origem, data de obtenção, licença ou condição de uso, hash do documento ou template de controle, papel, escala, unidades, margens, colunas, tipografia de referência e tolerâncias reproduzíveis.
- Valor físico, versão, medida, navegador, engine ou equivalência visual NÃO DEVE ser imaginado, inferido por semelhança em tela nem atualizado silenciosamente. Ausência do perfil versionado DEVE bloquear a classificação `ieee-validado`, sem bloquear o fallback legível.
- A conformidade DEVE ser aferida no PDF ou papel final em escala `100%`; ajuste automático de encaixe e cabeçalho ou rodapé acrescentado pelo navegador NÃO DEVEM ser pressupostos.
- Adaptação de consumidor ou plataforma NÃO DEVE alterar invariante do perfil; exceção DEVE residir em configuração ou adaptador, ser identificada no relatório de conformidade e possuir teste próprio.

### Perfil implementado e autoridade

- O perfil canônico inicial é `ieee-conference-a4-ieeetran-1.8b`, schema 1, obtido em 2026-08-09 a partir do IEEEtran 1.8b indicado pelo IEEE Author Center e distribuído pelo CTAN sob LPPL-1.3c. O arquivo de referência NÃO é redistribuído; seu ZIP de controle possui SHA-256 `e0cd4f5afbd42c8076092280e72b3e0a5111efe501d35de9f715cfb8da313cb4`.
- O perfil fixa papel A4, escala 100%, margens superior/direita/inferior/esquerda de 19,05/14,3225/43/14,3225 mm, duas colunas, intervalo de 4,2175 mm e largura de coluna de 88,5687 mm. A família Times do controle é substituída, por decisão deste RCF, por Noto Sans incorporada.
- A biblioteca `@jcem/print-ieee` e seus artefatos próprios usam MPL-2.0. Licença da biblioteca e licença da referência externa DEVEM permanecer declaradas separadamente em perfil, pacote, documentação e relatório.
- O runtime DEVE declarar no máximo `nativo-preparado`. Somente relatório individual de saída física ou PDF PODE declarar `ieee-validado`; a aferição vigente após isolamento reside em `src/jcem-print-ieee/reports/2026-08-09-devaneios-chromium-151.json`, e a aferição Chromium 148 permanece como registro histórico da composição anterior.

## Arquitetura, autoridade e API

- A solução DEVE nascer como biblioteca autônoma, importada explicitamente pelo blog, ainda que armazenada inicialmente em sua estrutura-fonte; localização inicial NÃO DEVE acoplar o núcleo ao tema, ao site, ao Jekyll nem à árvore privada do consumidor.
- A biblioteca DEVE separar núcleo genérico, CSS/Sass, preparação de runtime, adaptadores de engine, plugins de plataforma, configuração do consumidor e overrides locais. Núcleo e contratos públicos NÃO DEVEM importar alias, helper, template, front matter, estado, classe acidental nem arquivo privado do primeiro consumidor.
- O contrato público DEVE permitir identificar o artigo, fornecer e mapear metadados, declarar conteúdo omitido ou preservado, registrar elemento indivisível ou de largura total, selecionar parâmetro autorizado, fornecer transformação estática e consultar ou acionar preparação. `[data-print-article]` DEVERIA ser o marcador declarativo padrão; outro seletor DEVE ser configurável.
- API, configuração e schema DEVEM ser mínimos, estáveis, versionados, validados e sem efeito colateral na importação. Inicialização automática DEVE depender de ativação explícita.
- Dependência opcional NÃO DEVE ser carregada nem instalada pelo consumidor que não usa seu recurso. Consumidor Node.js NÃO DEVE depender de Ruby, e consumidor Jekyll NÃO DEVE executar Node.js no navegador; dependência de build DEVE pertencer ao adaptador correspondente.
- Integração Jekyll DEVE permanecer em plugin, filtro, hook, include, Liquid, Ruby ou adaptador próprio e PODE mapear front matter, enriquecer HTML, gerar metadados, preparar conteúdo e rejeitar build inválido. Saída DEVE ser HTML estático funcional sem Ruby no navegador.
- A árvore-fonte da biblioteca, seus testes, relatórios e construtores DEVEM ser excluídos do artefato Jekyll. Somente módulos, estilos e perfil explicitamente materializados em `assets/jcem/print-ieee/` PODEM alcançar a superfície pública.
- Transformação equivalente em Ruby, Node.js ou outra integração DEVE consumir o mesmo schema, fixtures e contrato e produzir semântica equivalente. Remover o adaptador Jekyll NÃO DEVE comprometer o núcleo nem o uso básico por HTML, CSS e JavaScript padronizados.
- Correção originada no primeiro site DEVE resolver a classe geral do problema e produzir teste genérico, de contrato e do adaptador aplicável. Identificador privado, profundidade fixa de DOM, ordem circunstancial, conteúdo textual, path ou classe acidental NÃO DEVEM integrar o núcleo; caso não generalizável DEVE e…3331 tokens truncated…r. Quando uma pessoa conduzir ou nortear predominantemente a discussão, a identificação funcional deve prevalecer sobre seu nome real; no artigo que originou esta regra, Emerson deve ser apresentado como **Instrutor principal**.
- Ausência de manifestação nunca deve ser interpretada como concordância. Consenso, aceitação, rejeição, aprovação, conclusão ou ausência de conclusão do grupo somente podem ser mencionados quando explicitamente demonstrados e materiais ao tema; ressalvas já cobertas pelo aviso editorial não devem ser reiteradas.
- Fala documentada, síntese editorial, inferência e conjectura devem permanecer semanticamente distinguíveis, sem acrescentar conclusões não sustentadas ou apresentadas.
- A primeira ocorrência explícita de cada citação textual deve apresentar integralmente o trecho preservado na fonte disponível e sua referência nomeada `[^id]`; ocorrência posterior deve reutilizar a referência e não repetir integralmente o texto sem necessidade editorial comprovada.
- Todas as citações e referências preexistentes devem ser preservadas integralmente. A vedação a menções processuais não autoriza abreviar, parafrasear, deslocar ou suprimir conteúdo já integrante de citação ou referência; eventual menção dessa natureza dentro de referência preservada constitui a exceção estritamente necessária.
- Quando a fonte disponível conservar apenas um excerto, a edição deve identificá-lo como parcial e nunca completar por memória, hipótese ou texto não documentado.
- Referências devem obedecer integralmente ao `RCF-JCEM-FOOTNOTES-001`; sistema numérico manual ou paralelo é proibido.

## Namespace e roteamento

- Namespace é o identificador de classe anteposto ao título lógico na URL, de modo análogo aos namespaces da Wikipédia: separa o domínio editorial da identidade do conteúdo sem transformar essa classe em diretório-fonte ou taxonomia comum.
- `bate-papo:` é o namespace canônico das sínteses deste escopo. O título público deve iniciar com `Bate-papo:` e a URL pública deve usar literalmente `/p/bate-papo:<titulo-normalizado>/`; `%3A` e `bate-papo-` não são representações públicas canônicas.
- O arquivo-fonte e seu diretório devem usar o prefixo físico `bate-papo-`, sem `:`. Namespace lógico, URL pública e nome físico são representações distintas e não devem ser confundidos.
- A configuração `content_namespaces` é a única autoridade de conversão. O plugin de namespace deve derivar a URL do prefixo físico, validar título e disclaimer e manter o mapeamento determinístico em build, desenvolvimento local e publicação, sem permalink individual ou decisão ad hoc do ambiente.
- Em sistema de arquivos que não aceite `:` — inclusive Windows — somente o destino físico local deve usar o prefixo configurado `bate-papo-`; a URL gerada, canônica e apresentada ao cliente permanece literal com `bate-papo:`. Em ambiente publicável compatível, o artefato deve materializar o segmento literal.

## Validação

- A validação editorial deve confirmar o aviso na abertura, caráter temático, anonimização, linguagem acessível, preservação proporcional do conteúdo e da autoria intelectual, ausência das referências processuais vedadas fora da exceção documental, ausência de presunção coletiva, distinção entre conteúdo documentado e elaboração editorial, preservação integral das citações e referências e ausência de repetição textual desnecessária.
- Todas as chamadas e definições `[^id]` devem ser pareadas, reutilizar identificadores semanticamente equivalentes e renderizar pelo mecanismo Jekyll/Kramdown vigente.
- O build com rascunhos deve confirmar hierarquia de títulos, blockquotes, linhas de referência, notas de rodapé e legibilidade da página renderizada.
- A validação deve confirmar o título `Bate-papo:`, a URL pública literal `/p/bate-papo:`, o path físico local hifenizado, a conversão central e a resolução da rota sem erro, redirecionamento involuntário ou divergência canônica.

