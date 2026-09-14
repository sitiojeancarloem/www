# FT-065 - Equalizacao das nao aderencias de FLAG e barra de titulo

## Identidade e ordem

- Fonte: `TODO.ia.md`, frente "Corrigir integralmente as nao aderencias...".
- Evidencias normativas diretas: `evidencia17.pdf`, `evidencia18.png` e `como-deveria-ser.png`.
- Evidencia normativa complementar preservada: `projeto-cover.pdf`; as imagens `evidencia1.png` a `evidencia16.png` e `e1.png` a `e5.png` foram inspecionadas para distinguir regressao COVER, referencia contextual e materia alheia.
- Ordem: FT-065 (norma) -> nova autorizacao humana -> FT-066 (codigo) -> FT-067 (integracao e validacao).

## Objetivo global

Eliminar a causa comum das interpretacoes reiteradamente rejeitadas: ancorar a FLAG pela base horizontal real do triangulo traseiro, e nao pelo topo de sua caixa; restaurar a composicao de barra superior vitrea e barra inferior solida como regioes funcionalmente distintas, visualmente fundidas e aplicadas a todos os COVERs de artigo cabiveis.

## Decomposicao e precedencias

- O pedido atual especializa e corrige as clausulas anteriores que obrigavam a flag a iniciar integralmente depois da COVER e proibiam qualquer interpenetracao.
- `evidencia17.pdf` distingue topo, sustentacao e base; nao especifica implementacao interna do SVG.
- `como-deveria-ser.png` governa o resultado da barra/flag no exemplo; `evidencia18.png` documenta o defeito atual.
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

## Ledger visual anterior

| Evidencia/regiao | Observacao | Regra violada | Esperado | Correcao futura | Prova posterior |
|---|---|---|---|---|---|
| `evidencia17.pdf`, pagina 1, triangulo traseiro | topo, sustentacao e base sao tres linhas distintas | marcador/teste usa topo da caixa | base horizontal do triangulo em 16.85% colinear ao topo da barra superior | token geometrico derivado do SVG e medicao renderizada da linha real | FT-067, captura e coordenadas por modo |
| `evidencia18.png`, encontro COVER/barra | flag inicia pelo topo da caixa; barra nao e vidro completo | sustentacao simulada e duas funcoes visuais perdidas | flag sobe acima da linha de suporte; regiao superior desfoca a COVER | offset pelo anchor ratio; sobreposicao apenas da regiao vitrea | FT-067, diff focal claro/escuro |
| `como-deveria-ser.png`, barra | duas regioes fundidas, titulo amarelo inferior e flag secundaria | implementacao atual achata funcoes e herda aderecos | superior vitrea/fume com blur; inferior solida; sombra externa | CSS compartilhado sem duplicar estrutura | FT-067, estilos computados e captura |
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

FT-065 em andamento. FT-066 e FT-067 planejadas e bloqueadas ate nova autorizacao humana posterior ao commit normativo.
