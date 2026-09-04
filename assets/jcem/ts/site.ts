/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

import { formatJcemInlineQuotes } from './inline-quotes.js';
import { resolveJcemLegacyHeroMode } from './cover-layout.js';

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
	const toggle = select<HTMLButtonElement>('.jcem-theme-toggle');

	if (radio) {
		radio.checked = true;
	}
	toggle?.setAttribute('aria-checked', String(theme === 'dark'));
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
					applyJcemTheme(radio.value);
					saveJcemTheme(radio.value);
				}
			});
		});

	select<HTMLButtonElement>('.jcem-theme-toggle')?.addEventListener(
		'click',
		() => {
			const current = select<HTMLInputElement>(
				'input[name="jcem-theme"]:checked',
			)?.value;
			const next: JcemTheme = current === 'light' ? 'dark' : 'light';
			applyJcemTheme(next);
			saveJcemTheme(next);
		},
	);
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
	const cover = select<HTMLElement>('[data-jcem-cover]');
	const externalCover = select<HTMLElement>('[data-jcem-cover-external]');
	const upperNavigation = select<HTMLElement>('.main_jcem_wrapper > .sobpostbar');

	if (!masthead) {
		return;
	}
	if (externalCover) {
		const opacity = externalCover.style.getPropertyValue(
			'--jcem-cover-header-opacity',
		);
		if (opacity) masthead.style.setProperty('--jcem-cover-header-opacity', opacity);
		masthead.dataset.jcemCoverHeader = 'external';
	}

	let geometryFrame = 0;
	const syncCoverGeometry = (): void => {
		geometryFrame = 0;
		if (!cover) return;
		const outerBlockSize = (element: HTMLElement | null): number => {
			if (!element) return 0;
			const style = window.getComputedStyle(element);
			const number = (value: string): number => Number.parseFloat(value) || 0;
			let size = number(style.height);
			if (style.boxSizing !== 'border-box') {
				size += number(style.paddingTop) + number(style.paddingBottom);
				size += number(style.borderTopWidth) + number(style.borderBottomWidth);
			}
			return size + number(style.marginTop) + number(style.marginBottom);
		};
		const siteHeaderHeight = outerBlockSize(upperNavigation) + outerBlockSize(masthead);
		cover.style.setProperty('--jcem-site-header-height', `${siteHeaderHeight}px`);
	};
	const requestGeometrySync = (): void => {
		if (geometryFrame) return;
		geometryFrame = window.requestAnimationFrame(syncCoverGeometry);
	};
	if (cover) {
		syncCoverGeometry();
		requestGeometrySync();
		void document.fonts?.ready.then(requestGeometrySync);
		window.addEventListener('resize', requestGeometrySync, { passive: true });
		if (typeof ResizeObserver === 'function') {
			const geometryObserver = new ResizeObserver(requestGeometrySync);
			geometryObserver.observe(masthead);
			if (upperNavigation) geometryObserver.observe(upperNavigation);
		}
	}

	let ticking = false;

	const syncState = (): void => {
		ticking = false;
		document.documentElement.classList.toggle(
			'jcem-masthead-stuck',
			window.scrollY > 0,
		);
		if (externalCover) {
			masthead.dataset.jcemCoverHeaderState = window.scrollY > 0 ? 'solid' : 'translucent';
		}
	};

	const requestSync = (): void => {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(syncState);
		}
	};

	window.addEventListener('scroll', requestSync, { passive: true });
	syncState();
};

const bindJcemThemeConnector = (): void => {
	document
		.querySelectorAll<HTMLButtonElement>('.author__urls-wrapper button')
		.forEach((button) => {
			button.addEventListener('click', () => {
				const links = button
					.closest<HTMLElement>('.author__urls-wrapper')
					?.querySelector<HTMLElement>('.author__urls');
				const visible = links?.classList.toggle('is--visible') || false;
				button.classList.toggle('open', visible);
				button.setAttribute('aria-expanded', String(visible));
			});
		});

	const content = select<HTMLElement>('.page__content');
	content
		?.querySelectorAll<HTMLHeadingElement>(
			'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]',
		)
		.forEach((heading) => {
			if (heading.querySelector(':scope > .header-link')) return;
			const anchor = document.createElement('a');
			anchor.className = 'header-link';
			anchor.href = `#${encodeURIComponent(heading.id)}`;
			anchor.title = 'Link permanente';
			anchor.setAttribute(
				'aria-label',
				`Link permanente: ${heading.textContent?.trim() || heading.id}`,
			);
			anchor.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i>';
			heading.append(anchor);
		});

	document.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) return;
		const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
		if (
			!anchor ||
			event.defaultPrevented ||
			(event instanceof MouseEvent &&
				(event.button !== 0 ||
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey))
		)
			return;
		const id = decodeURIComponent(anchor.hash.slice(1));
		const target = id ? document.getElementById(id) : document.documentElement;
		if (!target) return;
		event.preventDefault();
		history.pushState(null, '', anchor.hash || '#top');
		target.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'auto'
				: 'smooth',
			block: 'start',
		});
	});

	const tocLinks = Array.from(
		document.querySelectorAll<HTMLAnchorElement>('nav.toc a[href^="#"]'),
	);
	if (!tocLinks.length || typeof IntersectionObserver !== 'function') return;
	const linksById = new Map(
		tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]),
	);
	const activate = (id: string): void => {
		tocLinks.forEach((link) => {
			const active = decodeURIComponent(link.hash.slice(1)) === id;
			link.classList.toggle('active', active);
			link.parentElement?.classList.toggle('active', active);
		});
	};
	const observer = new IntersectionObserver(
		(entries) => {
			const current = entries
				.filter((entry) => entry.isIntersecting)
				.sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
			if (
				current instanceof IntersectionObserverEntry &&
				current.target instanceof HTMLElement
			)
				activate(current.target.id);
		},
		{ rootMargin: '-20px 0px -70% 0px', threshold: 0 },
	);
	linksById.forEach((_link, id) => {
		const heading = document.getElementById(id);
		if (heading) observer.observe(heading);
	});
};

