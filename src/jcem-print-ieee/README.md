# @jcem/print-ieee

Biblioteca sem efeito colateral na importação para preparar artigos editoriais para impressão nativa. A API pública não depende de Jekyll, Ruby, tema ou DOM privado do consumidor.

```js
import { prepareArticle } from '@jcem/print-ieee';

const controller = prepareArticle(document.querySelector('[data-print-article]'));
console.log(controller.getState()); // nativo-preparado
```

O estado `ieee-validado` só deve ser marcado após aferição física/PDF e relatório contra o perfil. O perfil `ieee-conference-a4-ieeetran-1.8b` referencia o IEEEtran 1.8b sob LPPL-1.3c, registra o hash do arquivo de controle e não redistribui esse arquivo. A biblioteca e seus artefatos próprios usam MPL-2.0; `npm run build:print` materializa a licença no pacote extraível.

O relatório inicial `reports/2026-08-09-devaneios-chromium-148.json` registra a saída aferida, seus hashes, parâmetros, desvios e verificações. Essa evidência não eleva automaticamente a classificação de outra impressão.

Suporte declarado: ES2020; Node.js 20+ para build/teste; Chromium 140+, Firefox 141+ e Safari 18+ para CSS Paged Media e multicolunas. A integração Jekyll é estática e não cria dependência de runtime.

## Autoria

Jean Carlo EM — https://www.jeancarloem.com

## Repositório

https://github.com/sitiojeancarloem/blog

## Licença

Mozilla Public License 2.0 — https://mozilla.org/MPL/2.0/
