/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */
export const resolveJcemLegacyHeroMode = (measurement) => {
    const availableHeight = Math.max(0, measurement.viewportHeight - measurement.heroTopAtScrollZero);
    const projectedFullHeight = measurement.viewportWidth * measurement.imageHeight / measurement.imageWidth;
    return {
        mode: projectedFullHeight <= availableHeight + 0.5 ? 'full' : 'content',
        availableHeight,
        projectedFullHeight,
    };
};