const bindJcemResponsiveNav = (): void => {
	const navigation = select<HTMLElement>('#site-nav');
	if (!navigation) return;

	let frame = 0;
	let pendingWidth = navigation.clientWidth;
	let currentCompact: boolean | null = null;
	const compactBreakpoint = 1024;

	const applyState = (): void => {
		frame = 0;
		const compact = pendingWidth <= compactBreakpoint;
		if (compact === currentCompact) return;
		currentCompact = compact;
		navigation.dataset.jcemNavCompact = compact ? 'true' : 'false';
	};

	const schedule = (width: number): void => {
		pendingWidth = width;
		if (frame) return;
		frame = window.requestAnimationFrame(applyState);
	};

	const ResizeObserverCtor = window.ResizeObserver;
	if (typeof ResizeObserverCtor === 'function') {
		const observer = new ResizeObserverCtor((entries) => {
			const width = entries[0]?.contentRect.width;
			if (width) schedule(width);
		});
		observer.observe(navigation);
	}
	window.addEventListener(
		'resize',
		() => schedule(navigation.clientWidth),
		{ passive: true },
	);
	window.addEventListener(
		'orientationchange',
		() => schedule(navigation.clientWidth),
		{ passive: true },
	);

	schedule(pendingWidth);
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

const bindJcemLoadingProgress = (): void => {
	const progress = select<HTMLElement>('.jcem-load-progress');

	if (!progress) {
		return;
	}

	let lastProgress = 8;

	const advance = (value: number): void => {
		if (value <= lastProgress) return;
		lastProgress = value;
		setJcemLoadingProgress(value);
	};
	const completeDom = (): void => {
		advance(82);
	};
	const trickle = window.setInterval(() => {
		if (document.documentElement.classList.contains('jcem-page-loaded')) {
			window.clearInterval(trickle);
			return;
		}

		advance(Math.min(92, lastProgress + 3));
	}, 450);

	advance(28);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', completeDom, { once: true });
	} else {
		completeDom();
	}
};

type JcemSkeletonState = 'loading' | 'loaded' | 'error';

const bindJcemLegacyHeroLayout = (): void => {
	const hero = document.querySelector<HTMLElement>('[data-jcem-legacy-hero]');
	const image = hero?.querySelector<HTMLImageElement>('.page__hero-image, img');
	const article = document.querySelector<HTMLElement>('article.page .page__inner-wrap');
	if (!hero || !image || !article) return;

	let frame = 0;
	let decisions = 0;
	let lastMode = '';

	const decide = (): void => {
		frame = 0;
		const intrinsicWidth = Number(hero.dataset.jcemImageWidth) || image.naturalWidth;
		const intrinsicHeight = Number(hero.dataset.jcemImageHeight) || image.naturalHeight;
		if (!(intrinsicWidth > 0 && intrinsicHeight > 0)) return;

		const viewportHeight = window.visualViewport?.height || window.innerHeight;
		const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
		const topAtScrollZero = hero.getBoundingClientRect().top + window.scrollY;
		const { mode } = resolveJcemLegacyHeroMode({
			viewportWidth,
			viewportHeight,
			heroTopAtScrollZero: topAtScrollZero,
			imageWidth: intrinsicWidth,
			imageHeight: intrinsicHeight,
		});
		const articleRect = article.getBoundingClientRect();

		hero.style.setProperty('--jcem-legacy-content-left', `${articleRect.left}px`);
		hero.style.setProperty('--jcem-legacy-content-width', `${articleRect.width}px`);
		if (mode !== lastMode) {
			lastMode = mode;
			decisions += 1;
			hero.dataset.jcemLegacyHeroMode = mode;
			hero.dataset.jcemLegacyHeroDecisions = String(decisions);
		}
	};

	const schedule = (): void => {
		if (frame) return;
		frame = window.requestAnimationFrame(decide);
	};

	window.addEventListener('resize', schedule, { passive: true });
	window.addEventListener('orientationchange', schedule, { passive: true });
	window.visualViewport?.addEventListener('resize', schedule, { passive: true });
	if (typeof ResizeObserver === 'function') new ResizeObserver(schedule).observe(article);
	if (!image.complete) image.addEventListener('load', schedule, { once: true });
	schedule();
};

const jcemSkeletonMediaSelector =
	'img, video, iframe, .jcem-featured-image__stage, .jcem-featured-image, .archive__item-teaser, .page__hero, .page__hero--overlay, [data-jcem-skeleton]';
const jcemSkeletonMinVisibleMs = 520;

const findJcemSkeletonContainer = (element: Element): HTMLElement | null => {
	if (element instanceof HTMLElement && element.matches('[data-jcem-skeleton]')) {
		return element;
	}

	if (element instanceof HTMLImageElement) {
		return element.closest<HTMLElement>(
			'.jcem-featured-image__stage, .jcem-featured-image, .archive__item-teaser, .page__hero, .page__hero--overlay, [data-jcem-skeleton]',
		);
	}

	return element instanceof HTMLElement ? element : null;
};

const setJcemSkeletonState = (
	container: HTMLElement,
	state: JcemSkeletonState,
): void => {
	container.classList.add('jcem-skeleton');
	container.dataset.jcemSkeletonState = state;

	if (state === 'loading') {
		container.dataset.jcemSkeletonStartedAt = String(performance.now());
		return;
	}

	delete container.dataset.jcemSkeletonStartedAt;
};

