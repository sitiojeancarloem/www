// Alignment centers derived from qrcode-generator 2.0.4, Copyright (c) 2009 Kazuhiko Arase, MIT.
// Source/license: assets/jcem/lib/qrcode-generator/2.0.4/manifest.json and LICENSE.txt.
const alignmentPositions: readonly (readonly number[])[] = [[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]];

export function getQrFunctionalMask(size: number): boolean[][] {
  if (!Number.isInteger(size) || size < 21 || size > 177 || (size - 21) % 4 !== 0) {
    throw new Error('Tamanho inválido para matriz QR: deve ser inteiro entre 21 e 177, com (size-21)%4=0.');
  }

  const mask: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Borda conservadora de 11 módulos (protege localizadores/separadores/timing/formato/versão)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (y < 11 || x < 11 || y >= size - 11 || x >= size - 11) {
        mask[y][x] = true;
      }
    }
  }

  // Quadrados 5x5 centrados nos pares cartesianos de alignmentPositions
  const positions = alignmentPositions[(size - 17) / 4 - 1];
  for (const y of positions) {
    for (const x of positions) {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
            mask[ny][nx] = true;
          }
        }
      }
    }
  }

  return mask;
}

export function getCenteredQrSymbolArea(size: number, desired: number): { x: number; y: number; size: number } | null {
  if (!Number.isInteger(desired) || desired < 3 || desired > Math.floor(size * 0.2) || desired % 2 === 0) {
    throw new Error('Tamanho desejado inválido: deve ser ímpar, entre 3 e 20% do tamanho do QR.');
  }

  const x = (size - desired) / 2;
  const y = (size - desired) / 2;

  const mask = getQrFunctionalMask(size);

  for (let dy = 0; dy < desired; dy++) {
    for (let dx = 0; dx < desired; dx++) {
      const py = Math.floor(y + dy);
      const px = Math.floor(x + dx);
      if (mask[py][px]) {
        return null;
      }
    }
  }

  return { x, y, size: desired };
}
