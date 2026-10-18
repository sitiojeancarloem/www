# M33 — Renderização pontual do artigo atual

Dependência: M32 aceita e commitada em 91c5de1dcc. Artigo SHA-256 bf152ff4c0fcbced951734a10a0c49520dc35e421fcab6ff4188c06696b5d9d7.

Unidade: adaptar o verificador FT-112 existente em novo renderizar-M33.rb neste diretório, reutilizando plugins de notas, citações e leitura acessível. Ler frontmatter YAML completo (não split por comentário); usar o draft .md atual, preparar corpo integral e converter GFM; aplicar os mesmos mecanismos oficiais pertinentes, envolvendo HTML em article.jcem-post com título e .page__content. Sem reimplementar os plugins, sem alterar artigo, produção, _site, dependências ou outros trabalhos.

Saídas: renderizar-M33.rb, renderizado-M33.html, validacao-render-M33.json. Relatório deve registrar status, hash, comandos, contagens e falhas específicas, inclusive antes de levantar erro. HTML é artefato local de verificação, sem alegar ser build completo ou teste de leitor de tela.

Aceite: hash do artigo inalterado; corpo completo extraído após YAML; notas reconhecidas e destinos/retornos resolvidos, incluindo ap1217; nenhuma nota crua/ênfase Markdown não processada/marca AI-PROCESSED visível; nenhuma advertência Kramdown; tabela única, sete linhas, caption nativo correspondente à legenda já fornecida, scope col nas colunas, associações de referência integrais e aria-details corretas. Registrar cabeçalhos reais e semântica de citação sem exigir a priori que todo blockquote tenha somente um parágrafo. Não inventar cabeçalhos de linha ausentes nem apagar texto para passar.

Ruby instalado C:/Ruby40-x64/bin/ruby.exe 4.0.5 confirmado com execução autorizada fora da sandbox restritiva. Bundle script C:/Ruby40-x64/bin/bundle aceita ruby -x; conferir dependências sem instalar. Se falhar, diagnóstico delimitado, preservar artefatos e não contornar controles. Uma execução do renderizador; falha exige checkpoint antes de corrigir artigo ou ampliar escopo. Commit supervisor após revisão.

Retomada: preservar M32; não consultar novamente seu local_result. Após M33, revisar proporcionalmente e resolver diagnóstico concreto; só depois conferência global de preservação, demais gates aplicáveis e atualização final do estado FT-112.