const resolveJcemSkeletonState = (
	container: HTMLElement,
	state: Exclude<JcemSkeletonState, 'loading'>,
): void => {
	const startedAt = Number(container.dataset.jcemSkeletonStartedAt || 0);
	const elapsed = startedAt > 0 ? performance.now() - startedAt : Infinity;
	const delay =
		startedAt > 0 && elapsed < jcemSkeletonMinVisibleMs
			? jcemSkeletonMinVisibleMs - elapsed
			: 0;

	window.setTimeout(() => setJcemSkeletonState(container, state), delay);
};

const bindJcemImageSkeleton = (image: HTMLImageElement): void => {
	if (image.dataset.jcemSkeletonBound === 'true') return;
	image.dataset.jcemSkeletonBound = 'true';
	image.classList.add('jcem-skeleton-asset');
	if (!image.hasAttribute('decoding')) image.decoding = 'async';
	if (!image.hasAttribute('loading')) image.loading = 'lazy';

	const container = findJcemSkeletonContainer(image);
	if (!container) return;

	const sync = (): void => {
		if (image.complete) {
			resolveJcemSkeletonState(
				container,
				image.naturalWidth > 0 ? 'loaded' : 'error',
			);
			return;
		}

		setJcemSkeletonState(container, 'loading');
	};

	sync();
	image.addEventListener('load', sync, { once: true });
	image.addEventListener(
		'error',
		() => resolveJcemSkeletonState(container, 'error'),
		{ once: true },
	);
};

const extractJcemBackgroundUrls = (element: HTMLElement): string[] => {
	const background = window.getComputedStyle(element).backgroundImage || '';
	const urls: string[] = [];
	const pattern = /url\((['"]?)(.*?)\1\)/g;
	let match = pattern.exec(background);

	while (match) {
		if (match[2]) urls.push(match[2]);
		match = pattern.exec(background);
	}

	return urls;
};

const bindJcemBackgroundSkeleton = (element: HTMLElement): void => {
	if (element.dataset.jcemSkeletonBackgroundBound === 'true') return;
	element.dataset.jcemSkeletonBackgroundBound = 'true';

	const urls = extractJcemBackgroundUrls(element);
	if (!urls.length) return;

	let pending = urls.length;
	let failed = false;
	setJcemSkeletonState(element, 'loading');

	const finish = (error = false): void => {
		failed = failed || error;
		pending -= 1;
		if (pending <= 0) {
			resolveJcemSkeletonState(element, failed ? 'error' : 'loaded');
		}
	};

	urls.forEach((url) => {
		const image = new Image();
		image.addEventListener('load', () => finish(), { once: true });
		image.addEventListener('error', () => finish(true), { once: true });
		image.src = url;
	});
};

const bindJcemSkeletonElement = (element: Element): void => {
	if (element instanceof HTMLImageElement) {
		bindJcemImageSkeleton(element);
		return;
	}

	const container = findJcemSkeletonContainer(element);
	if (!container) return;

	const image = container.querySelector<HTMLImageElement>('img');
	if (image) {
		bindJcemImageSkeleton(image);
		return;
	}

	bindJcemBackgroundSkeleton(container);
};

const bindJcemSkeletonAssets = (): void => {
	document
		.querySelectorAll<Element>(jcemSkeletonMediaSelector)
		.forEach(bindJcemSkeletonElement);

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (!(node instanceof Element)) return;
				if (node.matches(jcemSkeletonMediaSelector)) {
					bindJcemSkeletonElement(node);
				}
				node
					.querySelectorAll?.(jcemSkeletonMediaSelector)
					.forEach(bindJcemSkeletonElement);
			});
		});
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});
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

const jcemPrintCollapsibleSelector =
	'details.jcem-collapsible--references, details.c-collapsible--references, details.jcem-collapsible--bibliography, details.c-collapsible--bibliography';

const openJcemPrintCollapsibles = (): void => {
	document
		.querySelectorAll<HTMLDetailsElement>(jcemPrintCollapsibleSelector)
		.forEach((details) => {
			// FIX-BUG: impressão exige seções semanticamente expandidas.
			details.open = true;
		});

	document.documentElement.dataset.jcemPrintSectionsOpen = 'true';
};

