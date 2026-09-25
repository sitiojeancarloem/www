import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const SEPARATORS = /^[\-_,. ]+|[\-_,. ]+$/g;

export class OverlayCatalogError extends Error {
	constructor(code, details) {
		super(`${code}:${JSON.stringify(details)}`);
		this.name = 'OverlayCatalogError';
		this.code = code;
		this.details = details;
	}
}

export const normalizeOverlayToken = (value) => String(value || '')
	.trim()
	.toLowerCase()
	.replace(SEPARATORS, '')
	.replace(/[\-_,. ]+/g, '-');

const safeSegment = (value, field) => {
	const raw = String(value || '').trim();
	if (!raw || raw === '.' || raw === '..' || /[\\/\0]/.test(raw)) {
		throw new OverlayCatalogError('OVERLAY_CONTEXTO_INVALIDO', { field, value: raw });
	}
	return raw;
};

export const parseOverlayFilename = (filename) => {
	const rawExtension = path.extname(filename);
	const extension = rawExtension.toLowerCase();
	if (!SUPPORTED_EXTENSIONS.has(extension)) return null;
	const basename = path.basename(filename).slice(0, -rawExtension.length);
	const yearMatch = /^(\d{4})(.*)$/i.exec(basename);
	if (!yearMatch) return null;

	let remainder = yearMatch[2];
	let kind = 'portrait';
	const wideMatch = /^(.*?)(?:[\-_,. ]?wide)$/i.exec(remainder);
	if (wideMatch) {
		kind = 'wide';
		remainder = wideMatch[1];
	}
	const rawQualifier = remainder.replace(SEPARATORS, '');
	return {
		filename,
		extension,
		year: Number(yearMatch[1]),
		kind,
		qualifier: rawQualifier ? normalizeOverlayToken(rawQualifier) : '',
	};
};

const diagnostic = (code, context, directory, candidates, extra = {}) => new OverlayCatalogError(code, {
	document: context.document || '',
	directory,
	when: context.now || new Date().toISOString(),
	candidates: candidates.map((candidate) => candidate.filename).sort(),
	rule: 'um par anual unico contendo wide e portrait',
	probableCause: code === 'OVERLAY_AMBIGUO'
		? 'mais de um arquivo resolve para a mesma variante'
		: 'o ano possui apenas uma das variantes obrigatorias',
	correction: 'mantenha exatamente um overlay wide e um nao-wide para o ano vigente',
	...extra,
});

const candidatesIn = async (directory, explicitSubnamespaces) => {
	let entries;
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error.code === 'ENOENT') return [];
		throw error;
	}
	const allowedQualifiers = new Set(explicitSubnamespaces.map(normalizeOverlayToken));
	return entries
		.filter((entry) => entry.isFile())
		.map((entry) => parseOverlayFilename(entry.name))
		.filter((candidate) => candidate && (!candidate.qualifier || allowedQualifiers.has(candidate.qualifier)))
		.map((candidate) => ({ ...candidate, path: path.join(directory, candidate.filename) }));
};

const validateDirectory = async (context, directory, candidates) => {
	const byYear = new Map();
	for (const candidate of candidates) {
		if (!byYear.has(candidate.year)) byYear.set(candidate.year, { wide: [], portrait: [] });
		byYear.get(candidate.year)[candidate.kind].push(candidate);
	}
	for (const [year, variants] of byYear) {
		for (const kind of ['wide', 'portrait']) {
			if (variants[kind].length > 1) {
				throw diagnostic('OVERLAY_AMBIGUO', context, directory, candidates, { year, kind });
			}
		}
		if (variants.wide.length !== 1 || variants.portrait.length !== 1) {
			throw diagnostic('OVERLAY_PAR_INCOMPLETO', context, directory, candidates, { year });
		}
	}
	const currentYear = Math.max(...byYear.keys());
	const current = byYear.get(currentYear);
	for (const candidate of [...current.wide, ...current.portrait]) {
		const metadata = await stat(candidate.path);
		if (!metadata.isFile()) throw diagnostic('OVERLAY_ARQUIVO_INVALIDO', context, directory, candidates, { path: candidate.path });
	}
	return {
		directory,
		year: currentYear,
		wide: current.wide[0].path,
		portrait: current.portrait[0].path,
	};
};

export const resolveOverlaySet = async ({ root, namespace, subnamespaces = [], document = '', now = '' }) => {
	if (!namespace) return null;
	const safeNamespace = safeSegment(namespace, 'namespace');
	const safeSubnamespaces = subnamespaces.map((value, index) => safeSegment(value, `subnamespace[${index}]`));
	const context = { document, now };
	let directory = path.join(root, safeNamespace);
	for (let depth = 0; depth <= safeSubnamespaces.length; depth += 1) {
		if (depth > 0) directory = path.join(directory, safeSubnamespaces[depth - 1]);
		const candidates = await candidatesIn(directory, safeSubnamespaces);
		if (candidates.length) return validateDirectory(context, directory, candidates);
	}
	return null;
};
