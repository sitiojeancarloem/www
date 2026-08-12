/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — código aberto, sem garantia. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'pagespeed.json');
const cacheRoot = path.join(root, '.jekyll-cache', 'pagespeed');
const retryableStatuses = new Set([500, 502, 503, 504]);

export const isRetryablePageSpeedStatus = (status) => retryableStatuses.has(Number(status));
export const isRetryablePageSpeedError = (error) =>
	error?.name === 'TimeoutError' || error?.name === 'AbortError';

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const validateConfig = (config) => {
	if (
		config?.schema !== 2 ||
		!Number.isFinite(config.minimumScore) ||
		!Number.isInteger(config.concurrency) ||
		config.concurrency < 1 ||
		config.concurrency > 4 ||
		!Array.isArray(config.layouts) ||
		!config.layouts.length
	) throw new Error('PAGESPEED_CONFIG_INVALIDA');
	const layoutIds = new Set();
	const sampleIds = new Set();
	for (const layout of config.layouts) {
		if (!layout.id || layoutIds.has(layout.id) || !Array.isArray(layout.samples) || layout.samples.length < 2) {
			throw new Error(`PAGESPEED_LAYOUT_INVALIDO:${layout.id || ''}`);
		}
		if (layout.categories && (
			!Array.isArray(layout.categories) ||
			!layout.categories.length ||
			layout.categories.some((category) => !config.categories.includes(category))
		)) throw new Error(`PAGESPEED_CATEGORIAS_INVALIDAS:${layout.id}`);
		layoutIds.add(layout.id);
		for (const sample of layout.samples) {
			if (!sample.id || !String(sample.path).startsWith('/') || sampleIds.has(sample.id)) {
				throw new Error(`PAGESPEED_AMOSTRA_INVALIDA:${sample.id || ''}`);
			}
			sampleIds.add(sample.id);
		}
	}
	return config;
};

const median = (values) => {
	const sorted = [...values].sort((left, right) => left - right);
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

export const aggregateLayouts = (results, minimumScore) => {
	const groups = new Map();
	for (const result of results) {
		const key = `${result.layout}\0${result.strategy}`;
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(result);
	}
	return [...groups.values()].map((samples) => {
		const categories = Object.fromEntries(
			Object.keys(samples[0].categories).map((category) => [
				category,
				Math.round(median(samples.map((sample) => sample.categories[category])) * 10) / 10,
			]),
		);
		const failing = Object.entries(categories)
			.filter(([, score]) => score < minimumScore)
			.map(([category]) => category);
		return {
			layout: samples[0].layout,
			strategy: samples[0].strategy,
			categories,
			samples: samples.map(({ target, url, categories: sampleCategories }) => ({
				target,
				url,
				categories: sampleCategories,
			})),
			failing,
			ok: failing.length === 0,
		};
	});
};

const cacheFile = (url, strategy, categories) => {
	const key = createHash('sha256')
		.update(JSON.stringify({ url, strategy, categories }))
		.digest('hex');
	return path.join(cacheRoot, `${key}.json`);
};

export const createEndpoint = (target, strategy, categories, apiKey = '') => {
	const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
	endpoint.searchParams.set('url', target.url);
	endpoint.searchParams.set('strategy', strategy);
	for (const category of categories) endpoint.searchParams.append('category', category);
	if (apiKey) endpoint.searchParams.set('key', apiKey);
	return endpoint;
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
		[
			'first-contentful-paint',
			'largest-contentful-paint',
			'total-blocking-time',
			'cumulative-layout-shift',
			'interaction-to-next-paint',
			'speed-index',
		]
			.filter((id) => audits[id])
			.map((id) => [id, audits[id].displayValue || audits[id].numericValue]),
	);
	const diagnostics = Object.fromEntries(
		[
			'lcp-breakdown-insight',
			'lcp-discovery-insight',
			'render-blocking-resources',
			'render-blocking-insight',
			'document-latency-insight',
			'dom-size-insight',
			'forced-reflow-insight',
			'image-delivery-insight',
			'cache-insight',
			'font-display-insight',
			'legacy-javascript-insight',
			'unused-css-rules',
			'unused-javascript',
			'modern-image-formats',
			'uses-responsive-images',
			'uses-optimized-images',
			'server-response-time',
			'mainthread-work-breakdown',
			'bootup-time',
			'network-dependency-tree',
		]
			.filter((id) =>
				audits[id] &&
				(
					audits[id].score === null ||
					Number(audits[id].score) < 0.9
				),
			)
			.map((id) => {
				const details = Array.isArray(audits[id].details?.items)
					? audits[id].details.items.slice(0, 6).map((item) => ({
						phase: item.phase,
						duration: item.duration ?? item.timing,
						selector: item.node?.selector,
						label: item.node?.nodeLabel,
					}))
					: undefined;
				return [id, {
					score: Math.round(Number(audits[id].score || 0) * 100),
					value: audits[id].displayValue || audits[id].title,
					...(details?.length ? { details } : {}),
				}];
			}),
	);
	const failing = Object.entries(categories)
		.filter(([, score]) => score < minimumScore)
		.map(([id]) => id);
	return {
		layout: target.layout,
		target: target.id,
		url: target.url,
		strategy,
		categories,
		vitals,
		diagnostics,
		failing,
		ok: failing.length === 0,
	};
};

