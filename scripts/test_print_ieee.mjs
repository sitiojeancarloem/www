/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repositoryRoot, 'src', 'jcem-print-ieee');
const profileName = 'ieee-conference-a4-ieeetran-1.8b.json';
const profile = JSON.parse(
	await readFile(path.join(packageRoot, 'profiles', profileName), 'utf8'),
);
assert.equal(
	profile.authority.referenceArchiveSha256,
	'e0cd4f5afbd42c8076092280e72b3e0a5111efe501d35de9f715cfb8da313cb4',
);
assert.deepEqual(
	[profile.page.paper, profile.page.scalePercent, profile.columns.count],
	['A4', 100, 2],
);
assert.equal(profile.classification.automaticMaximum, 'nativo-preparado');

const css = await readFile(path.join(packageRoot, 'dist', 'ieee.css'), 'utf8');
const headInclude = await readFile(
	path.join(repositoryRoot, '_includes', 'head', 'custom.html'),
	'utf8',
);
assert.match(css, /size:\s*A4/);
assert.match(css, /margin:\s*19\.05mm 14\.3225mm 43mm/);
assert.match(css, /column-gap:\s*4\.2175mm/);
assert.match(css, /column-fill:\s*balance/);
assert.match(css, /\[data-print-body\]\s*\{[^}]*display:\s*contents\s*!important/s);
assert.match(css, /\[data-print-body\]\s*\{[^}]*column-count:\s*auto\s*!important/s);
assert.match(css, /#print-isolation-specificity-guard/);
assert.match(css, /all:\s*revert\s*!important/);
assert.match(css, /\*::before[^{]*\*::after\s*\{[^}]*all:\s*revert\s*!important/s);
assert.match(css, /\.jcem-panel__table[^}]*display:\s*contents\s*!important/s);
assert.match(css, /\.jcem-panel__edge\)\s*\{[^}]*display:\s*none\s*!important/s);
assert.match(css, /\[data-print-article\][^}]*\*\s*\{[^}]*Noto Sans[^}]*!important/s);
assert.match(css, /:where\(code, pre, kbd, samp, code \*, pre \*\)/);
assert.doesNotMatch(css.split('@media print')[0], /\[data-print-article\]\s*\{[^}]*font-/s);
assert.match(
	headInclude,
	/<link rel="stylesheet" href="\{\{ '\/assets\/jcem\/print-ieee\/ieee\.css' \| relative_url \}\}">/,
);
assert.doesNotMatch(
	headInclude,
	/print-ieee\/ieee\.css[^>]*media="print"/,
	'o ocultador de auxiliares impressos precisa participar somente do contexto screen interno',
);

const dom = new JSDOM(
	'<article data-print-article data-print-state="legivel"><time data-print-acquired-at></time><aside data-print-span="all"></aside></article>',
	{ url: 'https://example.test/post/' },
);
Object.assign(globalThis, {
	window: dom.window,
	document: dom.window.document,
	HTMLElement: dom.window.HTMLElement,
	CustomEvent: dom.window.CustomEvent,
});
dom.window.matchMedia = () => ({
	matches: false,
	addEventListener() {},
	removeEventListener() {},
});

const library = await import(
	`${pathToFileURL(path.join(packageRoot, 'dist', 'index.js')).href}?test=${Date.now()}`
);
const article = document.querySelector('article');
assert.equal(article.dataset.printState, 'legivel', 'importação não deve auto-inicializar');
const controller = library.prepareArticle(article, {
	acquiredAt: new Date('2026-08-09T12:00:00.000Z'),
});
assert.equal(controller.getState(), 'nativo-preparado');
assert.equal(article.dataset.printProfile, profile.id);
assert.equal(article.querySelector('time').getAttribute('datetime'), '2026-08-09T12:00:00.000Z');
assert.equal(article.querySelector('aside').dataset.printSpan, 'all');
controller.dispose();

const publicModule = await readFile(
	path.join(repositoryRoot, 'assets', 'jcem', 'print-ieee', 'index.js'),
	'utf8',
);
const distModule = await readFile(path.join(packageRoot, 'dist', 'index.js'), 'utf8');
assert.equal(publicModule, distModule);
assert.match(publicModule, /^\/\*! Fonte:/);

const adapterCss = await readFile(
	path.join(packageRoot, 'adapters', 'jekyll-blog.css'),
	'utf8',
);
for (const webOnlySelector of [
	'.toc',
	'.header-link',
	'.jcem-date-flag',
	'.pagination',
	'> summary',
]) {
	assert.match(
		adapterCss,
		new RegExp(webOnlySelector.replaceAll('.', '\\.')),
		`auxiliar web sem neutralização impressa: ${webOnlySelector}`,
	);
}

const jekyllConfig = await readFile(path.join(repositoryRoot, '_config.yml'), 'utf8');
const rcf = await readFile(path.join(repositoryRoot, 'RCF.md'), 'utf8');
assert.match(rcf, /Registro único de exceções de isolamento e do perfil impresso/);
assert.match(rcf, /Exceções vigentes ao isolamento ou ao estilo IEEE: nenhuma/);
assert.match(
	rcf,
	/`blockquote` e estrutura semanticamente equivalente DEVEM usar na impressão, por padrão, exclusivamente o estilo definido pelo perfil IEEE/,
);
assert.match(rcf, /Componente de terceiro NÃO está dispensado/);
for (const excludedPath of [
	'/src',
	'/scripts',
]) {
	assert.match(
		jekyllConfig,
		new RegExp(`^\\s*- ${excludedPath.replaceAll('/', '\\/')}\\s*$`, 'm'),
		`fonte interna não excluída do artefato: ${excludedPath}`,
	);
}

process.stdout.write(`print_ieee=ok profile=${profile.id} state=${controller.getState()}\n`);
