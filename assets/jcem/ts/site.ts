declare global {
	interface Element {
		on(type: string, listener: EventListenerOrEventListenerObject): void;
	}
}

Element.prototype.on = function (
	type: string,
	listener: EventListenerOrEventListenerObject,
): void {
	this.addEventListener(type, listener);
};

const select = <T extends Element>(selector: string): T | null =>
	document.querySelector<T>(selector);

const jcemThemeKey = 'jcem-theme';
const jcemThemeMaxAge = 60 * 60 * 24 * 365;
const jcemThemeValues = ['light', 'dark'] as const;

type JcemTheme = (typeof jcemThemeValues)[number];

const isJcemTheme = (theme: string): theme is JcemTheme =>
	jcemThemeValues.includes(theme as JcemTheme);

const getJcemThemeCookie = (): string => {
	const cookie = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${jcemThemeKey}=`));

	return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
};

const getJcemTheme = (): string => {
	try {
		// PROTECAO: localStorage indisponivel nao impede o cookie.
		return localStorage.getItem(jcemThemeKey) || getJcemThemeCookie();
	} catch (error) {
		return getJcemThemeCookie();
	}
};

const saveJcemTheme = (theme: JcemTheme): void => {
	try {
		// PROTECAO: cookie preserva a escolha quando localStorage falha.
		localStorage.setItem(jcemThemeKey, theme);
	} catch (error) {
		document.documentElement.setAttribute('data-jcem-storage', 'blocked');
	}

	document.cookie = `${jcemThemeKey}=${encodeURIComponent(
		theme,
	)}; Path=/; Max-Age=${jcemThemeMaxAge}; SameSite=Lax`;
};

const applyJcemTheme = (theme: JcemTheme): void => {
	const radio = select<HTMLInputElement>(`#jcem-theme-${theme}`);

	if (radio) {
		radio.checked = true;
	}
};

const bindJcemTheme = (): void => {
	const storedTheme = getJcemTheme();
	const theme = isJcemTheme(storedTheme) ? storedTheme : 'dark';

	applyJcemTheme(theme);

	document
		.querySelectorAll<HTMLInputElement>('input[name="jcem-theme"]')
		.forEach((radio) => {
			radio.addEventListener('change', () => {
				if (radio.checked && isJcemTheme(radio.value)) {
					saveJcemTheme(radio.value);
				}
			});
		});
};

const bindJcemNav = (): void => {
	const navState = select<HTMLInputElement>('#jcem-nav-state');

	document.querySelectorAll<HTMLAnchorElement>('#site-nav a').forEach((link) => {
		link.addEventListener('click', () => {
			if (navState) {
				navState.checked = false;
			}
		});
	});
};

const bindJcemMasthead = (): void => {
	const masthead = select<HTMLElement>('.masthead');

	if (!masthead) {
		return;
	}

	let ticking = false;

	const syncState = (): void => {
		ticking = false;
		document.documentElement.classList.toggle(
			'jcem-masthead-stuck',
			window.scrollY > 0 && masthead.getBoundingClientRect().top <= 0,
		);
	};

	const requestSync = (): void => {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(syncState);
		}
	};

	window.addEventListener('scroll', requestSync, { passive: true });
	window.addEventListener('resize', requestSync, { passive: true });
	syncState();
};

