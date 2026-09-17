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

			await page.emulateMedia({ media: 'print' });
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
