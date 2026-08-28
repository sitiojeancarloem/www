import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'social-images.json');
const manifestPath = path.join(root, '_data', 'jcem_social_images.json');
const outputDirectory = path.join(root, 'assets', 'images', 'social');
const checkOnly = process.argv.includes('--check');

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const toPublic = (filePath) => `/${path.relative(root, filePath).split(path.sep).join('/')}`;
const stableJson = (value) => `${JSON.stringify(value, null, '\t')}\n`;

const config = JSON.parse(await readFile(configPath, 'utf8'));
if (
	config.schema !== 2 ||
	config.wide?.width !== 1200 || config.wide?.height !== 630 ||
	config.square?.width !== 400 || config.square?.height !== 400
) throw new Error('SOCIAL_IMAGE_CONFIG_INVALIDA');

let previous = { schema: 2, parameters: {}, assets: {} };
let previousRaw = '';
try {
	previousRaw = await readFile(manifestPath, 'utf8');
	previous = JSON.parse(previousRaw);
} catch (error) {
	if (error.code !== 'ENOENT') throw error;
}

const parameters = {
	wide: config.wide,
	square: config.square,
	jpegQuality: config.jpegQuality,
	pngCompressionLevel: config.pngCompressionLevel,
	peripheralBlur: config.peripheralBlur,
	composition: 'blurred-periphery-with-contained-original',
	foregroundBackground: 'transparent',
	foregroundFeatherPercent: 3,
};
const parametersSha256 = sha256(Buffer.from(JSON.stringify(parameters)));
const next = { schema: 2, parameters, assets: {} };
let changed = 0;

const renderVariant = async (sourceBytes, size) => {
	const background = await sharp(sourceBytes, { density: 192 })
		.rotate()
		.resize(size.width, size.height, { fit: 'cover', position: 'centre' })
		.blur(config.peripheralBlur)
		.toBuffer();
	const foregroundBase = await sharp(sourceBytes, { density: 192 })
		.rotate()
		.resize(size.width, size.height, {
			fit: 'contain',
			position: 'centre',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.png()
		.toBuffer();
	const feather = Buffer.from(`<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="0.03" stop-color="white"/><stop offset="0.97" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="0.03" stop-color="white"/><stop offset="0.97" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#v)"/><rect width="100%" height="100%" fill="url(#h)" style="mix-blend-mode:multiply"/></svg>`);
	const foreground = await sharp(foregroundBase)
		.composite([{ input: feather, blend: 'dest-in' }])
		.png()
		.toBuffer();
	const composed = sharp(background).composite([{ input: foreground, gravity: 'centre' }]);
	const png = await composed.clone().png({ compressionLevel: config.pngCompressionLevel, adaptiveFiltering: true }).toBuffer();
	const jpeg = await composed.clone().flatten({ background: '#ffffff' }).jpeg({ quality: config.jpegQuality, mozjpeg: true }).toBuffer();
	return jpeg.length < png.length
		? { bytes: jpeg, extension: 'jpg', mediaType: 'image/jpeg' }
		: { bytes: png, extension: 'png', mediaType: 'image/png' };
};

const validateVariant = async (variant, definition, sourceSha256, sourceBytes, size) => {
	if (!variant || variant.source !== definition.source || variant.sourceSha256 !== sourceSha256 ||
		variant.sourceBytes !== sourceBytes.length || variant.parametersSha256 !== parametersSha256 ||
		variant.width !== size.width || variant.height !== size.height || !variant.target) return false;
	try {
		const targetBytes = await readFile(path.join(root, variant.target.replace(/^\//, '')));
		return targetBytes.length === variant.targetBytes && sha256(targetBytes) === variant.targetSha256;
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
		return false;
	}
};

const buildVariant = async (kind, definition, sourceBytes, sourceStat, sourceSha256, size, current) => {
	if (await validateVariant(current, definition, sourceSha256, sourceBytes, size)) return current;
	if (checkOnly) throw new Error(`SOCIAL_IMAGE_DESATUALIZADA:${definition.id}:${kind}`);

	const selected = await renderVariant(sourceBytes, size);
	const targetPath = path.join(outputDirectory, `${definition.id}-og-${kind}.${selected.extension}`);
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
		source: definition.source,
		sourceSha256,
		sourceBytes: sourceBytes.length,
		sourceMtimeUtc: sourceStat.mtime.toISOString(),
		parametersSha256,
		target: toPublic(targetPath),
		targetSha256: sha256(selected.bytes),
		targetBytes: selected.bytes.length,
		mediaType: selected.mediaType,
		width: size.width,
		height: size.height,
		generatedAtUtc: new Date().toISOString(),
	};
};

for (const definition of config.assets) {
	const wideDefinition = definition;
	const squareDefinition = { ...definition, source: definition.squareSource || definition.source };
	const wideSourcePath = path.join(root, wideDefinition.source);
	const squareSourcePath = path.join(root, squareDefinition.source);
	const wideSourceBytes = await readFile(wideSourcePath);
	const squareSourceBytes = squareSourcePath === wideSourcePath ? wideSourceBytes : await readFile(squareSourcePath);
	const wideSourceStat = await stat(wideSourcePath);
	const squareSourceStat = squareSourcePath === wideSourcePath ? wideSourceStat : await stat(squareSourcePath);
	const wideSourceSha256 = sha256(wideSourceBytes);
	const squareSourceSha256 = squareSourcePath === wideSourcePath ? wideSourceSha256 : sha256(squareSourceBytes);
	const current = previous.schema === 2 ? previous.assets?.[definition.canonical] : null;
	next.assets[definition.canonical] = {
		wide: await buildVariant('wide', wideDefinition, wideSourceBytes, wideSourceStat, wideSourceSha256, config.wide, current?.wide),
		square: await buildVariant('square', squareDefinition, squareSourceBytes, squareSourceStat, squareSourceSha256, config.square, current?.square),
	};
}

if (Object.keys(next.assets).length !== config.assets.length) throw new Error('SOCIAL_IMAGE_CARDINALIDADE_INVALIDA');
for (const entry of await readdir(outputDirectory)) {
	if (!/-og\.(?:jpe?g|png)$/i.test(entry)) continue;
	if (checkOnly) throw new Error(`SOCIAL_IMAGE_LEGADA:${entry}`);
	await unlink(path.join(outputDirectory, entry));
	changed += 1;
}
const nextRaw = stableJson(next);
if (!checkOnly && nextRaw !== previousRaw) await writeFile(manifestPath, nextRaw, 'utf8');
process.stdout.write(`social_images=ok assets=${Object.keys(next.assets).length} variants=${Object.keys(next.assets).length * 2} changed=${changed}\n`);