const fetchResult = async (target, strategy, categories, maxAgeMs, force, apiKey) => {
	const file = cacheFile(target.url, strategy, categories);
	if (!force) {
		const cached = await readCache(file, maxAgeMs);
		if (cached) return { payload: cached.payload, cache: 'hit' };
	}
	const endpoint = createEndpoint(target, strategy, categories, apiKey);
	let response;
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		try {
			response = await fetch(endpoint, { signal: AbortSignal.timeout(120000) });
		} catch (error) {
			if (!isRetryablePageSpeedError(error) || attempt === 3) {
				throw new Error(`PAGESPEED_TIMEOUT:${target.id}:${strategy}`, { cause: error });
			}
			await wait(attempt * 2000);
			continue;
		}
		if (response.ok) break;
		if (!isRetryablePageSpeedStatus(response.status) || attempt === 3) {
			throw new Error(`PAGESPEED_HTTP_${response.status}`);
		}
		await wait(attempt * 2000);
	}
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
	const apiKey = process.env.PAGESPEED_API_KEY?.trim() || '';
	const targets = config.layouts.flatMap((layout) =>
		layout.samples.map((sample) => ({
			...sample,
			layout: layout.id,
			categories: layout.categories,
			url: new URL(sample.path, baseUrl).href,
		})),
	).filter((target) => !only || target.layout === only || target.id === only);
	if (!targets.length) throw new Error(`PAGESPEED_TARGET_AUSENTE:${only}`);
	const maxAgeMs = config.cacheMaxAgeHours * 3600000;
	const tasks = targets.flatMap((target) =>
		config.strategies.map((strategy) => ({ target, strategy })),
	);
	const results = new Array(tasks.length);
	let cursor = 0;
	const worker = async () => {
		while (cursor < tasks.length) {
			const index = cursor;
			cursor += 1;
			const { target, strategy } = tasks[index];
			const categories = target.categories || config.categories;
			const { payload, cache } = await fetchResult(
				target,
				strategy,
				categories,
				maxAgeMs,
				force,
				apiKey,
			);
			const result = { ...summarize(payload, target, strategy, config.minimumScore), cache };
			results[index] = result;
			console.error(
				`pagespeed_progress target=${target.id} strategy=${strategy} performance=${result.categories.performance ?? 'n/a'} ok=${result.ok}`,
			);
		}
	};
	await Promise.all(
		Array.from({ length: Math.min(config.concurrency, tasks.length) }, worker),
	);
	const layouts = aggregateLayouts(results, config.minimumScore);
	console.log(JSON.stringify({ schema: 2, minimumScore: config.minimumScore, layouts, results }));
	if (layouts.some((layout) => !layout.ok)) process.exitCode = 1;
	return results;
};

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
	await run();
}
