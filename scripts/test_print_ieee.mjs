/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
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
assert.match(css, /margin:\s*19\.05mm 14\.3225mm 25mm/);
assert.match(css, /column-gap:\s*4\.2175mm/);
assert.match(css, /column-fill:\s*balance/);
assert.doesNotMatch(
	css,
	/:is\(h1, h2, h3, h4, h5, h6, figure, table, blockquote, \[role="blockquote"\]\)/,
);
assert.match(
	css,
	/:is\(blockquote, \[role="blockquote"\]\)\s*\{[^}]*break-inside:\s*auto\s*!important[^}]*page-break-inside:\s*auto\s*!important/s,
);
assert.match(css, /\[data-print-body\][^{]*:where\(p, li\)\s*\{[^}]*text-align:\s*justify\s*!important/s);
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
assert.match(headInclude, /<meta name="jcem-print-stylesheet" content="\{\{ '\/assets\/jcem\/print-ieee\/ieee\.css'/);
assert.match(headInclude, /<meta name="jcem-print-stylesheet" content="\{\{ '\/assets\/jcem\/print-ieee\/jekyll-blog\.css'/);
assert.doesNotMatch(headInclude, /<link[^>]+print-ieee[^>]+rel="stylesheet"/);

const siteSource = await readFile(
	path.join(repositoryRoot, 'assets', 'jcem', 'ts', 'site.ts'),
	'utf8',
);
assert.match(siteSource, /document\.readyState !== 'complete'/);
assert.match(siteSource, /window\.addEventListener\('load'/);
assert.match(siteSource, /document\.fonts\?\.ready/);
assert.match(siteSource, /image\.decode\(\)/);
assert.match(siteSource, /requestIdleCallback\(callback\)/);
assert.match(siteSource, /new MessageChannel\(\)/);
assert.match(siteSource, /window\.addEventListener\('beforeprint', prepareNow\)/);
assert.doesNotMatch(siteSource, /setTimeout\(scheduleIdle,\s*5000\)/);
assert.doesNotMatch(siteSource, /userAgent|navigator\.platform|maxTouchPoints/);

const dom = new JSDOM(
	'<main><article data-print-article data-print-state="legivel"><div data-print-span="all"></div><section data-print-body><p><a href="https://example.test/fonte">Fonte</a></p></section></article><footer data-print-institutional><time data-print-acquired-at></time></footer></main>',
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
assert.equal(document.querySelector('time').getAttribute('datetime'), '2026-08-09T12:00:00.000Z');
assert.match(document.querySelector('[data-print-page-footer-style]').textContent, /@bottom-center/);
assert.match(document.querySelector('[data-print-page-footer-style]').textContent, /09\/08\/2026/);
assert.equal(article.querySelector('[data-print-span]').dataset.printSpan, 'all');
assert.equal(article.querySelectorAll('[data-print-link-note]').length, 1);
assert.equal(article.querySelectorAll('[data-print-link-references] li').length, 1);
assert.match(article.querySelector('[data-print-link-references]').textContent, /https:\/\/example\.test\/fonte/);
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
assert.match(adapterCss, /\.jcem-quote__icon\s*\{[^}]*display:\s*none\s*!important/s);
assert.match(adapterCss, /:is\(blockquote, \[data-jcem-blockquote\], \[role="blockquote"\]\)::before,[\s\S]*?::after\s*\{[^}]*display:\s*none\s*!important[^}]*content:\s*none\s*!important/s);
assert.match(adapterCss, /\.jcem-post-header,[^{]*\[data-print-metadata\]\s*\{[^}]*column-span:\s*all\s*!important/s);
assert.match(adapterCss, /\.jcem-article-authors\s*\{[^}]*display:\s*none\s*!important/s);
assert.match(adapterCss, /> :not\(\.main_jcem_wrapper, \[data-print-institutional\]\)/);
for (const webOnlySelector of [
	'.toc',
	'.jcem-article-toc',
	'.jcem-featured-image',
	'.jcem-legacy-hero',
	'.jcem-cover',
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

const layout = await readFile(
	path.join(repositoryRoot, '_layouts', 'single.html'),
	'utf8',
);
const printMetadata = await readFile(
	path.join(repositoryRoot, '_includes', 'jcem', 'print-metadata.html'),
	'utf8',
);
const titlePosition = layout.indexOf('<header class="jcem-post-header"');
assert.match(layout, /<header class="jcem-post-header"[^>]*data-print-span="all"/);
const metadataPosition = layout.indexOf('{% include jcem/print-metadata.html %}');
const bodyPosition = layout.indexOf('<section class="page__content e-content"');
assert(titlePosition >= 0 && titlePosition < metadataPosition && metadataPosition < bodyPosition);
assert.match(printMetadata, /data-print-authors/);
assert.match(printMetadata, /data-print-summary[^>]*lang="pt-BR"/);
assert.match(printMetadata, /data-print-abstract[^>]*lang="en"/);
assert.match(printMetadata, /page\.description/);
assert.match(printMetadata, /page\.abstract/);
const printInstitutional = await readFile(
	path.join(repositoryRoot, '_includes', 'jcem', 'print-institutional.html'),
	'utf8',
);
assert.match(printInstitutional, /data-print-acquired-at/);
assert.match(printInstitutional, /page\.url \| absolute_url/);
assert.match(css, /body:has\(\[data-print-article\]\) \[data-print-institutional\][\s\S]*display:\s*none\s*!important/);
assert.ok(layout.indexOf('{% include jcem/print-institutional.html %}') > layout.indexOf('</article>'));

const postsRoot = path.join(repositoryRoot, '_posts');
for (const name of (await readdir(postsRoot)).filter((entry) => entry.endsWith('.md'))) {
	const source = await readFile(path.join(postsRoot, name), 'utf8');
	const frontMatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
	assert.match(frontMatter, /^description:\s*\S.+$/m, `${name}: Resumo ausente`);
	assert.match(frontMatter, /^abstract:\s*\S.+$/m, `${name}: Abstract ausente`);
}

const jekyllConfig = await readFile(path.join(repositoryRoot, '_config.yml'), 'utf8');
const rcf = await readFile(path.join(repositoryRoot, 'RCF.md'), 'utf8');
const printRcf = await readFile(
	path.join(repositoryRoot, 'RCFs', 'impressao-ieee.md'),
	'utf8',
);
assert.match(rcf, /\[Impressão IEEE\]\(\.\/RCFs\/impressao-ieee\.md\)/);
assert.match(printRcf, /Registro único de exceções de isolamento e do perfil impresso/);
assert.match(printRcf, /Exceções vigentes ao isolamento ou ao estilo IEEE: nenhuma/);
assert.match(
	printRcf,
	/`blockquote` e estrutura semanticamente equivalente DEVEM usar na impressão, por padrão, exclusivamente o estilo definido pelo perfil IEEE/,
);
assert.match(printRcf, /Componente de terceiro NÃO está dispensado/);
assert.match(printRcf, /2026-08-11-devaneios-chromium-148\.json/);
const currentReport = JSON.parse(
	await readFile(
		path.join(packageRoot, 'reports', '2026-08-11-devaneios-chromium-148.json'),
		'utf8',
	),
);
assert.equal(currentReport.level, 'ieee-validado');
assert.equal(currentReport.output.paper, 'A4');
assert.equal(currentReport.output.pages, 7);
assert.equal(currentReport.output.blankPages, 0);
assert.equal(currentReport.checks.titleFullSpanBeforeColumns, true);
assert.equal(currentReport.checks.authorsAndMetadataBeforeBody, true);
assert.equal(currentReport.checks.summaryAndAbstractPresent, true);
assert.equal(currentReport.checks.bodyColumnsJustified, true);
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
