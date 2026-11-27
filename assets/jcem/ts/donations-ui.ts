/*!
  Autoria: JeanCarloEM — https://www.jeancarloem.com
  Origem: https://github.com/sitiojeancarloem/www
  Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — uso, cópia, modificação e distribuição conforme a licença; sem garantia.
  RCF: RCFs/doacoes.md
*/

import {validateDonationsData} from './donations-data.js';
import type {DonationMethod} from './donations-data.js';
import {getDonationCopyValue, shortenDonationAddress, copyDonationValue} from './donations-actions.js';



/**
 * Adiciona interatividade de cópia aos métodos de doação em um elemento raiz.
 *
 * @param root - Elemento DOM que contém os métodos de doação.
 * @param data - Dados de doação validados.
 * @param clipboard - Interface para operações de cópia.
 * @throws {Error} Se root for inválido ou o validador rejeitar data. Não altera os dados.
 * @returns Nada. Aprimora o DOM uma vez por método; mantém cópia manual após erro.
 */
export function enhanceDonationCopy(
  root: HTMLElement,
  data: unknown,
  clipboard: Pick<Clipboard, 'writeText'>
): void {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError('Parâmetro root deve ser um HTMLElement');
  }

  validateDonationsData(data);

  const methodsMap = new Map<string, DonationMethod>();
  for (const method of data.methods) {
    methodsMap.set(method.id, method);
  }

  const donorElements = Array.from(root.querySelectorAll<HTMLElement>('[data-donation-id]'));

  for (const donor of donorElements) {
    if (donor.dataset.donationCopyBound === 'true') continue;

    const id = donor.dataset.donationId;
    if (!id) continue;

    const method = methodsMap.get(id);
    if (!method || method.type === 'paypal') continue;

    const summary = donor.closest('details')?.querySelector<HTMLElement>('summary');
    if (!summary) continue;

    const value = getDonationCopyValue(method);
    if (value === null) continue;

    const shortened = shortenDonationAddress(value);

    const visualSummary = root.ownerDocument.createElement('span');
    visualSummary.setAttribute('data-donation-short', 'true');
    visualSummary.setAttribute('aria-hidden', 'true');
    visualSummary.textContent = shortened;

    const srSummary = root.ownerDocument.createElement('span');
    srSummary.className = 'screen-reader-text';
    srSummary.textContent = ` Endereço completo: ${value}`;

    summary.append(visualSummary, srSummary);

    const button = root.ownerDocument.createElement('button');
    button.type = 'button';
    button.textContent = `Copiar ${method.label}`;
    button.className = 'btn';
    button.setAttribute('aria-label', `Copiar ${method.label} para a área de transferência`);

    // O feedback separado preserva o nome e a semântica nativa do botão.
    const status = root.ownerDocument.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('data-donation-status', 'true');

    button.addEventListener('click', async () => {
      try {
        await copyDonationValue(method, clipboard);
        status.textContent = 'Copiado com sucesso';
      } catch {
        status.textContent = 'Erro ao copiar; use cópia manual';
      }
    }, {once: false});

    donor.append(button, status);

    donor.dataset.donationCopyBound = 'true';
  }
}
/**
 * Adiciona botões para abrir QR codes dos métodos de doação em um elemento raiz.
 *
 * @param root - Elemento DOM que contém os métodos de doação.
 * @param data - Dados de doação validados.
 * @param openQr - Função assíncrona que abre o diálogo de QR code. Só resolve quando o diálogo é fechado.
 * @throws {Error} Se root for inválido, data for inválido ou openQr não for uma função. Não altera o DOM.
 * @returns Nada. Aprimora o DOM uma vez por método; mantém cópia manual após erro.
 */
export function enhanceDonationQr(
  root: HTMLElement,
  data: unknown,
  openQr: (method: DonationMethod, opener: HTMLButtonElement) => Promise<void>
): void {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError('Parâmetro root deve ser um HTMLElement');
  }

  validateDonationsData(data);

  if (typeof openQr !== 'function') {
    throw new TypeError('Parâmetro openQr deve ser uma função assíncrona');
  }

  const methodsMap = new Map<string, DonationMethod>();
  for (const method of data.methods) {
    methodsMap.set(method.id, method);
  }

  const donorElements = Array.from(root.querySelectorAll<HTMLElement>('[data-donation-id]'));

  for (const donor of donorElements) {
    if (donor.dataset.donationQrBound === 'true') continue;

    const id = donor.dataset.donationId;
    if (!id) continue;

    const method = methodsMap.get(id);
    if (!method || method.type === 'paypal') continue;

    const summary = donor.closest('details')?.querySelector<HTMLElement>('summary');
    if (!summary) continue;

    const button = root.ownerDocument.createElement('button');
    button.type = 'button';
    button.className = 'btn';
    button.setAttribute('data-donation-qr-button', 'true');
    button.setAttribute('aria-label', `Ver QR code de ${method.label}`);
    button.textContent = `Ver QR de ${method.label}`;

    const status = root.ownerDocument.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('data-donation-qr-status', 'true');

    let busy = false;

    button.addEventListener('click', async () => {
      if (busy) return;

      busy = true;
      button.setAttribute('aria-busy', 'true');
      status.textContent = 'Preparando QR code...';

      try {
        await openQr(method, button);
        status.textContent = '';
      } catch {
        status.textContent = 'Erro ao abrir QR; use cópia manual';
      } finally {
        busy = false;
        button.removeAttribute('aria-busy');
        button.focus();
      }
    }, {once: false});

    donor.append(button, status);

    donor.dataset.donationQrBound = 'true';
  }
}
