import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

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
console.log(`editorial_assets=ok markdown=${files.length} special_webp=2`);
