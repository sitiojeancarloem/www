/*!
  Autoria: JeanCarloEM — https://www.jeancarloem.com
  Origem: https://github.com/sitiojeancarloem/www
  Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — uso, cópia, modificação e distribuição conforme a licença; sem garantia.
  RCF: RCFs/doacoes.md
*/

import { getDonationQrBlob } from './donations-actions.js';
/**
 * Apresenta QR produzido sob demanda e exporta o mesmo canvas como PNG.
 * @param root Raiz conectada proprietária do diálogo; impede aberturas simultâneas.
 * @param label Nome acessível e título textual da visualização.
 * @param filename Nome do arquivo PNG no link nativo de download.
 * @param produce Produtor de canvas que respeita o sinal de cancelamento.
 * @returns Resolve ao fechar; rejeita falhas de abertura, produção ou exportação.
 */
export async function showDonationQr(root: HTMLElement, label: string, filename: string, produce: (signal: AbortSignal) => Promise<HTMLCanvasElement>): Promise<void> {
    if (!(root instanceof HTMLElement) || !root.isConnected || typeof label !== 'string' || !label.trim() || typeof filename !== 'string' || !filename.trim() || typeof produce !== 'function')
        throw new Error('Entradas inválidas');
    if (root.dataset.donationQrDialogBusy === 'true')
        throw new Error('Diálogo já em uso');
    const doc = root.ownerDocument;
    const dialog: HTMLDialogElement = doc.createElement('dialog');
    dialog.className = 'jcem-donation-qr-dialog';
    dialog.setAttribute('data-donation-qr-dialog', '');
    dialog.setAttribute('aria-label', label);
    const closeBtn: HTMLButtonElement = doc.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('data-donation-qr-close', '');
    closeBtn.textContent = 'Fechar';
    const surface: HTMLDivElement = doc.createElement('div');
    const statusEl: HTMLParagraphElement = doc.createElement('p');
    statusEl.role = 'status';
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.textContent = 'Carregando QR';
    const downloadAnchor: HTMLAnchorElement = doc.createElement('a');
    downloadAnchor.hidden = true;
    downloadAnchor.download = filename;
    downloadAnchor.textContent = 'Baixar PNG';
    downloadAnchor.setAttribute('data-donation-qr-download', '');
    const title = doc.createElement('h2');
    title.textContent = label;
    dialog.append(title, closeBtn, surface, statusEl, downloadAnchor);
    return new Promise<void>((resolve, reject) => {
        const controller = new AbortController();
        let closed = false;
        let canvas: HTMLCanvasElement | null = null;
        let objectURL: string | null = null;
        const finish = (failed: boolean, cause?: unknown) => {
            if (closed)
                return;
            closed = true;
            controller.abort();
            dialog.remove();
            dialog.removeEventListener('keydown', onKeyDown);
            closeBtn.removeEventListener('click', onCloseClick);
            dialog.removeEventListener('cancel', onCancel);
            dialog.removeEventListener('close', onClose);
            if (objectURL) {
                URL.revokeObjectURL(objectURL);
                objectURL = null;
            }
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
                canvas = null;
            }
            delete root.dataset.donationQrDialogBusy;
            if (failed)
                reject(cause);
            else
                resolve();
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (closed)
                return;
            if (e.key === 'Escape') {
                e.preventDefault();
                finish(false);
                return;
            }
            if (e.key === 'Tab') {
                if (downloadAnchor.hidden) {
                    e.preventDefault();
                    return;
                }
                const focusable: HTMLElement[] = [closeBtn, downloadAnchor];
                const idx = focusable.indexOf(doc.activeElement as HTMLElement);
                if (idx === -1)
                    return;
                if (e.shiftKey) {
                    if (idx === 0) {
                        e.preventDefault();
                        focusable[focusable.length - 1].focus();
                    }
                }
                else {
                    if (idx === focusable.length - 1) {
                        e.preventDefault();
                        focusable[0].focus();
                    }
                }
            }
        };
        const onCloseClick = (e: Event) => {
            if (closed)
                return;
            e.preventDefault();
            finish(false);
        };
        const onCancel = (e: Event) => {
            if (closed)
                return;
            e.preventDefault();
            finish(false);
        };
        const onClose = (e: Event) => {
            if (closed)
                return;
            e.preventDefault();
            finish(false);
        };
        dialog.addEventListener('keydown', onKeyDown);
        closeBtn.addEventListener('click', onCloseClick);
        dialog.addEventListener('cancel', onCancel);
        dialog.addEventListener('close', onClose);
        void (async () => {
            try {
                root.dataset.donationQrDialogBusy = 'true';
                root.append(dialog);
                if (typeof dialog.showModal === 'function')
                    dialog.showModal();
                else {
                    dialog.setAttribute('open', '');
                    dialog.setAttribute('aria-modal', 'false');
                }
                closeBtn.focus();
                const result = await produce(controller.signal);
                if (closed) {
                    result.width = 0;
                    result.height = 0;
                    return;
                }
                canvas = result as HTMLCanvasElement;
                surface.append(canvas);
                const blob = await getDonationQrBlob(canvas);
                if (closed)
                    return;
                objectURL = URL.createObjectURL(blob);
                downloadAnchor.href = objectURL;
                downloadAnchor.hidden = false;
                statusEl.textContent = 'Pronto';
            }
            catch (error) {
                finish(true, error);
            }
        })();
    });
}
