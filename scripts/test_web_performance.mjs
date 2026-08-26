import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import {
	createEndpoint,
	aggregateLayouts,
	isRetryablePageSpeedError,
	isRetryablePageSpeedStatus,
	validateConfig,
	summarize,
} from './check-pagespeed.mjs';

const site = await readFile(new URL('../assets/jcem/ts/site.ts', import.meta.url), 'utf8');
const archiveCard = await readFile(new URL('../_includes/archive-single.html', import.meta.url), 'utf8');
const documentCollection = await readFile(new URL('../_includes/documents-collection.html', import.meta.url), 'utf8');
const taxonomyCollection = await readFile(new URL('../_includes/posts-taxonomy.html', import.meta.url), 'utf8');
const tagsPage = await readFile(new URL('../assuntos.md', import.meta.url), 'utf8');
const themeInputs = await readFile(new URL('../_includes/jcem/body/first.html', import.meta.url), 'utf8');
const mainPage = await readFile(new URL('../_includes/main_page.html', import.meta.url), 'utf8');
const featuredImage = await readFile(new URL('../_includes/jcem/post-featured-image.html', import.meta.url), 'utf8');
const assetMetadataPlugin = await readFile(new URL('../_plugins/jcem_asset_metadata.rb', import.meta.url), 'utf8');
const quoteSemanticsPlugin = await readFile(new URL('../_plugins/jcem_quote_semantics.rb', import.meta.url), 'utf8');
const responsiveGenerator = await readFile(new URL('./generate-responsive-images.py', import.meta.url), 'utf8');
const trackedWebpGenerator = await readFile(new URL('./generate-tracked-webp.py', import.meta.url), 'utf8');
const socialImageGenerator = await readFile(new URL('./generate-social-images.mjs', import.meta.url), 'utf8');
const socialImageConnector = await readFile(new URL('../_plugins/jcem_social_images.rb', import.meta.url), 'utf8');
const trackedWebpManifest = JSON.parse(
	await readFile(new URL('../config/tracked-webp.json', import.meta.url), 'utf8'),
);
const masthead = await readFile(new URL('../_includes/masthead.html', import.meta.url), 'utf8');
const archiveReadTime = await readFile(new URL('../_includes/jcem/post-read-time.html', import.meta.url), 'utf8');
const notFound = await readFile(new URL('../404.main.html', import.meta.url), 'utf8');
const footer = await readFile(new URL('../_includes/footer/custom.html', import.meta.url), 'utf8');
const head = await readFile(new URL('../_includes/head/custom.html', import.meta.url), 'utf8');
const themeScripts = await readFile(new URL('../_includes/scripts.html', import.meta.url), 'utf8');
const visualValidation = await readFile(new URL('./validate-visual.js', import.meta.url), 'utf8');
const customVariables = await readFile(
	new URL('../_sass/minimal-mistakes/skins/_variables-custom.scss', import.meta.url),
	'utf8',
);
const customTheme = await readFile(
	new URL('../assets/jcem/css/jcmain.scss', import.meta.url),
	'utf8',
);
const tableTheme = await readFile(
	new URL('../_sass/minimal-mistakes/_tables.scss', import.meta.url),
	'utf8',
);
const config = validateConfig(
	JSON.parse(await readFile(new URL('../config/pagespeed.json', import.meta.url), 'utf8')),
);