const bindJcemScrollTop = (): void => {
	const button = select<HTMLAnchorElement>('.jcem-scroll-top');

	if (!button) {
		return;
	}

	let ticking = false;

	const syncVisibility = (): void => {
		ticking = false;
		const isVisible = window.scrollY > 240;
		const isNearPageEnd =
			window.innerHeight + window.scrollY >=
			document.documentElement.scrollHeight - 96;

		button.classList.toggle('is-visible', isVisible);
		button.setAttribute('aria-hidden', String(!isVisible));
		button.tabIndex = isVisible ? 0 : -1;
		document.documentElement.classList.toggle(
			'jcem-at-page-end',
			isNearPageEnd,
		);
	};

	const requestSync = (): void => {
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

const clampJcemProgress = (value: number): number =>
	Math.max(8, Math.min(100, Math.round(value)));

const setJcemLoadingProgress = (value: number): void => {
	const progress = select<HTMLElement>('.jcem-load-progress');

	if (!progress) {
		return;
	}

	const percent = clampJcemProgress(value);
	progress.style.setProperty('--jcem-load-progress', `${percent}%`);
	progress.setAttribute('aria-valuenow', String(percent));
};

const isJcemLoadTargetComplete = (element: Element): boolean => {
	if (element instanceof HTMLImageElement) {
		return element.complete;
	}

	if (element instanceof HTMLMediaElement) {
		return element.readyState >= 2;
	}

	if (element instanceof HTMLIFrameElement) {
		try {
			return Boolean(element.contentDocument?.readyState === 'complete');
		} catch (error) {
			return false;
		}
	}

	return true;
};

const bindJcemLoadingProgress = (): void => {
	const progress = select<HTMLElement>('.jcem-load-progress');

	if (!progress) {
		return;
	}

	const targets = Array.from(
		document.querySelectorAll<Element>('img, iframe, video, audio'),
	);
	const total = Math.max(1, targets.length + 2);
	let completed = document.readyState === 'loading' ? 0 : 1;
	let lastProgress = 8;

	const update = (base = 0): void => {
		const loadedTargets = targets.filter(isJcemLoadTargetComplete).length;
		const nextProgress = Math.max(
			base,
			8 + ((completed + loadedTargets) / total) * 82,
		);

		if (nextProgress > lastProgress) {
			lastProgress = nextProgress;
			setJcemLoadingProgress(nextProgress);
		}
	};
	const completeDom = (): void => {
		completed = Math.max(completed, 1);
		update(55);
	};
	const completePage = (): void => {
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
	} else {
		completeDom();
	}

	if (document.readyState === 'complete') {
		completePage();
	} else {
		window.addEventListener('load', completePage, { once: true });
	}
};

const normalizeJcemText = (text: string): string =>
	text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();

const normalizeJcemHeadingText = (text: string): string =>
	normalizeJcemText(text).replace(/\s*permalink$/, '');

const findJcemSectionHeading = (
	content: HTMLElement,
	title: string,
): HTMLHeadingElement | null => {
	const normalizedTitle = normalizeJcemText(title);

	return (
		Array.from(
			content.querySelectorAll<HTMLHeadingElement>('h2, h3'),
		).find(
			(heading) =>
				normalizeJcemHeadingText(heading.textContent || '') === normalizedTitle,
		) || null
	);
};

const createJcemDetails = (
	id: string,
	label: string,
	modifier: string,
): HTMLDetailsElement => {
	const details = document.createElement('details');
	const summary = document.createElement('summary');

	details.id = id;
	details.className = `c-collapsible c-collapsible--${modifier} jcem-collapsible jcem-collapsible--${modifier}`;
	summary.textContent = label;
	details.append(summary);

	return details;
};

const insertJcemDetailsBefore = (
	details: HTMLDetailsElement,
	target: Element,
): boolean => {
	const parent = target.parentNode;

	if (!parent) {
		return false;
	}

	parent.insertBefore(details, target);
	return true;
};

const moveUntilNextHeading = (
	details: HTMLDetailsElement,
	start: Element,
): void => {
	let node = start.nextSibling;

	details.append(start);

	while (node) {
		const current = node;
		const next = current.nextSibling;

		if (
			current instanceof HTMLHeadingElement &&
			['H2', 'H3'].includes(current.tagName)
		) {
			break;
		}

		if (
			current instanceof HTMLDetailsElement &&
			(current.classList.contains('c-collapsible') ||
				current.classList.contains('jcem-collapsible'))
		) {
			break;
		}

		details.append(current);
		node = next;
	}
};

const wrapJcemFootnotes = (content: HTMLElement): void => {
	const footnotes = content.querySelector<HTMLElement>(':scope > .footnotes');

	if (!footnotes || footnotes.closest('.jcem-collapsible')) {
		return;
	}

	const heading =
		findJcemSectionHeading(content, 'Referências') ||
		findJcemSectionHeading(content, 'Referencias');
	const details = createJcemDetails(
		heading?.id || 'referencias',
		'Referências',
		'references',
	);

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

const wrapJcemBibliography = (content: HTMLElement): void => {
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

const openJcemCollapsibleForHash = (hash: string): void => {
	if (!hash) {
		return;
	}

	const id = decodeURIComponent(hash.slice(1));
	const target = document.getElementById(id);

	if (id.startsWith('fn:')) {
		(
			document.getElementById('referências') ||
			document.getElementById('referencias')
		)?.setAttribute('open', '');
	}

	if (!target) {
		return;
	}

	const details = target.closest<HTMLDetailsElement>(
		'details.c-collapsible, details.jcem-collapsible',
	);

	if (
		target instanceof HTMLDetailsElement &&
		(target.classList.contains('c-collapsible') ||
			target.classList.contains('jcem-collapsible'))
	) {
		return;
	}

	if (details) {
		details.open = true;
	}
};

const bindJcemCollapsibleSections = (): void => {
	const content = select<HTMLElement>('.page__content');

	if (!content) {
		return;
	}

	wrapJcemFootnotes(content);
	wrapJcemBibliography(content);
	openJcemCollapsibleForHash(window.location.hash);

	document.addEventListener('click', (event) => {
		const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
			'a[href^="#"]',
		);

		if (link) {
			openJcemCollapsibleForHash(link.hash);
		}
	});

	window.addEventListener('hashchange', () => {
		openJcemCollapsibleForHash(window.location.hash);
	});
};

const bindJcemBlockquotePanels = (): void => {
	const article = select<HTMLElement>('article.page.jcem-blockquote-panels');
	const content = select<HTMLElement>('.page__content');

	if (!article || !content) {
		return;
	}

	content
		.querySelectorAll<HTMLQuoteElement>('blockquote:not(.jcem-panel)')
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

const jcemCitationContexts: Array<[RegExp, string]> = [
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

const getJcemCitationContext = (text: string): string =>
	jcemCitationContexts.find(([pattern]) => pattern.test(text))?.[1] || '';

const normalizeJcemCitationPrefix = (element: HTMLElement): void => {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
	let node = walker.nextNode() as Text | null;

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

		node = walker.nextNode() as Text | null;
	}
};

const addJcemCitationContext = (element: HTMLElement): void => {
	if (
		Array.from(element.children).some((child) =>
			child.classList.contains('jcem-cite-context'),
		)
	) {
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

const normalizeJcemQuoteReferences = (scope: HTMLElement): void => {
	scope
		.querySelectorAll<HTMLElement>('p, cite')
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

const bindJcemQuoteReferences = (): void => {
	document
		.querySelectorAll<HTMLElement>(
			'.page__content blockquote, .page__content .jcem-panel__body',
		)
		.forEach(normalizeJcemQuoteReferences);
};

const jcemQuotePairs = new Map<string, string>([
	['"', '"'],
	["'", "'"],
	['“', '”'],
	['‘', '’'],
]);

const jcemWordCharacterPattern = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;
const jcemQuoteContentPattern = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;

const isJcemWordCharacter = (value: string): boolean =>
	jcemWordCharacterPattern.test(value);

const isJcemSingleQuoteBoundary = (
	text: string,
	index: number,
	opening: boolean,
): boolean => {
	const previous = text[index - 1] || '';
	const next = text[index + 1] || '';

	if (opening) {
		return !isJcemWordCharacter(previous) && Boolean(next.trim());
	}

	return !isJcemWordCharacter(next) && Boolean(previous.trim());
};

const findJcemClosingQuote = (
	text: string,
	start: number,
	closeQuote: string,
): number => {
	for (let index = start + 1; index < text.length; index += 1) {
		if (text[index] !== closeQuote) {
			continue;
		}

		if (
			closeQuote === "'" &&
			!isJcemSingleQuoteBoundary(text, index, false)
		) {
			continue;
		}

		return index;
	}

	return -1;
};

const wrapJcemInlineQuotesInText = (textNode: Text): boolean => {
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

		if (
			!closeQuote ||
			(openQuote === "'" && !isJcemSingleQuoteBoundary(text, cursor, true))
		) {
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

const bindJcemEditorialFormatting = (): void => {
	const article = select<HTMLElement>('article.page.jcem-post');
	const content = select<HTMLElement>('.page__content');

	if (!article || !content) {
		return;
	}

	const walker = document.createTreeWalker(
		content,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode(node) {
				const parent = node.parentElement;
				const text = node.textContent || '';

				if (!parent || !/["'“‘]/.test(text)) {
					return NodeFilter.FILTER_REJECT;
				}

				if (
					parent.closest(
						'a, em, i, cite, code, pre, kbd, samp, script, style, .footnotes, .jcem-references, .jcem-inline-quote',
					)
				) {
					return NodeFilter.FILTER_REJECT;
				}

				return NodeFilter.FILTER_ACCEPT;
			},
		},
	);
	const textNodes: Text[] = [];

	while (walker.nextNode()) {
		textNodes.push(walker.currentNode as Text);
	}

	textNodes.forEach(wrapJcemInlineQuotesInText);
};

const footnoteSummaryMaxLength = 260;

const summarizeFootnote = (text: string): string => {
	const normalized = text.replace(/\s+/g, ' ').trim();

	return normalized.length > footnoteSummaryMaxLength
		? `${normalized.slice(0, footnoteSummaryMaxLength - 3).trim()}...`
		: normalized;
};

const bindJcemFootnotes = (): void => {
	document
		.querySelectorAll<HTMLAnchorElement>(
			"sup[id^='fnref'] a.footnote[href^='#fn:'], sup[id^='fnref'] a[role='doc-noteref'][href^='#fn:']",
		)
		.forEach((link) => {
			const id = decodeURIComponent(link.hash.slice(1));
			const note = document.getElementById(id);

			if (!note) {
				return;
			}

			const summaryNode = note.cloneNode(true) as HTMLElement;

			summaryNode
				.querySelectorAll('.reversefootnote, [role="doc-backlink"]')
				.forEach((backlink) => backlink.remove());

			const summary = summarizeFootnote(summaryNode.textContent || '');

			if (!summary) {
				return;
			}

			// FIX-BUG: tooltip usa a nota renderizada sem alterar o footnote kramdown.
			link.dataset.footnote = summary;
			link.setAttribute('aria-label', `Nota ${link.textContent || ''}: ${summary}`);
		});
};

const revealJcemPage = (): void => {
	document.documentElement.classList.add('jcem-page-loaded');
};

const hideNoScript = (): void => {
	const noScript = select<HTMLElement>('body > noscript');

	if (noScript) {
		noScript.style.display = 'none';
	}

	// PROTECAO: o conteudo permanece visivel mesmo sem JavaScript.
};

bindJcemLoadingProgress();

if (document.readyState === 'complete') {
	revealJcemPage();
} else {
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
