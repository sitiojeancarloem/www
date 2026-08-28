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
	const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
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
					setTimeout(() => utterance.dispatchEvent(new Event('end')), 0);
				},
			},
		});
		window.__jcemSpokenFixture = spoken;
	});

	await page.goto(`http://127.0.0.1:${port}/_fixtures/tts-accessibility/`, { waitUntil: 'load' });
	const controls = await page.evaluate(() => ({
		play: document.querySelector('[data-jcem-read-action="play"]')?.textContent.trim(),
		pause: document.querySelector('[data-jcem-read-action="pause"]')?.textContent.trim(),
		stop: document.querySelector('[data-jcem-read-action="stop"]')?.textContent.trim(),
		mode: document.querySelector('[data-jcem-read-reference-mode]')?.value,
	}));
	if (controls.play !== '▶' || controls.pause !== '⏸' || controls.stop !== '■' || controls.mode !== 'continuous') {
		throw new Error(`CONTROLES_TTS_INVALIDOS ${JSON.stringify(controls)}`);
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
	await page.click('[data-jcem-read-action="play"]');
	await page.waitForFunction(() => document.querySelector('[data-jcem-read-status]')?.textContent === 'Leitura concluída.');
	const fullSpeech = await page.evaluate(() => window.__jcemSpokenFixture.map(({ text }) => text).join(' '));
	if (!fullSpeech.includes('Referências completas:')) throw new Error('MODO_REFERENCIA_COMPLETA_AUSENTE');

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
