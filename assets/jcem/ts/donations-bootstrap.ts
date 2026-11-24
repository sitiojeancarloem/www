/*!
 * Autoria: JeanCarloEM — https://www.jeancarloem.com
 * Origem: https://github.com/sitiojeancarloem/www
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — uso, cópia, modificação e distribuição conforme a licença; sem garantia.
 * RCF: RCFs/doacoes.md
 */

/** loading bloqueia montagem simultânea; error permite nova tentativa explícita. */
type MountStatus = 'loading' | 'ready' | 'error';

/** Mantém diagnóstico local sem exibir detalhes técnicos como conteúdo do produto. */
type MountState = {
  status: MountStatus;
  error?: Error;
};

/** Atualiza uma única região ARIA, preservando os campos nativos da raiz. */
function setStatus(root: HTMLElement, state: MountState): void {
  let statusEl = root.querySelector<HTMLParagraphElement>('p[data-donation-mount-status]');
  if (!statusEl) {
    statusEl = root.ownerDocument.createElement('p') as HTMLParagraphElement;
    statusEl.setAttribute('data-donation-mount-status', '');
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    root.appendChild(statusEl);
  }

  switch (state.status) {
    case 'loading':
      statusEl.textContent = 'Preparando ações…';
      break;
    case 'ready':
      statusEl.textContent = '';
      break;
    case 'error':
      statusEl.textContent = 'Falha ao carregar dados de doação. Copie manualmente os dados exibidos.';
      break;
  }
}

/**
 * Monta cópia e QR usando o snapshot JSON presente na raiz, sem buscar dados externos.
 * @param root Raiz que contém o script JSON inerte e os métodos renderizados.
 * @returns Promessa resolvida após montagem ou fallback manual com status; sem rejeição esperada.
 * @remarks A montagem automática chama esta função depois da oportunidade de pintura.
 */
export async function mountDonationCopy(root: HTMLElement): Promise<void> {
  if (root.dataset.donationCopyMount === 'ready' || root.dataset.donationCopyMount === 'loading') {
    return;
  }

  root.dataset.donationCopyMount = 'loading';

  const state: MountState = { status: 'loading' };
  setStatus(root, state);

  try {
    const scriptEl = root.querySelector<HTMLScriptElement>('script[data-jcem-donations-data]');
    if (!scriptEl?.textContent) {
      throw new Error('Dados JSON de doação não encontrados no script interno.');
    }

    const data: unknown = JSON.parse(scriptEl.textContent);

    // O agendamento automático chega aqui após dois frames, antes de carregar o conector.
    const { enhanceDonationCopy, enhanceDonationQr } = await import('./donations-ui.js');

    const clipboard: Pick<Clipboard, 'writeText'> = {
      writeText: async (text: string): Promise<void> => {
        const navigator = root.ownerDocument.defaultView?.navigator;
        if (!navigator?.clipboard) {
          throw new Error('Área de transferência não disponível no navegador.');
        }
        await navigator.clipboard.writeText(text);
      }
    };

    enhanceDonationCopy(root, data, clipboard);

    const siteUrl = root.dataset.donationSiteUrl;
    const logoUrl = root.dataset.donationLogoUrl;
    if (!siteUrl || !logoUrl) throw new Error('Metadados locais de QR ausentes.');
    enhanceDonationQr(root, data, async (method) => {
      const { showDonationQr } = await import('./donations-qr-dialog.js');
      const label = method.type === 'crypto' ? method.label + ' — ' + method.network : method.label;
      return showDonationQr(root, 'QR de ' + label, method.id + '.png', async (signal) => {
        const { prepareDonationQr } = await import('./donations-qr-resource.js');
        return prepareDonationQr(root.ownerDocument, method, siteUrl, logoUrl, signal);
      });
    });

    state.status = 'ready';
    root.dataset.donationCopyMount = 'ready';
  } catch (err) {
    state.status = 'error';
    root.dataset.donationCopyMount = 'error';
    state.error = err instanceof Error ? err : new Error(String(err));
    // Não ocultar campos nem lançar rejeição; apenas atualizar status
  } finally {
    setStatus(root, state);
  }
}

// Auto-inicialização após DOMContentLoaded, uma única vez
/** Agenda uma única passagem no componente, após DOMContentLoaded e duas oportunidades de frame. */
function autoInit(): void {
  const initOnce = (): void => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const roots = document.querySelectorAll<HTMLElement>('[data-jcem-donations]');
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
  } else {
    initOnce();
  }
}

autoInit();