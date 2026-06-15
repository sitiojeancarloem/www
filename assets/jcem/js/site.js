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
const normalizeJcemText = (text) => text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
const findJcemSectionHeading = (content, title) => {
    const normalizedTitle = normalizeJcemText(title);
    return (Array.from(content.querySelectorAll('h2, h3')).find((heading) => normalizeJcemText(heading.textContent || '') === normalizedTitle) || null);
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
        content.insertBefore(details, heading);
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
    content.insertBefore(details, heading);
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
        const body = document.createElement('div');
        body.className = 'jcem-panel__body';
        while (quote.firstChild) {
            body.append(quote.firstChild);
        }
        quote.classList.add('jcem-panel', 'jcem-panel--blockquote', 'jcem-panel--futuristic');
        quote.dataset.jcemPanelSource = 'blockquote';
        quote.append(body);
    });
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
const hideNoScript = () => {
    const noScript = select('body > noscript');
    if (noScript) {
        noScript.style.display = 'none';
    }
};
document.addEventListener('DOMContentLoaded', () => {
    bindJcemTheme();
    bindJcemNav();
    bindJcemScrollTop();
    bindJcemCollapsibleSections();
    bindJcemBlockquotePanels();
    bindJcemFootnotes();
    hideNoScript();
});
export {};
