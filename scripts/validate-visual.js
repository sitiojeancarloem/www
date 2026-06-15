import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(process.env.VISUAL_SITE_DIR || '_site');
const artifactDir = path.resolve(process.env.VISUAL_ARTIFACT_DIR || 'visual-artifacts');
const pages = ['/', '/sobre/', '/p/devaneios/'];
const themes = ['dark', 'light'];
const viewports = [
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

const fail = (message) => {
	throw new Error(message);
};

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
				response.writeHead(404);
				response.end('Not found');
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

	await page.locator('.jcem-nav-toggle').click();
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

	if (theme === 'light') {
		await page.locator('label[for="jcem-theme-light"]').click();
	} else {
		await page.locator('label[for="jcem-theme-dark"]').click();
	}

	await page.waitForTimeout(150);
	await page
		.waitForFunction(() => {
			const icon = document.querySelector('label[for="jcem-theme-light"] i');
			const pseudo = icon ? window.getComputedStyle(icon, '::before') : null;
			return pseudo && pseudo.display !== 'none' && pseudo.content !== 'none' && pseudo.content !== '""';
		}, null, { timeout: 15000 })
		.catch(() => {});

	const result = await page.evaluate(() => {
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
					cornerStyle?.backgroundImage.includes('painel.svg') &&
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
				flag: boxInfo('.jcem-post-header > .jcem-date-flag'),
				flagTextMaxOffset,
				blockquotePanelsEnabled: Boolean(
					document.querySelector('article.page.jcem-blockquote-panels'),
				),
				blockquoteCount: blockquotes.length,
				panelBlockquoteCount: blockquotePanels.length,
				tablePanelBlockquoteCount: tablePanels.length,
				shareButtons: shareButtons.length,
			},
			styles: [
				readStyle('.main_jcem_wrapper'),
				readStyle('.masthead'),
				readStyle('.jcem-theme-toggle'),
				readStyle('.initial-content'),
				readStyle('.jcem-panel, .archive__item, .jcem-sobre'),
				readStyle('.page__share .btn'),
			].filter(Boolean),
		};
	});

	if (result.overflowX > 2) {
		fail(`Overflow horizontal em ${url} ${theme} ${viewportName}: ${result.overflowX}px`);
	}

	if (result.sidebars > 0) {
		fail(`Sidebar visivel em ${url} ${theme} ${viewportName}`);
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

	if (viewportName !== 'desktop') {
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

	if (overlaps(result.post.flag, result.post.title)) {
		fail(`Flag de data sobreposta ao titulo em ${url} ${theme} ${viewportName}`);
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

		const ratio = contrastRatio(style.color, style.backgroundColor);
		if (ratio < 3) {
			fail(`Contraste baixo em ${url} ${theme} ${viewportName}: ${style.selector} (${ratio.toFixed(2)})`);
		}
	}

	if (result.scrollHeight > result.clientHeight + 240) {
		await page.evaluate(() => window.scrollTo(0, Math.min(520, document.documentElement.scrollHeight)));
		await page.waitForTimeout(250);

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

const validateNoScriptPage = async (page, url, viewportName) => {
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
	await page.waitForTimeout(150);

	const result = await page.evaluate(() => {
		const panel = document.querySelector('.jcem-noscript__panel');
		const wrapper = document.querySelector('.main_jcem_wrapper');
		const panelRect = panel?.getBoundingClientRect();
		const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;

		return {
			hasPanel: Boolean(panelRect),
			panelWidth: panelRect?.width || 0,
			panelHeight: panelRect?.height || 0,
			panelCenterOffset: panelRect
				? Math.abs(panelRect.left + panelRect.width / 2 - window.innerWidth / 2)
				: Number.POSITIVE_INFINITY,
			wrapperDisplay: wrapperStyle?.display || '',
			bodyText: document.body.innerText || '',
		};
	});

	if (!result.hasPanel || result.panelWidth <= 1 || result.panelHeight <= 1) {
		fail(`Painel noscript ausente em ${url} ${viewportName}`);
	}

	if (result.wrapperDisplay !== 'none') {
		fail(`Conteudo do blog visivel sem JavaScript em ${url} ${viewportName}`);
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

const server = await startServer();
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch();

try {
	await mkdir(artifactDir, { recursive: true });

	for (const viewport of viewports) {
		const context = await browser.newContext({ viewport });
		await seedCookieConsent(context);
		const page = await context.newPage();

		for (const pagePath of pages) {
			for (const theme of themes) {
				await validatePage(page, `${baseUrl}${pagePath}`, theme, viewport.name);
			}
		}

		await context.close();

		const noScriptContext = await browser.newContext({
			javaScriptEnabled: false,
			viewport,
		});
		const noScriptPage = await noScriptContext.newPage();

		for (const pagePath of pages) {
			await validateNoScriptPage(noScriptPage, `${baseUrl}${pagePath}`, viewport.name);
		}

		await noScriptContext.close();
	}
} finally {
	await browser.close();
	server.close();
}

console.log('visual_validation=ok');
