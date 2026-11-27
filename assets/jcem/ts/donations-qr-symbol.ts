import {createDonationQrMatrix} from './donations-qr.js';
import type {QrEncoder} from './donations-qr.js';
import {getCenteredQrSymbolArea} from './donations-qr-geometry.js';

export interface DonationQrWithSymbol {
  matrix: boolean[][];
  symbolArea: {x: number; y: number; size: number};
  version: number;
}
export function createDonationQrForSymbol(payload: string, factory: (version: number, correction: 'H') => QrEncoder): DonationQrWithSymbol {
  let matrix = createDonationQrMatrix(payload, () => factory(0, 'H'));
  const firstVersion = (matrix.length - 17) / 4;
  for (let version = firstVersion; version <= 40; version++) {
    if (version > firstVersion) {
      matrix = createDonationQrMatrix(payload, () => factory(version, 'H'));
      if (matrix.length !== 17 + 4 * version) throw new Error('Versão QR divergente');
    }
    const desired = Math.max(3, 2 * Math.floor((matrix.length * 0.2 - 1) / 2) + 1);
    const symbolArea = getCenteredQrSymbolArea(matrix.length, desired);
    if (symbolArea) return {matrix, symbolArea, version};
  }
  throw new Error('Nenhuma versão QR comporta símbolo central protegido');
}
