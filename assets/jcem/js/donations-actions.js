import { validateDonationMethod } from './donations-data.js';
export function getDonationCopyValue(method) {
    validateDonationMethod(method);
    return method.type === 'pix' ? method.key : method.type === 'crypto' ? method.address : null;
}
export function shortenDonationAddress(value) {
    if (typeof value !== 'string' || !value.trim() || value.length > 4096)
        throw new Error('Endereço inválido');
    const characters = Array.from(value);
    return characters.length <= 10 ? value : characters.slice(0, 4).join('') + '…' + characters.slice(-5).join('');
}
export async function copyDonationValue(method, clipboard) {
    const value = getDonationCopyValue(method);
    if (value === null || !clipboard || typeof clipboard.writeText !== 'function')
        throw new Error('Cópia indisponível');
    await clipboard.writeText(value);
}
export function getDonationQrBlob(canvas) {
    return new Promise((resolve, reject) => {
        if (!canvas || typeof canvas.toBlob !== 'function') {
            reject(new Error('Exportação indisponível'));
            return;
        }
        canvas.toBlob(blob => {
            if (!blob || blob.type !== 'image/png')
                reject(new Error('Exportação PNG falhou'));
            else
                resolve(blob);
        }, 'image/png');
    });
}
