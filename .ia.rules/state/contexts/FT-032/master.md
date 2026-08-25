# Contexto-mestre — equalizer de acessibilidade e 404

## Identidade

- FT normativa condutora: `FT-032`
- fonte: `TODO.ia.md` no hash SHA-256 `13E91E9F82897E55C4118AEDBAA17730550724490E026A1850B45CBE39A1E8E0`
- objetivo único: corrigir a regressão publicada da 404 e tornar conteúdo, navegação e mídia editorial semanticamente compreensíveis por tecnologias assistivas e TTS, sem alterar o texto visual nem regredir desempenho, SEO, impressão ou recursos vigentes.

## Equalização

1. `FT-032` consolida os contratos de produto e a decisão arquitetural antes de qualquer implementação.
2. `FT-033` projeta o modus operandi já normatizado no adaptador local canônico e em rotas mínimas, sem duplicar autoridade.
3. `FT-034` corrige a causa real da 404 e comprova o resultado publicado.
4. `FT-035` classifica e completa dados editoriais acessíveis retroativos sem inventar conteúdo.
5. `FT-036` implementa a camada semântica, a fala complementar, referências por ocorrência, gráficos e carregamento condicional.
6. `FT-037` valida a matriz real, publica e comprova ausência de regressão.

## Decisões e limites

- A 404 já possui regra de produto suficiente em `RCF-JCEM-COMPONENTES-COMPARTILHADOS-001`; a nova norma deve preservar esse contrato e registrar somente aceite/integração faltantes.
- TTS significa primeiro HTML semântico interoperável e conteúdo acessível; síntese de voz específica é aprimoramento progressivo, nunca fonte única.
- Texto visível, voz autoral e grafia original são imutáveis por automação de fala.
- Citação, referência, tabela, imagem e gráfico reutilizam seus contratos especializados; a nova RCF coordena a projeção falada sem duplicá-los.
- Dependência client-side opcional só pode existir na página que a usa e após inferência de build.
- `evidencia1a.png` e `evidencia1b.png` são citadas pela fonte, mas não existem em `HEAD`; a FT-034 deve recuperá-las do histórico ou obter substitutas autoritativas antes da comparação visual.

## Aceite global

- origem, FTs, RCFs e implementações permanecem bidirecionalmente rastreáveis;
- normatização conclui e interrompe antes das FTs 033–037;
- implementação posterior cobre conteúdo real, teclado, leitor de tela/TTS, temas, viewports, impressão, PageSpeed, build e artefato publicado;
- nenhum resultado parcial ou gate externo inconclusivo é apresentado como aprovação global.

## Resultado normativo

- `RCF-JCEM-OPERACAO-IA-001` centraliza o modus operandi detalhado e determina `agents.local.md` raiz como projeção fina futura, sem recuperar a árvore predecessora nem criar subarquivo sem ganho medido.
- `RCF-JCEM-LEITURA-ACESSIVEL-TTS-001` estabelece HTML semântico estático como fonte, normalização única de legado/futuro, fala complementar não duplicada, referências por ocorrência, idioma BCP 47, pronúncia com evidência, tabelas estruturadas e descrição/dados para imagens e gráficos.
- Chart.js 4.5.1 foi selecionado somente como renderer opcional, local e condicionado. ECharts e Vega-Lite foram comparados por acessibilidade, escopo, dados, manutenção e superfície; a representação acessível permanece independente da biblioteca.
- `RCF-JCEM-COMPONENTES-COMPARTILHADOS-001` já normatiza a extrapolação da masthead 404. A FT-034 deve corrigir a divergência entre fonte/build/publicação sem criar nova regra visual.
- Referências técnicas primárias: WCAG 2.2 e tutoriais WAI; documentação oficial de acessibilidade/integração do Chart.js; ARIA do ECharts; dados e ARIA do Vega-Lite.
- Gates concluídos: `npm run agent:rcf` retornou `RCF_OK`; `npm run agent:rcf:trace -- validate` retornou zero entradas e zero divergências; verificação focada confirmou IDs únicos e links existentes.
