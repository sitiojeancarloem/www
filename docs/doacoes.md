<!-- AI-PROCESSED -->
# Doações — dados, QR, assets e ações

Escopo atual: helpers existentes. A página pública /doe, seus controles acessíveis e o download na interface pertencem à FT-108; esta documentação não afirma sua implementação.

## Fonte única

Dados em `_data/donations.json` com esquema versionado, meios, assets e metadados.

## APIs exportadas

### `assets/jcem/ts/donations-assets.ts`

- `validateDonationAssets(value: unknown): void` — valida catálogo de assets (máx. 64 itens, IDs únicos, paths e hashes válidos).
- `resolveDonationAsset(catalog: unknown, id: string): DonationAsset | null` — resolve asset por ID; retorna `null` se não encontrado.
- `DonationAsset` — interface com `id`, `path`, `source`, `license`, `sha256`.

### `assets/jcem/ts/donations-actions.ts`

- `getDonationCopyValue(method: DonationMethod): string | null` — extrai chave/endereço para cópia; `null` para PayPal.
- `shortenDonationAddress(value: string): string` — encurta até 10 caracteres Unicode; a UI deve disponibilizar separadamente o valor integral às tecnologias assistivas.
- `copyDonationValue(method: DonationMethod, clipboard: Pick<Clipboard, 'writeText'>): Promise<void>` — copia o valor integral pela interface clipboard recebida; rejeita se indisponível e propaga falhas de writeText.
- `getDonationQrBlob(canvas: HTMLCanvasElement): Promise<Blob>` — exporta PNG do canvas; rejeita se `toBlob` não disponível ou tipo inválido.

<!-- donations-qr-spec:begin -->
### `assets/jcem/ts/donations-qr.ts` — especificação do QR

Fonte: [módulo TypeScript](../assets/jcem/ts/donations-qr.ts).

- `DonationQrSpec`: objeto com `payload: string` e `caption: string` somente leitura.
- `getDonationQrSpec(method: DonationMethod, siteUrl: string): DonationQrSpec | null`
- O método é validado por `validateDonationMethod` antes da seleção do resultado. PayPal retorna `null`, sem criar QR.
- PIX usa o payload informado nos dados e a legenda `PIX: ` seguida da chave; não reconstrói o payload.
- Criptomoeda usa o endereço como payload e a legenda com símbolo em maiúsculas, separador ` | ` e hostname do site sem o prefixo `www.`.
- `siteUrl` é interpretada somente no ramo de criptomoedas: deve ser URL HTTPS com hostname e sem usuário ou senha. Entrada inválida lança erro.
- Esta função retorna dados; não desenha, exporta nem decodifica o QR.

<!-- donations-qr-spec:end -->
<!-- donations-data-contract:begin -->
### Dados de doação (`DonationsData`)

#### Estrutura canônica

O módulo `assets/jcem/ts/donations-data.ts` define tipos e validações estruturais para o JSON canônico de meios de doação.

##### Tipos principais

- `DonationMethodType`: `'pix' | 'crypto' | 'paypal'`
- `DonationMethod`: união discriminada por `type` com campos obrigatórios e opcionais
- `DonationsData`: objeto com `schemaVersion: 1`, `methods: readonly DonationMethod[]` e `assets?: readonly DonationAsset[]`

##### Validação de método (`validateDonationMethod`)

| Campo | Obrigatório | Validação | Limite/Formato |
|---|---|---|---|
| `id` | Sim | Slug minúsculo seguro (`/^[a-z0-9-]+$/`) | ≤4096 caracteres |
| `type` | Sim | `'pix'`, `'crypto'` ou `'paypal'` | — |
| `label` | Sim | String não vazia | ≤4096 caracteres |
| `iconAssetId` | Opcional | Slug seguro; resolução no validador de coleção | — |
| `networkAssetId` | Opcional | Slug seguro; **só para `crypto`**; resolução no validador de coleção | — |
| `key` | Sim (`pix`) | String não vazia | — |
| `payload` | Sim (`pix`) | String não vazia | — |
| `address` | Sim (`crypto`) | String não vazia | — |
| `symbol`, `name`, `network` | Sim (`crypto`) | Strings não vazias | — |
| `minimumAmount` | Sim (`paypal`) | Número finito ≥0 | — |
| `currency` | Sim (`paypal`) | Sigla maiúscula de 3 letras (`/^[A-Z]{3}$/`) | — |
| `amountMode` | Sim (`paypal`) | `'free'` | — |
| `url` | Sim (`paypal`) | HTTPS, host `www.paypal.com`, path `/donate/`, sem portas não padrão ou credenciais | — |

