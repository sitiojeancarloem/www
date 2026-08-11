<!-- AI-PROCESSED -->
# RCF-JCEM-PERFORMANCE-DEPENDENCIAS-001

Status: vigente.

Escopo: scripts, estilos, fontes, bibliotecas externas, assets de terceiros e recursos client-side carregados pelo blog.

## Orçamento permanente e cobertura

- Implementação, manutenção, refatoração e evolução DEVEM buscar e manter pontuação PageSpeed Insights igual ou superior a 90 em todas as categorias aplicáveis, em mobile e desktop, para cada tipo real de página publicada.
- A amostra mínima DEVE representar home, post/artigo, mapa/índice, about e cada outro layout público efetivamente descoberto. Não se mede indiscriminadamente toda URL equivalente nem se declara aprovação para layout não aferido.
- Resultado inferior a 90 DEVE bloquear nova regressão e produzir diagnóstico do gargalo real; indisponibilidade externa, variação de laboratório ou limitação comprovada DEVE ser registrada separadamente e não convertida em sucesso.
- Categoria só é aplicável quando não contradiz a semântica HTTP/editorial da rota. Em particular, SEO de indexação NÃO se aplica à página 404 deliberadamente `noindex`; desempenho, acessibilidade e boas práticas continuam obrigatórios nessa rota.
- Medição DEVE ser reproduzível, condensada, cacheada por URL, estratégia, versão e hash de artefato. Cache válido DEVE evitar nova consulta; saída para IA DEVE preservar pontuações, Core Web Vitals, auditorias determinantes e evidência, sem payload prolixo.

## Regras Normativas

- Recurso externo não modificado deve ser carregado por CDN versionado quando existir CDN estável, pública e compatível com o build do projeto.
- Bibliotecas, estilos, fontes e assets de terceiros não devem ser versionados localmente quando forem idênticos ao pacote público e não houver exigência de segurança, privacidade, disponibilidade ou compatibilidade que justifique cópia local.
- Nenhum script, estilo, fonte ou asset externo deve ser carregado em páginas que não utilizam o recurso correspondente.
- Recursos client-side legados só podem permanecer quando necessários para comportamento vigente; o carregamento deve ser condicionado automaticamente por página, componente ou estado inferido pelo build.
- Dependências usadas somente no build, sem envio de JavaScript client-side ao navegador, podem permanecer em `package.json`, `Gemfile` ou ferramenta equivalente quando forem necessárias para gerar artefato estático.
- Includes, layouts e plugins devem priorizar inferência automática em vez de metadados manuais no front matter.
- Quando tecnicamente aplicável, recursos de CDN devem usar versão fixa, `integrity`, `crossorigin` e política de referência restritiva.
- Exceções à CDN exigem motivo técnico rastreável: modificação local do asset, indisponibilidade de CDN estável, licença incompatível, privacidade, segurança, necessidade offline, bloqueio de rede previsível ou ganho mensurável de performance com cópia local.
- Leituras de layout e mutações visuais acionadas por `resize`, orientação ou observer DEVEM ocorrer em fases separadas e consolidadas por frame. Listener duplicado, medição repetida sem mudança, leitura/escrita intercalada e reconstrução integral desnecessária são proibidos.
- Agrupamento da barra responsiva NÃO PODE ser removido; DEVE usar `ResizeObserver` ou sinal equivalente com cache de dimensões e `requestAnimationFrame`, preservando fallback de `resize`/orientação.
- Runtime exclusivo de impressão IEEE NÃO DEVE integrar o caminho crítico. O módulo DEVE carregar após período ocioso ou atraso configurado suficientemente distante da primeira renderização e também imediatamente, sem bloquear o iniciador nativo, diante de `beforeprint` ou `matchMedia('print')`.

## Implementação

