import {validateDonationAssets} from './donations-assets.js';
import type {DonationAsset} from './donations-assets.js';
// Tipos baseados em _data/donations.json
// Validação estrutural pura, sem IO/DOM/dependência, browser-compatible.

export type DonationMethodType = 'pix' | 'crypto' | 'paypal';

interface DonationBase { readonly id: string; readonly label: string; readonly iconAssetId?: string; readonly networkAssetId?: string; }
export type DonationMethod =
  | (DonationBase & { readonly type: 'pix'; readonly key: string; readonly payload: string })
  | (DonationBase & { readonly type: 'crypto'; readonly symbol: string; readonly name: string; readonly network: string; readonly address: string })
  | (DonationBase & { readonly type: 'paypal'; readonly url: string; readonly minimumAmount: number; readonly currency: string; readonly amountMode: 'free' });

export interface DonationsData {
  readonly schemaVersion: 1;
  readonly methods: readonly DonationMethod[];
  readonly assets?: readonly DonationAsset[];
}

// Expressões regulares auxiliares
const SLUG_REGEX = /^[a-z0-9-]+$/;
const CURRENCY_REGEX = /^[A-Z]{3}$/;

/**
 * Valida string não vazia e dentro do limite de comprimento.
 */
function validateNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} deve ser uma string`);
  }
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} não pode ser vazia`);
  }
  if (value.length > 4096) {
    throw new Error(`${fieldName} excede o limite de 4096 caracteres`);
  }
}

/**
 * Valida slug minúsculo seguro (letras minúsculas, dígitos e hífen).
 */
function validateSlug(value: unknown, fieldName: string): asserts value is string {
  validateNonEmptyString(value, fieldName);
  if (!SLUG_REGEX.test(value)) {
    throw new Error(`${fieldName} deve ser um slug minúsculo seguro (ex: "pix", "bitcoin-legacy")`);
  }
}

/**
 * Valida array denso (sem buracos) com tamanho entre 1 e 64.
 */
function validateNonEmptyDenseArray(value: unknown, fieldName: string): asserts value is readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} deve ser um array`);
  }
  if (value.length === 0) {
    throw new Error(`${fieldName} deve conter pelo menos 1 elemento`);
  }
  if (value.length > 64) {
    throw new Error(`${fieldName} deve conter no máximo 64 elementos`);
  }
  for (let i = 0; i < value.length; i++) {
    if (value[i] === undefined) {
      throw new Error(`${fieldName} não pode conter buracos (valores undefined)`);
    }
  }
}

/**
 * Valida número finito e não negativo.
 */
function validateNonNegativeFinite(value: unknown, fieldName: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldName} deve ser um número finito`);
  }
  if (value < 0) {
    throw new Error(`${fieldName} não pode ser negativo`);
  }
}

/**
 * Valida URL HTTPS com host e path específicos para PayPal.
 */
function validatePaypalUrl(value: unknown): asserts value is string {
  validateNonEmptyString(value, 'url (PayPal)');
  const parsed = new URL(value);
  if (parsed.hostname !== 'www.paypal.com') {
    throw new Error('url (PayPal) deve ter host "www.paypal.com"');
  }
  if (parsed.port !== '' && parsed.port !== '443') {
    throw new Error('url (PayPal) não pode especificar porta não padrão');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('url (PayPal) deve usar protocolo HTTPS');
  }
  if (parsed.pathname !== '/donate/') {
    throw new Error('url (PayPal) deve ter path igual a "/donate/"');
  }
  if (parsed.username !== '' || parsed.password !== '') {
    throw new Error('url (PayPal) não pode conter credenciais');
  }
}

/**
 * Valida um único método de doação.
 */
