# FT-070 — Impressão IEEE mobile e pós-crítica

Estado: pendente. Fonte: `TODO.ia.md`.

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
