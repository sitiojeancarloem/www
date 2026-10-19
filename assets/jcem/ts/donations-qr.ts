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

export interface QrEncoder {
  addData(data: string, mode: 'Byte'): void;
  make(): void;
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}
export type QrFactory = (version: 0, correction: 'H') => QrEncoder;

export function createDonationQrMatrix(payload: string, factory: QrFactory): boolean[][] {
  if (typeof payload !== 'string' || payload.length === 0 || payload.length > 4096 || typeof factory !== 'function') {
    throw new Error('Entrada QR inválida');
  }
  const encoder = factory(0, 'H');
  encoder.addData(payload, 'Byte');
  encoder.make();
  const count = encoder.getModuleCount();
  if (!Number.isInteger(count) || count < 21 || count > 177 || (count - 21) % 4 !== 0) {
    throw new Error('Dimensão QR inválida');
  }
  return Array.from({length: count}, (_, row) => Array.from({length: count}, (_, col) => {
    const dark = encoder.isDark(row, col);
    if (typeof dark !== 'boolean') throw new Error('Módulo QR inválido');
    return dark;
  }));
}
