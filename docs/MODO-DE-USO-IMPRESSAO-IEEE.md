# Impressão editorial IEEE — modo de uso

Página canônica de uso subordinada ao [`RCF-JCEM-IMPRESSAO-IEEE-001`](../RCFs/impressao-ieee.md). O mesmo perfil `ieee-conference-a4-ieeetran-1.8b` atende desktop e mobile, sem seleção por user-agent, largura, orientação ou classe de dispositivo.

## Imprimir um artigo

1. Abra uma publicação individual.
2. Use o comando nativo **Imprimir** do navegador ou do sistema.
3. Selecione uma impressora ou **Salvar como PDF**.
4. Mantenha papel A4 e escala de 100% para corresponder ao perfil aferido.

O artigo impresso contém título, autoria, metadados, Resumo, Abstract, corpo em duas colunas, imagens/tabelas editoriais admitidas, lista final de URLs e bloco institucional. COVER, Hero, navegação, controles TTS, decoração web e modelos visuais de `blockquote` não integram a saída.

## Desktop e mobile

A capacidade é a mesma em desktop e mobile. O navegador móvel pode apresentar o destino como impressão, compartilhamento ou exportação PDF conforme o sistema e a impressora disponíveis; essa diferença de interface não altera perfil, conteúdo nem configuração preparados pelo site.

Nenhuma heurística de user-agent, largura, orientação, toque ou DPR desativa o recurso. Quando um navegador não oferecer impressão/PDF, o artigo permanece legível e o fallback é uma limitação registrada do ambiente, não uma versão reduzida do produto.

## Carregamento pós-crítico

Os endereços dos dois CSS de impressão chegam como metadados inertes e não iniciam download no caminho crítico. Depois de `window.load`, fontes e imagens editoriais relevantes, o conector agenda CSS, módulo e preparação por `requestIdleCallback`; navegadores sem essa API usam uma fila assíncrona por `MessageChannel`, sem atraso fixo.

`beforeprint` e `matchMedia('print')` preemptam essa espera quando a impressão começa cedo. Falha de CSS, módulo, fonte ou imagem não oculta nem substitui o artigo HTML.

## Verificação técnica

```powershell
npm run check:print
npm run check:performance
npm run build:prod
$env:JCEM_SITE_ROOT='_site'; npm run check:print:runtime
```

Os dois primeiros comandos validam perfil, API, isolamento, metadados inertes, agendamento e desempenho. Após o build, `check:print:runtime` confirma em navegador real os perfis desktop/mobile e a rede sem assets IEEE antes da fase pós-crítica. A inspeção visual deve ainda conferir retrato/paisagem, claro/escuro e impressão antecipada.
