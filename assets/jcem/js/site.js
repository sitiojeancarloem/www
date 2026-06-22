Element.prototype.on = function (type, listener) {
    this.addEventListener(type, listener);
};
const select = (selector) => document.querySelector(selector);
const jcemThemeKey = 'jcem-theme';
const jcemThemeMaxAge = 60 * 60 * 24 * 365;
const jcemThemeValues = ['light', 'dark'];
const isJcemTheme = (theme) => jcemThemeValues.includes(theme);
const getJcemThemeCookie = () => {
    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${jcemThemeKey}=`));
    return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
};
const getJcemTheme = () => {
    try {
        return localStorage.getItem(jcemThemeKey) || getJcemThemeCookie();
    }
    catch (error) {
        return getJcemThemeCookie();
    }
};
const saveJcemTheme = (theme) => {
    try {
        localStorage.setItem(jcemThemeKey, theme);
    }
    catch (error) {
        document.documentElement.setAttribute('data-jcem-storage', 'blocked');
    }
    document.cookie = `${jcemThemeKey}=${encodeURIComponent(theme)}; Path=/; Max-Age=${jcemThemeMaxAge}; SameSite=Lax`;
};
const applyJcemTheme = (theme) => {
    const radio = select(`#jcem-theme-${theme}`);
    if (radio) {
        radio.checked = true;
    }
};
const bindJcemTheme = () => {
    const storedTheme = getJcemTheme();
    const theme = isJcemTheme(storedTheme) ? storedTheme : 'dark';
    applyJcemTheme(theme);
    document
        .querySelectorAll('input[name="jcem-theme"]')
        .forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked && isJcemTheme(radio.value)) {
                saveJcemTheme(radio.value);
            }
        });
    });
};
const bindJcemNav = () => {
    const navState = select('#jcem-nav-state');
    document.querySelectorAll('#site-nav a').forEach((link) => {
        link.addEventListener('click', () => {
            if (navState) {
                navState.checked = false;
            }
        });
    });
};
const bindJcemMasthead = () => {
    const masthead = select('.masthead');
    if (!masthead) {
        return;
    }
    let ticking = false;
    const syncState = () => {
        ticking = false;
        document.documentElement.classList.toggle('jcem-masthead-stuck', window.scrollY > 0 && masthead.getBoundingClientRect().top <= 0);
    };
    const requestSync = () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(syncState);
        }
    };
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync, { passive: true });
    syncState();
};
const bindJcemScrollTop = () => {
    const button = select('.jcem-scroll-top');
    if (!button) {
        return;
    }
    let ticking = false;
    const syncVisibility = () => {
        ticking = false;
        const isVisible = window.scrollY > 240;
        const isNearPageEnd = window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 96;
        button.classList.toggle('is-visible', isVisible);
        button.setAttribute('aria-hidden', String(!isVisible));
        button.tabIndex = isVisible ? 0 : -1;
        document.documentElement.classList.toggle('jcem-at-page-end', isNearPageEnd);
    };
    const requestSync = () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(syncVisibility);
        }
    };
    button.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', requestSync, { passive: true });
    syncVisibility();
};
const clampJcemProgress = (value) => Math.max(8, Math.min(100, Math.round(value)));
const setJcemLoadingProgress = (value) => {
    const progress = select('.jcem-load-progress');
    if (!progress) {
        return;
    }
    const percent = clampJcemProgress(value);
    progress.style.setProperty('--jcem-load-progress', `${percent}%`);
    progress.setAttribute('aria-valuenow', String(percent));
};
const isJcemLoadTargetComplete = (element) => {
    var _a;
    if (element instanceof HTMLImageElement) {
        return element.complete;
    }
    if (element instanceof HTMLMediaElement) {
        return element.readyState >= 2;
    }
    if (element instanceof HTMLIFrameElement) {
        try {
            return Boolean(((_a = element.contentDocument) === null || _a === void 0 ? void 0 : _a.readyState) === 'complete');
        }
        catch (error) {
            return false;
        }
    }
    return true;
};
const bindJcemLoadingProgress = () => {
    const progress = select('.jcem-load-progress');
    if (!progress) {
        return;
    }
    const targets = Array.from(document.querySelectorAll('img, iframe, video, audio'));
    const total = Math.max(1, targets.length + 2);
    let completed = document.readyState === 'loading' ? 0 : 1;
    let lastProgress = 8;
    const update = (base = 0) => {
        const loadedTargets = targets.filter(isJcemLoadTargetComplete).length;
        const nextProgress = Math.max(base, 8 + ((completed + loadedTargets) / total) * 82);
        if (nextProgress > lastProgress) {
            lastProgress = nextProgress;
            setJcemLoadingProgress(nextProgress);
        }
    };
    const completeDom = () => {
        completed = Math.max(completed, 1);
        update(55);
    };
    const completePage = () => {
        completed = total;
        setJcemLoadingProgress(100);
    };
    const trickle = window.setInterval(() => {
        if (document.documentElement.classList.contains('jcem-page-loaded')) {
            window.clearInterval(trickle);
            return;
        }
        update(Math.min(92, lastProgress + 2));
    }, 450);
    targets.forEach((target) => {
        if (isJcemLoadTargetComplete(target)) {
            return;
        }
        target.addEventListener('load', () => update(), { once: true });
        target.addEventListener('error', () => update(), { once: true });
    });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', completeDom, { once: true });
    }
    else {
        completeDom();
    }
    if (document.readyState === 'complete') {
        completePage();
    }
    else {
        window.addEventListener('load', completePage, { once: true });
    }
};
const normalizeJcemText = (text) => text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
const normalizeJcemHeadingText = (text) => normalizeJcemText(text).replace(/\s*permalink$/, '');
const findJcemSectionHeading = (content, title) => {
    const normalizedTitle = normalizeJcemText(title);
    return (Array.from(content.querySelectorAll('h2, h3')).find((heading) => normalizeJcemHeadingText(heading.textContent || '') === normalizedTitle) || null);
};
const createJcemDetails = (id, label, modifier) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.id = id;
    details.className = `c-collapsible c-collapsible--${modifier} jcem-collapsible jcem-collapsible--${modifier}`;
    summary.textContent = label;
    details.append(summary);
    return details;
};
const insertJcemDetailsBefore = (details, target) => {
    const parent = target.parentNode;
    if (!parent) {
        return false;
    }
    parent.insertBefore(details, target);
    return true;
};
const moveUntilNextHeading = (details, start) => {
    let node = start.nextSibling;
    details.append(start);
    while (node) {
        const current = node;
        const next = current.nextSibling;
        if (current instanceof HTMLHeadingElement &&
            ['H2', 'H3'].includes(current.tagName)) {
            break;
        }
        if (current instanceof HTMLDetailsElement &&
            (current.classList.contains('c-collapsible') ||
                current.classList.contains('jcem-collapsible'))) {
            break;
        }
        details.append(current);
        node = next;
    }
};
const wrapJcemFootnotes = (content) => {
    const footnotes = content.querySelector(':scope > .footnotes');
    if (!footnotes || footnotes.closest('.jcem-collapsible')) {
        return;
    }
    const heading = findJcemSectionHeading(content, 'Referências') ||
        findJcemSectionHeading(content, 'Referencias');
    const details = createJcemDetails((heading === null || heading === void 0 ? void 0 : heading.id) || 'referencias', 'Referências', 'references');
    if (heading) {
        heading.removeAttribute('id');
        if (!insertJcemDetailsBefore(details, heading)) {
            return;
        }
        details.append(heading);
        details.append(footnotes);
        return;
    }
    content.insertBefore(details, footnotes);
    details.append(footnotes);
};
const wrapJcemBibliography = (content) => {
    const heading = findJcemSectionHeading(content, 'Bibliografia');
    if (!heading || heading.closest('.jcem-collapsible')) {
        return;
    }
    const id = heading.id || 'bibliografia';
    const details = createJcemDetails(id, 'Bibliografia', 'bibliography');
    heading.removeAttribute('id');
    if (!insertJcemDetailsBefore(details, heading)) {
        return;
    }
    moveUntilNextHeading(details, heading);
};
const openJcemCollapsibleForHash = (hash) => {
    var _a;
    if (!hash) {
        return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(id);
    if (id.startsWith('fn:')) {
        (_a = (document.getElementById('referências') ||
            document.getElementById('referencias'))) === null || _a === void 0 ? void 0 : _a.setAttribute('open', '');
    }
    if (!target) {
        return;
    }
    const details = target.closest('details.c-collapsible, details.jcem-collapsible');
    if (target instanceof HTMLDetailsElement &&
        (target.classList.contains('c-collapsible') ||
            target.classList.contains('jcem-collapsible'))) {
        return;
    }
    if (details) {
        details.open = true;
    }
};
const bindJcemCollapsibleSections = () => {
    const content = select('.page__content');
    if (!content) {
        return;
    }
    wrapJcemFootnotes(content);
    wrapJcemBibliography(content);
    openJcemCollapsibleForHash(window.location.hash);
    document.addEventListener('click', (event) => {
        var _a;
        const link = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest('a[href^="#"]');
        if (link) {
            openJcemCollapsibleForHash(link.hash);
        }
    });
    window.addEventListener('hashchange', () => {
        openJcemCollapsibleForHash(window.location.hash);
    });
};
const bindJcemBlockquotePanels = () => {
    const article = select('article.page.jcem-blockquote-panels');
    const content = select('.page__content');
    if (!article || !content) {
        return;
    }
    content
        .querySelectorAll('blockquote:not(.jcem-panel)')
        .forEach((quote) => {
        if (quote.closest('.footnotes, .jcem-references')) {
            return;
        }
        const panel = document.createElement('div');
        const table = document.createElement('table');
        const colgroup = document.createElement('colgroup');
        const leftColumn = document.createElement('col');
        const centerColumn = document.createElement('col');
        const rightColumn = document.createElement('col');
        const tbody = document.createElement('tbody');
        const top = document.createElement('tr');
        const contentRow = document.createElement('tr');
        const final = document.createElement('tr');
        const body = document.createElement('td');
        const topLeft = document.createElement('td');
        const topCenter = document.createElement('td');
        const topRight = document.createElement('td');
        const finalLeft = document.createElement('td');
        const finalCenter = document.createElement('td');
        const finalRight = document.createElement('td');
        panel.className = [
            'painel',
            'jcem-panel',
            'jcem-panel--blockquote',
            'jcem-panel--futuristic',
            quote.className,
        ]
            .filter(Boolean)
            .join(' ');
        panel.dataset.jcemPanelSource = 'blockquote';
        table.className = 'nohover jcem-panel__table';
        table.cellSpacing = '0';
        table.cellPadding = '0';
        table.border = '0';
        table.setAttribute('role', 'presentation');
        leftColumn.className = 'jcem-panel__column jcem-panel__column--left';
        centerColumn.className = 'jcem-panel__column jcem-panel__column--center';
        rightColumn.className = 'jcem-panel__column jcem-panel__column--right';
        top.className = 'jcem-panel__edge jcem-panel__edge--top';
        contentRow.className = 'content jcem-panel__content-row';
        final.className = 'final jcem-panel__edge jcem-panel__edge--bottom';
        body.className = 'jcem-panel__body';
        body.colSpan = 3;
        topLeft.className = 'jcem-panel__corner jcem-panel__corner--top-left';
        topCenter.className = 'jcem-panel__edge-fill jcem-panel__edge-fill--top';
        topRight.className =
            'f3 jcem-panel__corner jcem-panel__corner--top-right';
        finalLeft.className =
            'jcem-panel__corner jcem-panel__corner--bottom-left';
        finalCenter.className = 'jcem-panel__edge-fill jcem-panel__edge-fill--bottom';
        finalRight.className =
            'f3 jcem-panel__corner jcem-panel__corner--bottom-right';
        while (quote.firstChild) {
            body.append(quote.firstChild);
        }
        const finalFill = document.createElement('div');
        finalFill.setAttribute('aria-hidden', 'true');
        finalCenter.append(finalFill);
        top.append(topLeft, topCenter, topRight);
        contentRow.append(body);
        final.append(finalLeft, finalCenter, finalRight);
        colgroup.append(leftColumn, centerColumn, rightColumn);
        tbody.append(top, contentRow, final);
        table.append(colgroup);
        table.append(tbody);
        panel.append(table);
        quote.replaceWith(panel);
        normalizeJcemQuoteReferences(body);
    });
};
const jcemCitationContexts = [
    [/\bB[ií]blia\b/i, 'texto bíblico'],
    [/\bDescartes\b/i, 'filósofo e matemático francês'],
    [/\bArist[oó]teles\b/i, 'filósofo grego'],
    [/\bS[oó]crates\b/i, 'filósofo ateniense'],
    [/\bCarlos Heitor Cony\b/i, 'escritor e jornalista brasileiro'],
    [/\bProt[aá]goras\b/i, 'sofista grego'],
    [/\bDaniel Patrick Moynihan\b/i, 'sociólogo e senador dos EUA'],
    [/\bFrancis Collins\b/i, 'médico-geneticista'],
    [/\bPeter Brian Medawar\b/i, 'biólogo e Nobel de Medicina'],
    [/\bThomas S\. Kuhn\b/i, 'físico e historiador da ciência'],
    [/\bParm[eê]nides\b/i, 'filósofo pré-socrático'],
    [/\bDepartment of Health\b/i, 'órgão de saúde do Reino Unido'],
    [/\bBurton\b.*\bSheron\b|\bSheron\b.*\bBurton\b/i, 'pesquisadores em saúde pública'],
    [/\bChen\b/i, 'pesquisador citado'],
    [/\bDicion[aá]rio Aur[eé]lio\b/i, 'obra lexicográfica brasileira'],
    [/\bEllen G\.?\s*White\b/i, 'escritora adventista'],
    [/\bEventos Finais\b|\bO Desejado de Todas as Nações\b|\bReavivamento e seus Resultados\b|\bSantificação\b|\bMensagem aos jovens\b|\bCaminho a Cristo\b|\bO ColportorEvangelista\b/i, 'Ellen G. White, escritora adventista'],
    [/\bTaylor\b/i, 'filósofo citado'],
    [/\bSteven Robiner\b/i, 'autor citado'],
];
const getJcemCitationContext = (text) => { var _a; return ((_a = jcemCitationContexts.find(([pattern]) => pattern.test(text))) === null || _a === void 0 ? void 0 : _a[1]) || ''; };
const normalizeJcemCitationPrefix = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        const text = node.textContent || '';
        const replaced = text.replace(/^(\s*)-\s+/, '$1— ');
        if (replaced !== text) {
            node.textContent = replaced;
            return;
        }
        if (text.trim()) {
            return;
        }
        node = walker.nextNode();
    }
};
const addJcemCitationContext = (element) => {
    if (Array.from(element.children).some((child) => child.classList.contains('jcem-cite-context'))) {
        return;
    }
    const context = getJcemCitationContext(element.textContent || '');
    if (!context) {
        return;
    }
    const note = document.createElement('span');
    note.className = 'jcem-cite-context';
    note.textContent = ` · ${context}`;
    element.append(note);
};
const normalizeJcemQuoteReferences = (scope) => {
    scope
        .querySelectorAll('p, cite')
        .forEach((element) => {
        const text = (element.textContent || '').trim();
        if (!/^[-—]\s+/.test(text)) {
            return;
        }
        element.classList.add('jcem-quote-reference');
        normalizeJcemCitationPrefix(element);
        addJcemCitationContext(element);
    });
};
const bindJcemQuoteReferences = () => {
    document
        .querySelectorAll('.page__content blockquote, .page__content .jcem-panel__body')
        .forEach(normalizeJcemQuoteReferences);
};
const jcemQuotePairs = new Map([
    ['"', '"'],
    ["'", "'"],
    ['“', '”'],
    ['‘', '’'],
]);
const jcemWordCharacterPattern = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;
const jcemQuoteContentPattern = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;
const isJcemWordCharacter = (value) => jcemWordCharacterPattern.test(value);
const isJcemSingleQuoteBoundary = (text, index, opening) => {
    const previous = text[index - 1] || '';
    const next = text[index + 1] || '';
    if (opening) {
        return !isJcemWordCharacter(previous) && Boolean(next.trim());
    }
    return !isJcemWordCharacter(next) && Boolean(previous.trim());
};
const findJcemClosingQuote = (text, start, closeQuote) => {
    for (let index = start + 1; index < text.length; index += 1) {
        if (text[index] !== closeQuote) {
            continue;
        }
        if (closeQuote === "'" &&
            !isJcemSingleQuoteBoundary(text, index, false)) {
            continue;
        }
        return index;
    }
    return -1;
};
const wrapJcemInlineQuotesInText = (textNode) => {
    const text = textNode.textContent || '';
    if (!/["'“‘]/.test(text)) {
        return false;
    }
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let lastAppend = 0;
    let changed = false;
    while (cursor < text.length) {
        const openQuote = text[cursor];
        const closeQuote = jcemQuotePairs.get(openQuote);
        if (!closeQuote ||
            (openQuote === "'" && !isJcemSingleQuoteBoundary(text, cursor, true))) {
            cursor += 1;
            continue;
        }
        const closeIndex = findJcemClosingQuote(text, cursor, closeQuote);
        if (closeIndex <= cursor + 1) {
            cursor += 1;
            continue;
        }
        const quoted = text.slice(cursor, closeIndex + 1);
        if (!jcemQuoteContentPattern.test(quoted)) {
            cursor += 1;
            continue;
        }
        if (cursor > lastAppend) {
            fragment.append(document.createTextNode(text.slice(lastAppend, cursor)));
        }
        const quote = document.createElement('em');
        quote.className = 'jcem-inline-quote';
        quote.textContent = quoted;
        fragment.append(quote);
        lastAppend = closeIndex + 1;
        cursor = closeIndex + 1;
        changed = true;
    }
    if (!changed) {
        return false;
    }
    if (lastAppend < text.length) {
        fragment.append(document.createTextNode(text.slice(lastAppend)));
    }
    textNode.replaceWith(fragment);
    return changed;
};
const bindJcemEditorialFormatting = () => {
    const article = select('article.page.jcem-post');
    const content = select('.page__content');
    if (!article || !content) {
        return;
    }
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            const text = node.textContent || '';
            if (!parent || !/["'“‘]/.test(text)) {
                return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('a, em, i, cite, code, pre, kbd, samp, script, style, .footnotes, .jcem-references, .jcem-inline-quote')) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });
    const textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    textNodes.forEach(wrapJcemInlineQuotesInText);
};
const footnoteSummaryMaxLength = 260;
const summarizeFootnote = (text) => {
    const normalized = text.replace(/\s+/g, ' ').trim();
    return normalized.length > footnoteSummaryMaxLength
        ? `${normalized.slice(0, footnoteSummaryMaxLength - 3).trim()}...`
        : normalized;
};
const bindJcemFootnotes = () => {
    document
        .querySelectorAll("sup[id^='fnref'] a.footnote[href^='#fn:'], sup[id^='fnref'] a[role='doc-noteref'][href^='#fn:']")
        .forEach((link) => {
        const id = decodeURIComponent(link.hash.slice(1));
        const note = document.getElementById(id);
        if (!note) {
            return;
        }
        const summaryNode = note.cloneNode(true);
        summaryNode
            .querySelectorAll('.reversefootnote, [role="doc-backlink"]')
            .forEach((backlink) => backlink.remove());
        const summary = summarizeFootnote(summaryNode.textContent || '');
        if (!summary) {
            return;
        }
        link.dataset.footnote = summary;
        link.setAttribute('aria-label', `Nota ${link.textContent || ''}: ${summary}`);
    });
};
let jcemNoScriptFragmentsReady = null;
const jcemRecentMonths = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
];
const createJcemElement = (tag, className = '', text = '') => {
    const node = document.createElement(tag);
    if (className)
        node.className = className;
    if (text)
        node.textContent = text;
    return node;
};
const jcemSafeHttpUrl = (value) => {
    try {
        const url = new URL(String(value || ''), window.location.origin);
        return /^(https?:)$/.test(url.protocol) ? url.href : '';
    }
    catch (_error) {
        return '';
    }
};
const isJcemRecentPost = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const post = value;
    return typeof post.title === 'string' && typeof post.url === 'string';
};
const createJcemRecentDateFlag = (post) => {
    const flag = createJcemElement('div', 'jcem-date-flag jcem-date-flag--archive');
    const time = createJcemElement('time');
    const month = Math.max(1, Math.min(12, Number(post.month) || 1));
    time.dateTime = String(post.date || '');
    time.setAttribute('aria-label', `Publicado em ${post.day || ''}/${post.month || ''}/${post.year || ''}`);
    time.append(createJcemElement('span', 'jcem-date-flag__year', String(post.year || '')), createJcemElement('span', 'jcem-date-flag__month', jcemRecentMonths[month - 1]), createJcemElement('span', 'jcem-date-flag__day', String(post.day || '')));
    flag.append(time);
    return flag;
};
const createJcemRecentCard = (post) => {
    const href = jcemSafeHttpUrl(post.url);
    if (!href || !post.title.trim())
        return null;
    const image = jcemSafeHttpUrl(post.image);
    const style = ['wide', 'content'].includes(post.image_style || '')
        ? post.image_style
        : '';
    const item = createJcemElement('div', 'grid__item');
    const article = createJcemElement('article', `archive__item${image ? ' archive__item--has-image' : ''}${style ? ` archive__item--${style}` : ''}`);
    const link = createJcemElement('a', 'archive__item-link u-url');
    const header = createJcemElement('header', 'archive__item-header');
    article.setAttribute('itemscope', '');
    article.setAttribute('itemtype', 'https://schema.org/CreativeWork');
    link.href = href;
    link.rel = 'permalink';
    if (image) {
        const figure = createJcemElement('figure', 'archive__item-teaser');
        const img = createJcemElement('img', 'archive__item-image u-photo');
        img.src = image;
        img.alt = String(post.image_alt || post.title);
        img.loading = 'lazy';
        img.decoding = 'async';
        figure.append(img);
        header.append(figure);
    }
    header.append(createJcemRecentDateFlag(post));
    const title = createJcemElement('h2', 'archive__item-title no_toc p-name', post.title);
    title.setAttribute('itemprop', 'headline');
    header.append(title);
    const body = createJcemElement('div', 'archive__item-body');
    const meta = createJcemElement('p', 'page__meta');
    const date = new Date(post.date || '');
    const dateText = Number.isNaN(date.getTime())
        ? ''
        : new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    const minutes = Math.max(1, Math.ceil(Number(post.words || 0) / 200));
    meta.textContent = `${dateText}${dateText ? ' · ' : ''}${minutes} minuto(s) de leitura`;
    body.append(meta);
    if (post.excerpt) {
        const excerpt = createJcemElement('p', 'archive__item-excerpt p-summary', post.excerpt);
        excerpt.setAttribute('itemprop', 'description');
        body.append(excerpt);
    }
    link.append(header, body);
    article.append(link);
    item.append(article);
    return item;
};
const loadJcemRecentPosts = async () => {
    const section = select('[data-jcem-recent-posts]');
    const grid = select('[data-jcem-recent-posts-grid]');
    if (!section || !grid)
        return;
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = controller ? window.setTimeout(() => controller.abort(), 15000) : 0;
    try {
        const response = await fetch('/recent-posts.json', {
            credentials: 'omit',
            headers: { Accept: 'application/json' },
            signal: controller === null || controller === void 0 ? void 0 : controller.signal,
        });
        if (!response.ok)
            return;
        const payload = await response.json();
        if (!Array.isArray(payload))
            return;
        const fragment = document.createDocumentFragment();
        payload.filter(isJcemRecentPost).slice(0, 6).forEach((post) => {
            const card = createJcemRecentCard(post);
            if (card)
                fragment.append(card);
        });
        if (!fragment.childElementCount)
            return;
        grid.append(fragment);
        section.hidden = false;
    }
    catch (_error) {
    }
    finally {
        if (timeout)
            window.clearTimeout(timeout);
    }
};
let jcemRecentPostsScheduled = false;
const scheduleJcemRecentPosts = () => {
    if (jcemRecentPostsScheduled || !select('[data-jcem-recent-posts]'))
        return;
    jcemRecentPostsScheduled = true;
    const run = () => {
        void loadJcemRecentPosts();
    };
    if (window.requestIdleCallback)
        window.requestIdleCallback(run, { timeout: 1800 });
    else
        window.setTimeout(run, 80);
};
const prepareJcemNoScriptFragments = () => {
    if (jcemNoScriptFragmentsReady) {
        return jcemNoScriptFragmentsReady;
    }
    jcemNoScriptFragmentsReady = new Promise((resolve) => {
        try {
            const noScript = select('body > noscript');
            const source = ((noScript === null || noScript === void 0 ? void 0 : noScript.textContent) || (noScript === null || noScript === void 0 ? void 0 : noScript.innerHTML) || '').trim();
            const template = document.createElement('template');
            template.innerHTML = source;
            const masthead = template.content.querySelector('[data-jcem-static-fragment="masthead"]');
            const footer = template.content.querySelector('[data-jcem-static-fragment="footer"]');
            let cache = select('#jcem-noscript-fragment-cache');
            if (!cache) {
                cache = document.createElement('div');
                cache.id = 'jcem-noscript-fragment-cache';
                cache.hidden = true;
                document.body.append(cache);
            }
            while (cache.firstChild) {
                cache.removeChild(cache.firstChild);
            }
            if (masthead) {
                cache.append(masthead.cloneNode(true));
            }
            if (footer) {
                cache.append(footer.cloneNode(true));
            }
            document.documentElement.dataset.jcemNoscriptFragmentsReady =
                masthead && footer ? 'true' : 'missing';
        }
        catch (_error) {
            document.documentElement.dataset.jcemNoscriptFragmentsReady = 'failed';
        }
        finally {
            resolve();
        }
    });
    return jcemNoScriptFragmentsReady;
};
const revealJcemPage = () => {
    void prepareJcemNoScriptFragments().finally(() => {
        document.documentElement.classList.add('jcem-page-loaded');
        scheduleJcemRecentPosts();
    });
};
const hideNoScript = () => {
    const noScript = select('body > noscript');
    if (noScript) {
        noScript.style.display = 'none';
    }
};
bindJcemLoadingProgress();
if (document.readyState === 'complete') {
    revealJcemPage();
}
else {
    window.addEventListener('load', revealJcemPage, { once: true });
}
document.addEventListener('DOMContentLoaded', () => {
    bindJcemTheme();
    bindJcemNav();
    bindJcemMasthead();
    bindJcemScrollTop();
    bindJcemCollapsibleSections();
    bindJcemBlockquotePanels();
    bindJcemQuoteReferences();
    bindJcemEditorialFormatting();
    bindJcemFootnotes();
    hideNoScript();
});
export {};
