# FT-070 — Impressão IEEE mobile e pós-crítica

Estado normativo: concluído. Implementação: FT-071 concluída tecnicamente pelo commit `2dd99ad4bb` e integrada pela FT-074; validação humana da frente permanece externa. Fonte: `TODO.ia.md`.

## Baseline e inventário

- CSS IEEE é entregue com `media="print"` para todo artigo, sem exclusão por dispositivo.
- O módulo JS é importado dinamicamente por `assets/jcem/ts/site.ts`; `beforeprint` e `matchMedia('print')` preparam imediatamente.
- A preparação preventiva atual usa `setTimeout(..., 5000)` antes de `requestIdleCallback`, atraso arbitrário que não comprova conclusão de imagens nem outros recursos relevantes.
- A biblioteca é idempotente por promessa compartilhada, mas o agendamento não declara estado observável de pós-carga.

## Estado-alvo preservador

- manter CSS `media=print`, `beforeprint`, `afterprint`, perfil e DOM impresso;
- remover qualquer dependência de user-agent, largura, orientação ou classe mobile;
- aguardar `document.readyState === 'complete'`/`load` e imagens relevantes já descobertas, sem bloquear a página;
- após a carga útil, executar por idle; fallback usa tarefa assíncrona sem prazo arbitrário para fingir ociosidade;
- evento de impressão continua preemptivo e não espera idle.

## Métricas e validação

- registrar instante de `load`, agendamento e preparo em atributos/eventos testáveis, sem telemetria externa;
- provar importação ausente antes do pós-carregamento e presente depois do idle;
- executar desktop/mobile, orientação/resize, impressão e testes estruturais; comparar bytes/requisições críticas quando disponível.

Resultado normativo: o perfil IEEE é único para desktop/mobile; metadados inertes substituem links de stylesheet no caminho crítico; `load` + fontes + imagens relevantes + idle formam a preparação preventiva, e `beforeprint`/`matchMedia` são preempções obrigatórias. `rcf-trace validate`: `entries=371`, `material=340`.

## Resultado técnico consolidado

- FT-071 materializou CSS IEEE como metadado inerte e passou a carregar estilos, módulo e preparação somente após `load`, fontes, imagens relevantes e idle, com preempção imediata por `beforeprint`/`matchMedia('print')`.
- A mesma capacidade atende desktop e mobile sem decisão por user-agent, largura, orientação, toque ou DPR; falha parcial preserva o artigo legível.
- O commit causal é `2dd99ad4bb`; a sincronização causal correspondente é `be4a1d89a7`.
- As FTs FT-074, FT-077, FT-086 e FT-087 alteraram e ampliaram a impressão posteriormente sem reabrir nem regredir FT-071.
- Na reconciliação de 2026-09-21, `check:print`, `check:performance`, `check:documentation`, `check:ts`, build Jekyll isolado e runtime real em quatro páginas nos perfis desktop/mobile aprovaram.
