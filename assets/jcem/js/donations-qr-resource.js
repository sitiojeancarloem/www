/*!
  Autoria: JeanCarloEM — https://www.jeancarloem.com
  Origem: https://github.com/sitiojeancarloem/www
  Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — uso, cópia, modificação e distribuição conforme a licença; sem garantia.
  RCF: RCFs/doacoes.md
*/
import { getDonationQrSpec } from './donations-qr.js';
import { createDonationQrForSymbol } from './donations-qr-symbol.js';
import { renderDonationQrWithSymbol } from './donations-qr-canvas.js';
export async function prepareDonationQr(doc, method, siteUrl, logoUrl, signal) {
    if (signal.aborted) {
        throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
    }
    const spec = getDonationQrSpec(method, siteUrl);
    if (spec === null) {
        throw new Error('Método de doação não suportado para geração de QR');
    }
    if (signal.aborted) {
        throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
    }
    const base = doc.baseURI;
    const logoUrlObj = new URL(logoUrl, base);
    if (logoUrlObj.protocol !== 'http:' && logoUrlObj.protocol !== 'https:') {
        throw new Error('URL do logo deve usar http ou https');
    }
    if (logoUrlObj.username !== '' || logoUrlObj.password !== '') {
        throw new Error('URL do logo não deve conter credenciais');
    }
    if (logoUrlObj.origin !== new URL(base).origin) {
        throw new Error('URL do logo deve ter mesma origem do documento');
    }
    if (signal.aborted) {
        throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
    }
    const vendorModule = await import(new URL('../lib/qrcode-generator/2.0.4/qrcode.mjs', import.meta.url).href);
    const factory = vendorModule.default;
    if (typeof factory !== 'function') {
        throw new Error('Módulo QR vendor não expõe factory válido');
    }
    if (signal.aborted) {
        throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
    }
    let bitmap = null;
    try {
        const response = await fetch(logoUrlObj, { signal, redirect: 'error' });
        if (!response.ok) {
            throw new Error(`Falha ao carregar logo: ${response.status} ${response.statusText}`);
        }
        if (signal.aborted) {
            throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
        }
        const blob = await response.blob();
        if (signal.aborted) {
            throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
        }
        bitmap = await createImageBitmap(blob);
        if (signal.aborted) {
            throw (signal.reason === undefined ? new DOMException('Operação abortada', 'AbortError') : signal.reason);
        }
        const qrWithSymbol = createDonationQrForSymbol(spec.payload, factory);
        const canvas = doc.createElement('canvas');
        renderDonationQrWithSymbol(canvas, qrWithSymbol.matrix, spec.caption, bitmap, qrWithSymbol.symbolArea);
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', `Código QR de ${method.label}: ${spec.caption}`);
        return canvas;
    }
    finally {
        bitmap === null || bitmap === void 0 ? void 0 : bitmap.close();
    }
}
