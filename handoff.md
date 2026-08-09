<!-- Gerado por npm run agent:handoff. Nao editar manualmente. -->
# Implementacoes em andamento

Resumo operacional gerado de `.agents/continue.ia`.

## FT-016 - Modelo semântico de blocos de citação

Objetivo: Implementar modelo registrado por ocorrência e normalização agnóstica de blockquotes, preservando defaults legados.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="1">Inventário e contrato executável</td>
<td>Mapear estruturas reais, defaults, pipeline, atributos, acessibilidade e fallbacks</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Registro e precedência</td>
<td>Implementar schema de modelos, IAL por ocorrência e mapeamento legado `blockquote_panels`</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Normalização e renderers</td>
<td>Preservar semântica em `&lt;blockquote&gt;`, `div`, `table` e estruturas registradas sem dependência privada</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Integração e documentação</td>
<td>Integrar tema, impressão, ausência de JavaScript e modo de autoria definitivo</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Validação e encerramento</td>
<td>Cobrir precedência, modelos, acessibilidade, fallback, build e renderização</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>

## FT-017 - Biblioteca agnóstica de impressão IEEE

Objetivo: Construir e integrar biblioteca autônoma de impressão editorial conforme perfil físico versionado.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="1">Perfil e matriz</td>
<td>Registrar referência, hash, licença, medidas, tolerâncias, navegadores, engines, Jekyll, Ruby e Node.js</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Núcleo e pacote</td>
<td>Criar API, schema, CSS/Sass, artefatos e projeto Node.js de referência sem acoplamento ao blog</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Adaptação Jekyll</td>
<td>Mapear artigo, metadados, avisos e transformações estáticas por adaptador próprio</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Paginação e tipografia</td>
<td>Implementar perfil físico, colunas por página, Noto Sans calibrada, tabelas, imagens e conteúdo institucional</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Ciclo progressivo</td>
<td>Integrar impressão nativa, preparação assíncrona, fallback CSS e motor opcional medido</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Validação cruzada</td>
<td>Comparar PDF/papel por página, navegadores, mobile, sem JS, sem engine e sem adaptador Jekyll</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Extração e encerramento</td>
<td>Validar pacote extraível, licenças, documentação, build, distribuição e integração final</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>

## FT-018 - Citações inline semânticas

Objetivo: Classificar e apresentar citações inline sem confundir bloco, subcitação, código ou ênfase autoral.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="1">Pipeline e casos</td>
<td>Inventariar transformações atuais e corpus positivo, negativo, aninhado e ambíguo</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Detecção e marcação</td>
<td>Implementar aspas por estrutura semântica e backtick somente com classificação autoral explícita</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Estilo e integrações</td>
<td>Aplicar itálico sem duplicação e preservar tema, impressão, texto e estilização vigente</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Validação e encerramento</td>
<td>Testar conteúdo, contextos excluídos, build, DOM, impressão e renderização</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>

## FT-019 - Subcitações contextuais

Objetivo: Identificar e diferenciar visualmente citação aninhada em qualquer modelo semântico suportado.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="1">Modelos e aninhamento</td>
<td>Mapear relações em parágrafo, bloco nativo, painel, `div`, `table` e estruturas registradas</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Semântica e tokens</td>
<td>Implementar marcador de subcitação e tokens `rgba` contextuais por tema/modelo</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Impressão e acessibilidade</td>
<td>Preservar distinção impressa com indício adicional não dependente somente de cor</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="1">Validação e encerramento</td>
<td>Testar temas, modelos, impressão com e sem fundos, fallback, contraste e ausência de regressão</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>
