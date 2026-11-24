/*!
  Autoria: JeanCarloEM — https://www.jeancarloem.com
  Origem: https://github.com/sitiojeancarloem/www
  Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — uso, cópia, modificação e distribuição conforme a licença; sem garantia.
  RCF: RCFs/doacoes.md
*/
import { validateDonationsData } from './donations-data.js';
import { getDonationCopyValue, shortenDonationAddress, copyDonationValue } from './donations-actions.js';
export function enhanceDonationCopy(root, data, clipboard) {
    var _a;
    if (!(root instanceof HTMLElement)) {
        throw new TypeError('Parâmetro root deve ser um HTMLElement');
    }
    validateDonationsData(data);
    const methodsMap = new Map();
    for (const method of data.methods) {
        methodsMap.set(method.id, method);
    }
    const donorElements = Array.from(root.querySelectorAll('[data-donation-id]'));
    for (const donor of donorElements) {
        if (donor.dataset.donationCopyBound === 'true')
            continue;
        const id = donor.dataset.donationId;
        if (!id)
            continue;
        const method = methodsMap.get(id);
        if (!method || method.type === 'paypal')
            continue;
        const summary = (_a = donor.closest('details')) === null || _a === void 0 ? void 0 : _a.querySelector('summary');
        if (!summary)
            continue;
        const value = getDonationCopyValue(method);
        if (value === null)
            continue;
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
        const status = root.ownerDocument.createElement('p');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('data-donation-status', 'true');
        button.addEventListener('click', async () => {
            try {
                await copyDonationValue(method, clipboard);
                status.textContent = 'Copiado com sucesso';
            }
            catch {
                status.textContent = 'Erro ao copiar; use cópia manual';
            }
        }, { once: false });
        donor.append(button, status);
        donor.dataset.donationCopyBound = 'true';
    }
}
