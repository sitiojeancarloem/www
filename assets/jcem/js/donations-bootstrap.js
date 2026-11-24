/*!
 * Autoria: JeanCarloEM — https://www.jeancarloem.com
 * Origem: https://github.com/sitiojeancarloem/www
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — uso, cópia, modificação e distribuição conforme a licença; sem garantia.
 * RCF: RCFs/doacoes.md
 */
function setStatus(root, state) {
    let statusEl = root.querySelector('p[data-donation-mount-status]');
    if (!statusEl) {
        statusEl = root.ownerDocument.createElement('p');
        statusEl.setAttribute('data-donation-mount-status', '');
        statusEl.setAttribute('role', 'status');
        statusEl.setAttribute('aria-live', 'polite');
        root.appendChild(statusEl);
    }
    switch (state.status) {
        case 'loading':
            statusEl.textContent = 'Preparando cópia…';
            break;
        case 'ready':
            statusEl.textContent = '';
            break;
        case 'error':
            statusEl.textContent = 'Falha ao carregar dados de doação. Copie manualmente os dados exibidos.';
            break;
    }
}
export async function mountDonationCopy(root) {
    if (root.dataset.donationCopyMount === 'ready' || root.dataset.donationCopyMount === 'loading') {
        return;
    }
    root.dataset.donationCopyMount = 'loading';
    const state = { status: 'loading' };
    setStatus(root, state);
    try {
        const scriptEl = root.querySelector('script[data-jcem-donations-data]');
        if (!(scriptEl === null || scriptEl === void 0 ? void 0 : scriptEl.textContent)) {
            throw new Error('Dados JSON de doação não encontrados no script interno.');
        }
        const data = JSON.parse(scriptEl.textContent);
        const { enhanceDonationCopy } = await import('./donations-ui.js');
        const clipboard = {
            writeText: async (text) => {
                var _a;
                const navigator = (_a = root.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.navigator;
                if (!(navigator === null || navigator === void 0 ? void 0 : navigator.clipboard)) {
                    throw new Error('Área de transferência não disponível no navegador.');
                }
                await navigator.clipboard.writeText(text);
            }
        };
        enhanceDonationCopy(root, data, clipboard);
        state.status = 'ready';
        root.dataset.donationCopyMount = 'ready';
    }
    catch (err) {
        state.status = 'error';
        root.dataset.donationCopyMount = 'error';
        state.error = err instanceof Error ? err : new Error(String(err));
    }
    finally {
        setStatus(root, state);
    }
}
function autoInit() {
    const initOnce = () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const roots = document.querySelectorAll('[data-jcem-donations]');
                roots.forEach((root) => {
                    if (root.dataset.donationCopyMount !== 'ready') {
                        void mountDonationCopy(root);
                    }
                });
            });
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnce, { once: true });
    }
    else {
        initOnce();
    }
}
autoInit();
