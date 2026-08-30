/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(process.env.JCEM_SITE_ROOT || '_site');
const types = new Map([
	['.html', 'text/html; charset=utf-8'],
	['.js', 'text/javascript; charset=utf-8'],
	['.css', 'text/css; charset=utf-8'],
]);

const targetFor = (requestPath) => {
	const clean = decodeURIComponent(requestPath.split('?')[0]).replace(/^[/\\]+/, '');
	let target = path.join(root, clean || 'index.html');
	if (requestPath.endsWith('/')) target = path.join(target, 'index.html');
	return path.relative(root, target).startsWith('..') ? null : target;
};

const server = createServer(async (request, response) => {
	const target = targetFor(request.url || '/');
	if (!target || !existsSync(target)) {
		response.writeHead(404);
		response.end('Not found');
		return;
	}
	response.writeHead(200, { 'content-type': types.get(path.extname(target)) || 'application/octet-stream' });
	response.end(await readFile(target));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const executablePath = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
	const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
	await page.addInitScript(() => {
		localStorage.setItem('silktideCookieBanner_InitialChoice', '1');
		localStorage.setItem('silktideCookieChoice_obrigat_rios', 'true');
		localStorage.setItem('silktideCookieChoice_estat_sticos', 'false');
		localStorage.setItem('silktideCookieChoice_publicit_rios', 'false');
		const spoken = [];
		class FakeUtterance extends EventTarget {
			constructor(text) {
				super();
				this.text = text;
				this.lang = '';
				this.voice = null;
			}
		}
		Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance });
		Object.defineProperty(window, 'speechSynthesis', {
			value: {
				cancel() {},
				pause() {},
				resume() {},
				getVoices() { return []; },
				speak(utterance) {
					spoken.push({ text: utterance.text, lang: utterance.lang });
					if (window.__jcemHoldSpeech) return;
					setTimeout(() => utterance.dispatchEvent(new Event('end')), 0);
				},
			},
		});
		window.__jcemSpokenFixture = spoken;
	});

	await page.goto(`http://127.0.0.1:${port}/_fixtures/tts-accessibility/`, { waitUntil: 'load' });
	const controls = await page.evaluate(() => ({
		playIcon: document.querySelector('[data-jcem-read-action="play"] i')?.className,
		pauseIcon: document.querySelector('[data-jcem-read-action="pause"] i')?.className,
		stopIcon: document.querySelector('[data-jcem-read-action="stop"] i')?.className,
		mode: document.querySelector('[data-jcem-read-reference-mode]')?.value,
		modeIcon: document.querySelector('.jcem-read-aloud__mode > i')?.className,
	}));
	if (
		!controls.playIcon?.includes('fa-play') ||
		!controls.pauseIcon?.includes('fa-pause') ||
		!controls.stopIcon?.includes('fa-stop') ||
		!controls.modeIcon?.includes('fa-book-open') ||
		controls.mode !== 'continuous'
	) {
		throw new Error(`CONTROLES_TTS_INVALIDOS ${JSON.stringify(controls)}`);
	}
	const compactLayout = await page.evaluate(() => {
		const toolbar = document.querySelector('[data-jcem-read-aloud]');
		const controlGroup = toolbar?.querySelector('.jcem-read-aloud__controls');
		const mode = toolbar?.querySelector('.jcem-read-aloud__mode');
		const select = toolbar?.querySelector('[data-jcem-read-reference-mode]');
		const parent = toolbar?.parentElement;
		if (!(toolbar instanceof HTMLElement) || !(controlGroup instanceof HTMLElement) || !(mode instanceof HTMLElement) || !(select instanceof HTMLSelectElement) || !(parent instanceof HTMLElement)) return null;
		const toolbarRect = toolbar.getBoundingClientRect();
		const parentRect = parent.getBoundingClientRect();
		const targets = [...toolbar.querySelectorAll('button'), mode].map((target) => {
			const rect = target.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		});
		return {
			toolbar: { left: toolbarRect.left, right: toolbarRect.right, width: toolbarRect.width, height: toolbarRect.height },
			parent: { left: parentRect.left, right: parentRect.right },
			display: getComputedStyle(toolbar).display,
			flexWrap: getComputedStyle(toolbar).flexWrap,
			controlsWrap: getComputedStyle(controlGroup).flexWrap,
			selectOpacity: getComputedStyle(select).opacity,
			visibleLabelPresent: Boolean(toolbar.querySelector('.jcem-read-aloud__label')),
			buttonText: [...toolbar.querySelectorAll('button')].map((button) => button.textContent.trim()),
			targets,
			labels: [...toolbar.querySelectorAll('button, select')].map((target) => target.getAttribute('aria-label')),
			titles: [...toolbar.querySelectorAll('button, select')].map((target) => target.getAttribute('title')),
		};
	});
	if (
		!compactLayout ||
		compactLayout.display !== 'flex' ||
		compactLayout.flexWrap !== 'nowrap' ||
		compactLayout.controlsWrap !== 'nowrap' ||
		compactLayout.selectOpacity !== '0' ||
		compactLayout.visibleLabelPresent ||
		compactLayout.buttonText.some(Boolean) ||
		compactLayout.toolbar.width > 176 ||
		compactLayout.toolbar.height > 41 ||
		Math.abs(compactLayout.parent.right - compactLayout.toolbar.right) > 1 ||
		compactLayout.toolbar.left < compactLayout.parent.left - 1 ||
		compactLayout.targets.some(({ width, height }) => width < 40 || height < 40 || width > 41 || height > 41) ||
		compactLayout.labels.some((label) => !label) ||
		compactLayout.titles.some((title) => !title)
	) {
		throw new Error(`BARRA_TTS_NAO_COMPACTA ${JSON.stringify(compactLayout)}`);
	}
	await page.waitForFunction(() => document.querySelector('[data-jcem-chart]')?.dataset.jcemChartState === 'rendered');
	await page.click('[data-jcem-read-action="play"]');
	await page.waitForFunction(() => document.querySelector('[data-jcem-read-status]')?.textContent === 'Leitura concluída.');
	const fixture = await page.evaluate(() => ({
		spoken: window.__jcemSpokenFixture,
		chartState: document.querySelector('[data-jcem-chart]')?.dataset.jcemChartState,
		chartVersion: document.querySelector('[data-jcem-chart-renderer]')?.dataset.jcemChartRenderer,
		canvasHidden: document.querySelector('[data-jcem-chart-canvas]')?.closest('[aria-hidden="true"]') !== null,
	}));
	const speech = fixture.spoken.map(({ text }) => text).join(' ');
	if (
		fixture.chartState !== 'rendered' ||
		fixture.chartVersion !== '4.5.1' ||
		!fixture.canvasHidden ||
		!speech.includes('Início da citação.') ||
		!speech.includes('Fim da citação.') ||
		!speech.includes('Tabela:') ||
		!speech.includes('Gráfico:') ||
		!speech.includes('Esta passagem possui uma referência.') ||
		!speech.includes('λόγος')
	) {
		throw new Error(`RUNTIME_ACESSIVEL_INVALIDO ${JSON.stringify(fixture)}`);
	}
	if (speech.includes('Bíblia, NVI, Isaías 12:3; 53:10')) {
		throw new Error('REFERENCIA_COMPLETA_INTERROMPEU_MODO_CONTINUO');
	}
	await page.selectOption('[data-jcem-read-reference-mode]', 'full');
	const fullModeHint = await page.getAttribute('[data-jcem-read-reference-mode]', 'title');
	if (fullModeHint !== 'Modo de referências: completo') throw new Error(`HINT_MODO_TTS_INVALIDO ${fullModeHint}`);
	await page.click('[data-jcem-read-action="play"]');
	await page.waitForFunction(() => document.querySelector('[data-jcem-read-status]')?.textContent === 'Leitura concluída.');
	const fullSpeech = await page.evaluate(() => window.__jcemSpokenFixture.map(({ text }) => text).join(' '));
	if (!fullSpeech.includes('Referências completas:')) throw new Error('MODO_REFERENCIA_COMPLETA_AUSENTE');

	await page.evaluate(() => { window.__jcemHoldSpeech = true; });
	await page.click('[data-jcem-read-action="play"]');
	await page.click('[data-jcem-read-action="pause"]');
	const pausedState = await page.evaluate(() => ({
		label: document.querySelector('[data-jcem-read-action="pause"]')?.getAttribute('aria-label'),
		pressed: document.querySelector('[data-jcem-read-action="pause"]')?.getAttribute('aria-pressed'),
		icon: document.querySelector('[data-jcem-read-pause-icon]')?.className,
		status: document.querySelector('[data-jcem-read-status]')?.textContent,
	}));
	if (pausedState.label !== 'Continuar leitura' || pausedState.pressed !== 'true' || !pausedState.icon?.includes('fa-play') || pausedState.status !== 'Leitura pausada.') {
		throw new Error(`ESTADO_PAUSA_TTS_INVALIDO ${JSON.stringify(pausedState)}`);
	}
	await page.click('[data-jcem-read-action="pause"]');
	const resumedState = await page.evaluate(() => ({
		label: document.querySelector('[data-jcem-read-action="pause"]')?.getAttribute('aria-label'),
		pressed: document.querySelector('[data-jcem-read-action="pause"]')?.getAttribute('aria-pressed'),
		icon: document.querySelector('[data-jcem-read-pause-icon]')?.className,
		status: document.querySelector('[data-jcem-read-status]')?.textContent,
	}));
	if (resumedState.label !== 'Pausar leitura' || resumedState.pressed !== 'false' || !resumedState.icon?.includes('fa-pause') || resumedState.status !== 'Leitura retomada.') {
		throw new Error(`ESTADO_RETORNADA_TTS_INVALIDO ${JSON.stringify(resumedState)}`);
	}
	await page.click('[data-jcem-read-action="stop"]');
	const stoppedState = await page.evaluate(() => ({
		pauseDisabled: document.querySelector('[data-jcem-read-action="pause"]')?.disabled,
		stopDisabled: document.querySelector('[data-jcem-read-action="stop"]')?.disabled,
		status: document.querySelector('[data-jcem-read-status]')?.textContent,
	}));
	if (!stoppedState.pauseDisabled || !stoppedState.stopDisabled || stoppedState.status !== 'Leitura interrompida.') {
		throw new Error(`ESTADO_PARADA_TTS_INVALIDO ${JSON.stringify(stoppedState)}`);
	}

	await page.goto(`http://127.0.0.1:${port}/p/devaneios/`, { waitUntil: 'load' });
	if (await page.locator('[data-jcem-chart-renderer], [data-jcem-chart-adapter]').count()) {
		throw new Error('CHART_ASSET_EM_ARTIGO_SEM_GRAFICO');
	}
	if (await page.locator('[data-jcem-read-aloud-runtime]').count() !== 1) {
		throw new Error('TTS_PROGRESSIVO_AUSENTE_EM_ARTIGO');
	}

	await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
	if (await page.locator('[data-jcem-chart-renderer], [data-jcem-chart-adapter], [data-jcem-read-aloud-runtime]').count()) {
		throw new Error('ASSET_CONDICIONAL_NA_HOME');
	}

	console.log(`accessible_runtime=ok spoken_units=${fixture.spoken.length} chart=${fixture.chartVersion}`);
} finally {
	await browser.close();
	server.close();
}
