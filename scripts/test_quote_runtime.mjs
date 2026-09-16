/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(process.env.JCEM_SITE_ROOT || '_site');
const types = new Map([['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.svg', 'image/svg+xml']]);
const targetFor = (requestPath) => {
	const pathname = requestPath.split('?')[0];
	const clean = decodeURIComponent(pathname).replace(/^[/\\]+/, '');
	let target = path.join(root, clean || 'index.html');
	if (pathname.endsWith('/')) target = path.join(target, 'index.html');
	return path.relative(root, target).startsWith('..') ? null : target;
};
const server = createServer(async (request, response) => {
	const target = targetFor(request.url || '/');
	if (!target || !existsSync(target)) { response.writeHead(404); response.end('Not found'); return; }
	response.writeHead(200, { 'content-type': types.get(path.extname(target)) || 'application/octet-stream' });
	response.end(await readFile(target));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const executablePath = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const screenshotRoot = process.env.JCEM_QUOTE_SCREENSHOT_DIR
	? path.resolve(process.env.JCEM_QUOTE_SCREENSHOT_DIR)
	: null;
if (screenshotRoot) await mkdir(screenshotRoot, { recursive: true });
const expected = ['standard', 'futuristic', 'notice', 'info', 'alerta1', 'alerta2', 'framed-accent', 'pull-quote', 'centered-mark', 'editorial-statement', 'thematic-rail'];

try {
	for (const viewport of [{ width: 1280, height: 900 }, { width: 320, height: 800 }]) {
		const page = await browser.newPage({ viewport });
		await page.addInitScript(() => {
			localStorage.setItem('silktideCookieBanner_InitialChoice', '1');
			localStorage.setItem('silktideCookieChoice_obrigat_rios', 'true');
		});
		await page.goto(`http://127.0.0.1:${port}/_fixtures/blockquote-models/`, { waitUntil: 'load' });
		const quotes = page.locator('[data-jcem-blockquote]');
		for (let index = 0; index < await quotes.count(); index += 1) {
			const quote = quotes.nth(index);
			await quote.scrollIntoViewIfNeeded();
			const rendered = await quote.evaluate((element) => {
				const range = document.createRange();
				range.selectNodeContents(element);
				return {
					model: element.getAttribute('data-jcem-quote-model'),
					text: element.textContent?.trim() || '',
					height: element.getBoundingClientRect().height,
					textHeight: range.getBoundingClientRect().height,
				};
			});
			assert.ok(rendered.text.length > 0, `${viewport.width}: conteúdo ausente em ${rendered.model}`);
			assert.ok(rendered.height > 20, `${viewport.width}: modelo não materializado ${rendered.model}`);
			assert.ok(rendered.textHeight > 0, `${viewport.width}: texto não materializado ${rendered.model}`);
		}
		await page.evaluate(() => window.scrollTo(0, 0));
		// A captura de matriz precisa materializar todos os modelos ao mesmo tempo;
		// a otimização real de content-visibility foi validada individualmente acima.
		await page.addStyleTag({ content: '.main_jcem_wrapper .page__content > * { content-visibility: visible !important; contain-intrinsic-size: none !important; }' });
		const thematicBackgrounds = new Map();
		for (const theme of ['light', 'dark']) {
			const state = await page.evaluate((selectedTheme) => {
				const light = document.querySelector('#jcem-theme-light');
				const dark = document.querySelector('#jcem-theme-dark');
				if (light instanceof HTMLInputElement) light.checked = selectedTheme === 'light';
				if (dark instanceof HTMLInputElement) dark.checked = selectedTheme === 'dark';
				const content = document.querySelector('.page__content');
				const models = [...document.querySelectorAll('[data-jcem-blockquote]')].map((quote) => {
					const style = getComputedStyle(quote);
					const rect = quote.getBoundingClientRect();
					return {
						model: quote.getAttribute('data-jcem-quote-model'),
						alias: quote.getAttribute('data-jcem-quote-alias'),
						accent: quote.getAttribute('data-jcem-quote-accent'),
						left: rect.left,
						right: rect.right,
						fontFamily: style.fontFamily,
						background: style.backgroundColor,
						backgroundImage: style.backgroundImage,
						before: getComputedStyle(quote, '::before').content,
					};
				});
				return {
					models,
					contentFont: content ? getComputedStyle(content).fontFamily : '',
					contentLeft: content?.getBoundingClientRect().left || 0,
				};
			}, theme);
			for (const model of expected) assert.ok(state.models.some((entry) => entry.model === model), `${theme}/${viewport.width}: modelo ausente ${model}`);
			assert.ok(state.models.some(({ model, alias }) => model === 'thematic-rail' && alias === 'primary'));
			assert.ok(state.models.some(({ model, alias }) => model === 'futuristic' && alias === 'destaque'));
			assert.ok(state.models.filter(({ model }) => model === 'framed-accent').some(({ accent }) => accent === 'cyan'));
			assert.ok(state.models.filter(({ model }) => model === 'framed-accent').some(({ accent }) => accent === 'amber'));
			assert.ok(state.models.every(({ left, right }) => left >= -0.6 && right <= viewport.width + 0.6), `${theme}/${viewport.width}: overflow horizontal`);
			for (const entry of state.models.filter(({ model }) => expected.slice(6).includes(model))) {
				assert.equal(entry.fontFamily, state.contentFont, `${theme}/${viewport.width}: fonte divergente em ${entry.model}`);
				assert.notEqual(entry.before, 'none', `${theme}/${viewport.width}: adorno ausente em ${entry.model}`);
			}
			assert.ok(state.models.find(({ model }) => model === 'pull-quote').left > state.contentLeft + 4, `${theme}/${viewport.width}: recuo pull-quote ausente`);
			for (const model of ['centered-mark', 'editorial-statement']) assert.equal(state.models.find((entry) => entry.model === model).background, 'rgba(0, 0, 0, 0)');
			assert.notEqual(state.models.find(({ model }) => model === 'thematic-rail').backgroundImage, 'none');
			thematicBackgrounds.set(theme, state.models.find(({ model }) => model === 'thematic-rail').backgroundImage);
			if (screenshotRoot) {
				await page.locator('.page__content').screenshot({
					path: path.join(screenshotRoot, `blockquote-${theme}-${viewport.width}.png`),
				});
			}
		}
		assert.notEqual(thematicBackgrounds.get('light'), thematicBackgrounds.get('dark'), `${viewport.width}: thematic-rail não respondeu ao tema`);
		await page.emulateMedia({ media: 'print' });
		const printed = await page.evaluate(() => [...document.querySelectorAll('[data-jcem-blockquote]')].map((quote) => {
			const style = getComputedStyle(quote);
			return {
				model: quote.getAttribute('data-jcem-quote-model'),
				background: style.backgroundImage,
				borderLeft: style.borderLeftWidth,
				before: getComputedStyle(quote, '::before').content,
			};
		}));
		for (const entry of printed.filter(({ model }) => expected.slice(6).includes(model))) {
			assert.equal(entry.background, 'none', `print: fundo web persistiu em ${entry.model}`);
			assert.equal(entry.before, 'none', `print: adorno persistiu em ${entry.model}`);
			assert.notEqual(entry.borderLeft, '0px', `print: estilo IEEE ausente em ${entry.model}`);
		}
		await page.close();
	}
	console.log('quote_runtime=ok viewports=1280,320 themes=light,dark print=ieee');
} finally {
	await browser.close();
	await new Promise((resolve) => server.close(resolve));
}
