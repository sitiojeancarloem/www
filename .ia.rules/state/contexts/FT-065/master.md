# FT-065 - Equalizacao das nao aderencias de FLAG e barra de titulo

## Identidade e ordem

- Fonte: `TODO.ia.md`, frente "Corrigir integralmente as nao aderencias...".
- Evidencias normativas diretas: `evidencia17.pdf`, `evidencia18.png`, `evidencia19.png`, `evidencia21.png`, `evidencia22.png`, `como-deveria-ser.png`, `.ia.rules/state/requests/FT-066/acabamento-final.md`, `.ia.rules/state/requests/FT-066/quinta-correcao-geometria-inicializacao-blur.md`, `.ia.rules/state/requests/FT-066/sexta-correcao-recomposicao-backdrop.md` e `.ia.rules/state/requests/FT-066/setima-rejeicao-evidencias-21-22.md`.
- Evidencia normativa complementar preservada: `projeto-cover.pdf`; as imagens `evidencia1.png` a `evidencia16.png` e `e1.png` a `e5.png` foram inspecionadas para distinguir regressao COVER, referencia contextual e materia alheia.
- Ordem: FT-065 (norma) -> nova autorizacao humana -> FT-066 (codigo) -> FT-067 (integracao e validacao).

## Objetivo global

Eliminar a causa comum das interpretacoes reiteradamente rejeitadas: ancorar a FLAG pela base horizontal real do triangulo traseiro, e nao pelo topo de sua caixa; preservar as duas regioes funcionais numa unica superficie vitrea/fume continua, com o alpha, blur, bordas e sombra do baseline manual vigente, aplicada a todos os COVERs de artigo cabiveis.

## Decomposicao e precedencias

- O pedido atual especializa e corrige as clausulas anteriores que obrigavam a flag a iniciar integralmente depois da COVER e proibiam qualquer interpenetracao.
- `evidencia17.pdf` distingue topo, sustentacao e base; nao especifica implementacao interna do SVG.
- `como-deveria-ser.png` governa o resultado da barra/flag no exemplo; `evidencia18.png` e `evidencia19.png` documentam tentativas sucessivas rejeitadas.
- O pedido complementar de 2026-09-15 especializa materialidade e posição: a distinção funcional das regiões permanece, mas nenhuma delas pode usar fundo totalmente opaco; o gradiente e o backdrop devem formar uma superfície contínua.
- Os SVGs `flagVermelho.svg` e `flagCinza.svg` permanecem fonte visual vigente. CSS alternativo so entra com equivalencia integral e custo total menor comprovados.
- A regra pertence ao cabecalho editorial de artigo; flags de cards e componentes analogos ficam fora do escopo.
- Hero permanece restrito a area util da COVER e nao pode colidir com flag ou barras.

## Causa identificada

1. O RCF anterior associou a referencia da dobra ao topo da barra, mas simultaneamente exigiu que a flag inteira iniciasse depois da COVER e ficasse contida nessa regiao. Essa combinacao apagou a diferenca entre topo da caixa e linha de sustentacao.
2. O CSS fixou `.jcem-date-flag` em `top: 0` da barra superior e criou `.jcem-date-flag__triangle-base` tambem em `top: 0`.
3. O teste comparou esse marcador artificial ao topo da barra; portanto aprovou a aproximacao sem medir a base horizontal do triangulo traseiro desenhado no SVG.
4. Nos SVGs vigentes, a base do triangulo traseiro esta em `y=204.63`, enquanto o topo visual esta em aproximadamente `y=185.90`, dentro de `viewBox="0 0 67.733 111.12"`: a sustentacao fica aproximadamente a `18.724/111.12 = 16.85%` da altura da caixa.
5. A barra superior possui apenas gradiente de cor e sombra interna: nao usa `backdrop-filter`, nao desfoca a faixa da COVER atras dela e nao projeta a sombra somente para o conteudo externo.
6. O titulo herda decoracoes globais de `.page__title` e `a::after`; a regra local nao elimina integralmente borda, sublinhado, pseudoicone e equivalentes.
7. Após a primeira correção, `upper` passou a ter blur real, porém media somente `27%` da altura da FLAG; `lower` continuou opaca. A barra entrava pouco no COVER e a maior parte da superfície percebida não podia revelar nem desfocar o backdrop.

## Ledger visual anterior

