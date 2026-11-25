/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */
function getExtensionFromPath(path) {
    const lastDot = path.lastIndexOf('.');
    if (lastDot === -1)
        return '';
    return path.slice(lastDot + 1).toLowerCase();
}
function getSupportedMimeForExtension(ext) {
    switch (ext) {
        case 'png': return 'image/png';
        case 'svg': return 'image/svg+xml';
        case 'webp': return 'image/webp';
        case 'gif': return 'image/gif';
        default: return null;
    }
}
function verifySignature(body, ext) {
    switch (ext) {
        case 'png':
            if (body.length < 8)
                return false;
            return body[0] === 0x89 && body[1] === 0x50 && body[2] === 0x4e && body[3] === 0x47 &&
                body[4] === 0x0d && body[5] === 0x0a && body[6] === 0x1a && body[7] === 0x0a;
        case 'gif':
            if (body.length < 6)
                return false;
            const header = new TextDecoder().decode(body.slice(0, 6));
            return header === 'GIF87a' || header === 'GIF89a';
        case 'webp':
            if (body.length < 12)
                return false;
            const riff = new TextDecoder().decode(body.slice(0, 4));
            const webp = new TextDecoder().decode(body.slice(8, 12));
            return riff === 'RIFF' && webp === 'WEBP';
        case 'svg':
            if (body.length === 0)
                return false;
            try {
                const text = new TextDecoder('utf-8', { fatal: true }).decode(body).trimStart();
                return /^(?:<\?xml\s[\s\S]*?\?>\s*)?<svg(?:\s|\/?>)/.test(text);
            }
            catch {
                return false;
            }
        default:
            return false;
    }
}
async function computeSHA256(body) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', Uint8Array.from(body));
    const hex = Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return hex;
}
export async function verifyDonationAssetResponse(asset, response, maxBytes) {
    var _a;
    if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) {
        return { ok: false, reason: 'invalid_limit' };
    }
    if (response.status !== 200) {
        return { ok: false, reason: 'http_status' };
    }
    if (!(response.body instanceof Uint8Array)) {
        return { ok: false, reason: 'invalid_body' };
    }
    const byteLength = response.body.byteLength;
    if (byteLength === 0 || byteLength > maxBytes) {
        return { ok: false, reason: 'size' };
    }
    const ext = getExtensionFromPath(asset.path);
    const expectedMime = getSupportedMimeForExtension(ext);
    if (expectedMime === null) {
        return { ok: false, reason: 'unsupported_extension' };
    }
    const receivedMime = ((_a = response.contentType) !== null && _a !== void 0 ? _a : '').split(';', 1)[0].trim().toLowerCase();
    if (receivedMime !== expectedMime) {
        return { ok: false, reason: 'mime' };
    }
    if (!verifySignature(response.body, ext)) {
        return { ok: false, reason: 'signature' };
    }
    const computedHash = await computeSHA256(response.body);
    if (computedHash !== asset.sha256) {
        return { ok: false, reason: 'hash' };
    }
    return { ok: true, sha256: computedHash, contentType: expectedMime, byteLength };
}
