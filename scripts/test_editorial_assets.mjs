// Fonte: https://github.com/sitiojeancarloem/blog
// Autor: Jean Carlo EM — https://www.jeancarloem.com
// Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.

import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const roots = ['_posts', '_drafts'];
const files = [];
const walk = async (directory) => {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const target = path.join(directory, entry.name);
		if (entry.isDirectory()) await walk(target);
		else if (/\.md$/i.test(entry.name)) files.push(target);
	}
};
for (const root of roots) await walk(root);

const violations = [];
for (const file of files) {
	const source = await readFile(file, 'utf8');
	// Diretórios de recuperação também contêm Markdown intermediário sem front matter.
	// O contrato publicável alcança apenas documentos que o Jekyll reconhece como conteúdo.
	if (!/^---\s*\r?\n/.test(source)) continue;
	const patterns = [
		/^\s*(?:image|image_square|image_wide_left|image_wide_right|overlay_image):\s*['"]?https:\/\/web\.archive\.org/im,
		/!\[[^\]]*\]\(\s*https:\/\/web\.archive\.org/i,
		/<(?:img|source|video|audio|iframe)\b[^>]+\bsrc=['"]https:\/\/web\.archive\.org/i,
	];
	if (patterns.some((pattern) => pattern.test(source))) violations.push(file);
}
if (violations.length) throw new Error(`ASSET_EDITORIAL_WEB_ARCHIVE:${violations.join(',')}`);

const recoveryManifest = JSON.parse(await readFile('config/recovered-editorial-assets.json', 'utf8'));
if (recoveryManifest.schema !== 1 || !Array.isArray(recoveryManifest.assets)) {
	throw new Error('MANIFESTO_RECUPERACAO_INVALIDO');
}
for (const record of recoveryManifest.assets) {
	const normalized = path.normalize(record.local);
	if (path.isAbsolute(normalized) || normalized.startsWith(`..${path.sep}`) || !normalized.startsWith(`assets${path.sep}`)) {
		throw new Error(`ASSET_RECUPERADO_PATH_INVALIDO:${record.local}`);
	}
	const bytes = await readFile(normalized);
	const metadata = await sharp(bytes).metadata();
	const file = await stat(normalized);
	const hash = createHash('sha256').update(bytes).digest('hex');
	if (
		hash !== record.sha256 ||
		file.size !== record.bytes ||
		metadata.width !== record.width ||
		metadata.height !== record.height ||
		metadata.format !== record.format
	) {
		throw new Error(`ASSET_RECUPERADO_DIVERGENTE:${record.local}`);
	}
	if (
		!/^https:\/\//.test(record.original) ||
		!/^https:\/\//.test(record.recoverySource) ||
		!/^https:\/\//.test(record.recoveryAsset) ||
		!record.evidence
	) {
		throw new Error(`ASSET_RECUPERADO_SEM_PROVENIENCIA:${record.local}`);
	}
}

const responsive = await readFile('config/responsive-images.json', 'utf8');
const social = await readFile('config/social-images.json', 'utf8');
if (/"(?:source|canonical)"\s*:\s*"(?:https:\/\/web\.archive\.org|_site\/)/i.test(`${responsive}\n${social}`)) {
	throw new Error('MANIFESTO_ASSET_COM_ORIGEM_PROIBIDA');
}
const page404 = await readFile('404.main.html', 'utf8');
const noscript = await readFile('_includes/jcem/noscript-content.html', 'utf8');
if (!/pagina-404[^"']+\.webp/.test(page404) || !/sem-motor[^"']+\.jcem\.webp/.test(noscript)) {
	throw new Error('PAGINA_ESPECIAL_SEM_WEBP');
}
console.log(`editorial_assets=ok markdown=${files.length} recovered=${recoveryManifest.assets.length} special_webp=2`);
