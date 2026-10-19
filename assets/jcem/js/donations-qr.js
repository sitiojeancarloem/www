import { validateDonationsData } from './donations-data.js';
export function getDonationQrSpec(method, siteUrl) {
    validateDonationsData({ schemaVersion: 1, methods: [method] });
    if (method.type === 'paypal')
        return null;
    if (method.type === 'pix')
        return { payload: method.payload, caption: 'PIX: ' + method.key };
    const url = new URL(siteUrl);
    if (url.protocol !== 'https:' || url.username !== '' || url.password !== '' || !url.hostname) {
        throw new Error('URL canônica do site inválida');
    }
    const domain = url.hostname.replace(/^www\./, '');
    return { payload: method.address, caption: method.symbol.toUpperCase() + ' | ' + domain };
}