export function validateDonationMethod(value: unknown, index: number = 0): asserts value is DonationMethod {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`methods[${index}] deve ser um objeto`);
  }

  const method = value as DonationMethod;

  // id
  validateSlug(method.id, `methods[${index}].id`);

  // type
  if (method.type !== 'pix' && method.type !== 'crypto' && method.type !== 'paypal') {
    throw new Error(`methods[${index}].type deve ser "pix", "crypto" ou "paypal"`);
  }

  for (const field of ['iconAssetId', 'networkAssetId'] as const) {
    const reference = method[field];
    if (reference !== undefined) {
      validateSlug(reference, field);
      if (field === 'networkAssetId' && method.type !== 'crypto') throw new Error('Somente cripto possui ícone de rede');
    }
  }
  // label
  validateNonEmptyString(method.label, `methods[${index}].label`);

  if (method.type === 'pix') {
    validateNonEmptyString(method.key, `methods[${index}].key`);
    validateNonEmptyString(method.payload, `methods[${index}].payload`);
  }

  // address (obrigatório para crypto)
  if (method.type === 'crypto') {
    validateNonEmptyString(method.address, `methods[${index}].address`);
  }

  // symbol, name e network (obrigatórios para crypto)
  if (method.type === 'crypto') {
    validateNonEmptyString(method.symbol, `methods[${index}].symbol`);
    validateNonEmptyString(method.name, `methods[${index}].name`);
    validateNonEmptyString(method.network, `methods[${index}].network`);
  }

  // minimumAmount (obrigatório para paypal)
  if (method.type === 'paypal') {
    if (method.minimumAmount === undefined) {
      throw new Error(`methods[${index}].minimumAmount é obrigatório para tipo "${method.type}"`);
    }
    validateNonNegativeFinite(method.minimumAmount, `methods[${index}].minimumAmount`);
  }

  // currency (obrigatório para paypal)
  if (method.type === 'paypal') {
    validateNonEmptyString(method.currency, `methods[${index}].currency`);
    if (!CURRENCY_REGEX.test(method.currency)) {
      throw new Error(`methods[${index}].currency deve ser uma sigla de 3 letras maiúsculas (ex: "USD", "BRL")`);
    }
  }

  // amountMode (obrigatório para paypal)
  if (method.type === 'paypal') {
    if (method.amountMode !== 'free') {
      throw new Error(`methods[${index}].amountMode deve ser "free"`);
    }
  }

  // url (obrigatório para paypal)
  if (method.type === 'paypal') {
    if (method.url === undefined) {
      throw new Error(`methods[${index}].url é obrigatório para tipo "paypal"`);
    }
    validatePaypalUrl(method.url);
  }
}

/**
 * Valida um array de métodos de doação, garantindo unicidade de id.
 */
function validateDonationMethodsArray(value: unknown): asserts value is readonly DonationMethod[] {
  validateNonEmptyDenseArray(value, 'methods');

  const seenIds = new Set<string>();
  for (let i = 0; i < (value as readonly unknown[]).length; i++) {
    const method = (value as readonly unknown[])[i];
    validateDonationMethod(method, i);

    const id = (method as DonationMethod).id;
    if (seenIds.has(id)) {
      throw new Error(`methods[${i}].id "${id}" duplicado (IDs devem ser únicos)`);
    }
    seenIds.add(id);
  }
}

/**
 * Valida o objeto completo de dados de doação.
 * Lança Error se inválido; não modifica o valor.
 */
export function validateDonationsData(value: unknown): asserts value is DonationsData {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('donationsData deve ser um objeto');
  }

  const data = value as DonationsData;

  // schemaVersion
  if (data.schemaVersion !== 1) {
    throw new Error('schemaVersion deve ser 1');
  }

  // methods
  validateDonationMethodsArray(data.methods);
  if (data.assets !== undefined) validateDonationAssets(data.assets);
  for (const method of data.methods) {
    for (const reference of [method.iconAssetId, method.networkAssetId]) {
      if (reference !== undefined && !data.assets?.some(asset => asset.id === reference)) throw new Error('Referência de asset ausente no catálogo');
    }
  }
}
