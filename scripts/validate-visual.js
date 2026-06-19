import { createServer } from 'node:http';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY ??= '1';

const root = path.resolve(process.env.VISUAL_SITE_DIR || '_site');
const artifactDir = path.resolve(process.env.VISUAL_ARTIFACT_DIR || 'visual-artifacts');
const visualValidationStrict = !['0', 'false', 'no', 'advisory'].includes(
	String(process.env.VISUAL_VALIDATION_STRICT || 'true').toLowerCase(),
);
const pages = ['/', '/sobre/', '/p/devaneios/'];
const themes = ['dark', 'light'];
const notFoundPage = '/rota-inexistente-codex/';
const viewports = [
	{ name: 'wide', width: 1920, height: 1080 },
	{ name: 'desktop', width: 1366, height: 768 },
	{ name: 'reduced', width: 900, height: 700 },
	{ name: 'side', width: 720, height: 768 },
	{ name: 'mobile', width: 390, height: 844 },
];

const contentTypes = new Map([
	['.html', 'text/html; charset=utf-8'],
	['.js', 'text/javascript; charset=utf-8'],
	['.css', 'text/css; charset=utf-8'],
	['.svg', 'image/svg+xml'],
	['.png', 'image/png'],
	['.jpg', 'image/jpeg'],
	['.jpeg', 'image/jpeg'],
	['.gif', 'image/gif'],
	['.ico', 'image/x-icon'],
]);
const loadingProbeGif = Buffer.from(
	'R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
	'base64',
);

const browserCandidates = [
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
	process.env.CHROME_EXECUTABLE,
	process.env.EDGE_EXECUTABLE,
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

const findLocalBrowser = () =>
	browserCandidates.find((candidate) => existsSync(candidate));

const launchBrowser = async () => {
	const executablePath = findLocalBrowser();

	if (executablePath) {
		// PROTECAO: validação visual não depende do download do browser gerenciado.
		return chromium.launch({ executablePath });
	}

	return chromium.launch();
};

const fail = (message) => {
	throw new Error(message);
};

const githubAnnotationText = (message) =>
	String(message).replace(/[\r\n]+/g, ' ').slice(0, 8000);

const warnVisualValidation = (error) => {
	const message = error?.stack || error?.message || String(error);
	console.warn(`visual_validation=advisory_failed`);
	console.warn(message);

	if (process.env.GITHUB_ACTIONS) {
		console.warn(
			`::warning title=Validacao visual consultiva::${githubAnnotationText(message)}`,
		);
	}
};

const readPublishedPostPaths = async () => {
	const postRoot = path.join(root, 'p');

	if (!existsSync(postRoot)) {
		return [];
	}

	const entries = await readdir(postRoot, { withFileTypes: true });

	return entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => `/p/${entry.name}/`)
		.sort();
};

const delay = (ms) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

const routePath = (urlPath) => {
	const decoded = decodeURIComponent(urlPath.split('?')[0] || '/');
	const clean = path.normalize(decoded).replace(/^([/\\])+/, '');
	const candidate = path.join(root, clean);
	const target = decoded.endsWith('/') ? path.join(candidate, 'index.html') : candidate;

	const relative = path.relative(root, target);

	if (relative.startsWith('..') || path.isAbsolute(relative)) {
		return null;
	}

	if (existsSync(target)) {
		return target;
	}

	if (existsSync(`${target}.html`)) {
		return `${target}.html`;
	}

	const index = path.join(target, 'index.html');
	return existsSync(index) ? index : null;
};

const startServer = async () =>
	new Promise((resolve) => {
		const server = createServer(async (request, response) => {
			const target = routePath(request.url || '/');

			if (!target) {
				const fallback = path.join(root, '404.html');

				if (!existsSync(fallback)) {
					response.writeHead(404);
					response.end('Not found');
					return;
				}

				const body = await readFile(fallback);
				response.writeHead(404, {
					'content-type': 'text/html; charset=utf-8',
				});
				response.end(body);
				return;
			}

			const body = await readFile(target);
			response.writeHead(200, {
				'content-type': contentTypes.get(path.extname(target)) || 'application/octet-stream',
			});
			response.end(body);
		});

		server.listen(0, '127.0.0.1', () => resolve(server));
	});

const seedCookieConsent = async (context) => {
	await context.addInitScript(() => {
		// PROTECAO: o banner de consentimento nao deve bloquear controles em validacao visual.
		localStorage.setItem('silktideCookieBanner_InitialChoice', '1');
		localStorage.setItem('silktideCookieChoice_obrigat_rios', 'true');
		localStorage.setItem('silktideCookieChoice_estat_sticos', 'false');
		localStorage.setItem('silktideCookieChoice_publicit_rios', 'false');
	});
};

const readLoadingState = async (page) =>
	page.evaluate(() => {
		const isVisible = (element) => {
			if (!element) return false;
			const rect = element.getBoundingClientRect();
			const style = window.getComputedStyle(element);

			return (
				rect.width > 1 &&
				rect.height > 1 &&
				style.display !== 'none' &&
				style.visibility !== 'hidden' &&
				style.opacity !== '0'
			);
		};
		const loader = document.querySelector('.carregandoPagina');
		const progress = loader?.querySelector('.jcem-load-progress');
		const progressFill = progress?.querySelector('span');
		const wrapper = document.querySelector('.main_jcem_wrapper');
		const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
		const progressRect = progress?.getBoundingClientRect();
		const progressFillRect = progressFill?.getBoundingClientRect();

		return {
			pageLoadedClass: document.documentElement.classList.contains('jcem-page-loaded'),
			urlChecked: document.documentElement.dataset.jcem404UrlChecked || '',
			loaderVisible: isVisible(loader),
			progressInsideLoader: Boolean(progress && loader?.contains(progress)),
			progressWidth: progressRect?.width || 0,
			progressHeight: progressRect?.height || 0,
			progressTop: progressRect?.top || 0,
			progressFillWidth: progressFillRect?.width || 0,
			progressValue: Number(progress?.getAttribute('aria-valuenow') || 0),
			wrapperVisible: isVisible(wrapper),
			wrapperVisibility: wrapperStyle?.visibility || '',
			bodyOverflow: window.getComputedStyle(document.body).overflow,
		};
	});

const validateLoadingGate = async (browser, baseUrl, url, viewport) => {
	const context = await browser.newContext({ viewport });
	await seedCookieConsent(context);
	let releaseRoutes = () => {};
	const routeGate = new Promise((resolve) => {
		releaseRoutes = resolve;
	});
	await context.route('**/assets/jcem/js/site.js', async (route) => {
		await routeGate;
		await route.continue();
	});
	await context.route('**/*logo-animado.gif', async (route) => {
		await routeGate;
		await route.fulfill({
			status: 200,
			contentType: 'image/gif',
			body: loadingProbeGif,
		});
	});

	const page = await context.newPage();

	try {
		await page.goto(`${baseUrl}${url}`, { waitUntil: 'commit' });
		await page.waitForSelector('.carregandoPagina', { state: 'attached' });
		await page.waitForTimeout(50);

		const beforeLoad = await readLoadingState(page);

		if (beforeLoad.pageLoadedClass) {
			fail(`Classe de pagina carregada aplicada antes de window.load em ${url}`);
		}

		if (!beforeLoad.loaderVisible) {
			fail(`.carregandoPagina invisivel antes de window.load em ${url}`);
		}

		if (
			!beforeLoad.progressInsideLoader ||
			beforeLoad.progressHeight < 7 ||
			beforeLoad.progressTop !== 0 ||
			beforeLoad.progressWidth < viewport.width - 2 ||
			beforeLoad.progressFillWidth <= 0
		) {
			fail(`Progressbar do loader invalida antes de window.load em ${url}`);
		}

		if (beforeLoad.wrapperVisible || beforeLoad.wrapperVisibility !== 'hidden') {
			fail(`Conteudo visivel antes de window.load em ${url}`);
		}

		if (url === notFoundPage && beforeLoad.urlChecked !== 'true') {
			fail(`404 sem conclusao do gate de URL antes do load em ${url}`);
		}

		releaseRoutes();
		await page.waitForLoadState('load', { timeout: 15000 });
		await page.waitForFunction(() => document.documentElement.classList.contains('jcem-page-loaded'));
		await page.waitForFunction(() => {
			const loader = document.querySelector('.carregandoPagina');
			if (!loader) return false;
			const style = window.getComputedStyle(loader);
			return style.visibility === 'hidden' || style.opacity === '0';
		});

		const afterLoad = await readLoadingState(page);

		if (!afterLoad.pageLoadedClass) {
			fail(`Classe de pagina carregada ausente depois de window.load em ${url}`);
		}

		if (afterLoad.loaderVisible) {
			fail(`.carregandoPagina visivel depois de window.load em ${url}`);
		}

		if (afterLoad.progressValue !== 100) {
			fail(`Progressbar do loader nao finalizou em ${url}`);
		}

		if (!afterLoad.wrapperVisible || afterLoad.wrapperVisibility === 'hidden') {
			fail(`Conteudo oculto depois de window.load em ${url}`);
		}

		if (url === notFoundPage && afterLoad.urlChecked !== 'true') {
			fail(`404 liberada sem conclusao do gate de URL em ${url}`);
		}
	} finally {
		await context.close();
	}
};

