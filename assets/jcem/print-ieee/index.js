/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */
export const PRINT_PROFILE_ID = 'ieee-conference-a4-ieeetran-1.8b';
const VALID_STATES = new Set([
    'legivel',
    'nativo-preparado',
    'ieee-validado',
]);
const stateOf = (article) => {
    const state = article.dataset.printState;
    return state && VALID_STATES.has(state) ? state : 'legivel';
};
const stampAcquisitionDate = (article, acquiredAt) => {
    const isoDate = acquiredAt.toISOString();
    article.dataset.printAcquiredAt = isoDate;
    document
        .querySelectorAll('[data-print-acquired-at]:not([data-print-article])')
        .forEach((element) => {
        element.textContent = acquiredAt.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        element.setAttribute('datetime', isoDate);
    });
};
const materializeInstitutionalPageFooter = () => {
    const footer = document.querySelector('[data-print-institutional]');
    if (!footer)
        return;
    const text = (footer.textContent || '').replace(/\s+/g, ' ').trim();
    const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    let style = document.querySelector('[data-print-page-footer-style]');
    if (!style) {
        style = document.createElement('style');
        style.dataset.printPageFooterStyle = '';
        style.media = 'print';
        document.head.append(style);
    }
    style.textContent = `@page { @bottom-center { content: "${escaped}"; color: #000; font-family: "Noto Sans", Arial, sans-serif; font-size: 6.5pt; line-height: 8pt; border-top: 0.25pt solid #777; padding-top: 1.5mm; } }`;
};
const materializePrintLinks = (article) => {
    article.querySelectorAll('[data-print-link-references]').forEach((node) => node.remove());
    article.querySelectorAll('[data-print-link-note]').forEach((node) => node.remove());
    const references = document.createElement('section');
    references.dataset.printLinkReferences = '';
    references.dataset.printOnly = '';
    references.setAttribute('aria-label', 'URLs dos links do artigo');
    const title = document.createElement('h2');
    title.textContent = 'URLs dos links';
    const list = document.createElement('ol');
    references.append(title, list);
    const seen = new Map();
    article.querySelectorAll('[data-print-body] a[href]').forEach((link) => {
        if (link.closest('.footnotes, [data-print-link-references]'))
            return;
        const url = new URL(link.href, document.baseURI).href;
        if (!/^https?:/i.test(url))
            return;
        let index = seen.get(url);
        if (!index) {
            index = seen.size + 1;
            seen.set(url, index);
            const item = document.createElement('li');
            item.textContent = `${index}. ${url}`;
            list.append(item);
        }
        const marker = document.createElement('sup');
        marker.dataset.printLinkNote = '';
        marker.dataset.printOnly = '';
        marker.textContent = `[${index}]`;
        marker.setAttribute('aria-label', `URL ${index} na lista final`);
        link.after(marker);
    });
    if (seen.size)
        article.append(references);
};
export const getPrintState = (article) => stateOf(article);
export const prepareArticle = (article, options = {}) => {
    if (!(article instanceof HTMLElement)) {
        throw new TypeError('prepareArticle exige um HTMLElement.');
    }
    const profileId = options.profileId || PRINT_PROFILE_ID;
    const fullWidthSelector = options.fullWidthSelector || '[data-print-span="all"]';
    let disposed = false;
    article.dataset.printArticle = '';
    article.dataset.printProfile = profileId;
    if (!VALID_STATES.has(article.dataset.printState)) {
        article.dataset.printState = 'legivel';
    }
    const setState = (state) => {
        article.dataset.printState = state;
        options.onStateChange?.(state, article);
        article.dispatchEvent(new CustomEvent('jcem-print-state', { detail: { profileId, state } }));
        return state;
    };
    const prepare = () => {
        if (disposed)
            return stateOf(article);
        stampAcquisitionDate(article, options.acquiredAt || new Date());
        materializeInstitutionalPageFooter();
        materializePrintLinks(article);
        article.querySelectorAll(fullWidthSelector).forEach((element) => {
            element.dataset.printSpan = 'all';
        });
        return setState('nativo-preparado');
    };
    const beforePrint = () => {
        prepare();
    };
    const afterPrint = () => {
        article.dataset.printLifecycle = 'complete';
    };
    const printMedia = window.matchMedia?.('print');
    const mediaChange = (event) => {
        if (event.matches)
            prepare();
        else
            afterPrint();
    };
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    printMedia?.addEventListener?.('change', mediaChange);
    prepare();
    return {
        article,
        profileId,
        prepare,
        getState: () => stateOf(article),
        markValidated: () => setState('ieee-validado'),
        dispose: () => {
            if (disposed)
                return;
            disposed = true;
            window.removeEventListener('beforeprint', beforePrint);
            window.removeEventListener('afterprint', afterPrint);
            printMedia?.removeEventListener?.('change', mediaChange);
        },
    };
};
