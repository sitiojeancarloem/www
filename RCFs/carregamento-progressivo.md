<!-- AI-PROCESSED -->
# RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001

Status: vigente.

Escopo: carregamento inicial, loader global, recursos pesados, skeleton loading e indicadores de progresso do blog.

## Regras Normativas

- Imagem destacada ampla limitada pela viewport DEVE preencher a altura visual calculada sem deformação: o contêiner e a caixa da imagem DEVEM compartilhar a mesma altura efetiva, enquanto a largura deriva da proporção intrínseca e permanece centralizada e limitada à viewport. `aspect-ratio` de reserva de carregamento NÃO PODE conservar altura excedente depois que esse limite passa a governar a imagem.

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

## Implementação

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

- A validação visual deve simular asset pesado pendente e confirmar que `.jcem-page-loaded` é aplicado antes de `document.readyState === "complete"`.
- A validação visual deve confirmar que o conteúdo permanece visível antes, durante e após a inicialização dos aprimoramentos essenciais.
- A validação visual deve confirmar presença, geometria, pseudo-elemento e estado final dos skeletons em componentes elegíveis.
- A validação visual deve aceitar skeleton pendente quando a animação estiver ativa e o asset correspondente ainda não estiver disponível.
- A validação visual deve confirmar variação perceptível do skeleton entre dois momentos distintos de carregamento pendente.
- A validação visual deve confirmar geometria e contraste mínimo operacional da barra superior de progresso.
- `npm run check` deve validar o extrator de metadados em imagens reais do repositório.
- O teste DEVE validar ordenação por largura, proporção homogênea, bytes, fallback, `srcset`/ `sizes` e seleção de variante menor em card estreito e DPR representativos.
- Build Jekyll deve confirmar a geração de `assets/jcem/asset-metadata.json` e o uso opcional dos metadados no HTML renderizado.
