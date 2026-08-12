import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
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

const config = JSON.parse(await readFile(configPath, 'utf8'));
if (config.schema !== 1 || !Number.isInteger(config.height) || config.height !== 630) {
	throw new Error('SOCIAL_IMAGE_CONFIG_INVALIDA');
}

let previous = { schema: 1, parameters: {}, assets: {} };
try {
	previous = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
	if (error.code !== 'ENOENT') throw error;
}

const parameters = {
	height: config.height,
	jpegQuality: config.jpegQuality,
	pngCompressionLevel: config.pngCompressionLevel,
};
const parametersSha256 = sha256(Buffer.from(JSON.stringify(parameters)));
const next = { schema: 1, parameters, assets: {} };
let changed = 0;

for (const definition of config.assets) {
	const sourcePath = path.join(root, definition.source);
	const sourceBytes = await readFile(sourcePath);
	const sourceStat = await stat(sourcePath);
	const sourceSha256 = sha256(sourceBytes);
	const current = previous.assets?.[definition.canonical];
	const currentTarget = current?.target ? path.join(root, current.target.replace(/^\//, '')) : null;
	let currentValid = Boolean(
		current &&
		current.source === definition.source &&
		current.sourceSha256 === sourceSha256 &&
		current.sourceBytes === sourceBytes.length &&
		current.parametersSha256 === parametersSha256 &&
		current.height === config.height &&
		currentTarget,
	);
	if (currentValid) {
		try {
			const targetBytes = await readFile(currentTarget);
			currentValid = targetBytes.length === current.targetBytes && sha256(targetBytes) === current.targetSha256;
		} catch (error) {
			if (error.code !== 'ENOENT') throw error;
			currentValid = false;
		}
	}
	if (currentValid) {
		next.assets[definition.canonical] = current;
		continue;
	}
	if (checkOnly) throw new Error(`SOCIAL_IMAGE_DESATUALIZADA:${definition.id}`);

	const input = sharp(sourceBytes, { density: 192 }).rotate();
	const metadata = await input.metadata();
	if (!metadata.width || !metadata.height) throw new Error(`SOCIAL_IMAGE_DIMENSAO_AUSENTE:${definition.id}`);
	const width = Math.max(1, Math.round((metadata.width * config.height) / metadata.height));
	const resized = input.resize({ width, height: config.height, fit: 'fill', kernel: sharp.kernel.lanczos3 });
	const png = await resized.clone().png({ compressionLevel: config.pngCompressionLevel, adaptiveFiltering: true }).toBuffer();
	const jpeg = await resized.clone().flatten({ background: '#ffffff' }).jpeg({ quality: config.jpegQuality, mozjpeg: true }).toBuffer();
	const selected = jpeg.length < png.length ? { bytes: jpeg, extension: 'jpg', mediaType: 'image/jpeg' } : { bytes: png, extension: 'png', mediaType: 'image/png' };
	const targetPath = path.join(outputDirectory, `${definition.id}-og.${selected.extension}`);
	await mkdir(outputDirectory, { recursive: true });
	await writeFile(targetPath, selected.bytes);
	if (currentTarget && currentTarget !== targetPath) {
		try {
			await unlink(currentTarget);
		} catch (error) {
			if (error.code !== 'ENOENT') throw error;
		}
	}
	next.assets[definition.canonical] = {
		source: definition.source,
		sourceSha256,
		sourceBytes: sourceBytes.length,
		sourceMtimeUtc: sourceStat.mtime.toISOString(),
		parametersSha256,
		target: toPublic(targetPath),
		targetSha256: sha256(selected.bytes),
		targetBytes: selected.bytes.length,
		mediaType: selected.mediaType,
		width,
		height: config.height,
		generatedAtUtc: new Date().toISOString(),
	};
	changed += 1;
}

if (Object.keys(next.assets).length !== config.assets.length) throw new Error('SOCIAL_IMAGE_CARDINALIDADE_INVALIDA');
if (!checkOnly) await writeFile(manifestPath, `${JSON.stringify(next, null, '\t')}\n`, 'utf8');
process.stdout.write(`social_images=ok assets=${Object.keys(next.assets).length} changed=${changed}\n`);
