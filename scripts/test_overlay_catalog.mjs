import assert from 'node:assert/strict';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseOverlayFilename, resolveOverlaySet } from './lib/overlay-catalog.mjs';

const root = path.join(os.tmpdir(), `jcem-overlay-${process.pid}-${Date.now()}`);
const touch = async (relative) => {
	const target = path.join(root, relative);
	await mkdir(path.dirname(target), { recursive: true });
	await writeFile(target, 'fixture');
};

try {
	assert.deepEqual(parseOverlayFilename('2026-wide.PNG'), {
		filename: '2026-wide.PNG', extension: '.png', year: 2026, kind: 'wide', qualifier: '',
	});
	assert.equal(parseOverlayFilename('2026 eventos-finais.png').qualifier, 'eventos-finais');
	assert.equal(parseOverlayFilename('sem-ano.png'), null);

	await touch('bate-papo/2025.png');
	await touch('bate-papo/2025-wide.png');
	await touch('bate-papo/primeiros-escritos/2026.png');
	await touch('bate-papo/primeiros-escritos/2026-wide.png');
	const dominant = await resolveOverlaySet({
		root, namespace: 'bate-papo', subnamespaces: ['primeiros-escritos'], document: '_posts/exemplo.md', now: '2026-09-24T00:00:00Z',
	});
	assert.equal(dominant.year, 2025, 'diretório superior não dominou o inferior');
	assert.equal(path.basename(dominant.portrait), '2025.png');

	await rm(path.join(root, 'bate-papo'), { recursive: true });
	await touch('bate-papo/primeiros-escritos/2025.png');
	await touch('bate-papo/primeiros-escritos/2025-wide.png');
	await touch('bate-papo/primeiros-escritos/2026-primeiros-escritos.png');
	await touch('bate-papo/primeiros-escritos/2026-primeiros-escritos-wide.png');
	const newest = await resolveOverlaySet({ root, namespace: 'bate-papo', subnamespaces: ['primeiros-escritos'] });
	assert.equal(newest.year, 2026);
	assert.match(newest.wide, /2026-primeiros-escritos-wide\.png$/);

	await touch('bate-papo/primeiros-escritos/2026_primeiros-escritos.png');
	await assert.rejects(
		resolveOverlaySet({ root, namespace: 'bate-papo', subnamespaces: ['primeiros-escritos'], document: 'ambiguo.md', now: '2026-09-24T00:00:00Z' }),
		(error) => error.code === 'OVERLAY_AMBIGUO' && error.details.document === 'ambiguo.md' && error.details.candidates.length >= 3,
	);

	await rm(path.join(root, 'bate-papo'), { recursive: true });
	await touch('bate-papo/primeiros-escritos/2026.png');
	await assert.rejects(
		resolveOverlaySet({ root, namespace: 'bate-papo', subnamespaces: ['primeiros-escritos'] }),
		(error) => error.code === 'OVERLAY_PAR_INCOMPLETO' && Boolean(error.details.correction),
	);

	assert.equal(await resolveOverlaySet({ root, namespace: 'artigo-sem-overlay' }), null);
	await assert.rejects(resolveOverlaySet({ root, namespace: '../fora' }), /OVERLAY_CONTEXTO_INVALIDO/);
	console.log('overlay_catalog=ok dominance=1 newest=1 ambiguity=1 incomplete=1 absent=1 traversal=1');
} finally {
	await rm(root, { recursive: true, force: true });
}