| Evidencia/regiao | Observacao | Regra violada | Esperado | Correcao futura | Prova posterior |
|---|---|---|---|---|---|
| `evidencia17.pdf`, pagina 1, triangulo traseiro | topo, sustentacao e base sao tres linhas distintas | marcador/teste usa topo da caixa | base horizontal do triangulo em 16.85% colinear ao topo da barra superior | token geometrico derivado do SVG e medicao renderizada da linha real | FT-067, captura e coordenadas por modo |
| `evidencia18.png`, encontro COVER/barra | flag inicia pelo topo da caixa; barra nao e vidro completo | sustentacao simulada e duas funcoes visuais perdidas | flag sobe acima da linha de suporte; regiao superior desfoca a COVER | offset pelo anchor ratio; sobreposicao apenas da regiao vitrea | FT-067, diff focal claro/escuro |
| `evidencia19.png`, barra corrigida anterior | FLAG e coesao preservadas, mas barra baixa; somente `upper` com blur e `lower` opaca | materialidade e posição não convergem ao alvo | duas regiões continuam funcionais numa superfície única com alpha, gradiente e backdrop real; entrada maior deriva da altura da região vítrea | token soma base superior e deslocamento de sustentação; material migra ao deck | `check:covers`, 14 renders reais e matriz 140/140 |
| `como-deveria-ser.png`, barra | duas regioes funcionais fundidas numa superficie vitrea continua, titulo amarelo inferior e flag secundaria | tentativa anterior limitou o blur a uma faixa pequena e tornou a região inferior opaca | material único com alpha, gradiente, backdrop real e sombra externa; foreground nítido | `deck::before` contínuo, filhos transparentes e sombra no deck | capturas wide/desktop/mobile claro/escuro inspecionadas |
| `evidencia20.png`, faixa superior da barra | a terceira renderização mantém a arte praticamente intacta atrás do `upper`; o fumê não se distingue visualmente da transparência | a validação aceitou mera presença de alpha e blur, sem exigir densidade perceptível | fumê inequivocamente visível sobre a COVER, ainda translúcido e com variação do backdrop reconhecível | material movido para o próprio deck com alpha `0,55 → 0,94`; regressão exige patamares progressivos, estritamente translúcidos e perceptíveis | `visual-artifacts/ft066-third-devaneios/browser-dark-smoke.png`, rota real 14/14 e matriz 140/140 |
| prompt humano de 2026-09-15, acabamento 98% aderente | fumê, geometria e hierarquia aderentes, mas o blur ainda não é perceptível em todo o backdrop da barra | raio máximo de `14px` insuficiente e teste sem patamar mínimo | conteúdo subjacente inequivocamente desfocado apenas dentro da área integral do deck; foreground nítido | blur responsivo `20px → 30px` no próprio deck e regressão por raio computado mínimo | `visual-artifacts/ft066-fourth-devaneios/browser-dark-blur.png`, rota real 14/14 e matriz 140/140 |
| `evidencia21.png` e `evidencia22.png`, bordas laterais | a mídia visível ultrapassa bilateralmente a barra/zona útil na própria rota real rejeitada | a quinta correção excluiu a rota da prova ao classificá-la pelo comportamento implementado e, assim, aceitou o defeito marcado | resolver a semântica da rota pela fonte humana e pelos modos canônicos, exigindo colinearidade na rota rejeitada sem regredir modos explicitamente governados pela janela | regressão deve medir a rota real das evidências e falhar contra o estado atual antes da correção | FT-066/FT-067, Chrome/Brave, desktop/mobile, resize, orientação e DPR |
| `evidencia22.png`, blur ausente no primeiro carregamento | propriedade computada existe, mas Chrome e Brave só recompõem o efeito após toggle manual | presença nominal de CSS não prova composição; troca skeleton/imagem pode não invalidar o backdrop inicial | imagem e layout estabilizam antes da recomposição local única, sem alterar fumê/blur manual vigente | invalidação determinística por frames, restrita ao deck, sem polling, timeout ou estado final divergente | FT-067, reload normal/sem cache, navegação direta e comparação visual do primeiro paint |
| `projeto-cover.pdf`, paginas 4, 5 e 12 | diagrama de suporte e exemplos avisam defeitos de barra/flag | leitura anterior tratou screenshot defeituosa como referencia integral | texto/setas governam; screenshots apenas contextualizam | manter clausulas compativeis e substituir somente a interpretacao rejeitada | FT-065, RCF equalizado |
| `evidencia9.png` a `evidencia16.png` | registram geometria, modos e regressao anteriores | correcao local nao pode reabrir esses defeitos | proporcao, article-zone/window-zone e todos os modos preservados | matriz completa, nao fixture unica | FT-067, gates COVER existentes ampliados |
| `e1.png` a `e5.png` e demais evidencias alheias | referencias de blockquote/404 ou contexto nao causal | extrapolar seria alterar fora do necessario | nenhuma mudanca nesses dominios | excluir dos artefatos da FT-066 | diff final limitado |

## Entregaveis por fase

### FT-065 - normativa

- Corrigir as clausulas conflitantes em `RCFs/carregamento-progressivo.md` e `RCFs/componentes-compartilhados.md`.
- Definir aplicabilidade, sobreposicao permitida, referencia geometrica, funcoes das barras, aparencia do titulo, conteudo da flag e validacao real.
- Marcar a frente como equalizada e interromper antes do codigo.