##### Validação de coleção (`validateDonationsData`)

- `methods`: array denso (sem `undefined`), tamanho entre 1 e 64, IDs únicos
- `assets`: quando presente, é validado por `validateDonationAssets`. Toda referência em `iconAssetId`/`networkAssetId` deve resolver no catálogo; uma referência com catálogo ausente também é rejeitada.
- `schemaVersion`: valor exato `1`

#### Extensão por dados

- Novas entradas dos tipos já suportados (`pix`, `crypto`, `paypal`) podem ser configuradas no JSON canônico com seus assets e campos obrigatórios. Um novo valor de `type` exige alteração do contrato e do código.
- Validações rejeitam valores fora dos formatos previstos (ex: porta não padrão em URL do PayPal, sigla de moeda inválida, array com buracos).

> Fonte: [`../assets/jcem/ts/donations-data.ts`](../assets/jcem/ts/donations-data.ts)

- Os validadores `validateNonEmptyString` e `validateSlug` limitam as strings a 4096 caracteres e rejeitam conteúdo vazio após `trim`; as restrições adicionais da tabela continuam aplicáveis.
- `validateDonationMethod(value: unknown, index: number = 0): asserts value is DonationMethod` valida um método sem consultar o catálogo.
- `validateDonationsData(value: unknown): asserts value is DonationsData` valida o objeto completo, incluindo unicidade dos IDs e referências. Os validadores lançam erro diante de entrada inválida, sem modificar o valor; validação estrutural não autentica o destinatário financeiro.

<!-- donations-data-contract:end -->

<!-- donations-matrix-canvas:begin -->
### APIs de geração e renderização de QR Codes

Fontes: [matriz e fábrica](../assets/jcem/ts/donations-qr.ts) e [renderização em canvas](../assets/jcem/ts/donations-qr-canvas.ts).

#### `createDonationQrMatrix(payload: string, factory: QrFactory): boolean[][]`

Gera a matriz binária a partir do payload e da fábrica injetada: chama `factory(0, 'H')` e adiciona o payload no modo `Byte`.

- **Entradas**:
  - `payload`: string não vazia, ≤ 4096 caracteres.
  - `factory`: função `(version: 0, correction: 'H') => QrEncoder` que implementa `addData`, `make`, `getModuleCount`, `isDark`.
- **Retorno**: matriz `boolean[][]` quadrada, dimensão `n = 21 + 4k`, entre 21 e 177.
- **Erros**: `Error` para payload/factory inválidos, dimensão inválida ou módulos retornados sem tipo booleano; erros do codificador injetado propagam-se.
- **Dependência browser**: nenhuma (executa em Node.js ou navegador).

#### `renderDonationQrBase(canvas: HTMLCanvasElement, matrix: readonly (readonly boolean[])[], caption: string): void`

Renderiza o QR Code em um `<canvas>` com moldura, módulos pretos e legenda azul.

- **Entradas**:
  - `canvas`: objeto com `getContext('2d')` disponível; requer as APIs de canvas do ambiente.
  - `matrix`: matriz válida conforme `createDonationQrMatrix`.
  - `caption`: string não vazia, ≤ 4096 caracteres.
- **Dimensões**: largura `(n + 8) * 8 + 32` px e altura igual à largura mais 64 px; módulo de 8 px e margem branca de quatro módulos, além da margem externa de 16 px.
- **Estilo**: fundo branco, módulos pretos, borda azul `#17324d`, legenda centralizada em 24 px.
- **Erros**: `Error` para canvas indisponível ou matriz inválida.

#### `renderDonationQrWithSymbol(canvas: HTMLCanvasElement, matrix: readonly (readonly boolean[])[], caption: string, symbol: ImageBitmap, area: {x: number; y: number; size: number}): void`

