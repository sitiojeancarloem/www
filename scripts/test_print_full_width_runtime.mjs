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
const artifactDir = path.resolve(process.env.JCEM_PRINT_ARTIFACT_DIR || '.tmp/ft087');
const fixturePath = '/fixtures/print-full-width/';
const expected = {
	'print-full-width-manual': 'manual',
	'print-full-width-auto-text': 'auto',
	'print-full-width-auto-visual': 'auto',
	'print-full-width-negative-simple': null,
	'print-full-width-near-limit': 'auto',
	'print-full-width-over-height': null,
};
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

assert.ok(existsSync(path.join(root, 'fixtures', 'print-full-width', 'index.html')), 'fixture Jekyll ausente');
await mkdir(artifactDir, { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const executablePath = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
	const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
	await page.addInitScript(() => {
		localStorage.setItem('silktideCookieBanner_InitialChoice', '1');
		localStorage.setItem('silktideCookieChoice_obrigat_rios', 'true');
	});
	await page.goto(`http://127.0.0.1:${port}${fixturePath}`, { waitUntil: 'domcontentloaded' });
	await page.waitForFunction(
		() => document.querySelector('[data-print-article]')?.dataset.printSchedule === 'ready',
		undefined,
		{ timeout: 20_000 },
	);
	await page.waitForFunction(() => [...document.images].every((image) => image.complete));

	const screen = await page.evaluate((ids) => Object.fromEntries(ids.map((id) => {
		const node = document.getElementById(id);
		if (!node) return [id, null];
		const before = node.getBoundingClientRect();
		const attributes = ['data-print-span', 'data-print-span-source', 'data-print-span-reason'];
		const saved = Object.fromEntries(attributes.map((name) => [name, node.getAttribute(name)]));
		attributes.forEach((name) => node.removeAttribute(name));
		const withoutMarker = node.getBoundingClientRect();
		for (const [name, value] of Object.entries(saved)) if (value !== null) node.setAttribute(name, value);
		return [id, {
			span: saved['data-print-span'],
			source: saved['data-print-span-source'],
			columnSpan: getComputedStyle(node).columnSpan,
			before: { width: before.width, height: before.height, top: before.top, left: before.left },
			withoutMarker: {
				width: withoutMarker.width,
				height: withoutMarker.height,
				top: withoutMarker.top,
				left: withoutMarker.left,
			},
		}];
	})), Object.keys(expected));

	for (const [id, source] of Object.entries(expected)) {
		assert.ok(screen[id], `${id}: elemento ausente`);
		assert.equal(screen[id].source, source, `${id}: origem da classificação incorreta`);
		assert.equal(screen[id].span, source ? 'all' : null, `${id}: abrangência incorreta`);
		assert.equal(screen[id].columnSpan, 'none', `${id}: marcador afetou a mídia de tela`);
		for (const metric of ['width', 'height', 'top', 'left']) {
			assert.ok(
				Math.abs(screen[id].before[metric] - screen[id].withoutMarker[metric]) <= 0.1,
				`${id}: marcador alterou ${metric} na mídia de tela`,
			);
		}
	}

	await page.emulateMedia({ media: 'print' });
	const print = await page.evaluate((ids) => {
		const article = document.querySelector('[data-print-article]');
		const articleRect = article.getBoundingClientRect();
		const figures = ids.map((id) => {
			const node = document.getElementById(id);
			const image = node.querySelector('img');
			const caption = node.querySelector('figcaption');
			const rect = node.getBoundingClientRect();
			const imageRect = image.getBoundingClientRect();
			const captionRect = caption.getBoundingClientRect();
			return {
				id,
				span: node.getAttribute('data-print-span'),
				columnSpan: getComputedStyle(node).columnSpan,
				rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
				image: {
					width: imageRect.width,
					height: imageRect.height,
					naturalWidth: image.naturalWidth,
					naturalHeight: image.naturalHeight,
				},
				caption: {
					width: captionRect.width,
					fontSize: Number.parseFloat(getComputedStyle(caption).fontSize),
					textAlign: getComputedStyle(caption).textAlign,
				},
			};
		});
		return {
			article: { width: articleRect.width, columnCount: getComputedStyle(article).columnCount },
			figures,
			domOrder: figures.every((figure, index) => index === 0 ||
				document.getElementById(figures[index - 1].id).compareDocumentPosition(document.getElementById(figure.id)) & Node.DOCUMENT_POSITION_FOLLOWING),
		};
	}, Object.keys(expected));

	assert.equal(print.article.columnCount, '2', 'artigo não permaneceu em duas colunas');
	assert.ok(print.article.width > 670 && print.article.width < 700, `largura IEEE inesperada: ${print.article.width}`);
	assert.equal(print.domOrder, true, 'ordem editorial foi alterada');
	for (const figure of print.figures) {
		const isFullWidth = expected[figure.id] !== null;
		if (isFullWidth) {
			assert.equal(figure.columnSpan, 'all', `${figure.id}: column-span ausente`);
			assert.ok(figure.rect.width >= print.article.width * 0.98, `${figure.id}: não atravessou as colunas`);
			assert.ok(figure.caption.width >= print.article.width * 0.98, `${figure.id}: legenda não acompanhou a figura`);
			assert.ok(Math.abs(figure.caption.fontSize - (7 * 96 / 72)) < 0.25, `${figure.id}: legenda fora de 7pt`);
			assert.equal(figure.caption.textAlign, 'center', `${figure.id}: legenda não centralizada`);
		} else {
			assert.equal(figure.columnSpan, 'none', `${figure.id}: falso positivo no layout`);
			assert.ok(figure.rect.width <= print.article.width * 0.55, `${figure.id}: controle negativo saiu da coluna`);
		}
		assert.ok(figure.image.width > 0 && figure.image.height > 0, `${figure.id}: imagem sem caixa`);
		assert.ok(figure.image.naturalWidth > 0 && figure.image.naturalHeight > 0, `${figure.id}: imagem não carregada`);
		const renderedRatio = figure.image.width / figure.image.height;
		const naturalRatio = figure.image.naturalWidth / figure.image.naturalHeight;
		assert.ok(Math.abs(renderedRatio - naturalRatio) < 0.03, `${figure.id}: proporção foi distorcida`);
	}
	for (let left = 0; left < print.figures.length; left += 1) {
		for (let right = left + 1; right < print.figures.length; right += 1) {
			const a = print.figures[left].rect;
			const b = print.figures[right].rect;
			const intersectionWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
			const intersectionHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
			assert.ok(intersectionWidth * intersectionHeight < 1, `${print.figures[left].id} sobrepõe ${print.figures[right].id}`);
		}
	}

	const pdfPath = path.join(artifactDir, 'print-full-width-a4.pdf');
	await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true });
	console.log(`print_full_width_runtime=ok positives=4 negatives=2 screen=inert pdf=${pdfPath}`);
} finally {
	await browser.close();
	await new Promise((resolve) => server.close(resolve));
}