### FT-066 - codigo, aguardando autorizacao

- Ajustar somente o cabecalho editorial compartilhado, CSS e testes afetados.
- Preservar SVGs e todos os modos/aliases; atualizar documentacao/ilustracao somente se a interface de uso ou representacao visual documentada for materialmente atingida.

### FT-067 - integracao, aguardando autorizacao

- Construir antes dos testes renderizados.
- Validar todos os modos cabiveis, temas, viewports, DPR, resize, orientacao, scroll, foco, impressao e ausencia de overflow.
- Produzir evidencias posteriores e revisar diff/staging para excluir `_site`, temporarios e a remocao concorrente de `.agents/agents.local.md`.

## Fora de escopo

- Cards, suas flags e thumbnails.
- Reescrita dos SVGs sem comparacao cumulativa autorizada.
- Conteudo editorial, assets de artigos, modos/aliases COVER, Hero, OG, 404, blockquotes, TTS e publicacao externa.

## Estado

FT-065 permanece equalizada quanto às invariantes preservadas. A sétima correção foi implementada e revalidada tecnicamente pelas FT-066 e FT-067, mas continua pendente de validação humana. A TO-DO operacional permanece `⏳` até aceite efetivo.

## Sétima correção — rota real, ramo de pintura e raster persistente

- A rota real rejeitada `/p/nove-motivos-para-guardar-o-sabado/` usa `featured_image_style: wide` legado sem `cover`; nesse caso, a mídia agora compartilha o ramo do cabeçalho e as bordas bilaterais da zona do artigo, sem perder o crop wide.
- A capacidade superior foi preservada: `cover.mode: wide`, aliases `full`, `full-width` e `bleed`, além de triptych, continuam podendo ocupar a janela; a fixture correspondente usa agora `full-width` explicitamente.
- Quando mídia e deck compartilham o ramo, a estabilização aguarda pintura e fontes sem depender de toggle síncrono coalescível. O caminho de ramos separados mantém a recomposição já existente.
- A prova raster compara automaticamente o estado automático, o baseline sem blur e o toggle manual depois de dezoito frames; repete o ensaio no ciclo `1017x820 -> 1169x900`, equivalente à abertura e ao fechamento do inspetor.
- Commits: normativa `31f3490579`, causal `7718f8f546` e rastreabilidade `3afa897d5a`.
- Estado: tecnicamente concluído, pendente de validação humana; a TO-DO permanece `⏳`.

## Quinta correção rejeitada — colinearidade por modalidade e composição inicial

- A classificação da evidência `evidencia21.png`/`evidencia22.png` como rota dispensada da colinearidade foi rejeitada novamente em 2026-09-16. A rota real das evidências deve integrar a prova causal; a rota `/p/sola-scriptura/` isoladamente não substitui esse aceite.
- O baseline manual foi preservado literalmente: superfície plana a `35%`, blur responsivo `clamp(10px, 1.25vw, 15px)`, saturação final `1.14`, bordas, sombra, FLAG e foreground sem filtros próprios.
- Chrome e Brave agora recebem uma invalidação local única depois de imagem e skeleton estabilizarem. A variação imperceptível de saturação dura um frame e é removida; não há polling, timeout arbitrário, `will-change` permanente nem estilo final divergente.
- Regressões classificam o modo antes de comparar retângulos, provam que `content` coincide bilateralmente com a zona do artigo e que `wide` não foi estreitado. Navegação direta, reload e cache desabilitado exigem composição concluída sem toggle manual.
- Commits: fonte `0ce72f5121`, norma `5d4a99b7d0`, causal `280d5f69ac`, sincronização `33b7dcad12` e estabilização dos testes `5865727247`.
- Estado técnico: concluído e revalidado; permanece pendente somente o aceite visual humano, mantendo a TO-DO em `⏳`.

## Validacao normativa

- `ruby scripts/test_documentation.rb`: aprovado, com `documentation=ok covers=10 quotes=6 manifests=2`.
- `node .ia.rules/core/runtime/scripts/rcf-trace.js validate`: aprovado no Node 24.19.0, com `entries=347` e `material=332`.
- `npm run agent:rcf`: nao executou a finalidade no Node 22.21.0; falhou ao carregar `.ia.rules/scenarios/release/scripts/package-registry.js` como ES module embora o artefato use `module.exports`.
- Invocacao direta de `repo-tools.js agent:rcf` com Node 24.19.0: reproduziu a mesma falha antes do resultado RCF, sem mudanca de arquivo entre tentativas.
- A incompatibilidade pertence ao runtime gerenciado e nao sera corrigida pela FT visual; o gate permanece explicitamente nao aprovado.
