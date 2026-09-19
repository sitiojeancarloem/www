/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */

const NAMED_BOOKS = [
	'Atos dos Apóstolos', 'Cântico dos Cânticos', 'Cânticos dos Cânticos',
	'1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas',
	'1 Coríntios', '2 Coríntios', '1 Tessalonicenses', '2 Tessalonicenses',
	'1 Timóteo', '2 Timóteo', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João',
	'1 Macabeus', '2 Macabeus',
	'1 Sm', '2 Sm', '1 Rs', '2 Rs', '1 Cr', '2 Cr', '1 Co', '2 Co', '1 Ts',
	'2 Ts', '1 Tm', '2 Tm', '1 Pe', '2 Pe', '1 Jo', '2 Jo', '3 Jo', '1 Mc', '2 Mc',
	'I Samuel', 'II Samuel', 'I Reis', 'II Reis', 'I Crônicas', 'II Crônicas',
	'I Coríntios', 'II Coríntios', 'I Tessalonicenses', 'II Tessalonicenses',
	'I Timóteo', 'II Timóteo', 'I Pedro', 'II Pedro', 'I João', 'II João', 'III João',
	'I Macabeus', 'II Macabeus', 'I Sm', 'II Sm', 'I Rs', 'II Rs', 'I Cr', 'II Cr',
	'I Co', 'II Co', 'I Ts', 'II Ts', 'I Tm', 'II Tm', 'I Pe', 'II Pe', 'I Jo',
	'II Jo', 'III Jo', 'I Mc', 'II Mc',
	'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes',
	'Rute', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmo', 'Salmos', 'Provérbios',
	'Eclesiastes', 'Cântico dos Cânticos', 'Isaías', 'Jeremias', 'Lamentações',
	'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miqueias',
	'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias', 'Mateus',
	'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', 'Gálatas', 'Efésios',
	'Filipenses', 'Colossenses', 'Tito', 'Filemom', 'Hebreus', 'Tiago', 'Judas',
	'Apocalipse', 'Tobias', 'Judite', 'Sabedoria', 'Eclesiástico', 'Sirácida',
	'Baruque', 'Cantares',
];

const ABBREVIATED_BOOKS = [
	'Gn', 'Êx', 'Ex', 'Lv', 'Nm', 'Dt', 'Js', 'Jz', 'Rt', 'Sm', 'Rs', 'Cr', 'Ed',
	'Ne', 'Et', 'Sl', 'Pv', 'Ec', 'Ct', 'Is', 'Jr', 'Lm', 'Ez', 'Dn', 'Os', 'Jl',
	'Am', 'Ob', 'Jn', 'Mq', 'Na', 'Hc', 'Sf', 'Ag', 'Zc', 'Ml', 'Mt', 'Mc', 'Lc',
	'Jo', 'At', 'Rm', 'Co', 'Gl', 'Ef', 'Fp', 'Cl', 'Ts', 'Tm', 'Tt', 'Fm', 'Hb',
	'Tg', 'Pe', 'Jd', 'Ap', 'Tb', 'Jt', 'Sb', 'Eclo', 'Sir', 'Br',
];

const VERSIONS = [
	'A21', 'ACF', 'ARA', 'ARC', 'AS21', 'BJ', 'BKJ', 'KJA', 'NAA', 'NTLH', 'NVI', 'RA',
	'NVT', 'TB', 'TEB', 'VFL',
];

const ACCENT_EQUIVALENTS = {
	á: 'a', â: 'a', ã: 'a', à: 'a', ç: 'c', é: 'e', ê: 'e', í: 'i',
	ó: 'o', ô: 'o', õ: 'o', ú: 'u',
};

