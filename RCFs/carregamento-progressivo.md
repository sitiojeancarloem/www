<!-- AI-PROCESSED -->
# RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001

Status: vigente.

Escopo: carregamento inicial, loader global, recursos pesados, skeleton loading e indicadores de progresso do blog.

## Regras Normativas

- Toda imagem editorial de conteúdo elegível em mídia de tela DEVE receber, por aprimoramento progressivo, um controle sutil de ampliação sem reflow. O controle DEVE ter alvo adequado a mouse e toque, nome acessível e acionamento por teclado; PODE surgir por `hover`, foco ou primeira interação de toque/clique, mas NÃO PODE depender exclusivamente de `hover`.
- A visualização ampliada DEVE usar o asset de maior qualidade já disponível no elemento, preservar proporção, limitar-se à viewport, fornecer fechamento inequívoco por controle, `Escape` e retorno ao contexto/foco anterior. Fullscreen nativo PODE ser usado, com fallback modal local quando indisponível ou recusado.
- Logo, ícone, avatar, imagem de controle, card/thumbnail e mídia pertencente a componente com contrato próprio NÃO são imagem editorial elegível. A exclusão DEVE decorrer do papel semântico/estrutural, não de exceção arbitrária por URL, página, formato ou dispositivo.
- O aprimoramento de ampliação DEVE permanecer ausente da impressão e não PODE alterar o asset, suas dimensões no fluxo, `srcset`, `sizes`, skeleton, legenda, link editorial ou comportamento de carregamento.
- Imagem destacada ampla limitada pela viewport DEVE preencher a altura visual calculada sem deformação: o contêiner e a caixa da imagem DEVEM compartilhar a mesma altura efetiva, enquanto a largura deriva da proporção intrínseca e permanece centralizada e limitada à viewport. `aspect-ratio` de reserva de carregamento NÃO PODE conservar altura excedente depois que esse limite passa a governar a imagem.

## Covers editoriais e composição wide

- A superfície da cover DEVE ocupar integralmente a zona horizontal reservada pelo layout, sem vazio estrutural entre suas bordas e as bordas dessa zona. O conteúdo central permanece proporcional, sem distorção nem crop destrutivo; quando limite mínimo/máximo de altura tornar impossível preencher simultaneamente os dois eixos com uma única proporção, a superfície periférica DEVE completar a faixa sem amputar o conteúdo central.
- Altura mínima e máxima de cover DEVEM derivar de uma única configuração/token vigente em unidades relativas à viewport. CSS, include, front matter e script NÃO PODEM duplicar valor numérico concorrente; rotação e resize DEVEM recalcular a mesma regra sem salto ou estado intermediário persistente.
- Flag associada à publicação pertence à camada acima da cover e DEVE permanecer integralmente visível em composição wide e content. Cover, skeleton, contenção ou novo stacking context NÃO PODEM cobri-la nem recortá-la.
- Cover canônica para compartilhamento wide usa `1200×630` quando o contrato editorial permitir. Fonte com outra proporção DEVE ser preservada como original e gerar derivado novo; simples redimensionamento só é válido quando não distorcer nem degradar. Extensão generativa autorizada DEVE limitar-se às bordas necessárias, conservar o conteúdo central e registrar ferramenta, entrada, hash, parâmetros, saída e revisão visual, sem sobrescrever o original.
- O modo wide de uma imagem usa a cover central como conteúdo autoritativo e PODE completar periferias por camada derivada da mesma fonte, desde que a imagem integral continue perceptível e a composição não introduza faixa vazia, costura, deslocamento ou semântica visual nova.
- O modo wide triplo usa `header.image` como `central`, `header.image_wide_left` como segmento repetível à esquerda e `header.image_wide_right` como segmento repetível à direita, ativado por `header.image_wide_mode: triptych`. Ausência de laterais resolve para o modo de uma imagem; combinação parcial, proporção incompatível ou bordas não conciliáveis DEVE falhar no build.
- Segmentos laterais DEVEM compartilhar altura e escala efetivas com a central. A borda direita de `left` coincide pixel a pixel com a borda esquerda de `central`, e a borda esquerda de `right` com a borda direita de `central`; repetição externa respeita sua direção sem espelhamento implícito.

