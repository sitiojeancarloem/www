# Correção estrutural — Tabelas Markdown, acessibilidade e TTS

## Falha reproduzida

Ao executar `npm run dev-live -- --drafts` em `D:\trampo\jeancarloem.com.blog`, a compilação é interrompida:

```text
PS D:\trampo\jeancarloem.com.blog> npm run dev-live -- --drafts

> blog@1.0.0 dev-live
> cross-env RUBYOPT="-W:no-deprecated" JEKYLL_ENV=production bundle exec ruby scripts/jekyll_local.rb serve --host 127.0.0.1 --force_polling --livereload --drafts

Configuration file: D:/trampo/jeancarloem.com.blog/_config.yml
            Source: D:/trampo/jeancarloem.com.blog
       Destination: D:/trampo/jeancarloem.com.blog/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
             ERROR: YOUR SITE COULD NOT BE BUILT:
                    ------------------------------------
                    jcem_accessibility=tabela_sem_caption
PS D:\trampo\jeancarloem.com.blog>
```

## Objetivo e princípio obrigatório

**Corrija a causa real da falha**, sem presumir arquivos, APIs, plugins, mecanismos, normas ou arquitetura não inspecionados. O autor **NÃO DEVE** ser obrigado a reescrever uma tabela em HTML para declarar `caption` ou outros metadados/atributos semânticos e de apresentação: tabelas nativas Markdown DEVEM continuar editáveis em Markdown. Assim como outros elementos Markdown podem aceitar modificadores, tabelas DEVEM dispor de mecanismo equivalente, simples, não ambíguo e compatível com o ecossistema real do projeto.

**TTS, acessibilidade e qualquer outro processamento DEVEM ser compatíveis com todas as formas de autoria efetivamente aceitas em arquivos `.md` pelo projeto**, inclusive sintaxes reconhecidas por extensões/plugins. A forma de codificação NÃO DEVE, por si só, causar perda de suporte, semântica ou funcionalidades.

## Execução mandatória

1. **Inspecione antes de alterar:** examine estado real, normas aplicáveis e precedência documental (`AGENTS.md`, RCFs e demais documentos existentes), configuração Jekyll/Markdown, plugins/extensões, pipeline de transformação, implementação e acionamento de `jcem_accessibility=tabela_sem_caption`, TTS, renderização e testes. Reproduza o erro, identifique a tabela afetada, a origem precisa da regra e o estágio em que ela é aplicada. **NÃO presuma** que caption seja universalmente obrigatório para toda tabela, nem que a solução seja simplesmente desativar o validador.
2. **Resolva na camada apropriada:** aproveite os recursos de parser, extensões, AST, HTML renderizado ou outra abstração **efetivamente disponível**, escolhendo a solução mais simples e robusta que preserve sintaxes suportadas, ordem de processamento e contratos existentes. Diferentes sintaxes de autoria que produzam a mesma estrutura semântica DEVEM receber tratamento funcionalmente equivalente. NÃO introduza parser paralelo, dependência, conversão manual ou arquitetura nova sem necessidade demonstrada.
3. **Metadados em Markdown:** disponibilize/aperfeiçoe mecanismo declarativo para associar inequivocamente `caption` e demais informações pertinentes à tabela escrita em Markdown, com ergonomia análoga à dos modificadores de parágrafos e blockquotes **já existentes, se houver**. Investigue e reutilize primeiro sintaxe suportada pelo motor/plugins; somente defina extensão mínima se indispensável. Preserve conteúdo, alinhamento, células, cabeçalhos, links, notas e formatação; não anexe metadados à tabela errada nem os exponha como texto indevido.
4. **Semântica e validação:** quando houver legenda, gere associação semântica correta, preferencialmente `<caption>` dentro da `<table>` HTML final quando essa for a saída aplicável; não simule caption somente com estilo, tooltip ou texto desconectado. Avalie, conforme as regras reais do projeto e critérios de acessibilidade pertinentes, quando caption é requerido e quando outro contexto/nome acessível é suficiente. Corrija validações incompatíveis com sintaxes legítimas **sem dispensar exigências de acessibilidade justificadas**, sem inventar legendas e sem mascarar erros. Falhas restantes DEVEM apontar arquivo/local e correção viável em Markdown, quando tecnicamente possível.
5. **Consumidores e compatibilidade:** assegure que TTS e demais consumidores não dependam exclusivamente da sintaxe textual de uma tabela. Reutilize estrutura semântica normalizada quando compatível com o pipeline real, preservando leitura, ordem lógica, identificação dos cabeçalhos, caption e conteúdo, sem duplicações ou quebras em HTML, Markdown nativo e extensões suportadas. NÃO modifique comportamentos não relacionados nem degrade recursos já funcionais.
6. **Teste e comprove:** execute os testes aplicáveis e **`npm run dev-live -- --drafts`**, validando o build e a renderização real. Cubra tabelas Markdown sem/com caption, HTML existente, modificadores e sintaxes de extensões efetivamente instaladas, múltiplas tabelas próximas, metadados ausentes/inválidos, acessibilidade, TTS e regressões. Inspecione o HTML/resultado produzido, não apenas a ausência do erro. Se algum teste depender de serviço indisponível, registre a limitação e não declare aprovação.

## Restrições e aceite

- **É PROIBIDO** resolver apenas transformando tabelas `.md` em HTML, suprimindo indiscriminadamente a verificação, removendo tabelas/conteúdo, adicionando caption fictício, relaxando outras regras ou criando contornos específicos para um único artigo.
- Preserve compatibilidade retroativa, convenções, precedências normativas, processamento de plugins e segurança; atualize documentação e exemplos **somente na medida exigida** pelo mecanismo implementado.
- **Aceite:** o comando reproduzido deve compilar sem `jcem_accessibility=tabela_sem_caption` para tabelas validamente descritas pelo mecanismo suportado; captions e outros metadados DEVEM poder ser escritos sem abandonar Markdown; saída semântica, TTS, acessibilidade e demais consumidores DEVEM funcionar coerentemente em todas as sintaxes realmente admitidas, sem regressões.

**Entrega:** implemente a correção no repositório e informe sucintamente causa comprovada, arquivos alterados, sintaxe efetivamente suportada (com exemplo mínimo), testes executados/resultados e limitações reais. **NÃO declare êxito sem verificação.**