const contrastRatio = (foreground, background) => {
	const parse = (value) => {
		const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		return match ? match.slice(1, 4).map(Number) : null;
	};

	const luminance = (rgb) => {
		const [r, g, b] = rgb.map((channel) => {
			const value = channel / 255;
			return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
		});

		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};

	const fg = parse(foreground);
	const bg = parse(background);

	if (!fg || !bg) {
		return 21;
	}

	const lighter = Math.max(luminance(fg), luminance(bg));
	const darker = Math.min(luminance(fg), luminance(bg));
	return (lighter + 0.05) / (darker + 0.05);
};

const validateCompactMenu = async (page, url, theme, viewportName) => {
	if (viewportName === 'desktop') {
		return;
	}

	const navToggle = page.locator('.jcem-nav-toggle');
	const navToggleVisible = await navToggle.isVisible();

	if (!navToggleVisible) {
		if (viewportName === 'mobile' || viewportName === 'side') {
			fail(`Botao do menu compacto invisivel em ${url} ${theme} ${viewportName}`);
		}
		return;
	}

	await navToggle.click();
	await page.waitForFunction(() => {
		const menu = document.querySelector('.greedy-nav .visible-links');
		return menu && window.getComputedStyle(menu).opacity === '1';
	});

	const result = await page.evaluate(() => {
		const menu = document.querySelector('.greedy-nav .visible-links');
		const backdrop = document.querySelector('.jcem-nav-backdrop');
		const navState = document.querySelector('#jcem-nav-state');
		const menuRect = menu?.getBoundingClientRect();
		const backdropRect = backdrop?.getBoundingClientRect();
		const menuStyle = menu ? window.getComputedStyle(menu) : null;
		const backdropStyle = backdrop ? window.getComputedStyle(backdrop) : null;
		const backdropTarget = document.elementFromPoint(8, Math.floor(window.innerHeight / 2));

		return {
			checked: Boolean(navState?.checked),
			menu: menuRect && menuStyle
				? {
						width: menuRect.width,
						height: menuRect.height,
						right: Math.round(window.innerWidth - menuRect.right),
						opacity: menuStyle.opacity,
						filter: menuStyle.filter,
						backdropFilter: menuStyle.backdropFilter,
						zIndex: Number.parseInt(menuStyle.zIndex, 10) || 0,
					}
				: null,
			backdrop: backdropRect && backdropStyle
				? {
						width: backdropRect.width,
						height: backdropRect.height,
						display: backdropStyle.display,
						backdropFilter: backdropStyle.backdropFilter,
						zIndex: Number.parseInt(backdropStyle.zIndex, 10) || 0,
					}
				: null,
			backdropHit: backdropTarget === backdrop || Boolean(backdrop?.contains(backdropTarget)),
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		};
	});

	if (!result.checked) {
		fail(`Menu compacto nao abriu em ${url} ${theme} ${viewportName}`);
	}

	if (!result.menu || result.menu.width <= 1 || result.menu.height <= 1 || result.menu.opacity !== '1') {
		fail(`Menu compacto invisivel em ${url} ${theme} ${viewportName}`);
	}

	if (result.menu.filter !== 'none' || result.menu.backdropFilter !== 'none') {
		fail(`Menu compacto desfocado em ${url} ${theme} ${viewportName}`);
	}

	if (result.menu.width >= result.viewport.width - 32) {
		fail(`Menu compacto com largura total em ${url} ${theme} ${viewportName}`);
	}

	if (result.menu.right > 24) {
		fail(`Menu compacto desalinhado da direita em ${url} ${theme} ${viewportName}`);
	}

	if (!result.backdrop || result.backdrop.display === 'none') {
		fail(`Backdrop do menu ausente em ${url} ${theme}`);
	}

	if (result.backdrop.width < result.viewport.width || result.backdrop.height < result.viewport.height) {
		fail(`Backdrop do menu nao cobre a janela em ${url} ${theme}`);
	}

	if (!result.backdrop.backdropFilter.includes('blur')) {
		fail(`Backdrop do menu sem blur em ${url} ${theme}`);
	}

	if (!result.backdropHit) {
		fail(`Backdrop do menu nao cobre o conteudo externo em ${url} ${theme}`);
	}

	if (result.menu.zIndex <= result.backdrop.zIndex) {
		fail(`Menu compacto abaixo do backdrop em ${url} ${theme} ${viewportName}`);
	}

	await page.screenshot({
		path: path.join(
			artifactDir,
			`${url.replace(/\W+/g, '-') || 'home'}-${theme}-${viewportName}-menu.png`,
		),
		fullPage: true,
	});

	await page.evaluate(() => {
		const navState = document.querySelector('#jcem-nav-state');
		if (navState) {
			navState.checked = false;
		}
	});
};

