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
