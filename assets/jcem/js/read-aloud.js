/**
 * Fonte: https://github.com/sitiojeancarloem/blog
 * Autor: Jean Carlo EM — https://www.jeancarloem.com
 * Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/
 */
import { normalizeBiblicalReferences } from './biblical-reference-speech.js';

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
	const pauseIcon = controls.querySelector('[data-jcem-read-pause-icon]');
	const stop = controls.querySelector('[data-jcem-read-action="stop"]');
	const referenceMode = controls.querySelector('[data-jcem-read-reference-mode]');
	const status = controls.querySelector('[data-jcem-read-status]');
	let units = [];
	let index = 0;
	let active = false;
	let paused = false;
	let generation = 0;

	const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
	const biblicalMode = () => (referenceMode?.value || 'continuous') === 'full' ? 'long' : 'short';
	const normalizeBiblical = (value) => normalizeBiblicalReferences(normalize(value), biblicalMode());
	const languageFor = (element) =>
		element.closest('[lang]')?.getAttribute('lang') || document.documentElement.lang || 'pt-BR';
	const noterefSelector = '[role="doc-noteref"], sup > a.footnote[href^="#fn:"], sup[id^="fnref"] > a[href^="#fn:"]';
	const blockquoteSelector = 'blockquote, [data-jcem-blockquote], [role="blockquote"]';

	/** Obtém referências normalizadas pertencentes à unidade falada. */
	const referencesFor = (element) => [...element.querySelectorAll('[data-jcem-reference-full]')].map((link) => ({
		marker: normalize(link.textContent).replace(/^[\s[\]()]+|[\s[\]()]+$/g, ''),
		summary: normalize(link.dataset.jcemReferenceSummary),
		full: normalize(link.dataset.jcemReferenceFull),
	}));

	/** Constrói a indicação de referências segundo o modo escolhido. */
	const referenceSuffix = (element) => {
		const references = referencesFor(element);
		if (!references.length) return '';
		const mode = referenceMode?.value || 'continuous';
		if (mode === 'continuous') return `Esta passagem possui ${references.length === 1 ? 'uma referência' : `${references.length} referências`}.`;
		const values = references.map((reference, referenceIndex) => {
			const marker = reference.marker || String(referenceIndex + 1);
			const value = normalizeBiblical(mode === 'full' ? reference.full : reference.summary);
			return `Referência ${marker}: ${value || 'resumo indisponível; consulte a nota completa'}`;
		});
		return `${[...new Set(values)].join('. ')}.`;
	};

	/** Extrai texto editorial e anuncia somente links de corpo autorizados. */
	const textFor = (element, { announceLinks = true } = {}) => {
		const clone = element.cloneNode(true);
		clone.querySelectorAll('script, style, [aria-hidden="true"]').forEach((node) => node.remove());
		clone.querySelectorAll(noterefSelector).forEach((reference) => reference.remove());
		clone.querySelectorAll('.header-link, [role="doc-backlink"]').forEach((link) => link.remove());
		const technicalSegments = [];
		clone.querySelectorAll('code, pre, kbd, samp').forEach((node) => {
			const token = `\uE000${technicalSegments.length}\uE001`;
			technicalSegments.push(normalize(node.textContent));
			node.replaceWith(document.createTextNode(token));
		});
		if (announceLinks) {
			clone.querySelectorAll('a[href]').forEach((link) => {
				const label = normalize(link.textContent);
				link.replaceWith(document.createTextNode(label ? ` Link: ${label} ` : ''));
			});
		}
		clone.querySelectorAll('img[data-jcem-accessible-image="informative"]').forEach((image) => {
			image.replaceWith(document.createTextNode(` Imagem: ${image.getAttribute('alt')}. `));
		});
		const spoken = normalizeBiblical(clone.textContent);
		return normalize(spoken.replace(/\uE000(\d+)\uE001/g, (_, segment) => technicalSegments[Number(segment)]));
	};

	/** Adiciona uma unidade, permitindo excluir referências em contextos vedados. */
	const add = (element, text, prefix = '', suffix = '', includeReferences = true) => {
		const references = includeReferences ? referenceSuffix(element) : '';
		const value = normalize(`${prefix} ${text} ${references} ${suffix}`);
		if (value) units.push({ text: value, lang: languageFor(element) });
	};

	const addTable = (table) => {
		const captionNode = table.querySelector(':scope > caption');
		const caption = captionNode ? textFor(captionNode, { announceLinks: false }) : '';
		const columnHeaders = [...table.querySelectorAll(':scope > thead > tr:first-child > th')]
			.map((cell) => textFor(cell, { announceLinks: false }));
		add(table, caption, 'Tabela:');
		table.querySelectorAll(':scope > tbody > tr').forEach((row) => {
			const cells = [...row.children].filter((cell) => /^(TH|TD)$/.test(cell.tagName));
			const rowText = cells.map((cell, cellIndex) => {
				const header = columnHeaders[cellIndex] || (cellIndex === 0 ? 'Linha' : `Coluna ${cellIndex + 1}`);
				return `${header}: ${textFor(cell, { announceLinks: false })}`;
			}).join('. ');
			add(row, rowText);
		});
	};

	const walk = (element) => {
		if (!(element instanceof HTMLElement) || element.hidden || element.getAttribute('aria-hidden') === 'true') return;
		if (element.matches('[data-jcem-article-toc]')) {
			if ((referenceMode?.value || 'continuous') !== 'full') return;
			add(element, 'Sumário do artigo.', '', '', false);
			element.querySelectorAll('nav a').forEach((link) => add(link, textFor(link, { announceLinks: false }), 'Seção:', '', false));
			return;
		}
		if (element.matches('[data-jcem-chart]')) {
			const titleNode = element.querySelector('figcaption strong');
			const summaryNode = element.querySelector('.jcem-chart__summary');
			const conclusionNode = element.querySelector('.jcem-chart__conclusion');
			const title = titleNode ? textFor(titleNode, { announceLinks: false }) : '';
			const summary = summaryNode ? textFor(summaryNode, { announceLinks: false }) : '';
			const conclusion = conclusionNode ? textFor(conclusionNode, { announceLinks: false }) : '';
			add(element, `${title}. ${summary} ${conclusion}`, 'Gráfico:');
			return;
		}
		if (element.matches(blockquoteSelector)) {
			add(element, textFor(element), 'Início da citação.', 'Fim da citação.');
			return;
		}
		if (element.matches('table:not([role="presentation"])')) {
			addTable(element);
			return;
		}
		if (element.matches('h2, h3, h4')) {
			add(element, textFor(element, { announceLinks: false }), 'Título:', '', false);
			return;
		}
		if (element.matches('h1, h5, h6, p, figcaption')) {
			add(element, textFor(element));
			return;
		}
		if (element.matches('li')) {
			const clone = element.cloneNode(true);
			clone.querySelectorAll(`ol, ul, table, ${blockquoteSelector}, [data-jcem-chart]`).forEach((node) => node.remove());
			add(element, textFor(clone));
		}
		[...element.children].forEach(walk);
	};

	const buildUnits = () => {
		units = [];
		const title = document.querySelector('#page-title');
		if (title) add(title, textFor(title, { announceLinks: false }), 'Título:', '', false);
		[...root.children].forEach(walk);
	};

	/**
	 * Sincroniza estado funcional e pistas acessíveis sem introduzir texto visível nos controles.
	 * @param {string} message Estado anunciado pela região viva.
	 * @returns {void}
	 */
	const setState = (message) => {
		if (status) status.textContent = message;
		play.disabled = active;
		pause.disabled = !active;
		stop.disabled = !active;
		pauseIcon?.classList.toggle('fa-play', paused);
		pauseIcon?.classList.toggle('fa-pause', !paused);
		pause.setAttribute('aria-label', paused ? 'Continuar leitura' : 'Pausar leitura');
		pause.setAttribute('title', paused ? 'Continuar leitura' : 'Pausar leitura');
		pause.setAttribute('aria-pressed', String(paused));
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
		const currentGeneration = generation;
		const utterance = new Utterance(unit.text);
		utterance.lang = unit.lang;
		utterance.voice = voiceFor(unit.lang) || null;
		utterance.addEventListener('end', () => {
			if (currentGeneration === generation) speakNext();
		}, { once: true });
		utterance.addEventListener('error', () => {
			if (currentGeneration === generation) finish();
		}, { once: true });
		synth.speak(utterance);
	};

	play.addEventListener('click', () => {
		generation += 1;
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
		generation += 1;
		synth.cancel();
		active = false;
		paused = false;
		index = 0;
		setState('Leitura interrompida.');
	});

	referenceMode?.addEventListener('change', () => {
		const labels = { continuous: 'contínuo', summary: 'resumido', full: 'completo' };
		const selected = labels[referenceMode.value] || labels.continuous;
		const hint = `Modo de referências: ${selected}`;
		referenceMode.setAttribute('aria-label', hint);
		referenceMode.setAttribute('title', hint);
		if (active) {
			generation += 1;
			synth.cancel();
			index = Math.max(0, index - 1);
			buildUnits();
			paused = false;
			setState(`Modo de referências alterado para ${selected}. Leitura retomada.`);
			speakNext();
		} else setState(`Modo de referências alterado para ${selected}.`);
	});

	window.addEventListener('pagehide', () => {
		generation += 1;
		synth.cancel();
	}, { once: true });
	setState('Leitura pronta.');
})();