const validatePage = async (page, url, theme, viewportName) => {
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});

	await page.evaluate((selectedTheme) => {
		const input = document.querySelector(
			`#jcem-theme-${selectedTheme}`,
		);

		if (!(input instanceof HTMLInputElement)) return;

		input.checked = true;
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.dispatchEvent(new Event('change', { bubbles: true }));
	}, theme);

	const expectedPanelImage =
		theme === 'light' ? 'painel-modo-claro.svg' : 'painel.svg';

	await page.waitForTimeout(150);
	await page
		.waitForFunction(() => {
			const icon = document.querySelector('label[for="jcem-theme-light"] i');
			const pseudo = icon ? window.getComputedStyle(icon, '::before') : null;
			return pseudo && pseudo.display !== 'none' && pseudo.content !== 'none' && pseudo.content !== '""';
		}, null, { timeout: 15000 })
		.catch(() => {});
	await page
		.waitForFunction((panelImage) => {
			const article = document.querySelector('article.page.jcem-blockquote-panels');

			if (!article) return true;

			const blockquoteCount = article.querySelectorAll('.page__content blockquote').length;
			const panels = Array.from(
				article.querySelectorAll('.page__content .jcem-panel--blockquote'),
			);
			const validPanelCount = panels.filter((panel) => {
				const table = panel.querySelector(':scope > table.jcem-panel__table');
				const body = table?.querySelector('td.jcem-panel__body');
				const topLeft = table?.querySelector('.jcem-panel__corner--top-left');
				const topRight = table?.querySelector('.jcem-panel__corner--top-right');
				const bottomLeft = table?.querySelector('.jcem-panel__corner--bottom-left');
				const bottomRight = table?.querySelector('.jcem-panel__corner--bottom-right');
				const cornerStyle = topLeft ? window.getComputedStyle(topLeft) : null;
				const tableStyle = table ? window.getComputedStyle(table) : null;
				const tableRect = table?.getBoundingClientRect();
				const leftRect = topLeft?.getBoundingClientRect();
				const rightRect = topRight?.getBoundingClientRect();

				return Boolean(
					table &&
						body &&
						topLeft &&
						topRight &&
						bottomLeft &&
						bottomRight &&
						cornerStyle?.backgroundImage.includes(panelImage) &&
						cornerStyle?.backgroundSize.includes('auto') &&
						!cornerStyle?.backgroundSize.includes('100% 100%') &&
						tableStyle?.tableLayout !== 'fixed' &&
						tableRect &&
						leftRect &&
						rightRect &&
						leftRect.width >= 80 &&
						rightRect.width >= 70 &&
						tableRect.width > leftRect.width + rightRect.width
				);
			}).length;

			return blockquoteCount === 0 && (panels.length === 0 || panels.length === validPanelCount);
		}, expectedPanelImage, { timeout: 15000 })
		.catch(() => {});

	const result = await page.evaluate((expectedPanelImage) => {
		const visible = (selector) =>
			Array.from(document.querySelectorAll(selector)).filter((node) => {
				const rect = node.getBoundingClientRect();
				const style = window.getComputedStyle(node);
				return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
			});

		const readStyle = (selector) => {
			const element = document.querySelector(selector);
			if (!element) return null;

			const effectiveBackgroundColor = (node) => {
				let current = node;

				while (current) {
					const backgroundColor = window.getComputedStyle(current).backgroundColor;

					if (backgroundColor && !backgroundColor.endsWith(', 0)') && backgroundColor !== 'transparent') {
						return backgroundColor;
					}

					current = current.parentElement;
				}

				return window.getComputedStyle(document.documentElement).backgroundColor;
			};

			const style = window.getComputedStyle(element);
			const rect = element.getBoundingClientRect();
			return {
				selector,
				color: style.color,
				backgroundColor: effectiveBackgroundColor(element),
				width: rect.width,
				height: rect.height,
			};
		};

		const siteTitle = document.querySelector('.site-title')?.getBoundingClientRect();
		const scrollTop = document.querySelector('.jcem-scroll-top');
		const scrollTopRect = scrollTop?.getBoundingClientRect();
		const iconStyle = (selector) => {
			const element = document.querySelector(selector);
			const pseudo = element ? window.getComputedStyle(element, '::before') : null;
			return pseudo
				? {
						display: pseudo.display,
						content: pseudo.content,
					}
				: null;
		};
		const rectInfo = (selector) => {
			const element = document.querySelector(selector);
			const rect = element?.getBoundingClientRect();

			return rect
				? {
						left: Math.round(rect.left),
						right: Math.round(rect.right),
						width: Math.round(rect.width),
					}
				: null;
		};
		const boxInfo = (selector) => {
			const element = document.querySelector(selector);
			const rect = element?.getBoundingClientRect();

			return rect
				? {
						left: Math.round(rect.left),
						top: Math.round(rect.top),
						right: Math.round(rect.right),
						bottom: Math.round(rect.bottom),
						width: Math.round(rect.width),
						height: Math.round(rect.height),
					}
				: null;
		};
		const flag = document.querySelector('.jcem-post-header > .jcem-date-flag');
		const titleAnchor = document.querySelector('.jcem-post-header .page__title a');
		const titleAnchorRect = titleAnchor?.getBoundingClientRect();
		const titleAnchorStyle = titleAnchor
			? window.getComputedStyle(titleAnchor)
			: null;
		const titleTextStart = titleAnchorRect
			? titleAnchorRect.left + Number.parseFloat(titleAnchorStyle?.paddingLeft || '0')
			: null;
		const flagTime = flag?.querySelector('time');
		const flagTimeRect = flagTime?.getBoundingClientRect();
		const flagTextMaxOffset = flagTimeRect
			? Math.max(
					...Array.from(
						flag.querySelectorAll(
							'.jcem-date-flag__year, .jcem-date-flag__month, .jcem-date-flag__day',
						),
					).map((node) => {
						const rect = node.getBoundingClientRect();
						return Math.abs(
							rect.left + rect.width / 2 - (flagTimeRect.left + flagTimeRect.width / 2),
						);
					}),
				)
			: 0;
		const blockquotes = Array.from(
			document.querySelectorAll('.page__content blockquote'),
		);
		const blockquotePanels = Array.from(
			document.querySelectorAll('.page__content .jcem-panel--blockquote'),
		);
		const tablePanels = blockquotePanels.filter((panel) => {
			const table = panel.querySelector(':scope > table.jcem-panel__table');
			const body = table?.querySelector('td.jcem-panel__body');
			const topLeft = table?.querySelector('.jcem-panel__corner--top-left');
			const topRight = table?.querySelector('.jcem-panel__corner--top-right');
			const bottomLeft = table?.querySelector('.jcem-panel__corner--bottom-left');
			const bottomRight = table?.querySelector('.jcem-panel__corner--bottom-right');
			const cornerStyle = topLeft ? window.getComputedStyle(topLeft) : null;
			const tableStyle = table ? window.getComputedStyle(table) : null;
			const tableRect = table?.getBoundingClientRect();
			const leftRect = topLeft?.getBoundingClientRect();
			const rightRect = topRight?.getBoundingClientRect();

			return Boolean(
				table &&
					body &&
					topLeft &&
					topRight &&
					bottomLeft &&
					bottomRight &&
					cornerStyle?.backgroundImage.includes(expectedPanelImage) &&
					cornerStyle?.backgroundSize.includes('auto') &&
					!cornerStyle?.backgroundSize.includes('100% 100%') &&
					tableStyle?.tableLayout !== 'fixed' &&
					tableRect &&
					leftRect &&
					rightRect &&
					leftRect.width < Math.min(190, tableRect.width * 0.38) &&
					rightRect.width < Math.min(120, tableRect.width * 0.3) &&
					Math.abs(leftRect.left - tableRect.left) <= 2 &&
					Math.abs(rightRect.right - tableRect.right) <= 2,
			);
		});
		const shareButtons = visible('.page__share .btn');
		const isPost = Boolean(document.querySelector('article.page.jcem-post'));
		const readEditorialStyle = (element) => {
			if (!element) return null;
			const style = window.getComputedStyle(element);

			return {
				textIndent: style.textIndent,
				fontStyle: style.fontStyle,
			};
		};
		const normalPostParagraph = Array.from(
			document.querySelectorAll('article.jcem-post .page__content p'),
		).find((paragraph) => {
			if (
				paragraph.closest(
					'blockquote, .jcem-panel, .footnotes, .jcem-references, li, td, th, figcaption',
				)
			) {
				return false;
			}

			if (
				paragraph.children.length === 1 &&
				['IMG', 'PICTURE'].includes(paragraph.children[0].tagName) &&
				!(paragraph.textContent || '').trim()
			) {
				return false;
			}

			return Boolean((paragraph.textContent || '').trim());
		});
		const panelBody = document.querySelector(
			'article.jcem-post .page__content .jcem-panel__body',
		);
		const panelParagraph = document.querySelector(
			'article.jcem-post .page__content .jcem-panel__body p',
		);
		const quoteReference = document.querySelector(
			'article.jcem-post .page__content .jcem-quote-reference',
		);
		const inlineQuote = document.querySelector(
			'article.jcem-post .page__content .jcem-inline-quote',
		);
		const footnoteMarker = document.querySelector(
			'article.jcem-post .page__content sup[id^="fnref"]',
		);
		const footnoteMarkerRect = footnoteMarker?.getBoundingClientRect();
		const footnoteLinkRect = footnoteMarker
			?.querySelector('a')
			?.getBoundingClientRect();
		const quoteReferenceStyle = quoteReference
			? window.getComputedStyle(quoteReference)
			: null;
		const panelBodyStyle = panelBody ? window.getComputedStyle(panelBody) : null;
		const articleLink = document.querySelector(
			'article.jcem-post .page__content p a[href]:not(.footnote):not(.reversefootnote)',
		);
		const articleLinkIconStyle = articleLink
			? window.getComputedStyle(articleLink, '::after')
			: null;
		const archiveItem = document.querySelector('.entries-grid .archive__item');
		const archiveLink = archiveItem?.querySelector('.archive__item-link');
		const archiveImage = archiveItem?.querySelector('.archive__item-image');
		const archiveNormalImage = document.querySelector(
			'.entries-grid .archive__item:not(.archive__item--wide) .archive__item-image',
		);
		const archiveNormalFrame = archiveNormalImage?.closest('.archive__item-teaser');
		const archiveWideImage = document.querySelector(
			'.entries-grid .archive__item--wide .archive__item-image',
		);
		const archiveGrid = document.querySelector('.entries-grid');
		const archiveItemRect = archiveItem?.getBoundingClientRect();
		const archiveLinkRect = archiveLink?.getBoundingClientRect();
		const archiveImageRect = archiveImage?.getBoundingClientRect();
		const archiveNormalImageRect = archiveNormalImage?.getBoundingClientRect();
		const archiveNormalFrameRect = archiveNormalFrame?.getBoundingClientRect();
		const archiveWideImageRect = archiveWideImage?.getBoundingClientRect();
		const archiveImageStyle = archiveImage
			? window.getComputedStyle(archiveImage)
			: null;
		const archiveNormalImageStyle = archiveNormalImage
			? window.getComputedStyle(archiveNormalImage)
			: null;
		const archiveNormalFrameStyle = archiveNormalFrame
			? window.getComputedStyle(archiveNormalFrame)
			: null;
		const archiveWideImageStyle = archiveWideImage
			? window.getComputedStyle(archiveWideImage)
			: null;
		const archiveCenterTarget = archiveItemRect
			? document
					.elementFromPoint(
						archiveItemRect.left + archiveItemRect.width / 2,
						archiveItemRect.top + archiveItemRect.height / 2,
					)
					?.closest('a.archive__item-link')
			: null;

		return {
			overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			sidebars: visible('aside, .sidebar, .sidebar__right').length,
			siteTitleWidth: siteTitle ? siteTitle.width : 0,
			siteTitleHeight: siteTitle ? siteTitle.height : 0,
			scrollHeight: document.documentElement.scrollHeight,
			clientHeight: document.documentElement.clientHeight,
			scrollTopButton: scrollTop
				? {
						width: scrollTopRect.width,
						height: scrollTopRect.height,
						visible: scrollTop.classList.contains('is-visible'),
						ariaHidden: scrollTop.getAttribute('aria-hidden'),
						tabIndex: scrollTop.getAttribute('tabindex'),
					}
				: null,
			icons: {
				themeLight: iconStyle('label[for="jcem-theme-light"] i'),
				themeDark: iconStyle('label[for="jcem-theme-dark"] i'),
				scrollTop: iconStyle('.jcem-scroll-top i'),
			},
			headerControls: {
				viewportWidth: window.innerWidth,
				logo: rectInfo('.site-logo'),
				logoImg: rectInfo('.site-logo img'),
				theme: rectInfo('.jcem-theme-toggle'),
				navToggle: rectInfo('.jcem-nav-toggle'),
			},
			post: {
				article: boxInfo('article.page'),
				articleSurface:
					boxInfo('article.page .page__inner-wrap') || boxInfo('article.page'),
				title: boxInfo('.jcem-post-header .page__title'),
				titleTextStart,
				readtime: boxInfo('.jcem-post-header .page__meta-readtime'),
				firstPanel: boxInfo('.page__content .jcem-panel--blockquote'),
				flag: boxInfo('.jcem-post-header > .jcem-date-flag'),
				flagTextMaxOffset,
				blockquotePanelsEnabled: Boolean(
					document.querySelector('article.page.jcem-blockquote-panels'),
				),
				blockquoteCount: blockquotes.length,
				panelBlockquoteCount: blockquotePanels.length,
				tablePanelBlockquoteCount: tablePanels.length,
				shareButtons: shareButtons.length,
				isPost,
				editorial: {
					normalParagraph: readEditorialStyle(normalPostParagraph),
					panelBody: readEditorialStyle(panelBody),
					panelParagraph: readEditorialStyle(panelParagraph),
					quoteReferenceCount: document.querySelectorAll(
						'article.jcem-post .page__content .jcem-quote-reference',
					).length,
					badQuoteReferenceCount: Array.from(
						document.querySelectorAll(
							'article.jcem-post .page__content .jcem-quote-reference',
						),
					).filter((reference) => {
						const text = (reference.textContent || '').trim();
						return !text.startsWith('—');
					}).length,
					quoteReferenceFontSize: Number.parseFloat(
						quoteReferenceStyle?.fontSize || '0',
					),
					panelBodyFontSize: Number.parseFloat(
						panelBodyStyle?.fontSize || '0',
					),
					citationContextCount: document.querySelectorAll(
						'article.jcem-post .page__content .jcem-cite-context',
					).length,
					inlineQuoteCount: document.querySelectorAll(
						'article.jcem-post .page__content .jcem-inline-quote',
					).length,
					inlineQuote: readEditorialStyle(inlineQuote),
					footnoteMarker: footnoteMarkerRect
						? {
								width: footnoteMarkerRect.width,
								height: footnoteMarkerRect.height,
								linkWidth: footnoteLinkRect?.width || 0,
							}
						: null,
					linkIcon: articleLinkIconStyle
						? {
								display: articleLinkIconStyle.display,
								marginLeft: articleLinkIconStyle.marginLeft,
								paddingTop: articleLinkIconStyle.paddingTop,
								width: articleLinkIconStyle.width,
								content: articleLinkIconStyle.content,
							}
						: null,
				},
			},
			archive: {
				itemCount: document.querySelectorAll('.entries-grid .archive__item').length,
				relatedItemCount: document.querySelectorAll(
					'.page__related .grid__wrapper .archive__item',
				).length,
				teaserCount: document.querySelectorAll(
					'.entries-grid .archive__item-teaser .archive__item-image',
				).length,
				flagCount: document.querySelectorAll(
					'.entries-grid .archive__item .jcem-date-flag--archive',
				).length,
				firstLinkCoversItem: Boolean(
					archiveItemRect &&
						archiveLinkRect &&
						Math.abs(archiveItemRect.left - archiveLinkRect.left) <= 2 &&
						Math.abs(archiveItemRect.top - archiveLinkRect.top) <= 2 &&
						Math.abs(archiveItemRect.right - archiveLinkRect.right) <= 2 &&
						Math.abs(archiveItemRect.bottom - archiveLinkRect.bottom) <= 2,
				),
				firstCenterClickable: archiveCenterTarget === archiveLink,
				columnCount: archiveGrid
					? window
							.getComputedStyle(archiveGrid)
							.gridTemplateColumns.split(' ')
							.filter(Boolean).length
					: 0,
				firstImageObjectFit: archiveImageStyle?.objectFit || '',
				normalImageObjectFit: archiveNormalImageStyle?.objectFit || '',
				normalFrameMaxHeight: archiveNormalFrameStyle?.maxHeight || '',
				normalImageMaxHeight: archiveNormalImageStyle?.maxHeight || '',
				normalImageCoversFrameWidth: Boolean(
					archiveNormalImageRect &&
						archiveNormalFrameRect &&
						Math.abs(archiveNormalImageRect.width - archiveNormalFrameRect.width) <= 2,
				),
				normalImageWithinFrameHeight: Boolean(
					archiveNormalImageRect &&
						archiveNormalFrameRect &&
						archiveNormalImageRect.height <= archiveNormalFrameRect.height + 2,
				),
				normalImageNaturalRatio:
					archiveNormalImage && archiveNormalImage.naturalHeight > 0
						? archiveNormalImage.naturalWidth / archiveNormalImage.naturalHeight
						: 0,
				normalImageRenderedRatio:
					archiveNormalImageRect && archiveNormalImageRect.height > 0
						? archiveNormalImageRect.width / archiveNormalImageRect.height
						: 0,
				wideImageCount: document.querySelectorAll(
					'.entries-grid .archive__item--wide .archive__item-image',
				).length,
				wideImageObjectFit: archiveWideImageStyle?.objectFit || '',
				firstWideImageRatio:
					archiveWideImageRect && archiveWideImageRect.height > 0
						? archiveWideImageRect.width / archiveWideImageRect.height
						: 0,
			},
			styles: [
				readStyle('.masthead'),
				readStyle('.jcem-theme-toggle'),
				readStyle('.initial-content'),
				readStyle('.jcem-panel, .archive__item, .jcem-sobre'),
				readStyle('.page__share .btn'),
			].filter(Boolean),
		};
	}, expectedPanelImage);

	if (result.overflowX > 2) {
		fail(`Overflow horizontal em ${url} ${theme} ${viewportName}: ${result.overflowX}px`);
	}

	if (result.sidebars > 0) {
		fail(`Sidebar visivel em ${url} ${theme} ${viewportName}`);
	}

	if (url.includes('/p/')) {
		const editorial = result.post.editorial;
		const paragraphIndent = Number.parseFloat(
			editorial.normalParagraph?.textIndent || '0',
		);
		const panelParagraphIndent = Number.parseFloat(
			editorial.panelParagraph?.textIndent || '0',
		);

		if (!result.post.isPost) {
			fail(`Post sem classe editorial em ${url} ${theme} ${viewportName}`);
		}

		if (!editorial.normalParagraph || paragraphIndent < 48) {
			fail(`Paragrafo de post sem indentacao editorial em ${url} ${theme} ${viewportName}`);
		}

		if (editorial.normalParagraph.fontStyle !== 'normal') {
			fail(`Paragrafo de post em italico por padrao em ${url} ${theme} ${viewportName}`);
		}

		if (result.post.panelBlockquoteCount > 0) {
			if (editorial.panelBody?.fontStyle !== 'normal') {
				fail(`Painel de citacao em italico por padrao em ${url} ${theme} ${viewportName}`);
			}

			if (panelParagraphIndent !== 0) {
				fail(`Painel de citacao com indentacao de paragrafo em ${url} ${theme} ${viewportName}`);
			}

			if (editorial.quoteReferenceCount < 1) {
				fail(`Painel de citacao sem referencia normalizada em ${url} ${theme} ${viewportName}`);
			}

			if (editorial.badQuoteReferenceCount > 0) {
				fail(`Referencia de painel sem travessao em ${url} ${theme} ${viewportName}`);
			}

			if (
				editorial.quoteReferenceFontSize <= 0 ||
				editorial.panelBodyFontSize <= 0 ||
				editorial.quoteReferenceFontSize >= editorial.panelBodyFontSize
			) {
				fail(`Referencia de painel sem fonte menor em ${url} ${theme} ${viewportName}`);
			}

			if (editorial.citationContextCount < 1) {
				fail(`Referencia de painel sem contexto sucinto de autoria em ${url} ${theme} ${viewportName}`);
			}
		}

		if (editorial.inlineQuoteCount < 1 || editorial.inlineQuote?.fontStyle !== 'italic') {
			fail(`Citacao inline sem italico editorial em ${url} ${theme} ${viewportName}`);
		}

		if (
			editorial.footnoteMarker &&
			(editorial.footnoteMarker.width > Math.max(28, editorial.footnoteMarker.linkWidth + 16) ||
				editorial.footnoteMarker.height > 18)
		) {
			fail(`Footnote inline distorcida em ${url} ${theme} ${viewportName}`);
		}

		if (
			editorial.linkIcon &&
			(editorial.linkIcon.display !== 'inline' ||
				Number.parseFloat(editorial.linkIcon.marginLeft || '0') > 0 ||
				Number.parseFloat(editorial.linkIcon.paddingTop || '0') > 0 ||
				editorial.linkIcon.content === 'none' ||
				editorial.linkIcon.content === '""')
		) {
			fail(`Icone de link do artigo afastado em ${url} ${theme} ${viewportName}`);
		}

		const expectedRelatedItemCount = Math.min(
			8,
			Math.max(0, publishedPostPaths.length - 1),
		);

		if (
			result.archive.relatedItemCount > 0 &&
			result.archive.relatedItemCount < expectedRelatedItemCount
		) {
			fail(`Relacionados abaixo do total esperado em ${url} ${theme} ${viewportName}`);
		}
	} else if (url.includes('/sobre/') && result.post.isPost) {
		fail(`Pagina estatica marcada como post em ${url} ${theme} ${viewportName}`);
	} else if (new URL(url).pathname === '/') {
		if (result.archive.itemCount < 1) {
			fail(`Home sem cards de arquivo em ${url} ${theme} ${viewportName}`);
		}

		if (result.archive.teaserCount < result.archive.itemCount) {
			fail(`Card de arquivo sem imagem destacada em ${url} ${theme} ${viewportName}`);
		}

		if (result.archive.flagCount < result.archive.itemCount) {
			fail(`Card de arquivo sem flag de data em ${url} ${theme} ${viewportName}`);
		}

		if (!result.archive.firstLinkCoversItem || !result.archive.firstCenterClickable) {
			fail(`Card de arquivo sem link cobrindo o quadro em ${url} ${theme} ${viewportName}`);
		}

		if (
			result.archive.columnCount < 1 ||
			result.archive.columnCount > 4 ||
			(viewportName === 'wide' && result.archive.columnCount !== 4) ||
			(viewportName === 'desktop' && result.archive.columnCount !== 3) ||
			(viewportName === 'mobile' && result.archive.columnCount !== 1)
		) {
			fail(`Grade de publicacoes fora do limite 1-4 colunas em ${url} ${theme} ${viewportName}`);
		}

		if (
			result.archive.normalImageObjectFit === 'cover' ||
			!result.archive.normalImageCoversFrameWidth ||
			!result.archive.normalImageWithinFrameHeight ||
			(result.archive.normalImageNaturalRatio > 0 &&
				Math.abs(result.archive.normalImageRenderedRatio - result.archive.normalImageNaturalRatio) > 0.02)
		) {
			fail(`Imagem destacada normal de card distorcida em ${url} ${theme} ${viewportName}: ${JSON.stringify(result.archive)}`);
		}

		if (
			result.archive.wideImageCount > 0 &&
			(result.archive.wideImageObjectFit !== 'cover' ||
				result.archive.firstWideImageRatio < 2.2)
		) {
			fail(`Imagem destacada wide de card sem crop/cover em ${url} ${theme} ${viewportName}: ${JSON.stringify(result.archive)}`);
		}

		if (result.archive.itemCount < 8) {
			fail(`Home sem 8 publicacoes por pagina em ${url} ${theme} ${viewportName}`);
		}
	}

	if (result.siteTitleWidth > 2 || result.siteTitleHeight > 2) {
		fail(`Site title visivel em ${url} ${theme} ${viewportName}`);
	}

	if (!result.scrollTopButton) {
		fail(`Botao de retorno ao topo ausente em ${url} ${theme} ${viewportName}`);
	}

	for (const [name, icon] of Object.entries(result.icons)) {
		if (!icon || icon.display === 'none' || icon.content === 'none' || icon.content === '""') {
			fail(`Icone Font Awesome ausente em ${url} ${theme} ${viewportName}: ${name}`);
		}
	}

	if (result.scrollTopButton.width < 42 || result.scrollTopButton.height < 42) {
		fail(`Botao de retorno ao topo pequeno em ${url} ${theme} ${viewportName}`);
	}

	if (result.scrollTopButton.visible || result.scrollTopButton.ariaHidden !== 'true' || result.scrollTopButton.tabIndex !== '-1') {
		fail(`Botao de retorno ao topo visivel no topo em ${url} ${theme} ${viewportName}`);
	}

	if (viewportName !== 'desktop' && viewportName !== 'wide') {
		const header = result.headerControls;

		if (!header.logo || !header.logoImg || !header.theme || !header.navToggle) {
			fail(`Controles do header ausentes em ${url} ${theme} ${viewportName}`);
		}

		if (
			result.post.articleSurface &&
			Math.abs(header.logoImg.left - result.post.articleSurface.left) > 3
		) {
			fail(`Logo do header desalinhado da esquerda em ${url} ${theme} ${viewportName}`);
		}

		if (header.theme.left <= header.logo.right) {
			fail(`Controles do header sobrepostos ou alinhados a esquerda em ${url} ${theme} ${viewportName}`);
		}

		if (
			result.post.articleSurface &&
			Math.abs(header.navToggle.right - result.post.articleSurface.right) > 3
		) {
			fail(`Controles do header desalinhados da direita em ${url} ${theme} ${viewportName}`);
		}
	}

	if (result.post.articleSurface && result.headerControls.logoImg) {
		if (result.headerControls.logoImg.left < result.post.articleSurface.left - 2) {
			fail(`Logo extrapola a margem do artigo em ${url} ${theme} ${viewportName}`);
		}
	}

	if (result.post.articleSurface && result.headerControls.theme) {
		if (result.headerControls.theme.right > result.post.articleSurface.right + 2) {
			fail(`Switch de tema extrapola a margem do artigo em ${url} ${theme} ${viewportName}`);
		}
	}

	if (
		result.post.articleSurface &&
		result.headerControls.navToggle &&
		result.headerControls.navToggle.width > 1 &&
		result.headerControls.navToggle.right > result.post.articleSurface.right + 2
	) {
		fail(`Botao de menu extrapola a margem do artigo em ${url} ${theme} ${viewportName}`);
	}

	const overlaps = (a, b) =>
		Boolean(a && b) &&
		a.left < b.right &&
		a.right > b.left &&
		a.top < b.bottom &&
		a.bottom > b.top;

	if (result.post.flag) {
		if (result.post.flag.left < -2 || result.post.flag.right > result.headerControls.viewportWidth + 2) {
			fail(`Flag de data fora da janela em ${url} ${theme} ${viewportName}`);
		}

		if (result.post.flag.width < 34 || result.post.flag.height < 54) {
			fail(`Flag de data pequena em ${url} ${theme} ${viewportName}`);
		}

		if (result.post.flagTextMaxOffset > 3) {
			fail(`Texto da flag desalinhado em ${url} ${theme} ${viewportName}`);
		}
	}

	if (
		overlaps(result.post.flag, result.post.title) &&
		(!Number.isFinite(result.post.titleTextStart) ||
			result.post.flag.right > result.post.titleTextStart + 2)
	) {
		fail(`Flag de data sobreposta ao titulo em ${url} ${theme} ${viewportName}`);
	}

	if (
		viewportName !== 'wide' &&
		result.post.readtime &&
		Number.isFinite(result.post.titleTextStart) &&
		Math.abs(result.post.readtime.left - result.post.titleTextStart) > 12
	) {
		fail(`Tempo de leitura desalinhado do titulo em ${url} ${theme} ${viewportName}`);
	}

	if (
		result.post.readtime &&
		result.post.firstPanel &&
		result.post.readtime.bottom > result.post.firstPanel.top - 2
	) {
		fail(`Tempo de leitura colado ao painel em ${url} ${theme} ${viewportName}`);
	}

	if (
		result.post.blockquotePanelsEnabled &&
		result.post.blockquoteCount > 0
	) {
		fail(`Blockquote remanescente apos conversao em ${url} ${theme} ${viewportName}`);
	}

	if (
		result.post.blockquotePanelsEnabled &&
		result.post.panelBlockquoteCount > 0 &&
		result.post.tablePanelBlockquoteCount !== result.post.panelBlockquoteCount
	) {
		fail(`Painel futurista sem tabela setorizada em ${url} ${theme} ${viewportName}`);
	}

	if (result.post.shareButtons > 0 && result.post.shareButtons < 4) {
		fail(`Botoes de compartilhamento incompletos em ${url} ${theme} ${viewportName}`);
	}

	for (const style of result.styles) {
		if (style.width <= 1 || style.height <= 1) {
			fail(`Componente sem dimensao em ${url}: ${style.selector}`);
		}

		if (style.selector === '.jcem-theme-toggle' && (style.width > 64 || style.height > 34)) {
			fail(`Switch de tema fora do tamanho discreto em ${url} ${theme} ${viewportName}: ${style.width.toFixed(1)}x${style.height.toFixed(1)}px`);
		}

		if (style.selector !== '.jcem-theme-toggle') {
			const ratio = contrastRatio(style.color, style.backgroundColor);
			if (ratio < 3) {
				fail(`Contraste baixo em ${url} ${theme} ${viewportName}: ${style.selector} (${ratio.toFixed(2)})`);
			}
		}
	}

	if (result.scrollHeight > result.clientHeight + 240) {
		await page.evaluate(() => window.scrollTo(0, Math.min(520, document.documentElement.scrollHeight)));
		await page
			.waitForFunction(
				() =>
					window.scrollY > 240 &&
					document.querySelector('.jcem-scroll-top')?.classList.contains('is-visible'),
				null,
				{ timeout: 1500 },
			)
			.catch(() => {});

		const scrolledState = await page.evaluate(() => {
			const scrollTop = document.querySelector('.jcem-scroll-top');
			const rect = scrollTop?.getBoundingClientRect();

			return scrollTop && rect
				? {
						visible: scrollTop.classList.contains('is-visible'),
						ariaHidden: scrollTop.getAttribute('aria-hidden'),
						tabIndex: scrollTop.getAttribute('tabindex'),
						right: Math.round(window.innerWidth - rect.right),
						bottom: Math.round(window.innerHeight - rect.bottom),
					}
				: null;
		});

		if (!scrolledState?.visible || scrolledState.ariaHidden !== 'false' || scrolledState.tabIndex !== '0') {
			fail(`Botao de retorno ao topo oculto apos rolagem em ${url} ${theme} ${viewportName}`);
		}

		if (scrolledState.right < 0 || scrolledState.bottom < 0) {
			fail(`Botao de retorno ao topo fora da janela em ${url} ${theme} ${viewportName}`);
		}

		if (viewportName === 'mobile') {
			await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
			await page.waitForTimeout(300);

			const bottomState = await page.evaluate(() => {
				const scrollTop = document.querySelector('.jcem-scroll-top');
				const silktide = document.querySelector('#silktide-cookie-icon');
				const footerBars = Array.from(document.querySelectorAll('.sobpostbar'));
				const footerBar = footerBars.at(-1);
				const rectFor = (element) => {
					const rect = element?.getBoundingClientRect();
					return rect
						? {
								top: rect.top,
								right: rect.right,
								bottom: rect.bottom,
								left: rect.left,
								width: rect.width,
								height: rect.height,
							}
						: null;
				};
				const overlaps = (a, b) =>
					Boolean(a && b) &&
					a.left < b.right &&
					a.right > b.left &&
					a.top < b.bottom &&
					a.bottom > b.top;

				return {
					atPageEnd: document.documentElement.classList.contains('jcem-at-page-end'),
					scrollTop: rectFor(scrollTop),
					silktide: rectFor(silktide),
					footerBar: rectFor(footerBar),
					scrollTopOverlap: overlaps(rectFor(scrollTop), rectFor(footerBar)),
					silktideOverlap: overlaps(rectFor(silktide), rectFor(footerBar)),
				};
			});

			if (!bottomState.atPageEnd) {
				fail(`Estado de fim da pagina ausente em ${url} ${theme} ${viewportName}`);
			}

			if (bottomState.scrollTopOverlap) {
				fail(`Botao de retorno ao topo sobreposto a sobpostbar em ${url} ${theme}`);
			}

			if (bottomState.silktideOverlap) {
				fail(`Icone Silktide sobreposto a sobpostbar em ${url} ${theme}`);
			}
		}

		await page.locator('.jcem-scroll-top').click();
		await page.waitForFunction(() => window.scrollY <= 2, null, { timeout: 1500 });
	}

	await page.screenshot({
		path: path.join(
			artifactDir,
			`${url.replace(/\W+/g, '-') || 'home'}-${theme}-${viewportName}.png`,
		),
		fullPage: true,
	});

	await validateCompactMenu(page, url, theme, viewportName);
};

