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
						textAlign: style.textAlign,
						paragraphAlignments: [...quote.querySelectorAll(':scope > p')].map((paragraph) => getComputedStyle(paragraph).textAlign),
						geometry: quote.getAttribute('data-jcem-quote-geometry'),
						thematicGap: style.getPropertyValue('--jcem-thematic-rail-gap').trim(),
						before: (() => {
							const before = getComputedStyle(quote, '::before');
							return {
								content: before.content,
								display: before.display,
								top: before.top,
								width: before.width,
								height: before.height,
								fontSize: before.fontSize,
								transform: before.transform,
							};
						})(),
						after: (() => {
							const after = getComputedStyle(quote, '::after');
							return {
								content: after.content,
								display: after.display,
								backgroundImage: after.backgroundImage,
							};
						})(),
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
				assert.notEqual(entry.before.content, 'none', `${theme}/${viewport.width}: conteúdo do adorno ausente em ${entry.model}`);
				assert.notEqual(entry.before.display, 'none', `${theme}/${viewport.width}: adorno invisível em ${entry.model}`);
				assert.ok(Number.parseFloat(entry.before.fontSize) > 0, `${theme}/${viewport.width}: adorno sem dimensão tipográfica em ${entry.model}`);
			}
			assert.ok(state.models.find(({ model }) => model === 'pull-quote').left > state.contentLeft + 4, `${theme}/${viewport.width}: recuo pull-quote ausente`);
			for (const entry of state.models.filter(({ model }) => model === 'framed-accent')) {
				assert.notEqual(entry.after.display, 'none', `${theme}/${viewport.width}: remate inferior invisível em framed-accent`);
				assert.notEqual(entry.after.backgroundImage, 'none', `${theme}/${viewport.width}: segmentos sólido e pontilhado ausentes em framed-accent`);
			}
			for (const model of ['centered-mark', 'editorial-statement']) {
				assert.ok(state.models.find((entry) => entry.model === model).before.content.includes('”'), `${theme}/${viewport.width}: aspas superiores divergentes em ${model}`);
			}
			for (const model of ['pull-quote', 'thematic-rail']) {
				const entries = state.models.filter((entry) => entry.model === model);
				assert.ok(entries.every((entry) => ['left', 'start'].includes(entry.textAlign)), `${theme}/${viewport.width}: alinhamento do ${model} não é esquerdo`);
				assert.ok(entries.every((entry) => entry.paragraphAlignments.every((alignment) => ['left', 'start'].includes(alignment))), `${theme}/${viewport.width}: parágrafo do ${model} não é esquerdo`);
			}
			for (const model of ['centered-mark', 'editorial-statement']) assert.equal(state.models.find((entry) => entry.model === model).background, 'rgba(0, 0, 0, 0)');
			const thematicEntries = state.models.filter(({ model }) => model === 'thematic-rail');
			const thematicGeometries = new Set(thematicEntries.map(({ geometry }) => geometry).filter(Boolean));
			assert.ok(thematicGeometries.has('short') && thematicGeometries.has('long'), `${theme}/${viewport.width}: amostras curta e longa ausentes`);
			assert.ok(thematicEntries.every(({ backgroundImage }) => backgroundImage !== 'none'));
			assert.equal(new Set(thematicEntries.map(({ thematicGap }) => thematicGap)).size, 1, `${theme}/${viewport.width}: intervalo da haste varia com o texto`);
			const geometryQuotes = page.locator('[data-jcem-quote-model="thematic-rail"][data-jcem-quote-geometry]');
			const geometryCount = await geometryQuotes.count();
			const materializedGeometry = [];
			for (let index = 0; index < geometryCount; index += 1) {
				const quote = geometryQuotes.nth(index);
				await quote.scrollIntoViewIfNeeded();
				materializedGeometry.push(await quote.evaluate((element) => {
					const rect = element.getBoundingClientRect();
					const before = getComputedStyle(element, '::before');
					return {
						geometry: element.getAttribute('data-jcem-quote-geometry'),
						height: rect.height,
						top: Number.parseFloat(before.top),
						content: before.content,
						width: Number.parseFloat(before.width),
						beforeHeight: Number.parseFloat(before.height),
					};
				}));
			}
			assert.deepEqual(new Set(materializedGeometry.map(({ geometry }) => geometry)), new Set(['short', 'long']));
			assert.ok(materializedGeometry.every(({ top, height, content }) => Math.abs(top - height / 2) <= 0.6 && content.includes('”')), `${theme}/${viewport.width}: aspas não estão centralizadas no intervalo`);
			assert.ok(materializedGeometry.every(({ width, beforeHeight }) => width > 0 && beforeHeight > 0), `${theme}/${viewport.width}: intervalo das aspas sem geometria própria`);
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
