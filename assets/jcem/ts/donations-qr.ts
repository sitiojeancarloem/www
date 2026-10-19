import {validateDonationsData} from './donations-data.js';
import type {DonationMethod} from './donations-data.js';

export interface DonationQrSpec { readonly payload: string; readonly caption: string; }

export function getDonationQrSpec(method: DonationMethod, siteUrl: string): DonationQrSpec | null {
  validateDonationsData({schemaVersion: 1, methods: [method]});
  if (method.type === 'paypal') return null;
  if (method.type === 'pix') return {payload: method.payload, caption: 'PIX: ' + method.key};
  const url = new URL(siteUrl);
  if (url.protocol !== 'https:' || url.username !== '' || url.password !== '' || !url.hostname) {
    throw new Error('URL canônica do site inválida');
  }
  const domain = url.hostname.replace(/^www\./, '');
  return {payload: method.address, caption: method.symbol.toUpperCase() + ' | ' + domain};
}