- HTML e CSS devem produzir conteúdo legível imediatamente; JavaScript, consentimento e aprimoramentos progressivos NÃO PODEM ocultar ou bloquear a primeira renderização visível da página.
- Recursos essenciais são HTML, CSS, JavaScript próprio necessário à inicialização e dependências leves do JavaScript, como JSON, XML ou formatos equivalentes.
- Imagens, `background-image`, vídeos, áudios, iframes, fontes opcionais e demais assets pesados não devem bloquear a liberação inicial da página.
- Recursos pesados devem carregar de forma assíncrona, progressiva e tolerante a falhas.
- Todo componente elegível que dependa de asset potencialmente lento deve exibir automaticamente skeleton loading em CSS puro até que o asset esteja carregado ou falhe.
- Componentes elegíveis incluem banners, imagens destacadas, cards, thumbnails, galerias, backgrounds visuais e componentes opt-in com `data-jcem-skeleton`.
- Skeleton loading deve preservar o espaço do componente no fluxo sempre que a geometria do componente for conhecida por CSS ou marcação.
- A base visual do skeleton deve permanecer visível durante todo o ciclo de animação; somente o brilho de varredura pode se deslocar.
- O brilho de varredura deve permanecer em camada visual própria e perceptível sobre o espaço reservado do componente, sem depender da visibilidade do asset final.
- O contêiner do skeleton deve possuir textura ou padrão visual próprio enquanto estiver em `loading`, para que o placeholder permaneça reconhecível mesmo se pseudo-elementos falharem ou forem sobrepostos.
- Quando o recurso estava pendente, o skeleton deve permanecer visível por janela mínima perceptível antes da transição para o conteúdo final.
- Metadados de assets constituem camada opcional de otimização; o tema jamais deve depender deles para funcionar corretamente.
- Quando disponíveis, metadados de assets devem ser usados para otimizar desempenho percebido, responsividade, reserva antecipada de espaço, estruturação automática de componentes e precisão do skeleton loading.
- Imagens externas elegíveis devem possuir metadados declarativos em `_data/jcem_asset_metadata.yml` ou fonte equivalente consumida no build; cards e imagens destacadas não podem depender do carregamento da imagem para definir a altura final.
- A primeira renderização de cards com imagem deve emitir `width`, `height` e/ou `aspect-ratio` suficientes para impedir expansão, contração ou reposicionamento após o carregamento do asset.
- O skeleton de imagens deve combinar padrão/textura fixa com brilho de varredura esquerda-para-direita em camada própria, com contraste ajustado por tema.
- A geração de metadados de assets deve ocorrer automaticamente durante o build.
- A geração deve ser incremental sempre que tecnicamente viável, evitando reprocessamento de assets não alterados.
- O índice consolidado de metadados deve ser cacheável, possuir baixa latência e minimizar requisições HTTP.
- O índice DEVE registrar variantes responsivas conhecidas por asset, com URL, largura, altura, proporção, formato e custo em bytes quando disponível.
- Cards e thumbnails DEVEM emitir `srcset` e `sizes` ou contrato equivalente que permita ao navegador escolher a menor variante suficiente para largura renderizada, viewport e DPR; a maior imagem NÃO DEVE ser o default por conveniência. Imagem destacada ou interna do artigo preserva o original, salvo autorização editorial explícita diversa.
- Imagem destacada wide de artigo DEVE preservar proporção e qualidade, porém sua caixa e a própria mídia NÃO PODEM exceder a altura útil da viewport com a rolagem no topo. A contenção aplica-se somente a artigo em mídia de tela e NÃO PODE alterar 404, `noscript`, cards, impressão ou o asset original.
- Variantes de cards e thumbnails DEVEM nascer diretamente do original declarado uma única vez. Configuração e índice DEVEM registrar hash SHA-256, tamanho e commit do original; build subsequente apenas valida e reutiliza as saídas, sem recompressão cumulativa.
- Variante incompatível em proporção ou finalidade NÃO DEVE integrar o mesmo conjunto. Ausência de variantes DEVE preservar a origem como fallback sem inventar arquivo ou URL.
- Card criado no cliente DEVE consumir o mesmo índice e regra de seleção do HTML estático, sem duplicar heurística divergente.
- Metadados incorporados diretamente ao arquivo original, como EXIF ou mecanismo equivalente, só devem ser gravados quando houver suporte seguro, preservação integral dos metadados existentes e ausência de impacto relevante no build.
- A substituição do skeleton pelo conteúdo definitivo deve usar transição suave, sem flickering perceptível.
- A implementação não deve introduzir mudança visual deliberada na identidade do componente carregado.
- Indicadores de carregamento e progresso devem possuir contraste suficiente durante toda a exibição, inclusive em tema claro, tema escuro, telas de baixo brilho e conexões lentas.
- Estas regras constituem o comportamento padrão para componentes atuais e futuros, salvo justificativa técnica explícita registrada no ponto de implementação.

