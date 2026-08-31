/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

export interface JcemLegacyHeroMeasurement {
	viewportWidth: number;
	viewportHeight: number;
	heroTopAtScrollZero: number;
	imageWidth: number;
	imageHeight: number;
}

export interface JcemLegacyHeroDecision {
	mode: 'full' | 'content';
	availableHeight: number;
	projectedFullHeight: number;
}

export const resolveJcemLegacyHeroMode = (
	measurement: JcemLegacyHeroMeasurement,
): JcemLegacyHeroDecision => {
	const availableHeight = Math.max(
		0,
		measurement.viewportHeight - measurement.heroTopAtScrollZero,
	);
	const projectedFullHeight =
		measurement.viewportWidth * measurement.imageHeight / measurement.imageWidth;

	return {
		mode: projectedFullHeight <= availableHeight + 0.5 ? 'full' : 'content',
		availableHeight,
		projectedFullHeight,
	};
};
