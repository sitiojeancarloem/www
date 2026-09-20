/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(process.env.JCEM_SITE_ROOT || '_site');
const types = new Map([
	['.html', 'text/html; charset=utf-8'],
	['.js', 'text/javascript; charset=utf-8'],
	['.css', 'text/css; charset=utf-8'],
	['.svg', 'image/svg+xml'],
	['.webp', 'image/webp'],
	['.png', 'image/png'],
	['.jpg', 'image/jpeg'],
	['.jpeg', 'image/jpeg'],
]);
const targetFor = (requestPath) => {
	const pathname = requestPath.split('?')[0];
	const clean = decodeURIComponent(pathname).replace(/^[/\\]+/, '');
	let target = path.join(root, clean || 'index.html');
	if (pathname.endsWith('/')) target = path.join(target, 'index.html');
	return path.relative(root, target).startsWith('..') ? null : target;
};
const server = createServer(async (request, response) => {
	const target = targetFor(request.url || '/');
	if (!target || !existsSync(target)) {
		response.writeHead(404);
		response.end('Not found');
		return;
	}
	response.writeHead(200, {
		'content-type': types.get(path.extname(target)) || 'application/octet-stream',
	});
	response.end(await readFile(target));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const executablePath = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

const profiles = [
	['desktop', { viewport: { width: 1280, height: 800 } }],
	['mobile', {
		viewport: { width: 390, height: 844 },
		isMobile: true,
		hasTouch: true,
		deviceScaleFactor: 2,
	}],
];
const articlePaths = [
	'/p/devaneios/',
	'/p/sola-scriptura/',
	'/p/nove-motivos-para-guardar-o-sabado/',
	'/p/bate-papo/eventos-finais/a-heranca-dos-santos/',
];
const chromeSelectors = [
	'.masthead',
	'.page__hero',
	'.page__hero--overlay',
	'.jcem-featured-image',
	'.jcem-featured-image__img',
	'.jcem-legacy-hero',
	'.jcem-cover',
	'.page__footer',
	'.sobpostbar',
	'.page__share',
	'.jcem-theme-toggle',
	'.jcem-scroll-top',
	'[data-print-web-control]',
	'[data-jcem-read-aloud]',
	'#silktide-wrapper',
	'#silktide-cookie-icon',
];

try {
	for (const [label, options] of profiles) {
		for (const articlePath of articlePaths) {
			const context = await browser.newContext(options);
			const page = await context.newPage();
			await page.addInitScript(() => {
				localStorage.setItem('silktideCookieBanner_InitialChoice', '1');
				localStorage.setItem('silktideCookieChoice_obrigat_rios', 'true');
			});
			await page.goto(`http://127.0.0.1:${port}${articlePath}`, {
				waitUntil: 'domcontentloaded',
			});
			assert.equal(
				await page.locator('link[data-jcem-print-stylesheet]').count(),
				0,
				`${label} ${articlePath}: CSS de impressão entrou no caminho crítico`,
			);
			await page.waitForFunction(
				() => document.querySelector('[data-print-article]')?.dataset.printSchedule === 'ready',
				undefined,
				{ timeout: 20_000 },
			);
			const state = await page.evaluate(() => ({
				profile: document.querySelector('[data-print-article]')?.getAttribute('data-print-profile'),
				schedule: document.querySelector('[data-print-article]')?.getAttribute('data-print-schedule'),
				styles: [...document.querySelectorAll('link[data-jcem-print-stylesheet]')].map((link) => ({
					href: link.getAttribute('href'),
					media: link.getAttribute('media'),
					priority: link.getAttribute('fetchpriority'),
				})),
				resources: performance.getEntriesByType('resource').map(({ name }) => name),
			}));
			assert.equal(state.schedule, 'ready', `${label} ${articlePath}: preparação não concluiu`);
			assert.equal(state.profile, 'ieee-conference-a4-ieeetran-1.8b');
			assert.equal(state.styles.length, 2, `${label} ${articlePath}: folhas IEEE incompletas`);
			assert.ok(state.styles.every(({ media, priority }) => media === 'print' && priority === 'low'));
			assert.ok(state.resources.some((url) => url.endsWith('/assets/jcem/print-ieee/ieee.css')));
			assert.ok(state.resources.some((url) => url.endsWith('/assets/jcem/print-ieee/jekyll-blog.css')));
			assert.ok(state.resources.some((url) => url.endsWith('/assets/jcem/print-ieee/index.js')));

			const footnoteStructure = await page.evaluate(() => {
				const article = document.querySelector('[data-print-article]');
				const refs = Array.from(
					article?.querySelectorAll('sup[id^="fnref"] > a[role="doc-noteref"], sup[id^="fnref"] > a.footnote') || [],
				);
				const missingTargets = refs.filter((link) => {
					const href = link.getAttribute('href') || '';
					return !href.startsWith('#') || !document.getElementById(href.slice(1));
				});
				const invalidBacklinks = Array.from(
					article?.querySelectorAll('.footnotes a[role="doc-backlink"], .footnotes .reversefootnote, .footnotes .jcem-footnote-backref') || [],
				).filter((link) => {
					const href = link.getAttribute('href') || '';
					return !href.startsWith('#') || !document.getElementById(href.slice(1));
				});
				return {
					refs: refs.length,
					invalidReferenceGrammar: refs.filter((link) => !/^\[\d+\]$/.test((link.textContent || '').trim())).length,
					nestedFootnoteSup: article?.querySelectorAll('sup[id^="fnref"] sup').length || 0,
					printMarkersInsideFootnotes:
						article?.querySelectorAll('sup[id^="fnref"] [data-print-link-note]').length || 0,
					missingTargets: missingTargets.length,
					invalidBacklinks: invalidBacklinks.length,
					spuriousFootnoteUrls: Array.from(
						article?.querySelectorAll('[data-print-link-references] li') || [],
					).filter((item) => /#fn(?::|ref)/.test(item.textContent || '')).length,
					invalidPrintLinkReferences: Array.from(
						article?.querySelectorAll('[data-print-link-note]') || [],
					).filter((marker) => {
						const identifier = marker.getAttribute('data-print-link-identifier') || '';
						const target = document.getElementById(marker.getAttribute('data-print-link-target') || '');
						return !/^[a-z]+$/.test(identifier) || marker.textContent !== `[${identifier}]` ||
							marker.getAttribute('aria-details') !== target?.id ||
							target?.getAttribute('data-print-link-identifier') !== identifier;
					}).length,
					numericPrintLinkMarkers: Array.from(
						article?.querySelectorAll('[data-print-link-note]') || [],
					).filter((marker) => /^\[\d+\]$/.test((marker.textContent || '').trim())).length,
				};
			});
			assert.equal(
				footnoteStructure.nestedFootnoteSup,
				0,
				`${label} ${articlePath}: chamada de footnote contém <sup> aninhado`,
			);
			assert.equal(footnoteStructure.invalidReferenceGrammar, 0, `${label} ${articlePath}: chamada ordinária fora de [N]`);
			assert.equal(
				footnoteStructure.printMarkersInsideFootnotes,
				0,
				`${label} ${articlePath}: footnote foi reprocessada como URL impressa`,
			);
			assert.equal(footnoteStructure.missingTargets, 0, `${label} ${articlePath}: destino de footnote ausente`);
			assert.equal(footnoteStructure.invalidBacklinks, 0, `${label} ${articlePath}: backlink de footnote inválido`);
			assert.equal(footnoteStructure.spuriousFootnoteUrls, 0, `${label} ${articlePath}: URL espúria de footnote`);
			assert.equal(footnoteStructure.invalidPrintLinkReferences, 0, `${label} ${articlePath}: associação alfabética inválida`);
			assert.equal(footnoteStructure.numericPrintLinkMarkers, 0, `${label} ${articlePath}: namespace de URL colidiu com notas numéricas`);

			await page.evaluate(async () => {
				const article = document.querySelector('[data-print-article]');
				const body = article?.querySelector('[data-print-body]');
				if (!article || !body) throw new Error('artigo de fixture ausente');
				const style = document.createElement('style');
				style.dataset.printDecorationFixtureStyle = '';
				style.textContent = '.print-decoration-fixture { text-decoration: underline wavy rgb(120, 20, 30); text-underline-offset: 3px; }';
				document.head.append(style);
				const fixture = document.createElement('p');
				fixture.dataset.printDecorationFixture = '';
				fixture.innerHTML = '<a data-print-plain-link href="https://example.test/runtime-fixture">comum</a> <u data-print-u-decoration><a href="#print-decoration-target">semântico</a></u> <span class="print-decoration-fixture" data-print-class-decoration><a href="#print-decoration-target">classe</a></span><span id="print-decoration-target"></span>';
				body.append(fixture);
				const controls = document.createElement('div');
				controls.innerHTML = '<div data-print-control-fixture data-print-web-control>widget</div><form data-print-control-fixture><input value="campo"><button type="button">ação</button></form><progress data-print-control-fixture value="1" max="2"></progress><div data-print-control-fixture role="button" tabindex="0">botão ARIA</div>';
				body.append(...controls.children);
				const { prepareArticle } = await import('/assets/jcem/print-ieee/index.js');
				prepareArticle(article).prepare();
			});

			await page.emulateMedia({ media: 'print' });
			const linkDecoration = await page.evaluate(() => {
				const plain = document.querySelector('[data-print-plain-link]');
				const semantic = document.querySelector('[data-print-u-decoration]');
				const classed = document.querySelector('[data-print-class-decoration]');
				const external = plain;
				const marker = document.querySelector('[data-print-link-note]');
				return {
					plain: getComputedStyle(plain).textDecorationLine,
					semantic: getComputedStyle(semantic).textDecorationLine,
					classed: getComputedStyle(classed).textDecorationLine,
					external: getComputedStyle(external).textDecorationLine,
					marker: getComputedStyle(marker).textDecorationLine,
					classCaptured: classed.hasAttribute('data-print-external-text-decoration'),
				};
			});
			assert.equal(linkDecoration.plain, 'none', `${label} ${articlePath}: link comum manteve decoração própria`);
			assert.equal(linkDecoration.external, 'none', `${label} ${articlePath}: hyperlink editorial permaneceu sublinhado`);
			assert.equal(linkDecoration.marker, 'none', `${label} ${articlePath}: marcador ganhou decoração de link`);
			assert.match(linkDecoration.semantic, /underline/, `${label} ${articlePath}: <u> externo perdeu underline`);
			assert.match(linkDecoration.classed, /underline/, `${label} ${articlePath}: classe ancestral perdeu underline`);
			assert.equal(linkDecoration.classCaptured, true, `${label} ${articlePath}: classe não foi classificada`);
			const controlGeometry = await page.evaluate(() =>
				Array.from(document.querySelectorAll('[data-print-control-fixture], [data-jcem-read-aloud]')).map((control) => {
					const rect = control.getBoundingClientRect();
					return {
						display: getComputedStyle(control).display,
						width: rect.width,
						height: rect.height,
					};
				}),
			);
			assert.ok(controlGeometry.length >= 5, `${label} ${articlePath}: matriz de controles incompleta`);
			assert.ok(
				controlGeometry.every(({ display, width, height }) => display === 'none' && width === 0 && height === 0),
				`${label} ${articlePath}: controle web deixou caixa residual ${JSON.stringify(controlGeometry)}`,
			);
			const lineMetrics = await page.evaluate(() => {
				const article = document.querySelector('[data-print-article]');
				const fixture = document.createElement('section');
				fixture.dataset.printSupMetricFixture = '';
				fixture.setAttribute(
					'style',
					'position:absolute!important;left:-10000px!important;top:0!important;width:240px!important;margin:0!important;padding:0!important;overflow:visible!important;',
				);
				const cases = [
					'Texto sem sobrescrito',
					'<sup>1</sup> no início da linha',
					'Texto com <sup>4</sup><sup>5</sup><sup>6</sup> no meio',
					'Texto com nota acima de nove <sup>10</sup>',
					'Texto com unidade legítima m<sup>2</sup>',
					'Texto no fim da linha <sup>7</sup>',
					'Outra linha sem sobrescrito',
				];
				for (const content of cases) {
					const line = document.createElement('span');
					line.dataset.printSupMetricLine = '';
					line.setAttribute(
						'style',
						'display:block!important;margin:0!important;padding:0!important;border:0!important;font-size:9pt!important;line-height:10.8pt!important;white-space:nowrap!important;overflow:visible!important;',
					);
					line.innerHTML = content;
					fixture.append(line);
				}
				article?.append(fixture);
				const lines = Array.from(fixture.querySelectorAll('[data-print-sup-metric-line]'));
				const rects = lines.map((line) => line.getBoundingClientRect());
				const superscripts = Array.from(fixture.querySelectorAll('sup'));
				const steps = rects.slice(1).map((rect, index) => rect.top - rects[index].top);
				const outOfEnvelope = superscripts.filter((sup) => {
					const line = sup.closest('[data-print-sup-metric-line]');
					const lineIndex = lines.indexOf(line);
					const rect = sup.getBoundingClientRect();
					const lineRect = rects[lineIndex];
					return rect.top < lineRect.top - 2 || rect.bottom > lineRect.bottom + 0.5;
				});
				return {
					heights: rects.map((rect) => rect.height),
					steps,
					lineOverflows: lines.map((line) => getComputedStyle(line).overflow),
					supLineHeights: superscripts.map((sup) => getComputedStyle(sup).lineHeight),
					supVisibility: superscripts.map((sup) => {
						const rect = sup.getBoundingClientRect();
						return { width: rect.width, height: rect.height };
					}),
					outOfEnvelope: outOfEnvelope.length,
				};
			});
			const metricBaseline = lineMetrics.heights[0];
			assert.ok(metricBaseline > 0, `${label} ${articlePath}: linha de controle sem altura`);
			assert.ok(
				lineMetrics.heights.every((height) => Math.abs(height - metricBaseline) <= 0.1),
				`${label} ${articlePath}: alturas de linha divergentes ${lineMetrics.heights.join(', ')}`,
			);
			assert.ok(
				lineMetrics.steps.every((step) => Math.abs(step - metricBaseline) <= 0.1),
				`${label} ${articlePath}: ritmo vertical divergente ${lineMetrics.steps.join(', ')}`,
			);
			assert.ok(lineMetrics.supLineHeights.every((height) => height === '0px'));
			assert.ok(lineMetrics.lineOverflows.every((overflow) => overflow === 'visible'));
			assert.ok(
				lineMetrics.supVisibility.every(({ width, height }) => width > 0 && height > 0),
				`${label} ${articlePath}: sobrescrito sem caixa legível`,
			);
			assert.equal(
				lineMetrics.outOfEnvelope,
				0,
				`${label} ${articlePath}: sobrescrito saiu da faixa tipográfica segura ${JSON.stringify(lineMetrics)}`,
			);
			const visibleChrome = await page.evaluate((selectors) =>
				selectors.flatMap((selector) =>
					Array.from(document.querySelectorAll(selector)).flatMap((node) => {
						const rect = node.getBoundingClientRect();
						const style = window.getComputedStyle(node);
						return rect.width > 1 &&
							rect.height > 1 &&
							style.display !== 'none' &&
							style.visibility !== 'hidden'
							? [`${selector}:${node.tagName.toLowerCase()}.${Array.from(node.classList).join('.')}`]
							: [];
					}),
				), chromeSelectors);
			assert.deepEqual(
				visibleChrome,
				[],
				`${label} ${articlePath}: chrome visível em impressão: ${visibleChrome.join(', ')}`,
			);
			await page.emulateMedia({ media: 'screen' });
			await context.close();
		}
	}
	console.log(`print_runtime=ok profiles=desktop,mobile pages=${articlePaths.length}`);
} finally {
	await browser.close();
	await new Promise((resolve) => server.close(resolve));
}
