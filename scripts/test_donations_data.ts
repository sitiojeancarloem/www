import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const TODO_PATH = new URL('../.ia.rules/state/TODO.ia.md', import.meta.url);
const DONATIONS_PATH = new URL('../_data/donations.json', import.meta.url);

function extractExpectations(todoContent: string) {
  const start = todoContent.indexOf('**Criar/atualizar `/doe`');
  const end = todoContent.indexOf('**Criar `/doe/obrigado`', start);
  assert.ok(start >= 0 && end > start, 'seção canônica de doações ausente');
  todoContent = todoContent.slice(start, end);
  const expectations: {
    pixPayload: string | null;
    pixKey: string | null;
    cryptos: Array<{ sigla: string; rede: string; endereco: string }>;
    paypalUrl: string | null;
  } = {
    pixPayload: null,
    pixKey: null,
    cryptos: [],
    paypalUrl: null,
  };

  // PIX: payload em backticks após "payload exato:"
  const pixPayloadMatch = todoContent.match(/payload exato:\s*`([^`]+)`/);
  if (pixPayloadMatch) {
    expectations.pixPayload = pixPayloadMatch[1];
  }

  // PIX: chave em backticks após "chave PIX (`<chave-pix>`):"
  const pixKeyMatch = todoContent.match(/chave PIX[^\n]*:\s*`([^`]+)`/);
  if (pixKeyMatch) {
    expectations.pixKey = pixKeyMatch[1];
  }

  // Criptomoedas: quatro linhas Dados iniciais com sigla, endereço e rede
  const cryptoLines = todoContent.match(/- `([A-Z]+)` \/?[^\r\n—]*—\s*`([^`]+)`\s*—\s*rede\s+`([^`]+)`/g);
  if (cryptoLines) {
    cryptoLines.forEach((line) => {
      const match = line.match(/- `([A-Z]+)` \/?[^\r\n—]*—\s*`([^`]+)`\s*—\s*rede\s+`([^`]+)`/);
      if (match) {
        expectations.cryptos.push({
          sigla: match[1],
          rede: match[3],
          endereco: match[2],
        });
      }
    });
  }

  // PayPal: URL após "Usar link exato:"
  const paypalUrlMatch = todoContent.match(/Usar link exato:\s*`(https:\/\/[^`]+)`/);
  if (paypalUrlMatch) {
    expectations.paypalUrl = paypalUrlMatch[1];
  }

  return expectations;
}

function validateDonationsJson(json: any, expectations: any) {
  // schemaVersion=1
  assert.strictEqual(json.schemaVersion, 1, 'schemaVersion deve ser 1');

  // seis métodos
  assert.strictEqual(json.methods.length, 6, 'deve haver seis métodos');

  assert.ok(Array.isArray(json.methods));
  for (const m of json.methods) {
    assert.ok(['pix', 'crypto', 'paypal'].includes(m.type));
    for (const k of ['id', 'label', ...(m.type === 'crypto' ? ['symbol', 'name', 'network', 'address'] : m.type === 'pix' ? ['key', 'payload'] : ['url'])]) {
      assert.ok(typeof m[k] === 'string' && m[k].trim().length > 0, 'campo obrigatório: ' + k);
    }
  }

  // IDs únicos
  const ids = json.methods.map((m: any) => m.id);
  const uniqueIds = new Set(ids);
  assert.strictEqual(uniqueIds.size, ids.length, 'IDs devem ser únicos');

  // PIX
  const pixMethod = json.methods.find((m: any) => m.type === 'pix');
  assert.ok(pixMethod, 'método PIX deve existir');
  assert.strictEqual(pixMethod.key, expectations.pixKey, 'chave PIX deve corresponder');
  assert.strictEqual(pixMethod.payload, expectations.pixPayload, 'payload PIX deve corresponder');

  // Criptomoedas: quatro correspondentes por sigla e rede
  const cryptoMethods = json.methods.filter((m: any) => m.type === 'crypto');
  assert.strictEqual(cryptoMethods.length, 4, 'deve haver quatro criptomoedas');

  expectations.cryptos.forEach((expected: any) => {
    const found = cryptoMethods.find(
      (m: any) => m.symbol === expected.sigla && m.network === expected.rede
    );
    assert.ok(found, `criptomoeda ${expected.sigla} na rede ${expected.rede} deve existir`);
    assert.strictEqual(found.address, expected.endereco, `endereço de ${expected.sigla} deve corresponder`);
  });

  // PayPal
  const paypalMethod = json.methods.find((m: any) => m.type === 'paypal');
  assert.ok(paypalMethod, 'método PayPal deve existir');
  assert.strictEqual(paypalMethod.url, expectations.paypalUrl, 'URL PayPal deve corresponder');
  assert.strictEqual(paypalMethod.minimumAmount, 10, 'PayPal mínimo deve ser 10');
  assert.strictEqual(paypalMethod.currency, 'BRL', 'PayPal moeda deve ser BRL');
  assert.strictEqual(paypalMethod.amountMode, 'free', 'PayPal valor livre deve ser true');

  // Validação adicional: key presente no payload PIX
  assert.ok(
    expectations.pixPayload.includes(expectations.pixKey),
    'chave PIX deve estar presente no payload'
  );

  // Validação adicional: PayPal URL HTTPS host www.paypal.com sem credenciais
  const paypalUrlObj = new URL(paypalMethod.url);
  assert.strictEqual(paypalUrlObj.protocol, 'https:', 'PayPal deve usar HTTPS');
  assert.strictEqual(paypalUrlObj.hostname, 'www.paypal.com', 'PayPal host deve ser www.paypal.com');
  assert.strictEqual(paypalUrlObj.pathname, '/donate/', 'PayPal path deve ser /donate/');
  assert.strictEqual(paypalUrlObj.username, '');
  assert.strictEqual(paypalUrlObj.password, '');
}

try {
  const todoContent = readFileSync(TODO_PATH, 'utf-8');
  const expectations = extractExpectations(todoContent);

  // Verificar extração fechada: exigir um payload, uma chave, quatro tuplas e um URL
  assert.ok(expectations.pixPayload, 'extração de payload PIX deve falhar fechado');
  assert.ok(expectations.pixKey, 'extração de chave PIX deve falhar fechado');
  assert.strictEqual(expectations.cryptos.length, 4, 'extração de criptomoedas deve falhar fechado');
  assert.ok(expectations.paypalUrl, 'extração de URL PayPal deve falhar fechado');

  const donationsJson = JSON.parse(readFileSync(DONATIONS_PATH, 'utf-8'));
  validateDonationsJson(donationsJson, expectations);

  console.log('Teste aprovado: _data/donations.json está correto.');
  process.exit(0);
} catch (err: any) {
  console.error('Falha no teste:', err.message);
  process.exit(1);
}