assert.match(site, /ResizeObserver/);
assert.match(site, /bindJcemImageViewers/);
assert.match(site, /jcemImageViewerExcludedSelector/);
assert.match(site, /requestFullscreen/);
assert.match(site, /is-fullscreen-fallback/);
assert.match(site, /jcemImageViewerOrigin\?\.focus\(\)/);
assert.match(site, /requestAnimationFrame\(applyState\)/);
assert.doesNotMatch(
	site.slice(site.indexOf('const bindJcemMasthead'), site.indexOf('const bindJcemScrollTop')),
	/getBoundingClientRect/,
);
assert.match(site, /addEventListener\('beforeprint', prepareNow\)/);
assert.match(site, /setTimeout\(scheduleIdle, 5000\)/);
assert.deepEqual(
	config.layouts.map((layout) => layout.id),
	['home', 'article', 'map', 'about', 'taxonomy', 'not-found'],
);
assert.equal(config.schema, 2);
assert.ok(config.layouts.every(({ samples }) => samples.length >= 2));
assert.ok(config.layouts.every(({ samples }) => samples.filter(({ gate }) => gate !== false).length >= 2));
assert.equal(config.concurrency, 2);
assert.deepEqual(config.layouts.find(({ id }) => id === 'not-found').categories, [
	'performance',
	'accessibility',
	'best-practices',
]);
assert.match(archiveCard, /fetchpriority="high"/);
assert.match(archiveCard, /loading="{% if archive_image_priority %}eager/);
assert.match(documentCollection, /forloop\.index == 1/);
assert.match(taxonomyCollection, /jcem_archive_priority_count < 1/);
assert.match(tagsPage, /^taxonomy_compact:\s*true$/m);
assert.match(taxonomyCollection, /jcem_taxonomy_compact[\s\S]*jcem-taxonomy-posts/);
assert.match(featuredImage, /loading="eager" decoding="async" fetchpriority="high"/);
assert.doesNotMatch(featuredImage, /srcset=/);
assert.doesNotMatch(assetMetadataPlugin, /normalize_post_images|documents, :post_render/);
assert.doesNotMatch(
	customVariables,
	/\.archive\s*>\s*\.entries-grid\s*>\s*\.grid__item:nth-child\(n \+ 3\)[^{]*\{[^}]*content-visibility:\s*auto/s,
);
assert.match(
	customVariables,
	/\.jcem-featured-image--wide\s*\{[^}]*aspect-ratio:\s*auto;[^}]*height:\s*auto;[^}]*max-height:\s*min\(\s*var\(--jcem-featured-height\)/s,
);
assert.match(customTheme, /--jcem-featured-height:\s*clamp\(12rem, 32vh, 24rem\)/);
assert.match(customTheme, /--jcem-featured-height:\s*clamp\(10rem, 30vh, 18rem\)/);
assert.match(
	customVariables,
	/\.jcem-featured-image--wide\s+\.jcem-featured-image__img\s*\{[^}]*width:\s*auto;[^}]*height:\s*auto;[^}]*margin-inline:\s*auto;[^}]*max-height:\s*min\(/s,
);
assert.match(
	customTheme,
	/\.jcem-quote__icon\s*\{[^}]*grid-row:\s*1;[^}]*align-self:\s*start;/s,
);
assert.match(quoteSemanticsPlugin, /documents, :post_render/);
assert.match(quoteSemanticsPlugin, /render_structural_quotes/);
assert.match(responsiveGenerator, /RESPONSIVE_SOURCE_HASH_DIVERGENTE/);
assert.match(responsiveGenerator, /if not target\.is_file\(\)/);
assert.match(trackedWebpGenerator, /TRACKED_WEBP_SOURCE_DIVERGENTE/);
assert.match(trackedWebpGenerator, /TRACKED_WEBP_TARGET_DIVERGENTE/);
assert.match(trackedWebpGenerator, /sourceMtimeUtc/);
assert.doesNotMatch(trackedWebpGenerator, /recover_partial|legacy_partial/);
assert.equal(trackedWebpManifest.schema, 1);
assert.deepEqual(trackedWebpManifest.encoder, {
	name: 'Pillow',
	format: 'WEBP',
	quality: 82,
	method: 6,
});
assert.equal(Object.keys(trackedWebpManifest.assets).length, 2);
assert.match(trackedWebpGenerator, /AUTHORIZED_SHARED_SOURCES/);
assert.doesNotMatch(trackedWebpGenerator, /\(ROOT \/ "assets"\)\.rglob/);
for (const [sourcePath, record] of Object.entries(trackedWebpManifest.assets)) {
	const sourceUrl = new URL(`../${sourcePath}`, import.meta.url);
	const sourceBytes = await readFile(sourceUrl);
	assert.equal((await stat(sourceUrl)).size, record.sourceBytes);
	assert.equal(createHash('sha256').update(sourceBytes).digest('hex'), record.sourceSha256);
	assert.ok(record.sourceMtimeUtc);
	assert.ok(record.generatedAtUtc);
	assert.match(record.target, /\.jcem\.webp$/);
	const targetUrl = new URL(`../${record.target}`, import.meta.url);
	const targetBytes = await readFile(targetUrl);
	assert.equal((await stat(targetUrl)).size, record.targetBytes);
	assert.equal(createHash('sha256').update(targetBytes).digest('hex'), record.targetSha256);
}
assert.match(socialImageGenerator, /height !== 630/);
assert.match(socialImageGenerator, /sourceSha256/);
assert.match(socialImageGenerator, /parametersSha256/);
assert.match(socialImageGenerator, /jpeg\.length < png\.length/);
assert.match(socialImageConnector, /header\["og_image"\]/);
assert.match(socialImageConnector, /jcem_social_images/);
assert.match(masthead, /width="630"[\s\S]*height="256"/);
assert.match(archiveCard, /include jcem\/post-read-time\.html/);
assert.doesNotMatch(archiveCard, /include page__meta\.html/);
assert.match(archiveReadTime, /include\.post \| default/);
assert.doesNotMatch(customVariables, /repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(customVariables, /archive__item-link:visited/);
assert.match(customVariables, /pagination a::after/);
assert.match(customVariables, /100dvh - var\(--jcem-masthead-h/);
assert.match(notFound, /pagina-404-480w\.webp/);
assert.match(notFound, /fetchpriority="low"/);
assert.match(notFound, /body\.layout--404\s*\{[\s\S]*overflow-x:\s*clip/);
assert.match(notFound, /\.layout--404 \.main_jcem_wrapper\s*\{[\s\S]*overflow-x:\s*visible/);
assert.match(notFound, /const container = img\.closest\('\.jcem-skeleton'\);/);
assert.doesNotMatch(notFound, /img\.closest\('\.jcem-skeleton'\) \|\| img\.parentElement/);
assert.match(tableTheme, /border-bottom:\s*1px solid var\(--tblb\)/);
assert.match(customVariables, /--dark--table-head:\s*#303640/);
assert.match(customVariables, /table:not\(\.jcem-panel__table\)[\s\S]*var\(--table-head\)/);
assert.match(customVariables, /@media screen[\s\S]*\.jcem-image-viewer__control/);
assert.match(notFound, /pendingLines\.forEach\(\(line\) => line\.style\.setProperty\('visibility', 'hidden'\)\)/);
assert.match(notFound, /window\.setTimeout\(\(\) => \{[\s\S]*requestIdleCallback\(run[\s\S]*\}, 5000\)/);
assert.match(footer, /\{% comment %\}[\s\S]*RFC-JCEM-FOOTER-001[\s\S]*\{% endcomment %\}/);
assert.match(customVariables, /jcem-skeleton-asset\[fetchpriority='high'\]/);
assert.match(visualValidation, /text: document\.body\.textContent \|\| ''/);
assert.match(visualValidation, /terminalTrackResetting[\s\S]*terminalTrackTransitionProperty !== 'none'/);
assert.match(customVariables, /@media screen[\s\S]*content-visibility: auto/);
assert.doesNotMatch(customVariables, /\.archive > \.entries-grid > \.grid__item:nth-child\(n \+ 3\)/);
assert.match(customVariables, /@media screen[\s\S]*\.jcem-taxonomy-posts/);
assert.doesNotMatch(customVariables, /\.grid__wrapper > \.grid__item:nth-child\(n \+ 3\)/);
assert.doesNotMatch(head, /body > :not\(\.carregandoPagina\)/);
assert.match(head, /page\.layout == 'home' or page\.layout == 'categories' or page\.layout == 'tags'[\s\S]*imagesrcset=/);
assert.match(head, /else[\s\S]*jcem_lcp_image \| relative_url[\s\S]*fetchpriority="high"/);
assert.doesNotMatch(themeInputs, /<noscript>/);
assert.match(mainPage, /<\/div>[\s\S]*<noscript>[\s\S]*noscript-content\.html[\s\S]*<\/noscript>[\s\S]*<\/body>/);
assert.match(head, /consent-manager\/silktide\.js[^>]+defer/);
assert.match(head, /consent-manager\/start\.js[^>]+defer/);
assert.match(site, /bindJcemThemeConnector/);
assert.match(site, /liberacao visual nao depende da clonagem do fallback oculto/);
assert.match(site, /window\.setTimeout\(\(\) => \{[\s\S]*requestIdleCallback\(prepareFallback[\s\S]*\}, 4000\)/);
assert.match(site, /oportunidade real de pintura[\s\S]*requestAnimationFrame\(run\)/);
assert.match(site, /bindJcemTheme\(\);[\s\S]*scheduleJcemPostPaintEnhancements\(\)/);
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

const layoutSummary = aggregateLayouts([
	{ layout: 'article', target: 'a', url: 'https://example.test/a', strategy: 'mobile', gateCategories: ['accessibility', 'seo'], categories: { performance: 44, accessibility: 100, seo: 100 } },
	{ layout: 'article', target: 'b', url: 'https://example.test/b', strategy: 'mobile', categories: { performance: 94, accessibility: 98 } },
	{ layout: 'article', target: 'c', url: 'https://example.test/c', strategy: 'mobile', categories: { performance: 96, accessibility: 99 } },
], 90);
assert.equal(layoutSummary[0].categories.performance, 95);
assert.equal(layoutSummary[0].ok, true);
assert.equal(layoutSummary[0].samples.length, 3);
assert.deepEqual(layoutSummary[0].samples[0].gateCategories, ['accessibility', 'seo']);
assert.equal(layoutSummary[0].categories.seo, 100);

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
assert.equal(isRetryablePageSpeedError({ name: 'TimeoutError' }), true);
assert.equal(isRetryablePageSpeedError({ name: 'AbortError' }), true);
assert.equal(isRetryablePageSpeedError({ name: 'TypeError' }), false);
assert.match(await readFile(new URL('./check-pagespeed.mjs', import.meta.url), 'utf8'), /Math\.min\(config\.concurrency, tasks\.length\)/);

console.log('web_performance=ok');
