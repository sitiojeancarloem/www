import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateConfig, summarize } from './check-pagespeed.mjs';

const site = await readFile(new URL('../assets/jcem/ts/site.ts', import.meta.url), 'utf8');
const archiveCard = await readFile(new URL('../_includes/archive-single.html', import.meta.url), 'utf8');
const themeInputs = await readFile(new URL('../_includes/jcem/body/first.html', import.meta.url), 'utf8');
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
assert.match(themeInputs, /aria-label="Tema claro"/);
assert.match(themeInputs, /aria-label="Tema escuro"/);

const summary = summarize(
	{
		lighthouseResult: {
			categories: {
				performance: { score: 0.94 },
				accessibility: { score: 0.89 },
			},
			audits: {
				'largest-contentful-paint': { displayValue: '1.2 s' },
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

console.log('web_performance=ok');
