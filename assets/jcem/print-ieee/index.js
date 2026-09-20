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
const alphabeticPrintReference = (index) => {
    let value = index;
    let identifier = '';
    while (value > 0) {
        value -= 1;
        identifier = String.fromCharCode(97 + (value % 26)) + identifier;
        value = Math.floor(value / 26);
    }
    return identifier;
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
    list.setAttribute('type', 'a');
    references.append(title, list);
    const articleIndex = Array.from(document.querySelectorAll('[data-print-article]')).indexOf(article) + 1;
    const seen = new Map();
    article.querySelectorAll('[data-print-body] a[href]').forEach((link) => {
        const rawHref = (link.getAttribute('href') || '').trim();
        if (!rawHref || rawHref.startsWith('#'))
            return;
        if (link.matches('[role="doc-noteref"], [role="doc-backlink"], .footnote, .reversefootnote, .jcem-footnote-backref') ||
            link.closest('.footnotes, [role="doc-footnote"], .jcem-references, [data-print-link-references], sup[id^="fnref"]'))
            return;
        let url;
        try {
            url = new URL(rawHref, document.baseURI).href;
        }
        catch {
            return;
        }
        if (!/^https?:/i.test(url))
            return;
        let reference = seen.get(url);
        if (!reference) {
            const identifier = alphabeticPrintReference(seen.size + 1);
            reference = {
                identifier,
                targetId: `print-link-reference-${articleIndex}-${identifier}`,
            };
            seen.set(url, reference);
            const item = document.createElement('li');
            item.id = reference.targetId;
            item.dataset.printLinkIdentifier = identifier;
            item.textContent = url;
            list.append(item);
        }
        const marker = document.createElement('sup');
        marker.dataset.printLinkNote = '';
        marker.dataset.printOnly = '';
        marker.dataset.printLinkIdentifier = reference.identifier;
        marker.dataset.printLinkTarget = reference.targetId;
        marker.textContent = `[${reference.identifier}]`;
        marker.setAttribute('aria-details', reference.targetId);
        marker.setAttribute('aria-label', `URL ${reference.identifier} na lista final`);
        let markerAnchor = link;
        let superscript = link.closest('sup');
        while (superscript) {
            markerAnchor = superscript;
            superscript = superscript.parentElement?.closest('sup') || null;
        }
        markerAnchor.after(marker);
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
