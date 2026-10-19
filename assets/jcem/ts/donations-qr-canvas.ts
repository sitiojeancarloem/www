import {getCenteredQrSymbolArea} from './donations-qr-geometry.js';
export function renderDonationQrBase(canvas: HTMLCanvasElement, matrix: readonly (readonly boolean[])[], caption: string): void {
  const n = matrix.length;
  if (!Array.isArray(matrix) || !Number.isInteger(n) || n < 21 || n > 177 || (n - 21) % 4 !== 0 ||
      typeof caption !== 'string' || caption.trim().length === 0 || caption.length > 4096) throw new Error('Composição QR inválida');
  for (let y = 0; y < n; y++) {
    if (!Object.prototype.hasOwnProperty.call(matrix, y) || !Array.isArray(matrix[y]) || matrix[y].length !== n) throw new Error('Matriz QR inválida');
    for (let x = 0; x < n; x++) if (!Object.prototype.hasOwnProperty.call(matrix[y], x) || typeof matrix[y][x] !== 'boolean') throw new Error('Módulo QR inválido');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível');
  const moduleSize = 8, margin = 16, quiet = 4 * moduleSize;
  const width = (n + 8) * moduleSize + 2 * margin;
  canvas.width = width;
  canvas.height = width + 64;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#17324d';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  ctx.fillStyle = '#000000';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (matrix[y][x]) ctx.fillRect(margin + quiet + x * moduleSize, margin + quiet + y * moduleSize, moduleSize, moduleSize);
  ctx.fillStyle = '#17324d';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(caption, width / 2, width + 32, width - 32);
}

export function renderDonationQrWithSymbol(canvas: HTMLCanvasElement, matrix: readonly (readonly boolean[])[], caption: string, symbol: ImageBitmap, area: {x: number; y: number; size: number}): void {
  const expected = getCenteredQrSymbolArea(matrix.length, area.size);
  if (!expected || expected.x !== area.x || expected.y !== area.y || symbol.width !== 372 || symbol.height !== 192) {
    throw new Error('Símbolo ou região central inválidos');
  }
  renderDonationQrBase(canvas, matrix, caption);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível');
  const left = 48 + area.x * 8, top = 48 + area.y * 8, side = area.size * 8;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(left, top, side, side);
  const height = side - 4, width = height * 190 / 192;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(symbol, 0, 0, 190, 192, left + (side - width) / 2, top + 2, width, height);
  ctx.imageSmoothingEnabled = false;
}
