/**
 * Módulo puro para validação de dados de agradecimento de doação.
 * Sem efeitos colaterais, sem IO, sem imports externos.
 */

export interface DonationThankYou {
	readonly title: string;
	readonly message: string;
	readonly image: {
		readonly src: string;
		readonly alt: string;
	};
	readonly cover: {
		readonly mode: 'wide';
		readonly composition: 'triptych';
		readonly patterns: {
			readonly left: string;
			readonly right: string;
		};
	};
}

const EXTENSIONS = ['png', 'webp', 'jpg', 'jpeg', 'svg'];

function isAbsolutePathLocalAsset(value: unknown): value is string {
	if (typeof value !== 'string' || value.length > 4096 || /[\u0000-\u0020\u007f]/.test(value) || !value.startsWith('/assets/')) {
		return false;
	}
	const pathPart = value.substring(8);
	if (!pathPart || pathPart.includes('%') || pathPart.includes('\\') || pathPart.includes('?') || pathPart.includes('#') || pathPart.includes(':') || pathPart.includes('//') || pathPart.includes('..') || pathPart.includes(' ')) {
		return false;
	}
	const lastDot = pathPart.lastIndexOf('.');
	if (lastDot === -1) {
		return false;
	}
	const ext = pathPart.substring(lastDot + 1);
	if (!EXTENSIONS.includes(ext)) {
		return false;
	}
	const segments = pathPart.substring(0, lastDot).split('/');
	for (const seg of segments) {
		if (!seg || !/^[a-zA-Z0-9_-]+$/.test(seg)) {
			return false;
		}
	}
	return true;
}

function isNonEmptyStringRawLengthMax(value: unknown, maxLength: number): value is string {
	return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isDonationThankYouImage(value: unknown): value is DonationThankYou['image'] {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const v = value as Record<string, unknown>;
	if (!('src' in v) || !('alt' in v)) {
		return false;
	}
	if (!isAbsolutePathLocalAsset(v.src)) {
		return false;
	}
	if (!isNonEmptyStringRawLengthMax(v.alt, 4096)) {
		return false;
	}
	return true;
}

function isDonationThankYouCover(value: unknown): value is DonationThankYou['cover'] {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const v = value as Record<string, unknown>;
	if (!('mode' in v) || !('composition' in v) || !('patterns' in v)) {
		return false;
	}
	if (v.mode !== 'wide' || v.composition !== 'triptych') {
		return false;
	}
	if (v.patterns === null || typeof v.patterns !== 'object' || Array.isArray(v.patterns)) {
		return false;
	}
	const patterns = v.patterns as Record<string, unknown>;
	if (!('left' in patterns) || !('right' in patterns)) {
		return false;
	}
	if (!isAbsolutePathLocalAsset(patterns.left) || !isAbsolutePathLocalAsset(patterns.right)) {
		return false;
	}
	return true;
}

export function validateDonationThankYou(value: unknown): asserts value is DonationThankYou {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('DonationThankYou: valor deve ser um objeto não nulo');
	}
	const v = value as Record<string, unknown>;
	if (!('title' in v) || !('message' in v) || !('image' in v) || !('cover' in v)) {
		throw new Error('DonationThankYou: faltam chaves obrigatórias (title, message, image, cover)');
	}
	if (!isNonEmptyStringRawLengthMax(v.title, 4096)) {
		throw new Error('DonationThankYou: title deve ser string não vazia, tamanho ≤ 4096');
	}
	if (!isNonEmptyStringRawLengthMax(v.message, 4096)) {
		throw new Error('DonationThankYou: message deve ser string não vazia, tamanho ≤ 4096');
	}
	if (!isDonationThankYouImage(v.image)) {
		throw new Error('DonationThankYou: image inválido');
	}
	if (!isDonationThankYouCover(v.cover)) {
		throw new Error('DonationThankYou: cover inválido');
	}
}