const escapePattern = (value) => {
	let pattern = '';
	let previousSpace = false;
	for (const character of value) {
		if (/\s/u.test(character)) {
			if (!previousSpace) pattern += '\\s+';
			previousSpace = true;
			continue;
		}
		previousSpace = false;
		const lower = character.toLocaleLowerCase('pt-BR');
		pattern += ACCENT_EQUIVALENTS[lower]
			? `[${lower}${ACCENT_EQUIVALENTS[lower]}]`
			: character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	return pattern;
};

const bookPattern = [...new Set([...NAMED_BOOKS, ...ABBREVIATED_BOOKS])]
	.sort((left, right) => right.length - left.length)
	.map((book) => {
		const pattern = escapePattern(book);
		return ABBREVIATED_BOOKS.includes(book) ? `${pattern}\\.?` : pattern;
	})
	.join('|');

const BOOK_EXPRESSION = new RegExp(
	`(?<![\\p{L}\\p{N}])(${bookPattern})(?=\\s*\\d{1,3}\\s*:)`,
	'giu',
);
const VERSION_EXPRESSION = new RegExp(
	`^(?:\\s*\\((${VERSIONS.join('|')})\\)|\\s+(${VERSIONS.join('|')})(?![\\p{L}\\p{N}]))`,
	'iu',
);

const skipSpaces = (text, initial) => {
	let index = initial;
	while (/\s/u.test(text[index] || '')) index += 1;
	return index;
};

const readNumber = (text, initial) => {
	const index = skipSpaces(text, initial);
	const match = /^\d{1,3}/u.exec(text.slice(index));
	if (!match || Number(match[0]) < 1) return null;
	return { value: match[0], end: index + match[0].length };
};

const readAnd = (text, initial) => {
	const index = skipSpaces(text, initial);
	const match = /^e(?![\p{L}\p{N}])/iu.exec(text.slice(index));
	return match ? index + match[0].length : null;
};

const parseVerseItem = (text, initial) => {
	const start = readNumber(text, initial);
	if (!start) return null;
	let index = skipSpaces(text, start.end);
	if (!/[-–—]/u.test(text[index] || '')) return { start: start.value, end: null, next: start.end };
	const finish = readNumber(text, index + 1);
	if (!finish) return null;
	return { start: start.value, end: finish.value, next: finish.end };
};

const parseVerseList = (text, initial) => {
	const first = parseVerseItem(text, initial);
	if (!first) return null;
	const items = [{ start: first.start, end: first.end }];
	const separators = [];
	let index = first.next;

	while (index < text.length) {
		const separatorStart = index;
		const significant = skipSpaces(text, index);
		let separator = null;
		let afterSeparator = significant;
		if (text[significant] === ',') {
			separator = 'comma';
			afterSeparator = significant + 1;
		} else {
			const conjunctionEnd = readAnd(text, significant);
			if (conjunctionEnd !== null) {
				separator = 'and';
				afterSeparator = conjunctionEnd;
			}
		}
		if (!separator) break;

		const item = parseVerseItem(text, afterSeparator);
		if (!item || text[skipSpaces(text, item.next)] === ':') {
			index = separatorStart;
			break;
		}
		separators.push(separator);
		items.push({ start: item.start, end: item.end });
		index = item.next;
	}

	return { items, separators, next: index };
};

const parseGroup = (text, initial) => {
	const chapter = readNumber(text, initial);
	if (!chapter) return null;
	let index = skipSpaces(text, chapter.end);
	if (text[index] !== ':') return null;
	const verses = parseVerseList(text, index + 1);
	if (!verses) return null;
	return {
		chapter: chapter.value,
		items: verses.items,
		separators: verses.separators,
		next: verses.next,
	};
};

/** Interpreta grupos de uma referência após um livro já classificado. */
const parseReferenceBody = (text, initial) => {
	const first = parseGroup(text, initial);
	if (!first) return null;
	const groups = [{ chapter: first.chapter, items: first.items, separators: first.separators }];
	let index = first.next;

	while (index < text.length) {
		const separatorStart = index;
		const significant = skipSpaces(text, index);
		if (text[significant] !== ';') break;
		const group = parseGroup(text, significant + 1);
		if (!group) {
			index = separatorStart;
			break;
		}
		groups.push({ chapter: group.chapter, items: group.items, separators: group.separators });
		index = group.next;
	}

	if (text[skipSpaces(text, index)] === ':') return null;
	const version = VERSION_EXPRESSION.exec(text.slice(index));
	if (version) index += version[0].length;
	return { groups, version: version?.[1] || version?.[2] || '', end: index };
};

/** Converte texto reconhecido em AST única, preservando o rótulo real do livro. */
const parseBiblicalReferences = (text) => {
	const value = String(text || '');
	const references = [];
	BOOK_EXPRESSION.lastIndex = 0;
	let match;
	while ((match = BOOK_EXPRESSION.exec(value)) !== null) {
		const parsed = parseReferenceBody(value, match.index + match[0].length);
		if (!parsed) continue;
		references.push({
			book: match[1],
			groups: parsed.groups,
			version: parsed.version,
			start: match.index,
			end: parsed.end,
			raw: value.slice(match.index, parsed.end),
		});
		BOOK_EXPRESSION.lastIndex = parsed.end;
	}
	return references;
};

const shortItem = (item) => item.end ? `${item.start} a ${item.end}` : item.start;

const formatShortGroup = (group) => {
	let verses = shortItem(group.items[0]);
	for (let index = 1; index < group.items.length; index += 1) {
		const explicitAnd = group.separators[index - 1] === 'and';
		const inferredAnd = group.items[index - 1].end && index === group.items.length - 1;
		verses += explicitAnd ? ` e ${shortItem(group.items[index])}`
			: inferredAnd ? `, e ${shortItem(group.items[index])}`
				: `, ${shortItem(group.items[index])}`;
	}
	return `${group.chapter}, ${verses}`;
};

const joinNaturally = (values) => {
	if (values.length < 2) return values[0] || '';
	if (values.length === 2) return `${values[0]} e ${values[1]}`;
	return `${values.slice(0, -1).join(', ')} e ${values.at(-1)}`;
};

const formatLongVerses = (group) => {
	if (group.items.length === 1) {
		const item = group.items[0];
		return item.end ? `versículos de ${item.start} a ${item.end}` : `versículo ${item.start}`;
	}
	if (group.items.every((item) => !item.end)) {
		return `versículos ${joinNaturally(group.items.map(({ start }) => start))}`;
	}
	const phrases = group.items.map((item, index) => {
		if (item.end) return `${index ? 'os ' : ''}versículos de ${item.start} a ${item.end}`;
		return `${index ? 'o ' : ''}versículo ${item.start}`;
	});
	return joinNaturally(phrases);
};

/** Gera a forma curta sem palavras artificiais entre capítulo e versículo. */
const formatBiblicalReferenceShort = (reference) => {
	const groups = reference.groups.map(formatShortGroup).join('; ');
	return `${reference.book}, ${groups}${reference.version ? `, ${reference.version}` : ''}`;
};

/** Gera a forma longa a partir da mesma AST usada pelo modo curto. */
const formatBiblicalReferenceLong = (reference) => {
	const groups = reference.groups
		.map((group) => `capítulo ${group.chapter}, ${formatLongVerses(group)}`)
		.join('; ');
	return `${reference.book}, ${groups}${reference.version ? `, ${reference.version}` : ''}`;
};

/** Normaliza todas as referências reconhecidas sem alterar texto não classificado. */
const normalizeBiblicalReferences = (text, mode = 'short') => {
	const value = String(text || '');
	const references = parseBiblicalReferences(value);
	if (!references.length) return value;
	let output = '';
	let cursor = 0;
	for (const reference of references) {
		output += value.slice(cursor, reference.start);
		output += mode === 'long'
			? formatBiblicalReferenceLong(reference)
			: formatBiblicalReferenceShort(reference);
		cursor = reference.end;
	}
	return output + value.slice(cursor);
};

export {
	formatBiblicalReferenceLong,
	formatBiblicalReferenceShort,
	normalizeBiblicalReferences,
	parseBiblicalReferences,
	parseReferenceBody,
};
