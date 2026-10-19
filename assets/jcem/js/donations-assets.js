const slug = /^[a-z0-9-]+$/;
function text(value) {
    if (typeof value !== 'string' || !value.trim() || value.length > 4096)
        throw new Error('Texto de asset inválido');
}
export function validateDonationAssets(value) {
    if (!Array.isArray(value) || value.length > 64)
        throw new Error('Catálogo inválido');
    const ids = new Set();
    for (let i = 0; i < value.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(value, i))
            throw new Error('Catálogo esparso');
        const item = value[i];
        if (!item || typeof item !== 'object' || Array.isArray(item))
            throw new Error('Asset inválido');
        for (const field of ['id', 'path', 'source', 'license', 'sha256']) {
            if (!Object.prototype.hasOwnProperty.call(item, field))
                throw new Error('Campo de asset ausente');
            text(item[field]);
        }
        if (!slug.test(item.id) || ids.has(item.id))
            throw new Error('ID de asset inválido ou duplicado');
        ids.add(item.id);
        if (!/^\/assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:svg|png|webp|gif)$/.test(item.path))
            throw new Error('Path de asset inválido');
        if (!/^https:\/\//.test(item.source))
            throw new Error('Fonte de asset inválida');
        const url = new URL(item.source);
        if (url.protocol !== 'https:' || url.username || url.password || url.port)
            throw new Error('Fonte de asset insegura');
        if (!/^[a-f0-9]{64}$/.test(item.sha256))
            throw new Error('Hash de asset inválido');
    }
}
export function resolveDonationAsset(catalog, id) {
    var _a;
    validateDonationAssets(catalog);
    text(id);
    if (!slug.test(id))
        throw new Error('ID de asset inválido');
    return (_a = catalog.find(asset => asset.id === id)) !== null && _a !== void 0 ? _a : null;
}
