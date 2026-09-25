import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstat, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(path.join(root, 'config', 'ai-review.json'), 'utf8'));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const toPosix = (value) => value.split(path.sep).join('/');

const parseArgs = (argv) => {
	const result = { files: [] };
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === '--file') result.files.push(argv[++index]);
		else if (argument.startsWith('--')) result[argument.slice(2)] = argv[++index];
		else throw new Error(`AI_REVIEW_ARGUMENTO_INVALIDO:${argument}`);
	}
	return result;
};

const assertConfig = () => {
	if (config.schema !== 1 || !Array.isArray(config.roots) || !Array.isArray(config.extensions) ||
		![config.maxFiles, config.maxFileBytes, config.maxTotalBytes].every(Number.isSafeInteger)) {
		throw new Error('AI_REVIEW_CONFIG_INVALIDA');
	}
};

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const verifyRef = (ref, name) => {
	if (!ref || !/^[A-Za-z0-9._/@{}^~:+-]+$/.test(ref)) throw new Error(`AI_REVIEW_${name.toUpperCase()}_INVALIDO`);
	try { return git(['rev-parse', '--verify', `${ref}^{commit}`]); }
	catch { throw new Error(`AI_REVIEW_${name.toUpperCase()}_INVALIDO`); }
};

export const parseChangedPaths = (raw) => {
	const tokens = String(raw || '').split('\0');
	if (tokens.at(-1) === '') tokens.pop();
	const changes = [];
	for (let index = 0; index < tokens.length;) {
		const status = tokens[index++];
		if (!status) continue;
		if (/^[RC]/.test(status)) {
			const from = tokens[index++];
			const target = tokens[index++];
			changes.push({ status: status[0], from, path: target });
		} else {
			changes.push({ status: status[0], path: tokens[index++] });
		}
	}
	return changes;
};

export const changedPaths = (base, head) => {
	const baseCommit = verifyRef(base, 'base');
	const headCommit = verifyRef(head, 'head');
	let raw;
	try {
		raw = execFileSync('git', ['diff', '--name-status', '-z', '--find-renames', `${baseCommit}...${headCommit}`], {
			cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
		});
	} catch {
		throw new Error('AI_REVIEW_COMPARACAO_INVALIDA');
	}
	return { base: baseCommit, head: headCommit, changes: parseChangedPaths(raw) };
};

const within = (parent, target) => {
	const relative = path.relative(parent, target);
	return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
};