- O carregamento condicional deve ocorrer no menor ponto de composição possível, preferencialmente no include ou layout que conhece o estado real da página.
- Para matemática, `_plugins/jcem_math.rb` marca `page.jcem_math` durante o build; `_includes/head/custom.html` carrega KaTeX por CDN e o CSS local de controles apenas quando essa marca existir.
- JavaScript de varredura no navegador para decidir carregamento de bibliotecas deve ser evitado quando o build consegue inferir o uso com custo menor.
- Bibliotecas client-side amplas devem ser auditadas antes de qualquer inclusão global; ausência de uso na página implica ausência de carga.
- O projeto DEVE fornecer medidor PageSpeed representativo com cache e resumo estruturado, sem exigir credencial para validações locais que não consultem a API.
- Falhas transitórias `5xx` da API PageSpeed DEVEM receber repetição curta, limitada e determinística; esgotadas as tentativas, o erro externo DEVE permanecer explícito e jamais ser convertido em pontuação aprovada. O resumo DEVE expor FCP, LCP, TBT e auditorias determinantes sem revelar credencial ou payload prolixo.
- Conteúdo acima da dobra que possa se tornar LCP NÃO DEVE usar lazy loading; deve ser descoberto no HTML e receber prioridade compatível. Scripts de consentimento não essenciais à primeira pintura PODEM ser descobertos no `<head>` somente com execução não bloqueante e ordenada, como `defer`; jamais podem impedir a análise do HTML ou ocultar o conteúdo.
- Skeleton de recurso prioritário NÃO PODE manter o candidato a LCP invisível depois que o navegador já dispõe de seus bytes. O placeholder PODE permanecer como fundo até a resolução do carregamento, sem impor atraso mínimo artificial à pintura do recurso real.
- Imagens editoriais abaixo da dobra DEVEM nascer no HTML com carregamento tardio, dimensões e seleção responsiva quando houver variantes; adicionar `loading` somente depois da descoberta pelo navegador não satisfaz este contrato.
- Imagem visual não candidata a LCP, ainda que próxima da primeira dobra, DEVE usar variante proporcional e prioridade inferior quando o original competir desnecessariamente com texto, CSS ou outro candidato crítico.
- Contenção de layout/pintura para conteúdo distante da viewport PODE ser aplicada exclusivamente em mídia de tela, com tamanho intrínseco de reserva e renderização automática ao aproximar-se da viewport. Essa otimização NÃO PODE integrar, limitar nem alterar o fluxo de impressão.
- O adaptador de masthead DEVE manter uma única fila de sincronização responsiva e aplicar mutações somente quando o estado calculado mudar.
- O runtime global do tema de terceiros NÃO DEVE ser enviado quando suas funções ativas já estiverem cobertas pelo conector local. `_includes/scripts.html` condiciona o pacote amplo à busca realmente habilitada; `assets/jcem/ts/site.ts` preserva perfil do autor, links permanentes, rolagem interna e realce do sumário sem jQuery ou plugins globais.
- Clonagem de fallback oculto e alimentação de blocos recentes DEVEM ocorrer somente após a liberação visual e fora da janela crítica inicial; o fallback sem JavaScript permanece estático e funcional sem depender dessas tarefas.
- O fallback estático em `noscript` DEVE permanecer funcional sem JavaScript, mas sua serialização NÃO DEVE preceder o conteúdo principal no fluxo HTML entregue a navegadores com JavaScript, quando isso atrasar a descoberta do candidato a LCP. A ordem física PODE colocá-lo após o wrapper principal desde que o modo sem JavaScript continue exibindo exclusivamente o fallback e preserve navegação, conteúdo e rodapé.
- Em coleções e taxonomias, somente o primeiro candidato efetivamente acima da dobra DEVE receber carregamento `eager` e prioridade alta por padrão. Sua variante responsiva DEVE ser antecipada no `<head>` quando o build conhecer deterministicamente o asset; cards seguintes não podem competir pela mesma prioridade sem evidência de que também compõem a primeira viewport.

## Validação

- `npm run check` deve permanecer sem regressões após alterações de dependências ou carregamento condicional.
- Build Jekyll deve confirmar que páginas sem o recurso não recebem o asset externo.
- Alterações que mudem carregamento visível ou interativo devem ser validadas em artefato renderizado.
- Testes DEVEM simular sequência contínua de resize/orientation, contar medições e mutações por frame, comprovar agrupamento/desagrupamento e ausência de erro.
- Validação de rede DEVE comprovar que o chunk de impressão não é solicitado antes do agendamento tardio em artigo, não é solicitado em páginas sem artigo e continua disponível para impressão antecipada.
