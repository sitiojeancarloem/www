import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedPaths, classifyPath, parseChangedPaths, prepareReviewPackage } from './review-articles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = path.join(root, '_pages', '.ai-review-test');
const output = '.tmp-ai-review-test';
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const writeFixture = async (name, content = '---\ntitle: Fixture\npublished: false\n---\n\nTexto.\n') => {
	const target = path.join(fixtureRoot, name);
	await mkdir(path.dirname(target), { recursive: true });
	await writeFile(target, content);
	return path.relative(root, target).split(path.sep).join('/');
};

try {
	const parsed = parseChangedPaths('M\0_posts/a.md\0R100\0_drafts/antes.md\0_drafts/depois.md\0D\0_pages/removida.md\0');
	assert.deepEqual(parsed, [
		{ status: 'M', path: '_posts/a.md' },
		{ status: 'R', from: '_drafts/antes.md', path: '_drafts/depois.md' },
		{ status: 'D', path: '_pages/removida.md' },
	]);

	const article = await writeFixture('artigo.md');
	const unrelated = await writeFixture('ignorado.txt', 'fora');
	assert.equal((await classifyPath(article)).selected, true);
	assert.equal((await classifyPath('../segredo.md')).reason, 'path_inseguro');
	assert.equal((await classifyPath('README.md')).reason, 'root_fora_do_escopo');
	assert.equal((await classifyPath(unrelated)).reason, 'extensao_fora_do_escopo');
	assert.equal((await classifyPath('_pages/ausente.md')).reason, 'ausente_ou_removido');

	const symlinkPath = path.join(fixtureRoot, 'atalho.md');
	let symlinkCovered = false;
	try {
		await symlink(path.join(fixtureRoot, 'artigo.md'), symlinkPath, 'file');
		assert.equal((await classifyPath(path.relative(root, symlinkPath))).reason, 'symlink');
		symlinkCovered = true;
	} catch (error) {
		if (!['EPERM', 'EACCES', 'UNKNOWN', 'EISDIR'].includes(error.code)) throw error;
		const source = await readFile(path.join(root, 'scripts', 'review-articles.mjs'), 'utf8');
		assert.match(source, /metadata\.isSymbolicLink\(\)/);
	}

	const originalPath = path.join(root, article);
	const before = sha256(await readFile(originalPath));
	const prepared = await prepareReviewPackage({ files: [article, '_pages/ausente.md', 'README.md'], output });
	assert.deepEqual(prepared.manifest.selected.map((entry) => entry.path), [article]);
	assert.deepEqual(prepared.manifest.excluded.map((entry) => entry.reason).sort(), ['ausente_ou_removido', 'root_fora_do_escopo']);
	assert.equal(prepared.manifest.provider.status, 'pending');
	assert.equal(sha256(await readFile(originalPath)), before, 'preparação alterou o corpus');
	assert.equal(sha256(await readFile(path.join(root, output, 'articles', article))), before, 'cópia do pacote divergiu');
	const prompt = await readFile(path.join(root, output, 'REVIEW.md'), 'utf8');
	assert.match(prompt, /parecer, nunca edição/);
	assert.match(prompt, /Distinga texto humano de síntese conversacional/);

	const oversized = await writeFixture('grande.md', 'x'.repeat(524289));
	assert.equal((await classifyPath(oversized)).reason, 'arquivo_excede_limite');

	const many = [];
	for (let index = 0; index < 41; index += 1) many.push(await writeFixture(`muitos/${index}.md`));
	await assert.rejects(prepareReviewPackage({ files: many, output }), /AI_REVIEW_LIMITE_ARQUIVOS/);

	const total = [];
	for (let index = 0; index < 9; index += 1) total.push(await writeFixture(`total/${index}.md`, 'x'.repeat(500000)));
	await assert.rejects(prepareReviewPackage({ files: total, output }), /AI_REVIEW_LIMITE_BYTES/);
	assert.throws(() => changedPaths('ref-inexistente', 'HEAD'), /AI_REVIEW_BASE_INVALIDO/);

	const workflow = await readFile(path.join(root, '.github', 'workflows', 'ai-article-review.yml'), 'utf8');
	assert.match(workflow, /permissions:\s*\n\s*contents: read/);
	assert.match(workflow, /persist-credentials: false/);
	assert.match(workflow, /actions\/checkout@[a-f0-9]{40}/);
	assert.match(workflow, /actions\/upload-artifact@[a-f0-9]{40}/);
	assert.doesNotMatch(workflow, /pull_request_target|secrets\.|contents: write|\bpush:/);

	const proposal = await readFile(path.join(root, 'docs', 'propostas-upstream', 'revisao-editorial-portavel.md'), 'utf8');
	assert.doesNotMatch(proposal, /AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/);
	assert.doesNotMatch(proposal, /jeancarloem\.com|sitiojeancarloem|D:\\trampo|C:\\Users/i);
	assert.match(proposal, /jcempro\/agents\.md\/issues\/14/);
	const publication = JSON.parse(await readFile(path.join(root, 'docs', 'propostas-upstream', 'revisao-editorial-portavel.publicacao.json'), 'utf8'));
	assert.equal(publication.issue, 14);
	assert.equal(publication.status, 'published_open');
	assert.equal(publication.technicalAttachment.authorization, 'explicit_human_follow_up');
	const attachment = await readFile(path.join(root, 'docs', 'propostas-upstream', 'revisao-editorial-portavel-anexo.md'), 'utf8');
	assert.doesNotMatch(attachment, /AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/);
	assert.doesNotMatch(attachment, /jeancarloem\.com|sitiojeancarloem|D:\\trampo|C:\\Users/i);
	assert.match(attachment, /Norma de referência/);
	assert.match(attachment, /Workflow de referência/);
	assert.match(attachment, /Seleção segura e pacote determinístico/);

	console.log(`ai_article_review=ok selection=1 rename=1 removal=1 traversal=1 symlink=${symlinkCovered ? 'runtime' : 'source'} limits=2 provider=pending upstream=local`);
} finally {
	await rm(fixtureRoot, { recursive: true, force: true });
	await rm(path.join(root, output), { recursive: true, force: true });
}