export const classifyPath = async (candidate) => {
	const normalized = toPosix(String(candidate || '').replace(/^\.\//, ''));
	if (!normalized || normalized.includes('\0') || path.isAbsolute(normalized) || normalized.split('/').includes('..')) {
		return { path: normalized, selected: false, reason: 'path_inseguro' };
	}
	const extension = path.extname(normalized).toLowerCase();
	if (!config.extensions.includes(extension)) return { path: normalized, selected: false, reason: 'extensao_fora_do_escopo' };
	const rootName = config.roots.find((entry) => normalized === entry || normalized.startsWith(`${entry}/`));
	if (!rootName) return { path: normalized, selected: false, reason: 'root_fora_do_escopo' };
	const absolute = path.resolve(root, normalized);
	try {
		const metadata = await lstat(absolute);
		if (metadata.isSymbolicLink()) return { path: normalized, selected: false, reason: 'symlink' };
		if (!metadata.isFile()) return { path: normalized, selected: false, reason: 'nao_regular' };
		const resolved = await realpath(absolute);
		const resolvedRoot = await realpath(path.join(root, rootName));
		if (!within(resolvedRoot, resolved)) return { path: normalized, selected: false, reason: 'escape_do_root' };
		if (metadata.size > config.maxFileBytes) return { path: normalized, selected: false, reason: 'arquivo_excede_limite', bytes: metadata.size };
		return { path: normalized, selected: true, bytes: metadata.size, absolute };
	} catch (error) {
		if (error.code === 'ENOENT') return { path: normalized, selected: false, reason: 'ausente_ou_removido' };
		throw error;
	}
};

const reviewPrompt = (manifest) => `# Revisão assistida por IA\n\n` +
	`Revise somente os ${manifest.selected.length} arquivos listados em manifest.json. A saída é parecer, nunca edição.\n\n` +
	`## Autoridade\n\n` +
	`1. AGENTS.md e .ia.rules/resources/editorial-authoring.md\n` +
	`2. RCFs/revisao-automatizada-por-ia.md\n` +
	`3. RCFs/bate-papo.md quando houver síntese conversacional\n` +
	`4. RCFs/carregamento-progressivo.md quando front matter, COVER, OG ou overlay forem materiais\n` +
	`5. demais sub-RCFs disparadas pelo conteúdo\n\n` +
	`## Contrato de saída\n\n` +
	`Para cada achado informe arquivo, região, severidade, norma, explicação e sugestão. Distinga texto humano de síntese conversacional, preserve voz e substância, explique termos técnicos necessários na primeira ocorrência e não invente fatos, fontes, consenso ou intenção. Não modifique arquivos, Git, PR, issue, publicação ou upstream.\n`;

export const prepareReviewPackage = async ({ base = '', head = '', files = [], output = '' }) => {
	assertConfig();
	const comparison = files.length ? { base: '', head: '', changes: files.map((file) => ({ status: 'M', path: file })) } : changedPaths(base, head);
	const classified = [];
	for (const change of comparison.changes) {
		if (change.status === 'D') classified.push({ path: change.path, selected: false, reason: 'removido', status: change.status });
		else classified.push({ ...await classifyPath(change.path), status: change.status, from: change.from || '' });
	}
	const selected = classified.filter((entry) => entry.selected);
	if (selected.length > config.maxFiles) throw new Error(`AI_REVIEW_LIMITE_ARQUIVOS:${selected.length}:${config.maxFiles}`);
	const totalBytes = selected.reduce((sum, entry) => sum + entry.bytes, 0);
	if (totalBytes > config.maxTotalBytes) throw new Error(`AI_REVIEW_LIMITE_BYTES:${totalBytes}:${config.maxTotalBytes}`);

	const outputDirectory = path.resolve(root, output || config.outputDirectory);
	if (outputDirectory === root || !within(root, outputDirectory)) throw new Error('AI_REVIEW_SAIDA_INVALIDA');
	await rm(outputDirectory, { recursive: true, force: true });
	await mkdir(path.join(outputDirectory, 'articles'), { recursive: true });
	const selectedManifest = [];
	for (const entry of selected.sort((left, right) => left.path.localeCompare(right.path))) {
		const bytes = await readFile(entry.absolute);
		const destination = path.join(outputDirectory, 'articles', ...entry.path.split('/'));
		await mkdir(path.dirname(destination), { recursive: true });
		await writeFile(destination, bytes, { flag: 'wx' });
		selectedManifest.push({ path: entry.path, status: entry.status, from: entry.from || '', bytes: bytes.length, sha256: sha256(bytes) });
	}
	const manifest = {
		schema: 1,
		base: comparison.base,
		head: comparison.head,
		provider: { status: 'pending', reason: 'nenhum provedor configurado' },
		limits: { maxFiles: config.maxFiles, maxFileBytes: config.maxFileBytes, maxTotalBytes: config.maxTotalBytes },
		selected: selectedManifest,
		excluded: classified.filter((entry) => !entry.selected).map(({ path: filePath, status, reason }) => ({ path: filePath, status, reason })),
		totalBytes,
	};
	await writeFile(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
	await writeFile(path.join(outputDirectory, 'REVIEW.md'), reviewPrompt(manifest), 'utf8');
	return { manifest, outputDirectory };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		const args = parseArgs(process.argv.slice(2));
		const result = await prepareReviewPackage(args);
		process.stdout.write(`ai_review=prepared selected=${result.manifest.selected.length} excluded=${result.manifest.excluded.length} bytes=${result.manifest.totalBytes} provider=pending output=${toPosix(path.relative(root, result.outputDirectory))}\n`);
	} catch (error) {
		process.stderr.write(`${error.message}\n`);
		process.exitCode = 1;
	}
}
