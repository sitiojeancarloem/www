/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

const MODULE_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(MODULE_PATH), '..');
const IMAGE_REFERENCE = /(?:https?:\/\/[^\s"'<>)]*)?(\/assets\/images\/[^\s"'<>)]*?\.(?:gif|jpe?g|png|svg|webp))(?:[?#][^\s"'<>)]*)?/giu;
const SUPPORTED_EXTENSIONS = new Set(['.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp']);

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const rounded = (value, digits = 6) => Number(value.toFixed(digits));

const stableObject = (value) => {
	if (Array.isArray(value)) return value.map(stableObject);
	if (!value || typeof value !== 'object') return value;
	return Object.fromEntries(
		Object.entries(value)
			.sort(([left], [right]) => left.localeCompare(right, 'en'))
			.map(([key, item]) => [key, stableObject(item)]),
	);
};

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const listFiles = async (directory) => {
	let entries;
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error?.code === 'ENOENT') return [];
		throw error;
	}
	const nested = await Promise.all(
		entries.map((entry) => {
			const absolute = path.join(directory, entry.name);
			return entry.isDirectory() ? listFiles(absolute) : [absolute];
		}),
	);
	return nested.flat();
};

export const collectReferencedImages = async (repositoryRoot, sourceDirectories) => {
	const files = (
		await Promise.all(sourceDirectories.map((directory) => listFiles(path.join(repositoryRoot, directory))))
	)
		.flat()
		.filter((filePath) => ['.html', '.md', '.markdown'].includes(path.extname(filePath).toLowerCase()));
	const references = new Set();
	for (const filePath of files) {
		const source = await readFile(filePath, 'utf8');
		for (const match of source.matchAll(IMAGE_REFERENCE)) references.add(match[1]);
	}
	return [...references].sort((left, right) => left.localeCompare(right, 'en'));
};

const parseSvgLength = (value) => {
	const match = String(value || '').trim().match(/^([0-9]+(?:\.[0-9]+)?)(?:px)?$/iu);
	return match ? Number(match[1]) : 0;
};

const svgDimensions = (document) => {
	const root = document.documentElement;
	const width = parseSvgLength(root.getAttribute('width'));
	const height = parseSvgLength(root.getAttribute('height'));
	if (width > 0 && height > 0) return { width, height };
	const viewBox = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/u).map(Number);
	if (viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
		return { width: viewBox[2], height: viewBox[3] };
	}
	return { width: 0, height: 0 };
};

const analyzeSvg = (buffer, configuration) => {
	const dom = new JSDOM(buffer.toString('utf8'), { contentType: 'image/svg+xml' });
	const { document } = dom.window;
	const dimensions = svgDimensions(document);
	const textElements = [...document.querySelectorAll('text')];
	const textCharacters = textElements
		.map((element) => (element.textContent || '').replace(/\s+/gu, ' ').trim())
		.join('')
		.length;
	const detailElements = document.querySelectorAll(
		'path, line, polyline, polygon, circle, ellipse, rect, use',
	).length;
	const textEvidence =
		textElements.length >= configuration.minimumTextElements &&
		textCharacters >= configuration.minimumTextCharacters;
	const visualEvidence = detailElements >= configuration.minimumDetailElements;
	return {
		...dimensions,
		evidence: {
			text: textEvidence,
			visual: visualEvidence,
			textCharacters,
			textElements: textElements.length,
			detailElements,
		},
	};
};

const analyzeRaster = async (buffer, configuration) => {
	const image = sharp(buffer, { animated: false, failOn: 'error' });
	const metadata = await image.metadata();
	const width = Number(metadata.width || 0);
	const height = Number(metadata.height || 0);
	if (!(width > 0 && height > 0)) throw new Error('PRINT_IMAGE_DIMENSIONS_INVALID');
	const sample = image
		.clone()
		.resize({ width: configuration.sampleMaximumWidth, fit: 'inside', withoutEnlargement: true })
		.greyscale();
	const statistics = await sample.clone().stats();
	const { data } = await sample
		.clone()
		.convolve({
			width: 3,
			height: 3,
			kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0],
			scale: 1,
			offset: 128,
		})
		.raw()
		.toBuffer({ resolveWithObject: true });
	let edgePixels = 0;
	for (const value of data) {
		if (Math.abs(value - 128) >= configuration.edgeThreshold) edgePixels += 1;
	}
	const edgeDensity = data.length ? edgePixels / data.length : 0;
	const entropy = Number(statistics.entropy || 0);
	const visualEvidence =
		edgeDensity >= configuration.minimumEdgeDensity && entropy >= configuration.minimumEntropy;
	return {
		width,
		height,
		evidence: {
			text: false,
			visual: visualEvidence,
			edgeDensity: rounded(edgeDensity),
			entropy: rounded(entropy),
		},
	};
};

export const classifyGeometry = ({ width, height }, profile, maximumUsableHeightRatio) => {
	const usableHeightMm = profile.page.heightMm - profile.page.marginTopMm - profile.page.marginBottomMm;
	const projectedHeightMm = width > 0 ? (profile.columns.contentWidthMm * height) / width : Infinity;
	const maximumHeightMm = usableHeightMm * maximumUsableHeightRatio;
	return {
		aspectRatio: height > 0 ? rounded(width / height) : 0,
		maximumHeightMm: rounded(maximumHeightMm),
		projectedHeightMm: rounded(projectedHeightMm),
		usableHeightMm: rounded(usableHeightMm),
		eligible: width > height && projectedHeightMm <= maximumHeightMm + 1e-9,
	};
};

