/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repositoryRoot, 'src', 'jcem-print-ieee');
const distRoot = path.join(packageRoot, 'dist');
const publicRoot = path.join(repositoryRoot, 'assets', 'jcem', 'print-ieee');
const profileName = 'ieee-conference-a4-ieeetran-1.8b.json';
const metadata = JSON.parse(
	await readFile(path.join(repositoryRoot, 'config', 'code-metadata.json'), 'utf8'),
);
const profile = JSON.parse(
	await readFile(path.join(packageRoot, 'profiles', profileName), 'utf8'),
);
const banner = `/*! Fonte: ${metadata.repository} | Autor: ${metadata.author.name} — ${metadata.author.url} | Licença: ${metadata.license.spdx} — ${metadata.license.url} — ${metadata.license.summary}. */`;

const fail = (message) => {
	throw new Error(`Perfil de impressão inválido: ${message}`);
};

if (profile.schema !== 1) fail('schema não suportado');
if (profile.id !== profileName.replace(/\.json$/, '')) fail('identificador divergente');
if (profile.authority.referenceArchiveSha256.length !== 64) fail('hash ausente');
if (profile.page.paper !== 'A4' || profile.page.scalePercent !== 100) {
	fail('papel ou escala divergente');
}
if (profile.columns.count !== 2 || profile.columns.gapMm !== 4.2175) {
	fail('composição de colunas divergente');
}
if (profile.classification.automaticMaximum !== 'nativo-preparado') {
	fail('limite automático de conformidade divergente');
}

await mkdir(path.join(distRoot, 'profiles'), { recursive: true });
await mkdir(path.join(publicRoot, 'profiles'), { recursive: true });

const compiledPath = path.join(distRoot, 'index.js');
let compiled = await readFile(compiledPath, 'utf8');
if (!compiled.startsWith(banner)) {
	compiled = `${banner}\n${compiled.replace(/^\/\*!.*?\*\/\s*/s, '')}`;
	await writeFile(compiledPath, compiled, 'utf8');
}

const cssSource = await readFile(path.join(packageRoot, 'styles', 'ieee.css'), 'utf8');
const css = cssSource.startsWith(banner)
	? cssSource
	: `${banner}\n${cssSource.replace(/^\/\*!.*?\*\/\s*/s, '')}`;
const profileText = `${JSON.stringify(profile, null, '\t')}\n`;
const adapterCss = await readFile(
	path.join(packageRoot, 'adapters', 'jekyll-blog.css'),
	'utf8',
);

await writeFile(path.join(distRoot, 'ieee.css'), css, 'utf8');
await writeFile(path.join(distRoot, 'profiles', profileName), profileText, 'utf8');
await copyFile(path.join(repositoryRoot, 'LICENSE'), path.join(packageRoot, 'LICENSE'));
await writeFile(path.join(publicRoot, 'index.js'), compiled, 'utf8');
await writeFile(path.join(publicRoot, 'ieee.css'), css, 'utf8');
await writeFile(path.join(publicRoot, 'jekyll-blog.css'), adapterCss, 'utf8');
await writeFile(path.join(publicRoot, 'profiles', profileName), profileText, 'utf8');

process.stdout.write(`print_profile=${profile.id} state=${profile.classification.automaticMaximum}\n`);
