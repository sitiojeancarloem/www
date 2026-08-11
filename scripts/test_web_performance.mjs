import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
	createEndpoint,
	isRetryablePageSpeedStatus,
	validateConfig,
	summarize,
} from './check-pagespeed.mjs';

const site = await readFile(new URL('../assets/jcem/ts/site.ts', import.meta.url), 'utf8');
const archiveCard = await readFile(new URL('../_includes/archive-single.html', import.meta.url), 'utf8');
const documentCollection = await readFile(new URL('../_includes/documents-collection.html', import.meta.url), 'utf8');
const taxonomyCollection = await readFile(new URL('../_includes/posts-taxonomy.html', import.meta.url), 'utf8');
const themeInputs = await readFile(new URL('../_includes/jcem/body/first.html', import.meta.url), 'utf8');
const featuredImage = await readFile(new URL('../_includes/jcem/post-featured-image.html', import.meta.url), 'utf8');
const masthead = await readFile(new URL('../_includes/masthead.html', import.meta.url), 'utf8');
const notFound = await readFile(new URL('../404.main.html', import.meta.url), 'utf8');
const footer = await readFile(new URL('../_includes/footer/custom.html', import.meta.url), 'utf8');
const head = await readFile(new URL('../_includes/head/custom.html', import.meta.url), 'utf8');
const themeScripts = await readFile(new URL('../_includes/scripts.html', import.meta.url), 'utf8');
const visualValidation = await readFile(new URL('./validate-visual.js', import.meta.url), 'utf8');
const customVariables = await readFile(
	new URL('../_sass/minimal-mistakes/skins/_variables-custom.scss', import.meta.url),
	'utf8',
);
const config = validateConfig(
	JSON.parse(await readFile(new URL('../config/pagespeed.json', import.meta.url), 'utf8')),
);

assert.match(site, /ResizeObserver/);
assert.match(site, /requestAnimationFrame\(applyState\)/);
assert.doesNotMatch(
	site.slice(site.indexOf('const bindJcemMasthead'), site.indexOf('const bindJcemScrollTop')),
	/getBoundingClientRect/,
);
assert.match(site, /addEventListener\('beforeprint', prepareNow\)/);
assert.match(site, /setTimeout\(scheduleIdle, 5000\)/);
assert.deepEqual(
	config.targets.map((target) => target.id),
	['home', 'article', 'map', 'about', 'categories', 'tags', 'not-found'],
);
assert.deepEqual(config.targets.find(({ id }) => id === 'not-found').categories, [
	'performance',
	'accessibility',
	'best-practices',
]);
assert.match(archiveCard, /fetchpriority="high"/);
assert.match(archiveCard, /loading="{% if archive_image_priority %}eager/);
assert.match(documentCollection, /forloop\.index <= 2/);
assert.match(taxonomyCollection, /jcem_archive_priority_count < 2/);
assert.match(featuredImage, /loading="eager" decoding="async" fetchpriority="high"/);
assert.match(masthead, /width="630"[\s\S]*height="256"/);
assert.match(notFound, /pagina-404-480w\.webp/);
assert.match(notFound, /fetchpriority="low"/);
assert.match(notFound, /pendingLines\.forEach\(\(line\) => line\.style\.setProperty\('visibility', 'hidden'\)\)/);
assert.match(notFound, /window\.setTimeout\(\(\) => \{[\s\S]*requestIdleCallback\(run[\s\S]*\}, 5000\)/);
assert.match(footer, /\{% comment %\}[\s\S]*RFC-JCEM-FOOTER-001[\s\S]*\{% endcomment %\}/);
assert.match(customVariables, /jcem-skeleton-asset\[fetchpriority='high'\]/);
assert.match(visualValidation, /text: document\.body\.textContent \|\| ''/);
assert.match(customVariables, /@media screen[\s\S]*content-visibility: auto/);
assert.match(customVariables, /\.archive > \.entries-grid > \.grid__item:nth-child\(n \+ 3\)/);
assert.doesNotMatch(customVariables, /\.grid__wrapper > \.grid__item:nth-child\(n \+ 3\)/);
assert.doesNotMatch(head, /body > :not\(\.carregandoPagina\)/);
assert.match(head, /page\.layout == 'home'[\s\S]*rel="preload" as="image"/);
assert.match(head, /consent-manager\/silktide\.js[^>]+defer/);
assert.match(head, /consent-manager\/start\.js[^>]+defer/);
assert.match(site, /bindJcemThemeConnector/);
assert.match(site, /liberacao visual nao depende da clonagem do fallback oculto/);
assert.match(site, /window\.setTimeout\(\(\) => \{[\s\S]*requestIdleCallback\(prepareFallback[\s\S]*\}, 4000\)/);
assert.match(themeScripts, /site\.search == true or page\.layout == "search"/);
assert.doesNotMatch(themeScripts, /else[\s\S]*main\.min\.js/);
assert.match(themeInputs, /aria-label="Tema claro"/);
assert.match(themeInputs, /aria-label="Tema escuro"/);
assert.match(visualValidation, /const isVector = .*\.endsWith\('\.svg'\)/);
assert.match(visualValidation, /hasResponsiveSelection: isVector \|\| Boolean/);
assert.match(visualValidation, /const visit = async \(directory\)/);

const summary = summarize(
	{
		lighthouseResult: {
			categories: {
				performance: { score: 0.94 },
				accessibility: { score: 0.89 },
			},
			audits: {
				'largest-contentful-paint': { displayValue: '1.2 s' },
				'total-blocking-time': { displayValue: '120 ms' },
				'unused-css-rules': { score: 0.71, displayValue: 'Potential savings of 18 KiB' },
			},
		},
	},
	{ id: 'fixture', url: 'https://example.test/' },
	'mobile',
	90,
);
assert.equal(summary.ok, false);
assert.deepEqual(summary.failing, ['accessibility']);
assert.equal(summary.categories.performance, 94);
assert.equal(summary.vitals['total-blocking-time'], '120 ms');
assert.deepEqual(summary.diagnostics['unused-css-rules'], {
	score: 71,
	value: 'Potential savings of 18 KiB',
});

const endpointWithoutKey = createEndpoint(
	{ url: 'https://example.test/' },
	'mobile',
	['performance'],
);
assert.equal(endpointWithoutKey.searchParams.has('key'), false);

const endpointWithKey = createEndpoint(
	{ url: 'https://example.test/' },
	'desktop',
	['performance', 'accessibility'],
	'credencial-apenas-de-teste',
);
assert.equal(endpointWithKey.searchParams.get('key'), 'credencial-apenas-de-teste');
assert.deepEqual(endpointWithKey.searchParams.getAll('category'), ['performance', 'accessibility']);
assert.equal(endpointWithKey.searchParams.get('strategy'), 'desktop');
assert.equal(isRetryablePageSpeedStatus(500), true);
assert.equal(isRetryablePageSpeedStatus(504), true);
assert.equal(isRetryablePageSpeedStatus(429), false);
assert.equal(isRetryablePageSpeedStatus(404), false);

console.log('web_performance=ok');