## Assets editoriais e metadados sociais

- Draft ou publicação NÃO PODE depender diretamente de `web.archive.org` para entregar imagem, SVG, áudio, vídeo, PDF incorporado ou outro asset editorial. O pipeline DEVE resolver primeiro cópia local inequivocamente equivalente por origem, nome, conteúdo e hash; download só ocorre diante de ausência comprovada. URL de provenance em `source:` e hyperlink citacional para documento arquivado não constituem asset e permanecem preservados.
- `_site/` é artefato gerado, nunca origem editorial. Asset encontrado somente nessa árvore DEVE ser promovido ao namespace-fonte aplicável com hash e vínculo documental antes de qualquer novo build; a cópia gerada isolada não satisfaz preservação nem rastreabilidade.
- `header.image` é a fonte central visível e, por padrão, a fonte da OG wide. `header.image_square` declara fonte quadrada opcional. O build projeta derivados finais em `header.og_image` e `header.og_image_square`, sem exigir que autoria Markdown informe paths gerados.
- A projeção Open Graph DEVE emitir primeiro a imagem wide `1200×630`, seguida opcionalmente da square `400×400`, cada qual com URL absoluta HTTPS, tipo, largura, altura e alternativa. O protocolo admite múltiplos `og:image` e prefere o primeiro em conflitos; portanto a presença da square amplia opções, mas NÃO PODE ser declarada como garantia de seleção específica por WhatsApp, Instagram, Threads, LinkedIn, Facebook ou outro consumidor.
- X/Twitter DEVE receber `twitter:card` e `twitter:image` coerentes com o modo declarado. `summary_large_image` usa a wide; `summary` PODE usar a square quando existente e regride para a wide quando ausente. Tipo de card não PODE ser inferido por nome de plataforma nem divergir da imagem efetivamente emitida.
- Imagem square DEVE preservar conteúdo essencial, identidade, paleta e legibilidade da cover. Crop simples só é permitido quando não remover elemento relevante; extensão assistida segue a mesma provenance e revisão da wide. Post sem cover não recebe imagem inventada por este contrato.
- A imagem central do modo wide triplo é a única fonte wide de OG; segmentos laterais são composição de tela e NÃO PODEM ser concatenados ao metadado social.
- Covers raster compartilhadas da 404 e do fallback `noscript` DEVEM usar derivado **WebP**, não WebM, gerado uma única vez pelo allowlist vigente e com original preservado. O HTML DEVE apontar corretamente ao derivado e conservar fallback funcional quando exigido pelo componente.

## Implementação