const bindJcemPrintCollapsibles = (): void => {
	window.addEventListener('beforeprint', openJcemPrintCollapsibles);

	const printQuery = window.matchMedia?.('print');
	const handlePrintQuery = (event: MediaQueryListEvent | MediaQueryList): void => {
		if (event.matches) {
			openJcemPrintCollapsibles();
		}
	};

	if (printQuery?.addEventListener) {
		printQuery.addEventListener('change', handlePrintQuery);
	} else {
		printQuery?.addListener?.(handlePrintQuery);
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

	bindJcemPrintCollapsibles();
};

const jcemQuoteModels = [
	'standard',
	'futuristic',
	'notice',
	'info',
	'alerta1',
	'alerta2',
] as const;
type JcemQuoteModel = (typeof jcemQuoteModels)[number];
type JcemTypedQuoteModel = Exclude<JcemQuoteModel, 'standard' | 'futuristic'>;

const jcemTypedQuoteIcons: Record<JcemTypedQuoteModel, string> = {
	notice: '📄',
	info: 'ℹ️',
	alerta1: '⚠️',
	alerta2: '❗',
};

const isJcemQuoteModel = (value: string): value is JcemQuoteModel =>
	jcemQuoteModels.includes(value as JcemQuoteModel);

const resolveJcemQuoteModel = (
	quote: HTMLElement,
	article: HTMLElement,
): JcemQuoteModel => {
	const requested =
		quote.dataset.jcemQuoteModel ||
		article.dataset.jcemQuoteDefault ||
		(article.classList.contains('jcem-blockquote-panels')
			? 'futuristic'
			: 'standard');

	if (isJcemQuoteModel(requested)) {
		return requested;
	}

	quote.dataset.jcemQuoteDiagnostic = 'modelo-desconhecido';
	console.warn(`quote_semantics=modelo_desconhecido model=${requested}`);
	return 'standard';
};

const markJcemSemanticQuote = (
	quote: HTMLElement,
	model: JcemQuoteModel,
): void => {
	quote.dataset.jcemBlockquote = '';
	quote.dataset.jcemQuoteModel = model;
	quote.classList.remove(
		...jcemQuoteModels.map((name) => `jcem-quote-model--${name}`),
	);
	quote.classList.add(`jcem-quote-model--${model}`);

	if (quote.tagName !== 'BLOCKQUOTE' && !quote.hasAttribute('role')) {
		quote.setAttribute('role', 'blockquote');
	}
};

const safeJcemQuoteIconUrl = (value: string): string | null => {
	if (!value) return null;
	try {
		const url = new URL(value, document.baseURI);
		return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
	} catch {
		return null;
	}
};

const decorateJcemTypedQuote = (
	quote: HTMLElement,
	model: JcemTypedQuoteModel,
): void => {
	if (quote.querySelector(':scope > .jcem-quote__icon')) return;
	const icon = document.createElement('span');
	icon.className = 'jcem-quote__icon';
	const source = safeJcemQuoteIconUrl(quote.dataset.jcemQuoteIconSrc || '');
	if (source) {
		const image = document.createElement('img');
		image.src = source;
		image.alt = quote.dataset.jcemQuoteIconAlt || '';
		image.loading = 'lazy';
		image.decoding = 'async';
		icon.append(image);
	} else {
		icon.textContent =
			quote.dataset.jcemQuoteIcon || jcemTypedQuoteIcons[model];
		icon.setAttribute('aria-hidden', 'true');
	}
	quote.classList.add('jcem-quote--typed', 'jcem-quote--runtime-icon');
	quote.prepend(icon);
};

const bindJcemBlockquotePanels = (): void => {
	const article = select<HTMLElement>('article.page.jcem-post');
	const content = select<HTMLElement>('.page__content');

	if (!article || !content) {
		return;
	}

	Array.from(
		content.querySelectorAll<HTMLElement>(
			'blockquote:not(.jcem-panel), [data-jcem-blockquote]:not(.jcem-panel)',
		),
	)
		.reverse()
		.forEach((quote) => {
			if (
				quote.closest('.footnotes, .jcem-references') ||
				quote.dataset.jcemQuoteProcessed === 'true'
			) {
				return;
			}

			const model = resolveJcemQuoteModel(quote, article);
			markJcemSemanticQuote(quote, model);
			if (!['standard', 'futuristic'].includes(model)) {
				decorateJcemTypedQuote(quote, model as JcemTypedQuoteModel);
			}
			quote.dataset.jcemQuoteProcessed = 'true';

			if (model !== 'futuristic' || quote.tagName !== 'BLOCKQUOTE') {
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
				'jcem-quote-model--futuristic',
				quote.className,
			]
				.filter(Boolean)
				.join(' ');
			panel.dataset.jcemPanelSource = 'blockquote';
			panel.dataset.jcemBlockquote = '';
			panel.dataset.jcemQuoteModel = 'futuristic';
			panel.dataset.jcemQuoteProcessed = 'true';
			panel.setAttribute('role', 'blockquote');
			if (quote.id) {
				panel.id = quote.id;
			}

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
			body.dataset.jcemBlockquoteBody = '';
			for (const attribute of [
				'cite',
				'lang',
				'dir',
				'aria-label',
				'aria-labelledby',
			]) {
				const value = quote.getAttribute(attribute);
				if (value) {
					body.setAttribute(attribute, value);
				}
			}
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

const bindJcemEditorialFormatting = (): void => {
	const article = select<HTMLElement>('article.page.jcem-post');
	const content = select<HTMLElement>('.page__content');

	if (!article || !content) {
		return;
	}

	formatJcemInlineQuotes(content);
};

const footnoteSummaryMaxLength = 260;
const jcemFootnoteRefSelector =
	"sup[id^='fnref'] a.footnote[href^='#fn:'], sup[id^='fnref'] a[role='doc-noteref'][href^='#fn:']";
const jcemFootnoteBacklinkSelector =
	'.reversefootnote, [role="doc-backlink"], .jcem-footnote-backref';

const summarizeFootnote = (text: string): string => {
	const normalized = text.replace(/\s+/g, ' ').trim();

	return normalized.length > footnoteSummaryMaxLength
		? `${normalized.slice(0, footnoteSummaryMaxLength - 3).trim()}...`
		: normalized;
};

const getJcemFootnoteId = (link: HTMLAnchorElement): string => {
	try {
		return decodeURIComponent(link.hash.slice(1));
	} catch (_error) {
		return link.hash.slice(1);
	}
};

const jcemFootnoteAlpha = (index: number): string => {
	let value = index + 1;
	let label = '';

	while (value > 0) {
		value -= 1;
		label = String.fromCharCode(97 + (value % 26)) + label;
		value = Math.floor(value / 26);
	}

	return label;
};

const collectJcemFootnoteRefs = (): Map<string, HTMLAnchorElement[]> => {
	const groups = new Map<string, HTMLAnchorElement[]>();

	document
		.querySelectorAll<HTMLAnchorElement>(jcemFootnoteRefSelector)
		.forEach((link) => {
			const id = getJcemFootnoteId(link);

			if (!id) {
				return;
			}

			const refs = groups.get(id) || [];
			refs.push(link);
			groups.set(id, refs);
		});

	return groups;
};

const removeJcemFootnoteBacklinks = (note: HTMLElement): void => {
	note.querySelectorAll(jcemFootnoteBacklinkSelector).forEach((backlink) => {
		const previous = backlink.previousSibling;
		const next = backlink.nextSibling;

		if (
			previous instanceof Text &&
			!previous.textContent?.replace(/\u00a0/g, ' ').trim()
		) {
			previous.remove();
		}

		backlink.remove();

		if (
			next instanceof Text &&
			!next.textContent?.replace(/\u00a0/g, ' ').trim()
		) {
			next.remove();
		}
	});
};

const buildJcemFootnoteBackrefs = (
	refs: HTMLAnchorElement[],
): HTMLSpanElement => {
	const backrefs = document.createElement('span');
	backrefs.className = 'jcem-footnote-backrefs';
	backrefs.setAttribute('aria-label', 'Ocorrências desta nota');

	refs.forEach((ref, index) => {
		const source = ref.closest<HTMLElement>('sup[id^="fnref"]');

		if (!source?.id) {
			return;
		}

		const label = jcemFootnoteAlpha(index);
		const link = document.createElement('a');
		link.className = 'jcem-footnote-backref';
		link.href = `#${source.id}`;
		link.setAttribute('role', 'doc-backlink');
		link.setAttribute('aria-label', `Voltar à ocorrência ${label}`);
		link.textContent = label;
		backrefs.append(link);
	});

	return backrefs;
};

const removeJcemLegacyFootnoteLabels = (
	target: HTMLElement,
	refs: HTMLAnchorElement[],
): void => {
	if (refs.length < 2) {
		return;
	}

	const expected = refs.map((_ref, index) => jcemFootnoteAlpha(index)).join(' ');
	const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
	const firstText = walker.nextNode() as Text | null;

	if (!firstText) {
		return;
	}

	const pattern = new RegExp(`^(\\s*)${expected.replace(/\s+/g, '\\s+')}(\\s+)`);
	const text = firstText.textContent || '';
	const normalized = text.replace(pattern, '$1');

	if (normalized !== text) {
		firstText.textContent = normalized;
	}
};

// FIX-BUG: footnotes reutilizadas usam ocorrencias alfabeticas, sem setas duplicadas.
const normalizeJcemFootnoteBackrefs = (): Map<string, HTMLAnchorElement[]> => {
	const groups = collectJcemFootnoteRefs();
	const orderedIds = Array.from(groups.keys());
	const footnotes = select<HTMLElement>('.page__content .footnotes');
	const list = footnotes?.querySelector<HTMLOListElement>('ol');

	if (list) {
		orderedIds.forEach((id, index) => {
			const note = document.getElementById(id);

			if (note instanceof HTMLLIElement && note.parentElement === list) {
				list.append(note);
			}

			groups.get(id)?.forEach((link) => {
				link.textContent = String(index + 1);
			});
		});
	}

	groups.forEach((refs, id) => {
		const note = document.getElementById(id);

		if (!note) {
			return;
		}

		removeJcemFootnoteBacklinks(note);
		const target = note.querySelector<HTMLElement>('p') || note;
		removeJcemLegacyFootnoteLabels(target, refs);
		const backrefs = buildJcemFootnoteBackrefs(refs);

		if (backrefs.childElementCount) {
			target.insertBefore(backrefs, target.firstChild);
		}
	});

	return groups;
};

const bindJcemFootnotes = (): void => {
	normalizeJcemFootnoteBackrefs();

	document
		.querySelectorAll<HTMLAnchorElement>(jcemFootnoteRefSelector)
		.forEach((link) => {
			const id = getJcemFootnoteId(link);
			const note = document.getElementById(id);

			if (!note) {
				return;
			}

			const summaryNode = note.cloneNode(true) as HTMLElement;

			summaryNode
				.querySelectorAll(jcemFootnoteBacklinkSelector)
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

type JcemMathAction = 'wide' | 'fullscreen';

const jcemMathControlLabels: Record<JcemMathAction, string> = {
	wide: 'Ampliar fórmula na largura da janela',
	fullscreen: 'Abrir fórmula em tela cheia',
};

const createJcemMathControl = (
	action: JcemMathAction,
	icon: string,
): HTMLButtonElement => {
	const button = document.createElement('button');
	const symbol = document.createElement('i');

	button.type = 'button';
	button.className = `jcem-math__control jcem-math__control--${action}`;
	button.dataset.jcemMathAction = action;
	button.setAttribute('aria-label', jcemMathControlLabels[action]);
	button.title = jcemMathControlLabels[action];
	symbol.className = `fas ${icon}`;
	symbol.setAttribute('aria-hidden', 'true');
	button.append(symbol);

	return button;
};

const closeJcemMathFallbackFullscreen = (): void => {
	document
		.querySelectorAll<HTMLElement>('.jcem-math.is-fullscreen-fallback')
		.forEach((math) => {
			math.classList.remove('is-fullscreen-fallback');
		});

	document.documentElement.classList.remove('jcem-math-modal-open');
};

const toggleJcemMathFullscreen = async (math: HTMLElement): Promise<void> => {
	closeJcemMathFallbackFullscreen();

	if (document.fullscreenElement === math) {
		await document.exitFullscreen();
		return;
	}

	if (math.requestFullscreen) {
		try {
			await math.requestFullscreen();
			return;
		} catch (_error) {
			// PROTECAO: navegadores sem permissao usam fallback local.
		}
	}

	math.classList.add('is-fullscreen-fallback');
	document.documentElement.classList.add('jcem-math-modal-open');
};

const syncJcemMathFullscreenState = (): void => {
	document
		.querySelectorAll<HTMLElement>('.jcem-math')
		.forEach((math) => {
			math.classList.toggle('is-native-fullscreen', document.fullscreenElement === math);
		});
};

const bindJcemMathControls = (): void => {
	const formulas = Array.from(
		document.querySelectorAll<HTMLElement>(
			'.jcem-math--display[data-jcem-math-display="true"]',
		),
	);

	if (!formulas.length) {
		return;
	}

	formulas.forEach((math) => {
		if (math.querySelector(':scope > .jcem-math__tools')) {
			return;
		}

		const tools = document.createElement('div');
		tools.className = 'jcem-math__tools';
		tools.append(
			createJcemMathControl('wide', 'fa-arrows-alt-h'),
			createJcemMathControl('fullscreen', 'fa-expand'),
		);
		math.append(tools);
	});

	document.addEventListener('click', (event) => {
		const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
			'.jcem-math__control',
		);
		const math = button?.closest<HTMLElement>('.jcem-math');
		const action = button?.dataset.jcemMathAction as JcemMathAction | undefined;

		if (!button || !math || !action) {
			return;
		}

		if (action === 'wide') {
			math.classList.toggle('is-wide');
			return;
		}

		void toggleJcemMathFullscreen(math);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeJcemMathFallbackFullscreen();
		}
	});
	document.addEventListener('fullscreenchange', syncJcemMathFullscreenState);
};

const jcemImageViewerSelector =
	'article.jcem-post .page__content img';
const jcemImageViewerExcludedSelector =
	'.jcem-panel, .jcem-math, .jcem-quote__icon, .author__avatar, [role="presentation"]';
let jcemImageViewerOrigin: HTMLButtonElement | null = null;

const closeJcemImageViewerFallback = (): void => {
	const active = document.querySelector<HTMLElement>(
		'.jcem-image-viewer.is-fullscreen-fallback',
	);
	if (!active) return;
	active.classList.remove('is-fullscreen-fallback');
	document.documentElement.classList.remove('jcem-image-modal-open');
	jcemImageViewerOrigin?.focus();
	jcemImageViewerOrigin = null;
};

const syncJcemImageViewerControl = (viewer: HTMLElement): void => {
	const button = viewer.querySelector<HTMLButtonElement>(
		':scope > .jcem-image-viewer__control',
	);
	if (!button) return;
	const expanded =
		document.fullscreenElement === viewer ||
		viewer.classList.contains('is-fullscreen-fallback');
	const label = expanded ? 'Fechar imagem ampliada' : 'Ampliar imagem';
	button.setAttribute('aria-label', label);
	button.title = label;
	button.setAttribute('aria-expanded', String(expanded));
	const icon = button.querySelector('i');
	if (icon) icon.className = `fas ${expanded ? 'fa-compress' : 'fa-expand'}`;
};

const toggleJcemImageViewer = async (
	viewer: HTMLElement,
	button: HTMLButtonElement,
): Promise<void> => {
	if (
		document.fullscreenElement === viewer ||
		viewer.classList.contains('is-fullscreen-fallback')
	) {
		if (document.fullscreenElement === viewer) await document.exitFullscreen();
		else closeJcemImageViewerFallback();
		return;
	}

	jcemImageViewerOrigin = button;
	if (viewer.requestFullscreen) {
		try {
			await viewer.requestFullscreen();
			return;
		} catch (_error) {
			// PROTECAO: fullscreen recusado degrada para modal local acessivel.
		}
	}

	viewer.classList.add('is-fullscreen-fallback');
	document.documentElement.classList.add('jcem-image-modal-open');
	syncJcemImageViewerControl(viewer);
};

const bindJcemImageViewers = (): void => {
	const images = Array.from(
		document.querySelectorAll<HTMLImageElement>(jcemImageViewerSelector),
	).filter(
		(image) =>
			!image.closest(jcemImageViewerExcludedSelector) &&
			!image.closest('.jcem-image-viewer'),
	);
	if (!images.length) return;

	images.forEach((image) => {
		const media =
			image.closest('picture') ||
			(image.parentElement?.matches('a') &&
			image.parentElement.childElementCount === 1
				? image.parentElement
				: image);
		const viewer = document.createElement('span');
		const button = document.createElement('button');
		const icon = document.createElement('i');
		viewer.className = 'jcem-image-viewer';
		button.type = 'button';
		button.className = 'jcem-image-viewer__control';
		button.setAttribute('aria-label', 'Ampliar imagem');
		button.setAttribute('aria-expanded', 'false');
		button.title = 'Ampliar imagem';
		icon.className = 'fas fa-expand';
		icon.setAttribute('aria-hidden', 'true');
		button.append(icon);
		media.before(viewer);
		viewer.append(media, button);
		button.addEventListener('click', () => {
			void toggleJcemImageViewer(viewer, button);
		});
		viewer.addEventListener('pointerdown', (event) => {
			if (event.pointerType !== 'mouse') viewer.classList.add('is-controls-visible');
		});
	});

	document.addEventListener('fullscreenchange', () => {
		document
			.querySelectorAll<HTMLElement>('.jcem-image-viewer')
			.forEach(syncJcemImageViewerControl);
		if (!document.fullscreenElement && jcemImageViewerOrigin) {
			jcemImageViewerOrigin.focus();
			jcemImageViewerOrigin = null;
		}
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') closeJcemImageViewerFallback();
	});
};

let jcemNoScriptFragmentsReady: Promise<void> | null = null;

type JcemRecentPost = {
	title: string;
	url: string;
	excerpt?: string;
	date?: string;
	year?: string;
	month?: string;
	day?: string;
	words?: number;
	image?: string;
	image_alt?: string;
	image_style?: string;
	image_width?: number;
	image_height?: number;
	image_aspect_ratio?: string;
	image_sizes?: string;
	image_variants?: Array<{
		path: string;
		width: number;
		height: number;
		byte_size?: number;
	}>;
};

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

const createJcemElement = <K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className = '',
	text = '',
): HTMLElementTagNameMap[K] => {
	const node = document.createElement(tag);

	if (className) node.className = className;
	if (text) node.textContent = text;

	return node;
};

const jcemSafeHttpUrl = (value: unknown): string => {
	try {
		const url = new URL(String(value || ''), window.location.origin);
		return /^(https?:)$/.test(url.protocol) ? url.href : '';
	} catch (_error) {
		return '';
	}
};

const isJcemRecentPost = (value: unknown): value is JcemRecentPost => {
	if (!value || typeof value !== 'object') return false;

	const post = value as Partial<JcemRecentPost>;
	return typeof post.title === 'string' && typeof post.url === 'string';
};

const createJcemRecentDateFlag = (post: JcemRecentPost): HTMLElement => {
	const flag = createJcemElement('div', 'jcem-date-flag jcem-date-flag--archive');
	const time = createJcemElement('time');
	const month = Math.max(1, Math.min(12, Number(post.month) || 1));

	time.dateTime = String(post.date || '');
	time.setAttribute(
		'aria-label',
		`Publicado em ${post.day || ''}/${post.month || ''}/${post.year || ''}`,
	);
	time.append(
		createJcemElement('span', 'jcem-date-flag__year', String(post.year || '')),
		createJcemElement('span', 'jcem-date-flag__month', jcemRecentMonths[month - 1]),
		createJcemElement('span', 'jcem-date-flag__day', String(post.day || '')),
	);
	flag.append(time);

	return flag;
};

const createJcemRecentCard = (post: JcemRecentPost): HTMLElement | null => {
	const href = jcemSafeHttpUrl(post.url);
	if (!href || !post.title.trim()) return null;

	const image = jcemSafeHttpUrl(post.image);
	const style = ['wide', 'content'].includes(post.image_style || '')
		? post.image_style
		: '';
	const item = createJcemElement('div', 'grid__item');
	const article = createJcemElement(
		'article',
		`archive__item${image ? ' archive__item--has-image' : ''}${style ? ` archive__item--${style}` : ''}`,
	);
	const link = createJcemElement('a', 'archive__item-link u-url');
	const header = createJcemElement('header', 'archive__item-header');

	article.setAttribute('itemscope', '');
	article.setAttribute('itemtype', 'https://schema.org/CreativeWork');
	link.href = href;
	link.rel = 'permalink';

	if (image) {
		const figure = createJcemElement('figure', 'archive__item-teaser');
		const img = createJcemElement('img', 'archive__item-image u-photo jcem-skeleton-asset');

		setJcemSkeletonState(figure, 'loading');
		if (post.image_aspect_ratio) {
			figure.dataset.jcemAssetAspectRatio = post.image_aspect_ratio;
			figure.style.setProperty('--jcem-asset-aspect-ratio', post.image_aspect_ratio);
		}
		const variants = (post.image_variants || [])
			.map((variant) => ({
				...variant,
				path: jcemSafeHttpUrl(variant.path),
			}))
			.filter(
				(variant) =>
					variant.path &&
					Number(variant.width) > 0 &&
					Number(variant.height) > 0,
			)
			.sort((left, right) => left.width - right.width);
		img.src = variants[0]?.path || image;
		if (variants.length) {
			img.srcset = variants
				.map((variant) => `${variant.path} ${variant.width}w`)
				.join(', ');
			img.sizes =
				post.image_sizes ||
				'(max-width: 40rem) calc(100vw - 2rem), (max-width: 64rem) 50vw, 33vw';
		}
		img.alt = String(post.image_alt || post.title);
		img.loading = 'lazy';
		img.decoding = 'async';
		if (post.image_width && post.image_height) {
			img.width = post.image_width;
			img.height = post.image_height;
		}
		figure.append(img);
		header.append(figure);
	}

	header.append(createJcemRecentDateFlag(post));
	const title = createJcemElement(
		'h2',
		'archive__item-title no_toc p-name',
		post.title,
	);
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
		const excerpt = createJcemElement(
			'p',
			'archive__item-excerpt p-summary',
			post.excerpt,
		);
		excerpt.setAttribute('itemprop', 'description');
		body.append(excerpt);
	}

	link.append(header, body);
	article.append(link);
	item.append(article);

	return item;
};

const loadJcemRecentPosts = async (): Promise<void> => {
	const section = select<HTMLElement>('[data-jcem-recent-posts]');
	const grid = select<HTMLElement>('[data-jcem-recent-posts-grid]');
	if (!section || !grid) return;

	const controller = typeof AbortController === 'function' ? new AbortController() : null;
	const timeout = controller ? window.setTimeout(() => controller.abort(), 15000) : 0;

	try {
		const response = await fetch('/recent-posts.json', {
			credentials: 'omit',
			headers: { Accept: 'application/json' },
			signal: controller?.signal,
		});
		if (!response.ok) return;

		const payload: unknown = await response.json();
		if (!Array.isArray(payload)) return;

		const fragment = document.createDocumentFragment();
		payload.filter(isJcemRecentPost).slice(0, 6).forEach((post) => {
			const card = createJcemRecentCard(post);
			if (card) fragment.append(card);
		});
		if (!fragment.childElementCount) return;

		grid.append(fragment);
		section.hidden = false;
	} catch (_error) {
		// PROTECAO: falha do JSON nao interfere na leitura do artigo.
	} finally {
		if (timeout) window.clearTimeout(timeout);
	}
};

let jcemRecentPostsScheduled = false;

const scheduleJcemRecentPosts = (): void => {
	if (jcemRecentPostsScheduled || !select('[data-jcem-recent-posts]')) return;
	jcemRecentPostsScheduled = true;

	const run = (): void => {
		void loadJcemRecentPosts();
	};

	window.setTimeout(() => {
		if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 1800 });
		else window.setTimeout(run, 80);
	}, 4000);
};

const prepareJcemNoScriptFragments = (): Promise<void> => {
	if (jcemNoScriptFragmentsReady) {
		return jcemNoScriptFragmentsReady;
	}

	jcemNoScriptFragmentsReady = new Promise((resolve) => {
		try {
			const noScript = select<HTMLElement>('body > noscript');
			const source = (noScript?.textContent || noScript?.innerHTML || '').trim();
			const template = document.createElement('template');
			template.innerHTML = source;

			const masthead = template.content.querySelector<HTMLElement>(
				'[data-jcem-static-fragment="masthead"]',
			);
			const footer = template.content.querySelector<HTMLElement>(
				'[data-jcem-static-fragment="footer"]',
			);
			let cache = select<HTMLElement>('#jcem-noscript-fragment-cache');

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
		} catch (_error) {
			// PROTECAO: falha na copia do fallback nao deve travar a pagina real.
			document.documentElement.dataset.jcemNoscriptFragmentsReady = 'failed';
		} finally {
			resolve();
		}
	});

	return jcemNoScriptFragmentsReady;
};

let jcemPageRevealStarted = false;

const revealJcemPage = (): void => {
	if (jcemPageRevealStarted) return;
	jcemPageRevealStarted = true;

	// FIX-BUG: a liberacao visual nao depende da clonagem do fallback oculto.
	setJcemLoadingProgress(100);
	document.documentElement.classList.add('jcem-page-loaded');
	scheduleJcemRecentPosts();

	const prepareFallback = (): void => {
		void prepareJcemNoScriptFragments();
	};
	window.setTimeout(() => {
		if (window.requestIdleCallback) {
			window.requestIdleCallback(prepareFallback, { timeout: 1800 });
		} else {
			window.setTimeout(prepareFallback, 80);
		}
	}, 4000);
};

const scheduleJcemInitialReveal = (): void => {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', revealJcemPage, { once: true });
		return;
	}

	revealJcemPage();
};

