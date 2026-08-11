/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */
const quotePairs = new Map([
    ['"', '"'],
    ["'", "'"],
    ['“', '”'],
    ['‘', '’'],
]);
const wordCharacterPattern = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;
const quoteContentPattern = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;
const semanticBlockSelector = 'blockquote, [data-jcem-blockquote], [role="blockquote"]';
const excludedContextSelector = 'a, em, i, cite, code, pre, kbd, samp, script, style, .footnotes, .jcem-references, .jcem-inline-quote';
const isWordCharacter = (value) => wordCharacterPattern.test(value);
const isSingleQuoteBoundary = (text, index, opening) => {
    const previous = text[index - 1] || '';
    const next = text[index + 1] || '';
    return opening
        ? !isWordCharacter(previous) && Boolean(next.trim())
        : !isWordCharacter(next) && Boolean(previous.trim());
};
const findClosingQuote = (text, start, closeQuote) => {
    for (let index = start + 1; index < text.length; index += 1) {
        if (text[index] !== closeQuote)
            continue;
        if (closeQuote === "'" && !isSingleQuoteBoundary(text, index, false)) {
            continue;
        }
        return index;
    }
    return -1;
};
const wrapInlineQuotesInText = (textNode) => {
    const text = textNode.textContent || '';
    if (!/["'“‘]/.test(text))
        return false;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let lastAppend = 0;
    let changed = false;
    while (cursor < text.length) {
        const openQuote = text[cursor];
        const closeQuote = quotePairs.get(openQuote);
        if (!closeQuote ||
            (openQuote === "'" && !isSingleQuoteBoundary(text, cursor, true))) {
            cursor += 1;
            continue;
        }
        const closeIndex = findClosingQuote(text, cursor, closeQuote);
        if (closeIndex <= cursor + 1) {
            cursor += 1;
            continue;
        }
        const quoted = text.slice(cursor, closeIndex + 1);
        if (!quoteContentPattern.test(quoted)) {
            cursor += 1;
            continue;
        }
        if (cursor > lastAppend) {
            fragment.append(document.createTextNode(text.slice(lastAppend, cursor)));
        }
        const quote = document.createElement('em');
        quote.className = 'jcem-inline-quote';
        quote.dataset.jcemInlineQuote = 'automatic';
        quote.textContent = quoted;
        fragment.append(quote);
        lastAppend = closeIndex + 1;
        cursor = closeIndex + 1;
        changed = true;
    }
    if (!changed)
        return false;
    if (lastAppend < text.length) {
        fragment.append(document.createTextNode(text.slice(lastAppend)));
    }
    textNode.replaceWith(fragment);
    return true;
};
const quoteDepth = (quote) => {
    let depth = 0;
    let ancestor = quote.parentElement;
    while (ancestor) {
        if (ancestor.matches(semanticBlockSelector) ||
            ancestor.classList.contains('jcem-inline-quote')) {
            depth += 1;
        }
        ancestor = ancestor.parentElement;
    }
    return depth;
};
const classifyInlineQuote = (quote) => {
    const depth = quoteDepth(quote);
    const kind = depth > 0 ? 'subquote' : 'inline';
    quote.dataset.jcemQuoteDepth = String(depth);
    quote.dataset.jcemQuoteKind = kind;
    quote.classList.toggle('jcem-subquote', kind === 'subquote');
    quote.classList.toggle('jcem-subquote--nested', depth > 1);
    if (kind === 'subquote')
        quote.dataset.jcemSubquote = 'contextual';
    else
        delete quote.dataset.jcemSubquote;
    return kind;
};
export const formatJcemInlineQuotes = (content) => {
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            const text = node.textContent || '';
            if (!parent || !/["'“‘]/.test(text))
                return NodeFilter.FILTER_REJECT;
            if (parent.closest(excludedContextSelector))
                return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        },
    });
    const textNodes = [];
    while (walker.nextNode())
        textNodes.push(walker.currentNode);
    textNodes.forEach(wrapInlineQuotesInText);
    let inline = 0;
    let subquotes = 0;
    content.querySelectorAll('.jcem-inline-quote').forEach((quote) => {
        if (classifyInlineQuote(quote) === 'subquote')
            subquotes += 1;
        else
            inline += 1;
    });
    return { inline, subquotes };
};
