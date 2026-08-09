#!/usr/bin/env node

/* Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const metadataPath = resolve(repositoryRoot, 'config', 'code-metadata.json');
const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));

const summary = [
	`Fonte: ${metadata.repository}`,
	`Autor: ${metadata.author.name} — ${metadata.author.url}`,
	`Licença: ${metadata.license.spdx} — ${metadata.license.url} — ${metadata.license.summary}.`,
].join(' | ');

const commentFor = (path) => {
	const extension = extname(path).toLowerCase();

	if (['.js', '.css'].includes(extension)) {
		return `/*! ${summary} */`;
	}

	throw new Error(`HEADER_FORMAT_UNSUPPORTED:${extension || 'sem-extensao'}`);
};

const inject = async (relativePath) => {
	const path = resolve(repositoryRoot, relativePath);
	const source = await readFile(path, 'utf8');
	const header = commentFor(path);
	const withoutBom = source.replace(/^\uFEFF/, '');
	const lines = withoutBom.split(/\r?\n/);
	const shebang = lines[0]?.startsWith('#!') ? lines.shift() : '';
	const body = lines
		.join('\n')
		.replace(/^\/\*! Fonte: https:\/\/github\.com\/sitiojeancarloem\/blog[^\n]*\*\/\n*/u, '');
	const output = `${shebang ? `${shebang}\n` : ''}${header}\n${body}`;

	await writeFile(path, output, 'utf8');
};

const targets = process.argv.slice(2);

if (targets.length === 0) {
	throw new Error('HEADER_TARGET_REQUIRED');
}

for (const target of targets) {
	await inject(target);
}

process.stdout.write(`headers=ok files=${targets.length}\n`);
