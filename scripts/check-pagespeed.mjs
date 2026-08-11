/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — código aberto, sem garantia. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'pagespeed.json');
const cacheRoot = path.join(root, '.jekyll-cache', 'pagespeed');

export const validateConfig = (config) => {
	if (
		config?.schema !== 1 ||
		!Number.isFinite(config.minimumScore) ||
		!Array.isArray(config.targets) ||
		!config.targets.length
	) throw new Error('PAGESPEED_CONFIG_INVALIDA');
	const ids = new Set();
	for (const target of config.targets) {
		if (!target.id || !String(target.path).startsWith('/') || ids.has(target.id)) {
			throw new Error(`PAGESPEED_TARGET_INVALIDO:${target.id || ''}`);
		}
		ids.add(target.id);
	}
	return config;
};

const cacheFile = (url, strategy, categories) => {
	const key = createHash('sha256')
		.update(JSON.stringify({ url, strategy, categories }))
		.digest('hex');
	return path.join(cacheRoot, `${key}.json`);
};

const readCache = async (file, maxAgeMs) => {
	try {
		const payload = JSON.parse(await readFile(file, 'utf8'));
		return Date.now() - Date.parse(payload.fetchedAt) <= maxAgeMs ? payload : null;
	} catch {
		return null;
	}
};

export const summarize = (payload, target, strategy, minimumScore) => {
	const categories = Object.fromEntries(
		Object.entries(payload.lighthouseResult?.categories || {}).map(([id, value]) => [
			id,
			Math.round(Number(value.score || 0) * 100),
		]),
	);
	const audits = payload.lighthouseResult?.audits || {};
	const vitals = Object.fromEntries(
		['largest-contentful-paint', 'cumulative-layout-shift', 'interaction-to-next-paint', 'speed-index']
			.filter((id) => audits[id])
			.map((id) => [id, audits[id].displayValue || audits[id].numericValue]),
	);
	const failing = Object.entries(categories)
		.filter(([, score]) => score < minimumScore)
		.map(([id]) => id);
	return { target: target.id, url: target.url, strategy, categories, vitals, failing, ok: failing.length === 0 };
};

const fetchResult = async (target, strategy, categories, maxAgeMs, force) => {
	const file = cacheFile(target.url, strategy, categories);
	if (!force) {
		const cached = await readCache(file, maxAgeMs);
		if (cached) return { payload: cached.payload, cache: 'hit' };
	}
	const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
	endpoint.searchParams.set('url', target.url);
	endpoint.searchParams.set('strategy', strategy);
	for (const category of categories) endpoint.searchParams.append('category', category);
	const response = await fetch(endpoint, { signal: AbortSignal.timeout(120000) });
	if (!response.ok) throw new Error(`PAGESPEED_HTTP_${response.status}`);
	const payload = await response.json();
	await mkdir(cacheRoot, { recursive: true });
	await writeFile(file, JSON.stringify({ fetchedAt: new Date().toISOString(), payload }), 'utf8');
	return { payload, cache: 'miss' };
};

export const run = async (argv = process.argv.slice(2)) => {
	const config = validateConfig(JSON.parse(await readFile(configPath, 'utf8')));
	const baseUrl = argv.find((value) => value.startsWith('--base-url='))?.slice(11) || 'https://www.jeancarloem.com';
	const only = argv.find((value) => value.startsWith('--target='))?.slice(9);
	const force = argv.includes('--force');
	const targets = config.targets
		.filter((target) => !only || target.id === only)
		.map((target) => ({ ...target, url: new URL(target.path, baseUrl).href }));
	if (!targets.length) throw new Error(`PAGESPEED_TARGET_AUSENTE:${only}`);
	const maxAgeMs = config.cacheMaxAgeHours * 3600000;
	const results = [];
	for (const target of targets) {
		for (const strategy of config.strategies) {
			const { payload, cache } = await fetchResult(target, strategy, config.categories, maxAgeMs, force);
			results.push({ ...summarize(payload, target, strategy, config.minimumScore), cache });
		}
	}
	console.log(JSON.stringify({ schema: 1, minimumScore: config.minimumScore, results }));
	if (results.some((result) => !result.ok)) process.exitCode = 1;
	return results;
};

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
	await run();
}