const hideNoScript = (): void => {
	const noScript = select<HTMLElement>('body > noscript');

	if (noScript) {
		noScript.style.display = 'none';
	}

	// PROTECAO: o conteudo permanece visivel mesmo sem JavaScript.
};

let jcemPrintPreparation: Promise<void> | null = null;

const prepareJcemPrintArticle = (): Promise<void> => {
	const article = select<HTMLElement>('[data-print-article]');
	if (!article) return Promise.resolve();
	if (jcemPrintPreparation) return jcemPrintPreparation;

	jcemPrintPreparation = import(
		new URL('../print-ieee/index.js', import.meta.url).href
	)
		.then((library) => {
			library.prepareArticle(article, {
				profileId:
					article.dataset.printProfile ||
					'ieee-conference-a4-ieeetran-1.8b',
			});
		})
		.catch(() => {
			// PROTECAO: falha do recurso de impressão preserva o artigo legível.
			article.dataset.printState = 'legivel';
		});
	return jcemPrintPreparation;
};

const bindJcemPrintPreparation = (): void => {
	const article = select<HTMLElement>('[data-print-article]');
	if (!article) return;

	const prepareNow = (): void => {
		void prepareJcemPrintArticle();
	};
	window.addEventListener('beforeprint', prepareNow);
	const printMedia = window.matchMedia?.('print');
	printMedia?.addEventListener?.('change', (event) => {
		if (event.matches) prepareNow();
	});

	const scheduleIdle = (): void => {
		if (window.requestIdleCallback) {
			window.requestIdleCallback(prepareNow, { timeout: 2000 });
		} else {
			window.setTimeout(prepareNow, 0);
		}
	};
	window.setTimeout(scheduleIdle, 5000);
};