Sobrescreve a área central com um recorte do bitmap fornecido; as dimensões não autenticam sua identidade.

- **Entradas**:
  - `symbol`: `ImageBitmap` de 372×192 px.
  - `area`: coordenadas e tamanho do quadrado central, conforme `getCenteredQrSymbolArea`.
- **Comportamento**: limpa a área central e usa o recorte `(0, 0, 190, 192)` do bitmap de 372×192 px; ajusta-o proporcionalmente ao quadrado, com altura de `area.size * 8 - 4` px.
- **Erros**: `Error` para símbolo ou área inválidos.

**Notas**:

- As verificações descritas cobrem payload, geometria, legenda, módulos e dimensões do bitmap; não constituem autenticação do destinatário ou do símbolo.
- O desenho usa cores e geometria explícitas, sem consultar o tema. A rasterização depende do canvas e das fontes do ambiente.
- A decodificação automática deve ser feita separadamente, comparando byte a byte ao payload original.
<!-- donations-matrix-canvas:end -->

### Conector DOM de cópia

O módulo [donations-ui.ts](../assets/jcem/ts/donations-ui.ts) exporta `enhanceDonationCopy`, recebendo o elemento raiz, os dados ainda sujeitos à validação e uma interface de clipboard com `writeText`.

- A raiz contém os métodos identificados por `data-donation-id`, conforme a [partial canônica](../_includes/jcem/donations-content.html). O conector valida os dados antes de alterar o DOM e aprimora cada método uma única vez.
- PIX e criptomoedas recebem cópia integral, resumo visual de até dez caracteres e valor integral para tecnologias assistivas. PayPal conserva seu link e não recebe botão de cópia.
- O botão mantém seu nome e sua função nativa; o resultado aparece em uma região de status separada. Falha de clipboard orienta a cópia manual e preserva os campos existentes.
- O módulo não busca dados nem se inicializa automaticamente. A montagem na página, QR, aparência e fallback completo continuam nas unidades seguintes da FT-108.

## Fontes

- [../RCFs/doacoes.md](../RCFs/doacoes.md)
- [../assets/jcem/ts/donations-assets.ts](../assets/jcem/ts/donations-assets.ts)
- [../assets/jcem/ts/donations-actions.ts](../assets/jcem/ts/donations-actions.ts)

## Restrições reais

- Hash é validação estrutural (integridade física cabe verificador).
- Encurtador usa 4+1+5 caracteres Unicode; não preserva acessibilidade por si.
- Cópia usa valor integral e clipboard injetado; o acesso ao sistema depende da implementação fornecida. O exemplo usa somente memória.
- `getDonationQrBlob` não baixa nem decodifica; depende de canvas renderizado.

O exemplo abaixo roda como módulo Node.js a partir da raiz do repositório (node --input-type=module, recebendo o bloco pela entrada padrão). Usa dados reais e clipboard em memória; não demonstra controles de UI.

<!-- donations-example:begin -->
```javascript
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateDonationAssets, resolveDonationAsset } from './assets/jcem/js/donations-assets.js';
import { getDonationCopyValue, shortenDonationAddress, copyDonationValue } from './assets/jcem/js/donations-actions.js';

const data = JSON.parse(readFileSync('_data/donations.json', 'utf8'));
validateDonationAssets(data.assets);
const method = data.methods.find(item => item.iconAssetId && getDonationCopyValue(item) !== null);
assert.ok(method);
const asset = resolveDonationAsset(data.assets, method.iconAssetId);
assert.ok(asset);
const value = getDonationCopyValue(method);
assert.equal(typeof value, 'string');
let copied;
await copyDonationValue(method, { writeText: async text => { copied = text; } });
assert.equal(copied, value);
assert.ok(Array.from(shortenDonationAddress(value)).length <= 10);
console.log('DONATIONS_DOCUMENTED_APIS_EXAMPLE_OK');
```
<!-- donations-example:end -->

## Dependências de interface

- FT-108: página `/doe` responsiva e acessível.
- FT-110: workflow mensal de verificação de assets.
