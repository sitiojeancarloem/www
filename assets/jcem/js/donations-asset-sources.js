/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */
import { validateDonationAssets } from './donations-assets.js';
export function getDonationAssetSources(asset) {
    validateDonationAssets([asset]);
    const source = asset.source;
    if (!source.startsWith('https://raw.githubusercontent.com/')) {
        throw new Error('Fonte inválida: prefixo esperado https://raw.githubusercontent.com/');
    }
    const rest = source.slice('https://raw.githubusercontent.com/'.length);
    const parts = rest.split('/');
    if (parts.length < 4) {
        throw new Error('Fonte inválida: formato owner/repo/ref/path não encontrado');
    }
    const owner = parts[0];
    const repo = parts[1];
    const ref = parts[2];
    const file = parts.slice(3).join('/');
    if (!owner || !repo || !ref || !file) {
        throw new Error('Fonte inválida: segmentos vazios');
    }
    if (parts.some(part => !part || part === '.' || part === '..' || !/^[A-Za-z0-9_.-]+$/.test(part))) {
        throw new Error('Fonte inválida: segmento inválido');
    }
    if (ref.includes('/') || ref.includes('\\') || ref.includes('@') || ref.includes('#') || ref.includes('?') || ref.includes('=')) {
        throw new Error('Fonte inválida: ref contém caracteres inválidos');
    }
    const isHex40 = /^[a-f0-9]{40}$/;
    const isRelease = /^v?\d+\.\d+\.\d+$/;
    if (!isHex40.test(ref) && !isRelease.test(ref)) {
        throw new Error('Fonte inválida: ref deve ser commit SHA-1 hex ou release vX.Y.Z');
    }
    const primaryUrl = asset.source;
    const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${file}`;
    return Object.freeze([
        Object.freeze({ id: 'primary', url: primaryUrl }),
        Object.freeze({ id: 'jsdelivr', url: jsdelivrUrl }),
    ]);
}
