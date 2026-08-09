/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

export const PRINT_PROFILE_ID = 'ieee-conference-a4-ieeetran-1.8b';

export type PrintConformanceState =
	| 'legivel'
	| 'nativo-preparado'
	| 'ieee-validado';

export interface PrintPreparationOptions {
	profileId?: string;
	acquiredAt?: Date;
	fullWidthSelector?: string;
	onStateChange?: (
		state: PrintConformanceState,
		article: HTMLElement,
	) => void;
}

export interface PrintPreparationController {
	readonly article: HTMLElement;
	readonly profileId: string;
	prepare(): PrintConformanceState;
	getState(): PrintConformanceState;
	markValidated(): PrintConformanceState;
	dispose(): void;
}

const VALID_STATES = new Set<PrintConformanceState>([
	'legivel',
	'nativo-preparado',
	'ieee-validado',
]);

const stateOf = (article: HTMLElement): PrintConformanceState => {
	const state = article.dataset.printState as PrintConformanceState | undefined;
	return state && VALID_STATES.has(state) ? state : 'legivel';
};

const stampAcquisitionDate = (article: HTMLElement, acquiredAt: Date): void => {
	const isoDate = acquiredAt.toISOString();
	article.dataset.printAcquiredAt = isoDate;
	article
		.querySelectorAll<HTMLElement>('[data-print-acquired-at]')
		.forEach((element) => {
			element.textContent = acquiredAt.toLocaleString('pt-BR', {
				dateStyle: 'short',
				timeStyle: 'short',
			});
			element.setAttribute('datetime', isoDate);
		});
};

export const getPrintState = (article: HTMLElement): PrintConformanceState =>
	stateOf(article);

export const prepareArticle = (
	article: HTMLElement,
	options: PrintPreparationOptions = {},
): PrintPreparationController => {
	if (!(article instanceof HTMLElement)) {
		throw new TypeError('prepareArticle exige um HTMLElement.');
	}

	const profileId = options.profileId || PRINT_PROFILE_ID;
	const fullWidthSelector = options.fullWidthSelector || '[data-print-span="all"]';
	let disposed = false;

	article.dataset.printArticle = '';
	article.dataset.printProfile = profileId;
	if (!VALID_STATES.has(article.dataset.printState as PrintConformanceState)) {
		article.dataset.printState = 'legivel';
	}

	const setState = (state: PrintConformanceState): PrintConformanceState => {
		article.dataset.printState = state;
		options.onStateChange?.(state, article);
		article.dispatchEvent(
			new CustomEvent('jcem-print-state', { detail: { profileId, state } }),
		);
		return state;
	};

	const prepare = (): PrintConformanceState => {
		if (disposed) return stateOf(article);
		stampAcquisitionDate(article, options.acquiredAt || new Date());
		article.querySelectorAll<HTMLElement>(fullWidthSelector).forEach((element) => {
			element.dataset.printSpan = 'all';
		});
		return setState('nativo-preparado');
	};

	const beforePrint = (): void => {
		prepare();
	};
	const afterPrint = (): void => {
		article.dataset.printLifecycle = 'complete';
	};
	const printMedia = window.matchMedia?.('print');
	const mediaChange = (event: MediaQueryListEvent): void => {
		if (event.matches) prepare();
		else afterPrint();
	};

	window.addEventListener('beforeprint', beforePrint);
	window.addEventListener('afterprint', afterPrint);
	printMedia?.addEventListener?.('change', mediaChange);
	prepare();

	return {
		article,
		profileId,
		prepare,
		getState: () => stateOf(article),
		markValidated: () => setState('ieee-validado'),
		dispose: () => {
			if (disposed) return;
			disposed = true;
			window.removeEventListener('beforeprint', beforePrint);
			window.removeEventListener('afterprint', afterPrint);
			printMedia?.removeEventListener?.('change', mediaChange);
		},
	};
};