- `assets/jcem/ts/site.ts` acopla o controle de ampliação às imagens editoriais elegíveis depois da primeira pintura, reutiliza o contrato de fullscreen com fallback local e preserva o foco de origem. `_sass/minimal-mistakes/skins/_variables-custom.scss` contém somente a aparência de tela do controle e da superfície ampliada.
- `_includes/head/custom.html` define o loader inicial e a barra superior com contraste próprio, independente do tema ativo; o loader sinaliza aprimoramento pendente sem encobrir o conteúdo já pintável.
- Raster JPG, JPEG ou PNG compartilhado de tema/infraestrutura, ou abrangido pela exceção de cards e thumbnails, PODE possuir derivado WebP desde que o original permaneça versionado e intacto. Cada derivado DEVE ser criado uma única vez diretamente do original e vinculado em manifesto a hash SHA-256, tamanho, mtime de origem, hash/tamanho de destino e instante de geração; mudança de origem ou destino DEVE falhar até autorização/atualização explícita, vedada qualquer cadeia de recompressão.
- A conversão automática DEVE operar somente sobre allowlist de fontes compartilhadas autorizadas. Asset ou ligação editorial específica NÃO PODE entrar nesse fluxo por mera existência sob `assets/`; acervos de `_drafts`, recuperação e legado também permanecem excluídos até autorização explícita aplicável.
- `assets/jcem/ts/site.ts` libera a página após `DOMContentLoaded` e preparação leve dos fragmentos essenciais, sem aguardar `window.load`.
- `assets/jcem/ts/site.ts` monitora imagens e backgrounds elegíveis, aplicando estados `loading`, `loaded` e `error` em `.jcem-skeleton`.
- `_includes/archive-single.html` e `_includes/jcem/post-featured-image.html` marcam cards e imagens destacadas com skeleton server-side; somente o primeiro consome variantes responsivas editoriais.
- `_plugins/jcem_asset_metadata.rb` gera metadados opcionais de imagens, mantém cache incremental em `.jekyll-cache/jcem-asset-metadata.json` e publica índice consolidado em `assets/jcem/asset-metadata.json`.
- Metadados Open Graph e equivalentes DEVEM consumir variante social local gerada no build com altura final de 630 px e largura proporcional. O gerador DEVE partir da fonte original declarada, comparar JPEG e PNG produzidos com parâmetros estáveis, selecionar a menor saída visualmente compatível, registrar hashes, tamanho, estado temporal e parâmetros, e regenerar somente quando fonte ou parâmetros mudarem. `_plugins/jcem_social_images.rb` é o conector exclusivo entre esse manifesto e `header.og_image`; o asset editorial permanece inalterado.
- `_includes/archive-single.html`, `_includes/jcem/post-featured-image.html` e `recent-posts.json` usam metadados disponíveis para emitir `width`, `height` e proporção sem criar dependência funcional.
- Os consumidores de card/thumbnail DEVEM propagar variantes, `srcset` e `sizes` centralmente derivados; o JSON dinâmico DEVE transportar a mesma projeção sanitizada. A página individual NÃO DEVE substituir a imagem editorial original por essas variantes.
- `_sass/minimal-mistakes/skins/_variables-custom.scss` define tokens e animação de skeleton em CSS puro.
- `404.main.html` mantém implementação local equivalente para loader, imagem destacada e cards recentes, gerando `/404.html` em tempo de build.
- A implementação atual não grava EXIF nos arquivos originais porque a camada sidecar atende ao contrato com menor risco, sem nova dependência e sem mutação de assets autorais.

## Validação

- A validação visual DEVE comprovar controle sem deslocamento de layout, revelação por hover/foco e primeira interação, acionamento por mouse e teclado, proporção/contain na viewport, fechamento por botão e `Escape`, restauração de foco e ausência em imagens excluídas e impressão.
- A validação visual deve simular asset pesado pendente e confirmar que `.jcem-page-loaded` é aplicado antes de `document.readyState === "complete"`.
- A validação visual deve confirmar que o conteúdo permanece visível antes, durante e após a inicialização dos aprimoramentos essenciais.
- A validação visual deve confirmar presença, geometria, pseudo-elemento e estado final dos skeletons em componentes elegíveis.
- A validação visual deve aceitar skeleton pendente quando a animação estiver ativa e o asset correspondente ainda não estiver disponível.
- A validação visual deve confirmar variação perceptível do skeleton entre dois momentos distintos de carregamento pendente.
- A validação visual deve confirmar geometria e contraste mínimo operacional da barra superior de progresso.
- `npm run check` deve validar o extrator de metadados em imagens reais do repositório.
- O teste DEVE validar ordenação por largura, proporção homogênea, bytes, fallback, `srcset`/ `sizes` e seleção de variante menor em card estreito e DPR representativos.
- Build Jekyll deve confirmar a geração de `assets/jcem/asset-metadata.json` e o uso opcional dos metadados no HTML renderizado.
- A validação DEVE aferir covers em claro/escuro, orientações retrato/paisagem e viewports representativas; comprovar largura da zona, limites de altura, flag, proporção e continuidade dos modos único e triplo.
- O build DEVE validar dimensões, tipo, hash/provenance e idempotência de derivados `1200×630`, `400×400` e WebP; segunda execução sem mudança de origem produz zero alteração de bytes e timestamp.
- O HTML final DEVE comprovar ordem e propriedades estruturadas de cada `og:image`, fallback square→wide, coerência de `twitter:card`/`twitter:image` e ausência de promessa ou tag proprietária inexistente por plataforma.
- Varredura de fontes publicáveis DEVE falhar diante de URL de asset em `web.archive.org`, sem reprovar `source:` histórico ou hyperlink citacional não incorporado.

Referência técnica: [Open Graph protocol — imagens estruturadas e arrays](https://ogp.me/).
