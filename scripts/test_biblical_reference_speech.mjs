/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
import assert from 'node:assert/strict';
import {
	formatBiblicalReferenceLong,
	formatBiblicalReferenceShort,
	normalizeBiblicalReferences,
	parseBiblicalReferences,
} from '../assets/jcem/js/biblical-reference-speech.js';

const cases = [
	{
		input: 'Gênesis 2:7',
		short: 'Gênesis, 2, 7',
		long: 'Gênesis, capítulo 2, versículo 7',
	},
	{
		input: 'Apocalipse 14:12',
		short: 'Apocalipse, 14, 12',
		long: 'Apocalipse, capítulo 14, versículo 12',
	},
	{
		input: 'Gênesis 2:7-8,15',
		short: 'Gênesis, 2, 7 a 8, e 15',
		long: 'Gênesis, capítulo 2, versículos de 7 a 8 e o versículo 15',
	},
	{
		input: 'Apocalipse 14:12,22;15:3-7;16:1,3 e 5',
		short: 'Apocalipse, 14, 12, 22; 15, 3 a 7; 16, 1, 3 e 5',
		long: 'Apocalipse, capítulo 14, versículos 12 e 22; capítulo 15, versículos de 3 a 7; capítulo 16, versículos 1, 3 e 5',
	},
	{
		input: 'Êxodo 12:1-3,7',
		short: 'Êxodo, 12, 1 a 3, e 7',
		long: 'Êxodo, capítulo 12, versículos de 1 a 3 e o versículo 7',
	},
	{
		input: '1 Coríntios 13:4,7 e 13',
		short: '1 Coríntios, 13, 4, 7 e 13',
		long: '1 Coríntios, capítulo 13, versículos 4, 7 e 13',
	},
	{
		input: 'Sl 23:1 NVI',
		short: 'Sl, 23, 1, NVI',
		long: 'Sl, capítulo 23, versículo 1, NVI',
	},
	{
		input: 'Cântico dos Cânticos 2:1,3',
		short: 'Cântico dos Cânticos, 2, 1, 3',
		long: 'Cântico dos Cânticos, capítulo 2, versículos 1 e 3',
	},
	{
		input: 'II Coríntios 11:14',
		short: 'II Coríntios, 11, 14',
		long: 'II Coríntios, capítulo 11, versículo 14',
	},
	{
		input: 'I João 2:3-6',
		short: 'I João, 2, 3 a 6',
		long: 'I João, capítulo 2, versículos de 3 a 6',
	},
	{
		input: 'Genesis 2:7',
		short: 'Genesis, 2, 7',
		long: 'Genesis, capítulo 2, versículo 7',
	},
];

for (const fixture of cases) {
	const references = parseBiblicalReferences(fixture.input);
	assert.equal(references.length, 1, `referência não reconhecida: ${fixture.input}`);
	assert.equal(formatBiblicalReferenceShort(references[0]), fixture.short);
	assert.equal(formatBiblicalReferenceLong(references[0]), fixture.long);
	assert.equal(normalizeBiblicalReferences(fixture.input, 'short'), fixture.short);
	assert.equal(normalizeBiblicalReferences(fixture.input, 'long'), fixture.long);
	assert.doesNotMatch(fixture.short, /\b(?:para|por|até|capítulo|versículo)\b/iu);
	assert.doesNotMatch(fixture.long, /\b(?:para|por|até)\b/iu);
}

const complex = parseBiblicalReferences('Apocalipse 14:12,22;15:3-7;16:1,3 e 5')[0];
assert.deepEqual(complex.groups, [
	{ chapter: '14', items: [{ start: '12', end: null }, { start: '22', end: null }], separators: ['comma'] },
	{ chapter: '15', items: [{ start: '3', end: '7' }], separators: [] },
	{ chapter: '16', items: [{ start: '1', end: null }, { start: '3', end: null }, { start: '5', end: null }], separators: ['comma', 'and'] },
]);

assert.equal(normalizeBiblicalReferences('Às 14:30, razão 2:7 e escala 1:20.', 'long'), 'Às 14:30, razão 2:7 e escala 1:20.');
assert.equal(normalizeBiblicalReferences('Gênesis 2:7:30', 'short'), 'Gênesis 2:7:30');
assert.equal(normalizeBiblicalReferences('Gênesis 0:7', 'short'), 'Gênesis 0:7');
assert.equal(
	normalizeBiblicalReferences('Compare Gênesis 2:7 e Romanos 8:1-2;9:3.', 'short'),
	'Compare Gênesis, 2, 7 e Romanos, 8, 1 a 2; 9, 3.',
);

console.log(`biblical_reference_speech=ok cases=${cases.length}`);
