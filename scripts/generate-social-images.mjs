import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { resolveOverlaySet } from './lib/overlay-catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'social-images.json');
const manifestPath = path.join(root, '_data', 'jcem_social_images.json');
const outputDirectory = path.join(root, 'assets', 'images', 'social');
const checkOnly = process.argv.includes('--check');

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const toPublic = (filePath) => `/${path.relative(root, filePath).split(path.sep).join('/')}`;
const stableJson = (value) => `${JSON.stringify(value, null, '\t')}\n`;
const canonicalSourceBytes = (sourcePath, bytes) => path.extname(sourcePath).toLowerCase() === '.svg'
	? Buffer.from(bytes.toString('utf8').replace(/\r\n?/g, '\n'), 'utf8')
	: bytes;
const publicSource = (value) => {
	const raw = String(value || '').trim().replace(/^['"]|['"]$/g, '');
	return /^\/[A-Za-z0-9_./ -]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(raw) ? raw : '';
};

const yamlScalar = (value) => {
	const raw = String(value || '').trim();
	if (!raw || raw === '|' || raw === '>') return '';
	if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw.slice(1, -1);
	return raw.replace(/\s+#.*$/, '').trim();
};

const blockFor = (lines, key, parent = null) => {
	let parentBlock = { start: -1, end: lines.length, indent: -1 };
	if (parent) {
		parentBlock = blockFor(lines, parent);
		if (!parentBlock) return null;
	}
	for (let index = parentBlock.start + 1; index < parentBlock.end; index += 1) {
		const line = lines[index];
		if (!line.trim() || line.trimStart().startsWith('#')) continue;
		const indent = line.match(/^\s*/)[0].length;
		if (indent <= parentBlock.indent) break;
		const match = line.trim().match(new RegExp(`^${key}:\\s*(.*)$`));
		if (!match) continue;
		let end = index + 1;
		for (; end < parentBlock.end; end += 1) {
			const nested = lines[end];
			if (!nested.trim() || nested.trimStart().startsWith('#')) continue;
			if (nested.match(/^\s*/)[0].length <= indent) break;
		}
		return { start: index, end, indent, scalar: yamlScalar(match[1]) };
	}
	return null;
};

const nestedBlockFor = (lines, parents, key) => {
	let currentLines = lines;
	let offset = 0;
	for (const parent of parents) {
		const block = blockFor(currentLines, parent);
		if (!block) return null;
		offset += block.start + 1;
		currentLines = currentLines.slice(block.start + 1, block.end);
	}
	const block = blockFor(currentLines, key);
	return block ? { ...block, start: offset + block.start, end: offset + block.end } : null;
};

const valueFor = (lines, parents, key) => nestedBlockFor(lines, parents, key)?.scalar || '';
const listFor = (lines, key) => {
	const block = blockFor(lines, key);
	if (!block) return [];
	return lines.slice(block.start + 1, block.end)
		.map((line) => line.trim().match(/^-\s+(.+)$/)?.[1])
		.filter(Boolean)
		.map(yamlScalar);
};

const documentDescriptor = (frontMatter, document) => {
	const lines = frontMatter.split(/\r?\n/);
	const namespace = blockFor(lines, 'content_namespace')?.scalar || '';
	const subnamespaces = listFor(lines, 'content_subnamespaces');
	const featured = blockFor(lines, 'featured_image');
	const visible = publicSource(
		(featured?.scalar || valueFor(lines, ['featured_image'], 'path') || valueFor(lines, ['featured_image'], 'url') ||
		valueFor(lines, ['featured_image'], 'src') || valueFor(lines, ['featured_image'], 'image')) ||
		valueFor(lines, ['header'], 'image') || valueFor(lines, ['header'], 'overlay_image')
	);
	const wide = publicSource(valueFor(lines, ['cover', 'og'], 'wide_source'));
	const portrait = publicSource(
		valueFor(lines, ['cover', 'og'], 'portrait_source') || valueFor(lines, ['cover', 'og'], 'square_source')
	);
	return { document, namespace, subnamespaces, sources: [...new Set([visible, wide, portrait].filter(Boolean))] };
};

const discoverDocuments = async () => {
	const descriptors = [];
	const visit = async (directory) => {
		let entries = [];
		try { entries = await readdir(directory, { withFileTypes: true }); }
		catch (error) { if (error.code === 'ENOENT') return; throw error; }
		for (const entry of entries) {
			const target = path.join(directory, entry.name);
			if (entry.isDirectory()) await visit(target);
			else if (/\.md$/i.test(entry.name)) {
				const raw = await readFile(target, 'utf8');
				const frontMatter = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
				if (frontMatter) descriptors.push(documentDescriptor(frontMatter, path.relative(root, target).split(path.sep).join('/')));
			}
		}
	};
	for (const directory of ['_posts', '_pages', '_drafts']) await visit(path.join(root, directory));
	return descriptors;
};

const config = JSON.parse(await readFile(configPath, 'utf8'));
if (
	config.schema !== 3 ||
	config.wide?.width !== 1200 || config.wide?.height !== 630 ||
	config.portrait?.width !== 1080 || config.portrait?.height !== 1350 ||
	config.cover?.format !== 'webp' || !config.overlayRoot || !config.creator || !config.license
) throw new Error('SOCIAL_IMAGE_CONFIG_INVALIDA');

let previous = { schema: 3, parameters: {}, assets: {} };
let previousRaw = '';
try {
	previousRaw = await readFile(manifestPath, 'utf8');
	previous = JSON.parse(previousRaw);
} catch (error) {
	if (error.code !== 'ENOENT') throw error;
}

let publicationDomain = '';
try { publicationDomain = (await readFile(path.join(root, 'CNAME'), 'utf8')).trim(); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const rights = {
	license: config.license,
	licenseUrl: config.licenseUrl,
	creator: config.creator,
	publicationSite: publicationDomain ? `https://${publicationDomain}` : '',
};
const parameters = {
	wide: config.wide,
	portrait: config.portrait,
	cover: config.cover,
	jpegQuality: config.jpegQuality,
	pngCompressionLevel: config.pngCompressionLevel,
	peripheralBlur: config.peripheralBlur,
	composition: 'blurred-periphery-with-contained-original',
	foregroundBackground: 'transparent',
	foregroundFeatherPercent: 3,
	rights,
};
const parametersSha256 = sha256(Buffer.from(JSON.stringify(parameters)));
const next = { schema: 3, parameters, assets: {} };
let changed = 0;

const descriptors = await discoverDocuments();
const definitions = new Map(config.assets.map((definition) => [definition.source, { ...definition, contexts: new Map() }]));
for (const descriptor of descriptors) {
	for (const source of descriptor.sources) {
		const relativeSource = source.replace(/^\/+/, '');
		if (!definitions.has(relativeSource)) {
			const basename = path.basename(relativeSource, path.extname(relativeSource)).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
			definitions.set(relativeSource, {
				id: `cover-${basename}-${sha256(Buffer.from(relativeSource)).slice(0, 8)}`,
				canonical: `/${relativeSource}`,
				source: relativeSource,
				contexts: new Map(),
			});
		}
		if (descriptor.namespace) {
			const key = [descriptor.namespace, ...descriptor.subnamespaces].join('/');
			definitions.get(relativeSource).contexts.set(key, descriptor);
		}
	}
}

const renderCanvas = async (sourceBytes, size, overlayBytes = null) => {
	const background = await sharp(sourceBytes, { density: 192 }).rotate()
		.resize(size.width, size.height, { fit: 'cover', position: 'centre' })
		.blur(config.peripheralBlur).toBuffer();
	const foregroundBase = await sharp(sourceBytes, { density: 192 }).rotate()
		.resize(size.width, size.height, { fit: 'contain', position: 'centre', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png().toBuffer();
	const feather = Buffer.from(`<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="0.03" stop-color="white"/><stop offset="0.97" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="0.03" stop-color="white"/><stop offset="0.97" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#v)"/><rect width="100%" height="100%" fill="url(#h)" style="mix-blend-mode:multiply"/></svg>`);
	const foreground = await sharp(foregroundBase).composite([{ input: feather, blend: 'dest-in' }]).png().toBuffer();
	const layers = [{ input: foreground, gravity: 'centre' }];
	if (overlayBytes) {
		const overlay = await sharp(overlayBytes).rotate().resize(size.width, size.height, { fit: 'fill' }).png().toBuffer();
		layers.push({ input: overlay, gravity: 'centre' });
	}
	return sharp(background).composite(layers).png().toBuffer();
};

const encodeSocial = async (canvas) => {
	const png = await sharp(canvas).png({ compressionLevel: config.pngCompressionLevel, adaptiveFiltering: true }).toBuffer();
	const jpeg = await sharp(canvas).flatten({ background: '#ffffff' }).jpeg({ quality: config.jpegQuality, mozjpeg: true }).toBuffer();
	return jpeg.length < png.length
		? { bytes: jpeg, extension: 'jpg', mediaType: 'image/jpeg' }
		: { bytes: png, extension: 'png', mediaType: 'image/png' };
};

const validVariant = async (variant, expected) => {
	if (!variant || Object.entries(expected).some(([key, value]) => variant[key] !== value) || !variant.target) return false;
	try {
		const targetBytes = await readFile(path.join(root, variant.target.replace(/^\//, '')));
		return targetBytes.length === variant.targetBytes && sha256(targetBytes) === variant.targetSha256;
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
		return false;
	}
};

const buildVariant = async ({ kind, id, source, sourceBytes, sourceStat, size, overlay, current, contextKey = '', cover = false }) => {
	const sourceSha256 = sha256(sourceBytes);
	const overlayBytes = overlay ? await readFile(overlay.path) : null;
	const overlaySha256 = overlayBytes ? sha256(overlayBytes) : '';
	const expected = {
		source,
		sourceSha256,
		sourceBytes: sourceBytes.length,
		parametersSha256,
		overlaySource: overlay ? toPublic(overlay.path) : '',
		overlaySha256,
		width: size.width,
		height: size.height,
	};
	if (await validVariant(current, expected)) return current;
	if (checkOnly) throw new Error(`SOCIAL_IMAGE_DESATUALIZADA:${id}:${kind}:${contextKey || 'base'}`);

	const canvas = await renderCanvas(sourceBytes, size, overlayBytes);
	const selected = cover
		? { bytes: await sharp(canvas).webp({ quality: config.cover.quality, smartSubsample: true }).toBuffer(), extension: 'webp', mediaType: 'image/webp' }
		: await encodeSocial(canvas);
	const contextSuffix = contextKey ? `-${sha256(Buffer.from(contextKey)).slice(0, 10)}` : '';
	const targetPath = path.join(outputDirectory, `${id}${contextSuffix}-${cover ? 'cover' : `og-${kind}`}.${selected.extension}`);
	await mkdir(outputDirectory, { recursive: true });
	await writeFile(targetPath, selected.bytes);
	if (current?.target) {
		const oldTarget = path.join(root, current.target.replace(/^\//, ''));
		if (oldTarget !== targetPath) {
			try { await unlink(oldTarget); } catch (error) { if (error.code !== 'ENOENT') throw error; }
		}
	}
	changed += 1;
	return {
		...expected,
		sourceMtimeUtc: sourceStat.mtime.toISOString(),
		creationDate: (sourceStat.birthtimeMs > 0 ? sourceStat.birthtime : sourceStat.mtime).toISOString(),
		...rights,
		target: toPublic(targetPath),
		targetSha256: sha256(selected.bytes),
		targetBytes: selected.bytes.length,
		mediaType: selected.mediaType,
		generatedAtUtc: new Date().toISOString(),
	};
};

const overlayFor = async (descriptor) => {
	const resolved = await resolveOverlaySet({
		root: path.join(root, config.overlayRoot),
		namespace: descriptor.namespace,
		subnamespaces: descriptor.subnamespaces,
		document: descriptor.document,
	});
	if (!resolved) return null;
	for (const [kind, expected] of [['wide', 40 / 21], ['portrait', 4 / 5]]) {
		const metadata = await sharp(resolved[kind]).metadata();
		if (!metadata.width || !metadata.height || Math.abs(metadata.width / metadata.height - expected) > 0.01) {
			throw new Error(`OVERLAY_PROPORCAO_INVALIDA:${descriptor.document}:${kind}:${resolved[kind]}`);
		}
	}
	return resolved;
};

for (const definition of [...definitions.values()].sort((left, right) => left.canonical.localeCompare(right.canonical))) {
	const wideSource = definition.source;
	const portraitSource = definition.portraitSource || definition.squareSource || definition.source;
	const widePath = path.join(root, wideSource);
	const portraitPath = path.join(root, portraitSource);
	const wideBytes = canonicalSourceBytes(widePath, await readFile(widePath));
	const portraitBytes = portraitPath === widePath ? wideBytes : canonicalSourceBytes(portraitPath, await readFile(portraitPath));
	const wideStat = await stat(widePath);
	const portraitStat = portraitPath === widePath ? wideStat : await stat(portraitPath);
	const current = previous.assets?.[definition.canonical] || {};
	const record = {
		wide: await buildVariant({ kind: 'wide', id: definition.id, source: wideSource, sourceBytes: wideBytes, sourceStat: wideStat, size: config.wide, current: current.wide }),
		portrait: await buildVariant({ kind: 'portrait', id: definition.id, source: portraitSource, sourceBytes: portraitBytes, sourceStat: portraitStat, size: config.portrait, current: current.portrait || current.square }),
		contexts: {},
	};
	for (const [contextKey, descriptor] of [...definition.contexts.entries()].sort()) {
		const overlay = await overlayFor(descriptor);
		if (!overlay) continue;
		const currentContext = current.contexts?.[contextKey] || {};
		record.contexts[contextKey] = {
			overlay: { year: overlay.year, directory: toPublic(overlay.directory), wide: toPublic(overlay.wide), portrait: toPublic(overlay.portrait) },
			wide: await buildVariant({ kind: 'wide', id: definition.id, source: wideSource, sourceBytes: wideBytes, sourceStat: wideStat, size: config.wide, overlay: { path: overlay.wide }, current: currentContext.wide, contextKey }),
			portrait: await buildVariant({ kind: 'portrait', id: definition.id, source: portraitSource, sourceBytes: portraitBytes, sourceStat: portraitStat, size: config.portrait, overlay: { path: overlay.portrait }, current: currentContext.portrait, contextKey }),
			cover: await buildVariant({ kind: 'cover', id: definition.id, source: wideSource, sourceBytes: wideBytes, sourceStat: wideStat, size: config.cover, overlay: { path: overlay.wide }, current: currentContext.cover, contextKey, cover: true }),
		};
	}
	next.assets[definition.canonical] = record;
}

if (Object.keys(next.assets).length !== definitions.size) throw new Error('SOCIAL_IMAGE_CARDINALIDADE_INVALIDA');
const expectedTargets = new Set();
for (const record of Object.values(next.assets)) {
	for (const variant of [record.wide, record.portrait]) if (variant?.target) expectedTargets.add(path.basename(variant.target));
	for (const context of Object.values(record.contexts || {})) {
		for (const variant of [context.wide, context.portrait, context.cover]) if (variant?.target) expectedTargets.add(path.basename(variant.target));
	}
}
for (const entry of await readdir(outputDirectory)) {
	if (!/(?:-og-(?:wide|portrait)|-cover)\.(?:jpe?g|png|webp)$/i.test(entry) || expectedTargets.has(entry)) continue;
	if (checkOnly) throw new Error(`SOCIAL_IMAGE_LEGADA:${entry}`);
	await unlink(path.join(outputDirectory, entry));
	changed += 1;
}
const nextRaw = stableJson(next);
if (!checkOnly && nextRaw !== previousRaw) await writeFile(manifestPath, nextRaw, 'utf8');
const variants = Object.values(next.assets).reduce((count, record) => count + 2 + Object.keys(record.contexts || {}).length * 3, 0);
process.stdout.write(`social_images=ok assets=${Object.keys(next.assets).length} variants=${variants} changed=${changed}\n`);
