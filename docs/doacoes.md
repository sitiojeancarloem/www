<!-- AI-PROCESSED -->
# Doações — APIs de assets e ações

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
