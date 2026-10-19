import { validateDonationAssets } from './donations-assets.js';
const SLUG_REGEX = /^[a-z0-9-]+$/;
const CURRENCY_REGEX = /^[A-Z]{3}$/;
function validateNonEmptyString(value, fieldName) {
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
function validateSlug(value, fieldName) {
    validateNonEmptyString(value, fieldName);
    if (!SLUG_REGEX.test(value)) {
        throw new Error(`${fieldName} deve ser um slug minúsculo seguro (ex: "pix", "bitcoin-legacy")`);
    }
}
function validateNonEmptyDenseArray(value, fieldName) {
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
function validateNonNegativeFinite(value, fieldName) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`${fieldName} deve ser um número finito`);
    }
    if (value < 0) {
        throw new Error(`${fieldName} não pode ser negativo`);
    }
}
function validatePaypalUrl(value) {
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
export function validateDonationMethod(value, index = 0) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`methods[${index}] deve ser um objeto`);
    }
    const method = value;
    validateSlug(method.id, `methods[${index}].id`);
    if (method.type !== 'pix' && method.type !== 'crypto' && method.type !== 'paypal') {
        throw new Error(`methods[${index}].type deve ser "pix", "crypto" ou "paypal"`);
    }
    for (const field of ['iconAssetId', 'networkAssetId']) {
        const reference = method[field];
        if (reference !== undefined) {
            validateSlug(reference, field);
            if (field === 'networkAssetId' && method.type !== 'crypto')
                throw new Error('Somente cripto possui ícone de rede');
        }
    }
    validateNonEmptyString(method.label, `methods[${index}].label`);
    if (method.type === 'pix') {
        validateNonEmptyString(method.key, `methods[${index}].key`);
        validateNonEmptyString(method.payload, `methods[${index}].payload`);
    }
    if (method.type === 'crypto') {
        validateNonEmptyString(method.address, `methods[${index}].address`);
    }
    if (method.type === 'crypto') {
        validateNonEmptyString(method.symbol, `methods[${index}].symbol`);
        validateNonEmptyString(method.name, `methods[${index}].name`);
        validateNonEmptyString(method.network, `methods[${index}].network`);
    }
    if (method.type === 'paypal') {
        if (method.minimumAmount === undefined) {
            throw new Error(`methods[${index}].minimumAmount é obrigatório para tipo "${method.type}"`);
        }
        validateNonNegativeFinite(method.minimumAmount, `methods[${index}].minimumAmount`);
    }
    if (method.type === 'paypal') {
        validateNonEmptyString(method.currency, `methods[${index}].currency`);
        if (!CURRENCY_REGEX.test(method.currency)) {
            throw new Error(`methods[${index}].currency deve ser uma sigla de 3 letras maiúsculas (ex: "USD", "BRL")`);
        }
    }
    if (method.type === 'paypal') {
        if (method.amountMode !== 'free') {
            throw new Error(`methods[${index}].amountMode deve ser "free"`);
        }
    }
    if (method.type === 'paypal') {
        if (method.url === undefined) {
            throw new Error(`methods[${index}].url é obrigatório para tipo "paypal"`);
        }
        validatePaypalUrl(method.url);
    }
}
function validateDonationMethodsArray(value) {
    validateNonEmptyDenseArray(value, 'methods');
    const seenIds = new Set();
    for (let i = 0; i < value.length; i++) {
        const method = value[i];
        validateDonationMethod(method, i);
        const id = method.id;
        if (seenIds.has(id)) {
            throw new Error(`methods[${i}].id "${id}" duplicado (IDs devem ser únicos)`);
        }
        seenIds.add(id);
    }
}
export function validateDonationsData(value) {
    var _a;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error('donationsData deve ser um objeto');
    }
    const data = value;
    if (data.schemaVersion !== 1) {
        throw new Error('schemaVersion deve ser 1');
    }
    validateDonationMethodsArray(data.methods);
    if (data.assets !== undefined)
        validateDonationAssets(data.assets);
    for (const method of data.methods) {
        for (const reference of [method.iconAssetId, method.networkAssetId]) {
            if (reference !== undefined && !((_a = data.assets) === null || _a === void 0 ? void 0 : _a.some(asset => asset.id === reference)))
                throw new Error('Referência de asset ausente no catálogo');
        }
    }
}
