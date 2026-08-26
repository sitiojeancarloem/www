/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
(() => {
	'use strict';

	const render = (figure) => {
		if (!(figure instanceof HTMLElement) || figure.dataset.jcemChartState) return;
		const canvas = figure.querySelector('canvas[data-jcem-chart-canvas]');
		const payload = figure.querySelector('script[type="application/json"][data-jcem-chart-config]');
		if (!(canvas instanceof HTMLCanvasElement) || !payload) return;

		if (typeof window.Chart !== 'function') {
			figure.dataset.jcemChartState = 'fallback';
			return;
		}

		try {
			const config = JSON.parse(payload.textContent || '{}');
			new window.Chart(canvas.getContext('2d'), config);
			figure.dataset.jcemChartState = 'rendered';
		} catch (_error) {
			// PROTECAO: a tabela e a sintese estaticas permanecem autoritativas.
			figure.dataset.jcemChartState = 'fallback';
		}
	};

	const initialize = () => {
		document.querySelectorAll('[data-jcem-chart]').forEach(render);
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize, { once: true });
	} else {
		initialize();
	}
})();
