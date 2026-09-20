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
import sharp from 'sharp';

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
const batePapoSlug = 'rumo-ao-lar-viagem-dos-remidos-coroas-e-recompensa-celestial';
const batePapoRoute = existsSync(path.join(root, 'p', 'bate-papo', 'eventos-finais', batePapoSlug))
	? `/p/bate-papo/eventos-finais/${batePapoSlug}/`
	: `/p/bate-papo:eventos-finais/${batePapoSlug}/`;

/**
 * Mede no raster a extensão e o centro óptico do glifo temático sem confundir
 * a haste vertical, que compartilha a mesma cor de destaque.
 *
 * @param {import('playwright').Page} page página com a citação visível.
 * @param {{ rect: { left: number, top: number, height: number }, paddingInlineStart: number, color: string, fontSize: number }} geometry geometria computada da ocorrência.
 * @returns {Promise<{ inkWidth: number, inkCenterY: number, expectedCenterY: number }>} métricas da área pintada pelas aspas.
 */
const measureThematicQuoteInk = async (page, geometry) => {
	const screenshot = await page.screenshot({ type: 'png' });
	const metadata = await sharp(screenshot).metadata();
	const left = Math.max(0, Math.floor(geometry.rect.left));
	const top = Math.max(0, Math.floor(geometry.rect.top));
	const width = Math.min(metadata.width - left, Math.ceil(geometry.paddingInlineStart));
	const height = Math.min(metadata.height - top, Math.ceil(geometry.rect.height));
	assert.ok(width > 0 && height > 0, 'recorte raster do thematic-rail é inválido');

	const { data, info } = await sharp(screenshot)
		.extract({ left, top, width, height })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const accent = geometry.color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
	assert.equal(accent?.length, 3, `cor temática não mensurável: ${geometry.color}`);
	const rowPixels = Array.from({ length: info.height }, () => []);
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			const offset = (y * info.width + x) * info.channels;
			const distance = Math.hypot(
				data[offset] - accent[0],
				data[offset + 1] - accent[1],
				data[offset + 2] - accent[2],
			);
			if (distance <= 112 && data[offset + 3] > 0) rowPixels[y].push(x);
		}
	}

	const denseThreshold = Math.max(7, Math.floor(geometry.fontSize * 0.14));
	const glyphRows = rowPixels
		.map((pixels, y) => (pixels.length >= denseThreshold ? y : -1))
		.filter((y) => y >= 0);
	const maximumRowPixels = Math.max(...rowPixels.map((pixels) => pixels.length));
	assert.ok(
		glyphRows.length > 0,
		`área pintada das aspas não localizada no raster: max=${maximumRowPixels} threshold=${denseThreshold} color=${geometry.color} crop=${width}x${height}`,
	);
	const glyphPixels = glyphRows.flatMap((y) => rowPixels[y]);
	return {
		inkWidth: Math.max(...glyphPixels) - Math.min(...glyphPixels) + 1,
		inkCenterY: (Math.min(...glyphRows) + Math.max(...glyphRows)) / 2,
		expectedCenterY: geometry.rect.top - top + geometry.rect.height / 2,
	};
};

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

		// Regride a rota que expôs a contenção de pintura: a fixture agregada
		// desativa content-visibility em seguida e, sozinha, não detecta o recorte.
		await page.goto(`http://127.0.0.1:${port}/p/devaneios/`, { waitUntil: 'load' });
		const realQuotes = page.locator("article.jcem-post .page__content [data-jcem-quote-model='thematic-rail']");
		const realQuoteCount = await realQuotes.count();
		assert.ok(realQuoteCount > 1, `${viewport.width}: rota Devaneios sem múltiplas citações padrão`);
		const realStates = [];
		for (let index = 0; index < realQuoteCount; index += 1) {
			const quote = realQuotes.nth(index);
			await quote.scrollIntoViewIfNeeded();
			const geometry = await quote.evaluate((element) => {
				const rect = element.getBoundingClientRect();
				const style = getComputedStyle(element);
				const before = getComputedStyle(element, '::before');
				const matrix = new DOMMatrixReadOnly(before.transform);
				const pseudoLeft = rect.left + Number.parseFloat(before.left) + matrix.m41;
				const pseudoWidth = Number.parseFloat(before.width);
				return {
					contentVisibility: style.contentVisibility,
					bodyAlignments: [...element.querySelectorAll(':scope > p:not(.jcem-quote-reference), :scope > :is(ul, ol) li')]
						.map((paragraph) => getComputedStyle(paragraph).textAlign),
					referenceAlignments: [...element.querySelectorAll(':scope > .jcem-quote-reference')]
						.map((paragraph) => getComputedStyle(paragraph).textAlign),
					pseudoLeft,
					pseudoRight: pseudoLeft + pseudoWidth,
					beforeContent: before.content,
					paddingInlineStart: Number.parseFloat(style.paddingInlineStart),
					color: before.color,
					fontSize: Number.parseFloat(before.fontSize),
					rect: { left: rect.left, right: rect.right, top: rect.top, height: rect.height },
				};
			});
			realStates.push(geometry);
			assert.ok(geometry.beforeContent.includes('”'), `${viewport.width}/${index}: aspas temáticas ausentes`);
			assert.ok(geometry.pseudoLeft >= geometry.rect.left - 0.6, `${viewport.width}/${index}: aspas escapam da caixa de pintura pela esquerda`);
			assert.ok(geometry.pseudoRight <= geometry.rect.right + 0.6, `${viewport.width}/${index}: aspas escapam da caixa de pintura pela direita`);
			assert.ok(geometry.bodyAlignments.length > 0 && geometry.bodyAlignments.every((alignment) => alignment === 'justify'), `${viewport.width}/${index}: corpo da citação não está justificado`);
			assert.ok(geometry.referenceAlignments.every((alignment) => ['left', 'start'].includes(alignment)), `${viewport.width}/${index}: autoria da citação não está à esquerda`);
			if (viewport.width === 1280 && index < 2) {
				const raster = await measureThematicQuoteInk(page, geometry);
				assert.ok(raster.inkWidth >= geometry.fontSize * 0.3, `${viewport.width}/${index}: raster contém somente parte das aspas`);
				assert.ok(Math.abs(raster.inkCenterY - raster.expectedCenterY) <= geometry.fontSize * 0.1, `${viewport.width}/${index}: aspas não estão opticamente centralizadas`);
			}
		}
		assert.ok(realStates.slice(1).every(({ contentVisibility }) => contentVisibility === 'auto'), `${viewport.width}: regressão real não exercitou content-visibility`);

		// Regride a página real indicada na revisão visual do recuo externo.
		await page.goto(`http://127.0.0.1:${port}/p/5-verdades-de-genesis-27/`, { waitUntil: 'load' });
		const defaultQuote = page.locator("article.jcem-post .page__content [data-jcem-quote-model='thematic-rail'][data-jcem-quote-alias='primary']").first();
		const defaultQuoteState = await defaultQuote.evaluate((element) => ({
			model: element.getAttribute('data-jcem-quote-model'),
			alias: element.getAttribute('data-jcem-quote-alias'),
			marginInlineStart: Number.parseFloat(getComputedStyle(element).marginInlineStart),
		}));
		assert.equal(defaultQuoteState.model, 'thematic-rail');
		assert.equal(defaultQuoteState.alias, 'primary');
		assert.ok(
			Math.abs(defaultQuoteState.marginInlineStart - 18.2) <= 0.1,
			`${viewport.width}: recuo externo do modelo padrão divergiu de 18.2px: ${JSON.stringify(defaultQuoteState)}`,
		);

		// Regride a nota editorial que revelou a soma indevida do modelo primário
		// com alerta1 por uma IAL Markdown aninhada no conteúdo da citação.
		await page.goto(`http://127.0.0.1:${port}${batePapoRoute}`, { waitUntil: 'load' });
		const editorialNotice = page.locator('article.jcem-post .page__content [data-jcem-blockquote]').first();
		const editorialNoticeState = await editorialNotice.evaluate((element) => {
			const style = getComputedStyle(element);
			const before = getComputedStyle(element, '::before');
			return {
				model: element.getAttribute('data-jcem-quote-model'),
				paragraphModel: element.querySelector(':scope > p')?.getAttribute('data-jcem-quote-model') || '',
				beforeContent: before.content,
				backgroundImage: style.backgroundImage,
			};
		});
		assert.deepEqual(
			editorialNoticeState,
			{ model: 'alerta1', paragraphModel: '', beforeContent: 'none', backgroundImage: 'none' },
			`${viewport.width}: nota editorial somou alerta1 ao modelo primário`,
		);

		await page.goto(`http://127.0.0.1:${port}/_fixtures/blockquote-models/`, { waitUntil: 'load' });
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
						marginInlineStart: Number.parseFloat(style.marginInlineStart),
						textAlign: style.textAlign,
						bodyAlignments: [...quote.querySelectorAll(':scope > p:not(.jcem-quote-reference), :scope > :is(ul, ol) li')].map((paragraph) => getComputedStyle(paragraph).textAlign),
						referenceAlignments: [...quote.querySelectorAll(':scope > .jcem-quote-reference')].map((paragraph) => getComputedStyle(paragraph).textAlign),
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
			const pullQuoteEntries = state.models.filter(({ model }) => model === 'pull-quote');
			assert.ok(pullQuoteEntries.every((entry) => ['left', 'start'].includes(entry.textAlign)), `${theme}/${viewport.width}: alinhamento do pull-quote não é esquerdo`);
			assert.ok(pullQuoteEntries.every((entry) => entry.bodyAlignments.every((alignment) => ['left', 'start'].includes(alignment))), `${theme}/${viewport.width}: parágrafo do pull-quote não é esquerdo`);
			const thematicEntries = state.models.filter(({ model }) => model === 'thematic-rail');
			assert.ok(
				thematicEntries.every(({ marginInlineStart }) => Math.abs(marginInlineStart - 18.2) <= 0.1),
				`${theme}/${viewport.width}: recuo externo thematic-rail divergiu de 18.2px: ${JSON.stringify(thematicEntries.map(({ marginInlineStart }) => marginInlineStart))}`,
			);
			assert.ok(thematicEntries.every((entry) => entry.bodyAlignments.every((alignment) => alignment === 'justify')), `${theme}/${viewport.width}: corpo do thematic-rail não está justificado`);
			assert.ok(thematicEntries.every((entry) => entry.referenceAlignments.every((alignment) => ['left', 'start'].includes(alignment))), `${theme}/${viewport.width}: autoria do thematic-rail não está à esquerda`);
			for (const model of ['centered-mark', 'editorial-statement']) assert.equal(state.models.find((entry) => entry.model === model).background, 'rgba(0, 0, 0, 0)');
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