export const analyzeImageBuffer = async ({ buffer, extension, configuration, profile }) => {
	const normalizedExtension = extension.toLowerCase();
	const intrinsic = normalizedExtension === '.svg'
		? analyzeSvg(buffer, configuration.svg)
		: await analyzeRaster(buffer, configuration.raster);
	const geometry = classifyGeometry(
		intrinsic,
		profile,
		configuration.geometry.maximumUsableHeightRatio,
	);
	const informationEvidence = intrinsic.evidence.text || intrinsic.evidence.visual;
	const automatic = geometry.eligible && informationEvidence;
	return {
		width: intrinsic.width,
		height: intrinsic.height,
		geometry,
		evidence: intrinsic.evidence,
		autoFullWidth: automatic,
		reason: automatic
			? intrinsic.evidence.text
				? 'geometry-and-text-density'
				: 'geometry-and-visual-density'
			: !geometry.eligible
				? 'geometry-rejected'
				: 'information-density-insufficient',
	};
};

const loadCache = async (cachePath) => {
	try {
		const cache = await readJson(cachePath);
		return cache?.schema === 1 && cache.entries && typeof cache.entries === 'object'
			? cache
			: { schema: 1, entries: {} };
	} catch (error) {
		if (error?.code === 'ENOENT' || error instanceof SyntaxError) return { schema: 1, entries: {} };
		throw error;
	}
};

export const runAnalysis = async (options = {}) => {
	const repositoryRoot = path.resolve(options.repositoryRoot || DEFAULT_ROOT);
	const configPath = path.resolve(repositoryRoot, options.configPath || 'config/print-full-width.json');
	const profilePath = path.resolve(
		repositoryRoot,
		options.profilePath || 'src/jcem-print-ieee/profiles/ieee-conference-a4-ieeetran-1.8b.json',
	);
	const cachePath = path.resolve(
		repositoryRoot,
		options.cachePath || '.jekyll-cache/jcem-print-full-width.json',
	);
	const outputPath = path.resolve(
		repositoryRoot,
		options.outputPath || '_data/jcem_print_full_width.json',
	);
	const [configuration, profile] = await Promise.all([readJson(configPath), readJson(profilePath)]);
	if (configuration.schema !== 1 || !configuration.classifierVersion) {
		throw new Error('PRINT_FULL_WIDTH_CONFIG_INVALID');
	}
	if (profile.schema !== 1 || profile.columns?.count !== 2) {
		throw new Error('PRINT_FULL_WIDTH_PROFILE_INVALID');
	}
	const classifierKey = sha256(
		JSON.stringify(stableObject({
			classifierVersion: configuration.classifierVersion,
			geometry: configuration.geometry,
			page: profile.page,
			columns: profile.columns,
			raster: configuration.raster,
			svg: configuration.svg,
		})),
	);
	const references = options.references || await collectReferencedImages(
		repositoryRoot,
		configuration.sourceDirectories,
	);
	const cache = await loadCache(cachePath);
	const nextEntries = {};
	const assets = {};
	let analyzed = 0;
	let cacheHits = 0;
	for (const publicPath of references) {
		const extension = path.extname(publicPath).toLowerCase();
		if (!SUPPORTED_EXTENSIONS.has(extension)) continue;
		const absolutePath = path.resolve(repositoryRoot, `.${publicPath}`);
		if (!absolutePath.startsWith(repositoryRoot + path.sep)) continue;
		let buffer;
		try {
			buffer = await readFile(absolutePath);
		} catch (error) {
			if (error?.code === 'ENOENT') continue;
			throw error;
		}
		const sourceHash = sha256(buffer);
		const cached = cache.entries[publicPath];
		let analysis;
		if (cached?.sourceHash === sourceHash && cached?.classifierKey === classifierKey) {
			analysis = cached.analysis;
			cacheHits += 1;
		} else {
			analysis = await analyzeImageBuffer({ buffer, extension, configuration, profile });
			analyzed += 1;
		}
		assets[publicPath] = { ...analysis, sourceHash };
		nextEntries[publicPath] = { analysis, classifierKey, sourceHash };
	}
	const payload = stableObject({
		schema: 1,
		classifierVersion: configuration.classifierVersion,
		classifierKey,
		profileId: profile.id,
		assets,
	});
	await Promise.all([mkdir(path.dirname(cachePath), { recursive: true }), mkdir(path.dirname(outputPath), { recursive: true })]);
	await Promise.all([
		writeFile(cachePath, `${JSON.stringify({ schema: 1, entries: nextEntries }, null, 2)}\n`, 'utf8'),
		writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8'),
	]);
	return { analyzed, cacheHits, assets: Object.keys(assets).length, classifierKey };
};

if (process.argv[1] && path.resolve(process.argv[1]) === MODULE_PATH) {
	runAnalysis()
		.then((result) => {
			process.stdout.write(
				`print_full_width=ok assets=${result.assets} analyzed=${result.analyzed} cache_hits=${result.cacheHits} classifier=${result.classifierKey.slice(0, 12)}\n`,
			);
		})
		.catch((error) => {
			process.stderr.write(`${error.stack || error.message}\n`);
			process.exitCode = 1;
		});
}