const bindJcemPostPaintEnhancements = (): void => {
	bindJcemSkeletonAssets();
	bindJcemNav();
	bindJcemThemeConnector();
	bindJcemMasthead();
	bindJcemResponsiveNav();
	bindJcemScrollTop();
	bindJcemCollapsibleSections();
	bindJcemBlockquotePanels();
	bindJcemQuoteReferences();
	bindJcemEditorialFormatting();
	bindJcemFootnotes();
	bindJcemMathControls();
	bindJcemImageViewers();
	bindJcemPrintPreparation();
};

const scheduleJcemPostPaintEnhancements = (): void => {
	const run = (): void => {
		window.setTimeout(bindJcemPostPaintEnhancements, 0);
	};

	// PROTECAO: libera uma oportunidade real de pintura entre o reveal e as
	// transformacoes editoriais que percorrem artigos ou taxonomias extensas.
	if (window.requestAnimationFrame) window.requestAnimationFrame(run);
	else window.setTimeout(bindJcemPostPaintEnhancements, 0);
};

bindJcemLoadingProgress();
scheduleJcemInitialReveal();

document.addEventListener('DOMContentLoaded', () => {
	// Tema e fallback sao sincronizados antes da primeira pintura; os percursos
	// amplos do DOM ficam para a oportunidade posterior.
	bindJcemTheme();
	bindJcemLegacyHeroLayout();
	hideNoScript();
	scheduleJcemPostPaintEnhancements();
});

export {};
