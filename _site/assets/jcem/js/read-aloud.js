/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
(() => {
	'use strict';

	const controls = document.querySelector('[data-jcem-read-aloud]');
	const root = document.querySelector('[data-jcem-readable-root]');
	if (!(controls instanceof HTMLElement) || !(root instanceof HTMLElement)) return;

	const synth = window.speechSynthesis;
	const Utterance = window.SpeechSynthesisUtterance;
	if (!synth || typeof Utterance !== 'function') {
		controls.hidden = true;
		return;
	}

	const play = controls.querySelector('[data-jcem-read-action="play"]');
	const pause = controls.querySelector('[data-jcem-read-action="pause"]');
	const stop = controls.querySelector('[data-jcem-read-action="stop"]');
	const status = controls.querySelector('[data-jcem-read-status]');
	let units = [];
	let index = 0;
	let active = false;
	let paused = false;

	const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
	const languageFor = (element) =>
		element.closest('[lang]')?.getAttribute('lang') || document.documentElement.lang || 'pt-BR';

	const textFor = (element) => {
		const clone = element.cloneNode(true);
		clone.querySelectorAll('script, style, [aria-hidden="true"]').forEach((node) => node.remove());
		clone.querySelectorAll('[data-jcem-spoken-reference]').forEach((reference) => {
			reference.textContent = ` Referência: ${reference.dataset.jcemSpokenReference}. `;
		});
		clone.querySelectorAll('img[data-jcem-accessible-image="informative"]').forEach((image) => {
			image.replaceWith(document.createTextNode(` Imagem: ${image.getAttribute('alt')}. `));
		});
		return normalize(clone.textContent);
	};

	const add = (element, text, prefix = '', suffix = '') => {
		const value = normalize(`${prefix} ${text} ${suffix}`);
		if (value) units.push({ text: value, lang: languageFor(element) });
	};

	const addTable = (table) => {
		const caption = normalize(table.querySelector(':scope > caption')?.textContent);
		const columnHeaders = [...table.querySelectorAll(':scope > thead > tr:first-child > th')]
			.map((cell) => normalize(cell.textContent));
		add(table, caption, 'Tabela:');
		table.querySelectorAll(':scope > tbody > tr').forEach((row) => {
			const cells = [...row.children].filter((cell) => /^(TH|TD)$/.test(cell.tagName));
			const rowText = cells.map((cell, cellIndex) => {
				const header = columnHeaders[cellIndex] || (cellIndex === 0 ? 'Linha' : `Coluna ${cellIndex + 1}`);
				return `${header}: ${normalize(cell.textContent)}`;
			}).join('. ');
			add(row, rowText);
		});
	};

	const walk = (element) => {
		if (!(element instanceof HTMLElement) || element.hidden || element.getAttribute('aria-hidden') === 'true') return;
		if (element.matches('[data-jcem-chart]')) {
			const title = normalize(element.querySelector('figcaption strong')?.textContent);
			const summary = normalize(element.querySelector('.jcem-chart__summary')?.textContent);
			const conclusion = normalize(element.querySelector('.jcem-chart__conclusion')?.textContent);
			add(element, `${title}. ${summary} ${conclusion}`, 'Gráfico:');
			return;
		}
		if (element.matches('[role="blockquote"]')) {
			add(element, textFor(element), 'Início da citação.', 'Fim da citação.');
			return;
		}
		if (element.matches('table:not([role="presentation"])')) {
			addTable(element);
			return;
		}
		if (element.matches('h1, h2, h3, h4, h5, h6, p, figcaption')) {
			add(element, textFor(element));
			return;
		}
		if (element.matches('li')) {
			const clone = element.cloneNode(true);
			clone.querySelectorAll('ol, ul, table, [role="blockquote"], [data-jcem-chart]').forEach((node) => node.remove());
			add(element, textFor(clone));
		}
		[...element.children].forEach(walk);
	};

	const buildUnits = () => {
		units = [];
		const title = document.querySelector('#page-title');
		if (title) add(title, textFor(title), 'Título:');
		[...root.children].forEach(walk);
	};

	const setState = (message) => {
		if (status) status.textContent = message;
		play.disabled = active;
		pause.disabled = !active;
		stop.disabled = !active;
		pause.textContent = paused ? 'Continuar' : 'Pausar';
	};

	const voiceFor = (lang) => {
		const prefix = lang.toLowerCase().split('-')[0];
		return synth.getVoices().find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ||
			synth.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(prefix));
	};

	const finish = () => {
		active = false;
		paused = false;
		index = 0;
		setState('Leitura concluída.');
	};

	const speakNext = () => {
		if (!active) return;
		if (index >= units.length) {
			finish();
			return;
		}
		const unit = units[index++];
		const utterance = new Utterance(unit.text);
		utterance.lang = unit.lang;
		utterance.voice = voiceFor(unit.lang) || null;
		utterance.addEventListener('end', speakNext, { once: true });
		utterance.addEventListener('error', finish, { once: true });
		synth.speak(utterance);
	};

	play.addEventListener('click', () => {
		synth.cancel();
		buildUnits();
		if (!units.length) return;
		index = 0;
		active = true;
		paused = false;
		setState('Leitura iniciada.');
		speakNext();
	});

	pause.addEventListener('click', () => {
		if (!active) return;
		if (paused) synth.resume();
		else synth.pause();
		paused = !paused;
		setState(paused ? 'Leitura pausada.' : 'Leitura retomada.');
	});

	stop.addEventListener('click', () => {
		synth.cancel();
		active = false;
		paused = false;
		index = 0;
		setState('Leitura interrompida.');
	});

	window.addEventListener('pagehide', () => synth.cancel(), { once: true });
	setState('Leitura pronta.');
})();