const validatePrintTheme = async (page, url, viewportName) => {
	if (viewportName !== 'desktop') {
		return;
	}

	await page.goto(url, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
	await page.locator('label[for="jcem-theme-dark"]').click();
	await page.emulateMedia({ media: 'print' });
	await page.waitForTimeout(150);

	const result = await page.evaluate(() => {
		const wrapper = document.querySelector('.main_jcem_wrapper');
		const article = document.querySelector('article.page');
		const panelCorner = document.querySelector(
			'.page__content .jcem-panel--blockquote .jcem-panel__corner--top-left',
		);
		const firstContentLink = document.querySelector('.page__content a[href]');
		const markdownColumns = document.querySelector(
			'.page__content .jcem-markdown-columns, .page__content .c-markdown-columns',
		);
		const markdownColumnStates = Array.from(
			document.querySelectorAll(
				'.page__content .jcem-markdown-columns, .page__content .c-markdown-columns',
			),
		).map((node) => {
			const style = window.getComputedStyle(node);
			return {
				className: node.className || '',
				columnCount: style.columnCount || '',
				columnWidth: style.columnWidth || '',
				jcemColumns: style.getPropertyValue('--jcem-columns').trim(),
			};
		});
		const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
		const articleStyle = article ? window.getComputedStyle(article) : null;
		const panelCornerStyle = panelCorner
			? window.getComputedStyle(panelCorner)
			: null;
		const firstContentLinkAfterStyle = firstContentLink
			? window.getComputedStyle(firstContentLink, '::after')
			: null;
		const markdownColumnsStyle = markdownColumns
			? window.getComputedStyle(markdownColumns)
			: null;
		const bodyStyle = window.getComputedStyle(document.body);
		const rootStyle = window.getComputedStyle(document.documentElement);
		const value = (style, name) => style?.getPropertyValue(name).trim() || '';
		const visible = (selector) =>
			Array.from(document.querySelectorAll(selector)).some((node) => {
				const rect = node.getBoundingClientRect();
				const style = window.getComputedStyle(node);
				return (
					rect.width > 1 &&
					rect.height > 1 &&
					style.display !== 'none' &&
					style.visibility !== 'hidden'
				);
			});

		return {
			darkChecked: Boolean(document.querySelector('#jcem-theme-dark')?.checked),
			colorScheme: wrapperStyle?.colorScheme || '',
			bg: value(wrapperStyle, '--bg'),
			bgSolid: value(wrapperStyle, '--bg-solid'),
			tc: value(wrapperStyle, '--tc'),
			cleanBg: value(rootStyle, '--clean--bg'),
			cleanBgSolid: value(rootStyle, '--clean--bg-solid'),
			cleanTc: value(rootStyle, '--clean--tc'),
			darkBgSolid: value(rootStyle, '--dark--bg-solid'),
			bodyBackground: bodyStyle.backgroundColor,
			articleBackground: articleStyle?.backgroundColor || '',
			panelCount: document.querySelectorAll(
				'.page__content .jcem-panel--blockquote',
			).length,
			panelImage: panelCornerStyle?.backgroundImage || '',
			hasContentLink: Boolean(firstContentLink),
			linkAfterDisplay: firstContentLinkAfterStyle?.display || '',
			linkAfterContent: firstContentLinkAfterStyle?.content || '',
			columnCount: markdownColumnsStyle?.columnCount || '',
			markdownColumnStates,
			hiddenChrome: !visible(
				'.masthead, .page__hero, .jcem-featured-image, .jcem-featured-image__img, .page__footer, .sobpostbar, .page__share, .jcem-theme-toggle, .jcem-scroll-top, #silktide-wrapper, #silktide-cookie-icon',
			),
		};
	});

	await page.emulateMedia({ media: 'screen' });

	if (!result.darkChecked) {
		fail(`Tema escuro nao foi habilitado antes do teste de impressao em ${url}`);
	}

	if (!result.colorScheme.includes('light')) {
		fail(`Impressao nao forca color-scheme claro em ${url}`);
	}

	if (
		result.bg !== result.cleanBg ||
		result.bgSolid !== result.cleanBgSolid ||
		result.tc !== result.cleanTc
	) {
		fail(`Impressao nao usa aliases claros em ${url}`);
	}

	if (result.bgSolid === result.darkBgSolid) {
		fail(`Impressao manteve fundo escuro em ${url}`);
	}

	if (
		result.panelCount > 0 &&
		(!result.panelImage.includes('painel-modo-claro.svg') ||
			result.panelImage.includes('/painel.svg'))
	) {
		fail(`Impressao nao usa painel claro em ${url}`);
	}

	if (!result.hiddenChrome) {
		fail(`Impressao exibe elementos decorativos ou controles em ${url}`);
	}

	if (
		result.columnCount &&
		!['1', 'auto'].includes(result.columnCount)
	) {
		fail(
			`Impressao manteve colunas no conteudo em ${url}: ${JSON.stringify(result.markdownColumnStates)}`,
		);
	}

	if (
		result.hasContentLink &&
		result.linkAfterDisplay !== 'none' ||
		(result.hasContentLink &&
			result.linkAfterContent &&
			result.linkAfterContent !== 'none')
	) {
		fail(`Impressao exibe URLs automaticas em links em ${url}`);
	}
};

const validateNoScriptPage = async (page, url, viewportName) => {
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
	await page.waitForTimeout(150);

	const result = await page.evaluate(() => {
		const panel = document.querySelector('.jcem-noscript__panel');
		const wrapper = document.querySelector('.main_jcem_wrapper');
		const loader = document.querySelector('.carregandoPagina');
		const panelRect = panel?.getBoundingClientRect();
		const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
		const loaderStyle = loader ? window.getComputedStyle(loader) : null;

		return {
			hasPanel: Boolean(panelRect),
			panelWidth: panelRect?.width || 0,
			panelHeight: panelRect?.height || 0,
			panelCenterOffset: panelRect
				? Math.abs(panelRect.left + panelRect.width / 2 - window.innerWidth / 2)
				: Number.POSITIVE_INFINITY,
			wrapperDisplay: wrapperStyle?.display || '',
			loaderDisplay: loaderStyle?.display || '',
			bodyText: document.body.innerText || '',
		};
	});

	if (!result.hasPanel || result.panelWidth <= 1 || result.panelHeight <= 1) {
		fail(`Painel noscript ausente em ${url} ${viewportName}`);
	}

	if (result.wrapperDisplay !== 'none') {
		fail(`Conteudo do blog visivel sem JavaScript em ${url} ${viewportName}`);
	}

	if (result.loaderDisplay !== 'none') {
		fail(`.carregandoPagina visivel sem JavaScript em ${url} ${viewportName}`);
	}

	if (result.panelCenterOffset > 3) {
		fail(`Painel noscript descentralizado em ${url} ${viewportName}: ${result.panelCenterOffset}px`);
	}

	if (!result.bodyText.includes('JavaScript is disabled.') || !result.bodyText.includes('O JavaScript está desativado.')) {
		fail(`Conteudo noscript incompleto em ${url} ${viewportName}`);
	}

	await page.screenshot({
		path: path.join(
			artifactDir,
			`${url.replace(/\W+/g, '-') || 'home'}-noscript-${viewportName}.png`,
		),
		fullPage: true,
	});
};

const validate404Page = async (page, url, viewportName) => {
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
	await page.waitForFunction(() => document.documentElement.classList.contains('jcem-page-loaded'));
	await page.waitForFunction(() => {
		const loader = document.querySelector('.carregandoPagina');
		if (!loader) return false;
		const style = window.getComputedStyle(loader);
		return style.visibility === 'hidden' || style.opacity === '0';
	});

	const result = await page.evaluate(() => {
		const page404 = document.querySelector('.jcem-404');
		const featured = document.querySelector('.jcem-404-featured');
		const featuredImage = featured?.querySelector('.jcem-featured-image__img');
		const terminal = document.querySelector('.jcem-404__terminal');
		const terminalScreen = document.querySelector('.jcem-404__screen');
		const terminalTrack = document.querySelector('.jcem-404__screen-track');
		const terminalFinal = document.querySelector('.jcem-404__line--final');
		const themeToggle = document.querySelector('.jcem-theme-toggle');
		const loader = document.querySelector('.carregandoPagina');
		const page404Style = page404 ? window.getComputedStyle(page404) : null;
		const terminalScreenStyle = terminalScreen
			? window.getComputedStyle(terminalScreen)
			: null;
		const terminalTrackStyle = terminalTrack
			? window.getComputedStyle(terminalTrack)
			: null;
		const terminalFinalStyle = terminalFinal
			? window.getComputedStyle(terminalFinal)
			: null;
		const rectFor = (element) => {
			const rect = element?.getBoundingClientRect();
			const style = element ? window.getComputedStyle(element) : null;

			return rect && style
				? {
						top: rect.top,
						left: rect.left,
						right: rect.right,
						bottom: rect.bottom,
						width: rect.width,
						height: rect.height,
						display: style.display,
						visibility: style.visibility,
						opacity: style.opacity,
						backgroundColor: style.backgroundColor,
						objectFit: style.objectFit,
					}
				: null;
		};

		return {
			pageLoadedClass: document.documentElement.classList.contains('jcem-page-loaded'),
			urlChecked: document.documentElement.dataset.jcem404UrlChecked || '',
			title: document.title,
			hasThemeToggle: Boolean(themeToggle),
			featured: rectFor(featured),
			featuredImage: rectFor(featuredImage),
			featuredImageLoaded: Boolean(featuredImage?.complete && featuredImage.naturalWidth > 0),
			featuredImageNaturalRatio:
				featuredImage && featuredImage.naturalHeight > 0
					? featuredImage.naturalWidth / featuredImage.naturalHeight
					: 0,
			page404: rectFor(page404),
			page404BackgroundColor: page404Style?.backgroundColor || '',
			page404BackgroundGradientLayers:
				(page404Style?.backgroundImage.match(/radial-gradient/g) || []).length,
			terminal: rectFor(terminal),
			terminalScreen: rectFor(terminalScreen),
			terminalTrackAnimation: terminalTrackStyle?.animationName || '',
			terminalScreenOverflow: terminalScreenStyle?.overflow || '',
			terminalHiddenSequences: document.querySelectorAll(
				'.jcem-404__screen-seq[aria-hidden="true"]',
			).length,
			terminalFinalBorder: terminalFinalStyle?.borderLeftWidth || '',
			terminalFinalColor: terminalFinalStyle?.color || '',
			loader: rectFor(loader),
			text: document.body.innerText || '',
			overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
		};
	});

	if (!result.pageLoadedClass || result.urlChecked !== 'true') {
		fail(`404 exibida sem gate finalizado em ${url} ${viewportName}`);
	}

	if (result.title !== '404 - Página não encontrada - JeanCarloEm') {
		fail(`Titulo da 404 incorreto em ${url} ${viewportName}: ${result.title}`);
	}

	if (result.hasThemeToggle) {
		fail(`404 importou switch de tema em ${url} ${viewportName}`);
	}

	if (
		!result.featured ||
		!result.featuredImage ||
		!result.featuredImageLoaded ||
		result.featured.height <= 1 ||
		result.featuredImage.height <= 1 ||
		result.featured.backgroundColor === 'rgba(0, 0, 0, 0)' ||
		result.featuredImage.objectFit !== 'contain' ||
		Math.abs(result.featuredImage.height - result.featured.height) > 2
	) {
		fail(`Imagem destacada 404 invalida em ${url} ${viewportName}`);
	}

	if (
		result.featuredImageNaturalRatio <= 0 ||
		Math.abs(
			result.featuredImage.width / result.featuredImage.height -
				result.featuredImageNaturalRatio,
		) > 0.02
	) {
		fail(`Imagem destacada 404 com distorcao ou crop vertical em ${url} ${viewportName}`);
	}

	if (
		Math.abs(
			(result.featuredImage.left + result.featuredImage.width / 2) -
				(result.featured.left + result.featured.width / 2),
		) > 2
	) {
		fail(`Imagem destacada 404 descentralizada em ${url} ${viewportName}`);
	}

	if (result.featured.width > 1082 && result.featuredImage.width >= result.featured.width - 2) {
		fail(`Imagem destacada 404 esticada ate as bordas em viewport larga em ${url} ${viewportName}`);
	}

	if (result.page404 && result.page404.top - result.featured.bottom > 32) {
		fail(`Conteudo 404 afastado da imagem destacada em ${url} ${viewportName}`);
	}

	if (!result.page404 || result.page404.width <= 1 || result.page404.height <= 1 || result.page404.visibility === 'hidden') {
		fail(`Conteudo 404 invisivel em ${url} ${viewportName}`);
	}

	if (
		result.page404BackgroundColor !== 'rgba(0, 0, 0, 0)' ||
		result.page404BackgroundGradientLayers > 2
	) {
		fail(`Conteudo 404 reiniciando fundo base em ${url} ${viewportName}`);
	}

	if (!result.terminal || result.terminal.width <= 1 || result.terminal.height <= 1 || result.terminal.visibility === 'hidden') {
		fail(`Terminal 404 invisivel em ${url} ${viewportName}`);
	}

	if (
		!result.terminalScreen ||
		result.terminalScreen.height <= 1 ||
		result.terminalTrackAnimation !== 'jcem-404-terminal-scroll' ||
		result.terminalScreenOverflow !== 'hidden' ||
		result.terminalHiddenSequences !== 1 ||
		Number.parseFloat(result.terminalFinalBorder || '0') < 1
	) {
		fail(`Terminal 404 sem animacao CSS continua em ${url} ${viewportName}`);
	}

	if (result.loader && result.loader.visibility !== 'hidden' && result.loader.opacity !== '0') {
		fail(`.carregandoPagina persistiu na 404 depois do load em ${url} ${viewportName}`);
	}

	if (
		!result.text.includes('Página não encontrada') ||
		!result.text.includes('HTTP/1.1 404 Not Found') ||
		!result.text.includes('REQUEST_SLUG=pagina') ||
		!result.text.includes('const pagina = env.REQUEST_SLUG;') ||
		!result.text.includes('mysql --execute') ||
		!result.text.includes('mysqladmin ping') ||
		!result.text.includes('mongo --eval') ||
		!result.text.includes('serverless API localhost offline') ||
		!result.text.includes('./_posts/pagina.md') ||
		!result.text.includes('./_site/p/pagina/index.html')
	) {
		fail(`Texto essencial da 404 ausente em ${url} ${viewportName}`);
	}

	if (result.overflowX > 2) {
		fail(`Overflow horizontal na 404 em ${url} ${viewportName}: ${result.overflowX}px`);
	}

	await page.screenshot({
		path: path.join(artifactDir, `404-${viewportName}.png`),
		fullPage: true,
	});
};

const validatePublishedPostEditorialFormatting = async (page, baseUrl, postPath) => {
	await page.goto(`${baseUrl}${postPath}`, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
	await page.waitForTimeout(150);

	const result = await page.evaluate(() => {
		const readStyle = (element) => {
			if (!element) return null;
			const style = window.getComputedStyle(element);

			return {
				textIndent: Number.parseFloat(style.textIndent || '0'),
				fontStyle: style.fontStyle,
			};
		};
		const ignoredSelector =
			'blockquote, .jcem-panel, .footnotes, .jcem-references, li, td, th, figcaption';
		const normalParagraphs = Array.from(
			document.querySelectorAll('article.jcem-post .page__content p'),
		).filter((paragraph) => {
			if (paragraph.closest(ignoredSelector)) {
				return false;
			}

			if (
				paragraph.children.length === 1 &&
				['IMG', 'PICTURE'].includes(paragraph.children[0].tagName) &&
				!(paragraph.textContent || '').trim()
			) {
				return false;
			}

			return Boolean((paragraph.textContent || '').trim());
		});
		const quotedParagraphs = normalParagraphs.filter((paragraph) =>
			/["'“‘][^"'“‘”’]+["'”’]/.test(paragraph.textContent || ''),
		);
		const badParagraphs = normalParagraphs.filter((paragraph) => {
			const style = readStyle(paragraph);
			return !style || style.textIndent < 48 || style.fontStyle !== 'normal';
		});
		const panelBodies = Array.from(
			document.querySelectorAll(
				'article.jcem-post .page__content .jcem-panel__body',
			),
		);
		const quoteReferences = Array.from(
			document.querySelectorAll(
				'article.jcem-post .page__content .jcem-quote-reference',
			),
		);
		const badPanelBodies = panelBodies.filter(
			(panelBody) => readStyle(panelBody)?.fontStyle !== 'normal',
		);
		const badPanelParagraphs = Array.from(
			document.querySelectorAll(
				'article.jcem-post .page__content .jcem-panel__body p',
			),
		).filter((paragraph) => {
			const style = readStyle(paragraph);
			return !style || style.textIndent !== 0 || style.fontStyle !== 'normal';
		});
		const inlineQuotes = Array.from(
			document.querySelectorAll(
				'article.jcem-post .page__content .jcem-inline-quote',
			),
		);
		const badInlineQuotes = inlineQuotes.filter(
			(quote) => readStyle(quote)?.fontStyle !== 'italic',
		);
		const badQuoteReferences = quoteReferences.filter((reference) => {
			const text = (reference.textContent || '').trim();
			return !text.startsWith('—');
		});
		const badReferenceFontSizes = quoteReferences.filter((reference) => {
			const panelBody = reference.closest('.jcem-panel__body');
			const referenceStyle = readStyle(reference);
			const bodyStyle = panelBody ? readStyle(panelBody) : null;

			if (!panelBody || !referenceStyle || !bodyStyle) {
				return false;
			}

			const referenceFontSize = Number.parseFloat(
				window.getComputedStyle(reference).fontSize || '0',
			);
			const bodyFontSize = Number.parseFloat(
				window.getComputedStyle(panelBody).fontSize || '0',
			);

			return referenceFontSize <= 0 || bodyFontSize <= 0 || referenceFontSize >= bodyFontSize;
		});
		const footnoteMarkers = Array.from(
			document.querySelectorAll('article.jcem-post .page__content sup[id^="fnref"]'),
		);
		const badFootnoteMarkers = footnoteMarkers.filter((marker) => {
			const rect = marker.getBoundingClientRect();
			const linkRect = marker.querySelector('a')?.getBoundingClientRect();
			return rect.width > Math.max(28, (linkRect?.width || 0) + 16) || rect.height > 18;
		});

		return {
			isPost: Boolean(document.querySelector('article.page.jcem-post')),
			normalParagraphCount: normalParagraphs.length,
			quotedParagraphCount: quotedParagraphs.length,
			inlineQuoteCount: inlineQuotes.length,
			badParagraphCount: badParagraphs.length,
			panelBodyCount: panelBodies.length,
			badPanelBodyCount: badPanelBodies.length,
			badPanelParagraphCount: badPanelParagraphs.length,
			badInlineQuoteCount: badInlineQuotes.length,
			quoteReferenceCount: quoteReferences.length,
			badQuoteReferenceCount: badQuoteReferences.length,
			badReferenceFontSizeCount: badReferenceFontSizes.length,
			citationContextCount: document.querySelectorAll(
				'article.jcem-post .page__content .jcem-cite-context',
			).length,
			badFootnoteMarkerCount: badFootnoteMarkers.length,
		};
	});

	if (!result.isPost) {
		fail(`Post publicado sem classe editorial em ${postPath}`);
	}

	if (result.normalParagraphCount < 1) {
		fail(`Post publicado sem paragrafo comum validavel em ${postPath}`);
	}

	if (result.badParagraphCount > 0) {
		fail(`Post publicado com paragrafo comum fora da regra editorial em ${postPath}`);
	}

	if (result.badPanelBodyCount > 0 || result.badPanelParagraphCount > 0) {
		fail(`Post publicado com painel de citacao fora da regra editorial em ${postPath}`);
	}

	if (result.quoteReferenceCount > 0 && result.badQuoteReferenceCount > 0) {
		fail(`Post publicado com referencia de citacao sem travessao em ${postPath}`);
	}

	if (result.badReferenceFontSizeCount > 0) {
		fail(`Post publicado com referencia de citacao sem fonte menor em ${postPath}`);
	}

	if (result.quoteReferenceCount > 0 && result.citationContextCount < 1) {
		fail(`Post publicado sem contexto sucinto em referencias reconhecidas em ${postPath}`);
	}

	if (result.badFootnoteMarkerCount > 0) {
		fail(`Post publicado com footnote inline distorcida em ${postPath}`);
	}

	if (
		result.quotedParagraphCount > 0 &&
		(result.inlineQuoteCount < 1 || result.badInlineQuoteCount > 0)
	) {
		fail(`Post publicado com citacao inline fora da regra editorial em ${postPath}`);
	}
};

const server = await startServer();
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
let browser;
let publishedPostPaths = [];
let validationOk = false;

try {
	publishedPostPaths = await readPublishedPostPaths();

	await mkdir(artifactDir, { recursive: true });

	if (publishedPostPaths.length < 1) {
		fail('Nenhum post publicado encontrado em _site/p/');
	}

	browser = await launchBrowser();

	const editorialContext = await browser.newContext({ viewport: viewports[0] });
	await seedCookieConsent(editorialContext);
	const editorialPage = await editorialContext.newPage();

	try {
		for (const postPath of publishedPostPaths) {
			await validatePublishedPostEditorialFormatting(
				editorialPage,
				baseUrl,
				postPath,
			);
		}
	} finally {
		await editorialContext.close();
	}

	for (const viewport of viewports) {
		await validateLoadingGate(browser, baseUrl, '/', viewport);
		await validateLoadingGate(browser, baseUrl, notFoundPage, viewport);

		const context = await browser.newContext({ viewport });
		await seedCookieConsent(context);
		const page = await context.newPage();

		for (const pagePath of pages) {
			for (const theme of themes) {
				await validatePage(page, `${baseUrl}${pagePath}`, theme, viewport.name);
			}

			await validatePrintTheme(page, `${baseUrl}${pagePath}`, viewport.name);
		}

		await validate404Page(page, `${baseUrl}${notFoundPage}`, viewport.name);

		await context.close();

		const noScriptContext = await browser.newContext({
			javaScriptEnabled: false,
			viewport,
		});
		const noScriptPage = await noScriptContext.newPage();

		for (const pagePath of [...pages, notFoundPage]) {
			await validateNoScriptPage(noScriptPage, `${baseUrl}${pagePath}`, viewport.name);
		}

		await noScriptContext.close();
	}
	validationOk = true;
} catch (error) {
	if (visualValidationStrict) {
		throw error;
	}

	warnVisualValidation(error);
} finally {
	if (browser) {
		await browser.close();
	}
	server.close();
}

if (validationOk) {
	console.log('visual_validation=ok');
}
