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
    article
        .querySelectorAll('[data-print-acquired-at]')
        .forEach((element) => {
        element.textContent = acquiredAt.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        element.setAttribute('datetime', isoDate);
    });
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
