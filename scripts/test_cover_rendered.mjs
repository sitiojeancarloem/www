import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.env.JCEM_SITE_ROOT || '_site');

const html = async (mode) =>
	readFile(path.join(root, '_fixtures', 'covers', mode, 'index.html'), 'utf8');

const count = (source, pattern) => source.match(pattern)?.length || 0;

const legacy = await html('legacy');
const content = await html('content');
const single = await html('wide-single');
const triptych = await html('wide-triptych');

assert.equal(count(legacy, /<div class="page__hero"/g), 1, 'hero legado ausente ou duplicado');
assert.equal(count(legacy, /\sdata-jcem-legacy-hero(?:\s|>)/g), 1, 'controle adaptativo do hero legado ausente');
assert.equal(count(legacy, /jcem-featured-image--(?:content|single|triptych)/g), 0, 'hero legado reclassificado');

assert.equal(count(content, /<div class="page__hero"/g), 0, 'content duplicou hero legado');
assert.equal(count(content, /jcem-featured-image--content/g), 1, 'content ausente ou duplicado');
assert.equal(count(content, /jcem-featured-image__surface/g), 0, 'content manteve superficie artificial');
assert.equal(count(content, /jcem-featured-image__stage jcem-skeleton/g), 1, 'skeleton do content nao esta no stage');
assert.equal(count(content, /jcem-featured-image--(?:single|triptych)/g), 0, 'wide vazou para content');

assert.equal(
	count(single, /<figure class="jcem-featured-image jcem-featured-image--wide jcem-featured-image--single"/g),
	1,
	'wide single ausente ou duplicado',
);
assert.equal(count(single, /jcem-featured-image__surface/g), 0, 'wide single manteve superficie artificial');
assert.equal(count(single, /jcem-featured-image__side--/g), 0, 'segmentos triplos vazaram para single');

assert.equal(count(triptych, /jcem-featured-image--triptych/g), 1, 'wide triptych ausente');
assert.equal(count(triptych, /jcem-featured-image__surface--wide/g), 1, 'superficie tripla ausente');
assert.equal(count(triptych, /jcem-featured-image__side--left/g), 1, 'segmento left ausente');
assert.equal(count(triptych, /jcem-featured-image__center/g), 1, 'segmento central ausente');
assert.equal(count(triptych, /jcem-featured-image__side--right/g), 1, 'segmento right ausente');

for (const [mode, source] of Object.entries({ content, single, triptych })) {
	assert.doesNotMatch(source, /jcem-featured-image[^>]*src="\/assets\/images\/social\//, `${mode} exibiu derivado social`);
	assert.equal(count(source, /data-jcem-title-bar="upper"/g), 1, `${mode} sem barra superior única`);
	assert.equal(count(source, /data-jcem-title-bar="lower"/g), 1, `${mode} sem barra inferior única`);
	const upper = source.match(/data-jcem-title-bar="upper"[\s\S]*?data-jcem-title-bar="lower"/)?.[0] || '';
	const lower = source.match(/data-jcem-title-bar="lower"[\s\S]*?<\/div>\s*<\/div>\s*<div class="jcem-post-header__meta">/)?.[0] || '';
	assert.doesNotMatch(upper, /<h1 id="page-title"/, `${mode} manteve título na barra superior`);
	assert.match(lower, /<h1 id="page-title"/, `${mode} não colocou título na barra inferior`);
}

console.log('cover_rendered=ok modes=4 leakage=0');
