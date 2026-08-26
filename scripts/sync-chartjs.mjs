/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const packagePath = path.join(root, 'node_modules', 'chart.js', 'package.json');
const sourcePath = path.join(root, 'node_modules', 'chart.js', 'dist', 'chart.umd.min.js');
const targetDirectory = path.join(root, 'assets', 'jcem', 'lib', 'chartjs');
const targetPath = path.join(targetDirectory, 'chart.umd.min.js');
const expectedVersion = '4.5.1';
const metadata = JSON.parse(await readFile(packagePath, 'utf8'));

if (metadata.version !== expectedVersion || metadata.license !== 'MIT') {
	throw new Error(
		`CHARTJS_PROVENIENCIA_INVALIDA versao=${metadata.version} licenca=${metadata.license}`,
	);
}

await mkdir(targetDirectory, { recursive: true });
await copyFile(sourcePath, targetPath);
console.log(`chartjs_asset=ok version=${metadata.version} target=${path.relative(root, targetPath)}`);
