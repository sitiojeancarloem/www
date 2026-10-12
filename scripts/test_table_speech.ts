import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { normalizeBiblicalReferences } from '../assets/jcem/js/biblical-reference-speech.js';

const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<div data-jcem-read-aloud="true">
  <button data-jcem-read-action="play">Play</button>
  <button data-jcem-read-action="pause">Pause</button>
  <button data-jcem-read-action="stop">Stop</button>
  <span data-jcem-read-status></span>
  <select data-jcem-read-reference-mode><option value="continuous">continuous</option><option value="summary">summary</option><option value="full">full</option></select>
</div>
<div data-jcem-readable-root><table><caption>Valores</caption><thead><tr><th>Nome</th><th>Total</th></tr></thead><tbody><tr><td>A</td><td>2</td></tr></tbody></table></div>
</body>
</html>
`;

const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'outside-only' });
const { window } = dom;

// Declaração lastCaptions antes de mockSynth
const lastCaptions: string[] = [];

// Classe SpeechSynthesisUtterance extends EventTarget
class MockSpeechSynthesisUtterance extends window.EventTarget {
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
}

// Mock completo de speechSynthesis antes de atribuir métodos
const mockSynth = {
  getVoices: () => [],
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  speak: (utterance: SpeechSynthesisUtterance) => {
    // Capturar texto e simular evento 'end' após microtask
    lastCaptions.push(utterance.text);
    queueMicrotask(() => {
      const endEvent = new window.Event('end') as Event;
      utterance.dispatchEvent(endEvent);
    });
  }
};

window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
window.speechSynthesis = mockSynth as unknown as SpeechSynthesis;

// Injetar normalizeBiblicalReferences no window
(window as any).normalizeBiblicalReferences = normalizeBiblicalReferences;

// Carregar script real
const scriptPath = fileURLToPath(new URL('../assets/jcem/js/read-aloud.js', import.meta.url));
const scriptContent = readFileSync(scriptPath, 'utf-8');
window.eval(scriptContent.replace("import { normalizeBiblicalReferences } from './biblical-reference-speech.js';", 'const normalizeBiblicalReferences = window.normalizeBiblicalReferences;'));

const playBtn = window.document.querySelector('[data-jcem-read-action="play"]')!;
const pauseBtn = window.document.querySelector('[data-jcem-read-action="pause"]')!;
const stopBtn = window.document.querySelector('[data-jcem-read-action="stop"]')!;
const statusEl = window.document.querySelector('[data-jcem-read-status]')!;

// Iniciar teste
try {
  playBtn.click();
  const deadline = Date.now() + 1000;
  while (statusEl.textContent !== 'Leitura concluída.' && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.equal(statusEl.textContent, 'Leitura concluída.');
  assert.deepEqual(lastCaptions, ['Tabela: Valores', 'Nome: A. Total: 2']);
  // A primeira linha TH em tbody deve ter a mesma fala do thead.
  const table = window.document.querySelector('table')!;
  const tbody = table.querySelector('tbody')!;
  tbody.prepend(table.querySelector('thead tr')!);
  table.querySelector('thead')!.remove();
  lastCaptions.length = 0;
  playBtn.click();
  const secondDeadline = Date.now() + 1000;
  while (statusEl.textContent !== 'Leitura concluída.' && Date.now() < secondDeadline) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.equal(statusEl.textContent, 'Leitura concluída.');
  assert.deepEqual(lastCaptions, ['Tabela: Valores', 'Nome: A. Total: 2']);
  // Referências de células pertencem à linha falada, nunca ao caption.
  table.querySelector('td')!.insertAdjacentHTML('beforeend', '<a role="doc-noteref" data-jcem-reference-full="Fonte integral" data-jcem-reference-summary="Fonte, 2026">[1]</a>');
  const referenceMode = window.document.querySelector('[data-jcem-read-reference-mode]')!;
  for (const [mode, suffix] of [
    ['continuous', 'Esta passagem possui uma referência.'],
    ['summary', 'Referência 1: Fonte, 2026.'],
    ['full', 'Referência 1: Fonte integral.'],
  ]) {
    referenceMode.value = mode;
    lastCaptions.length = 0;
    playBtn.click();
    const referenceDeadline = Date.now() + 1000;
    while (statusEl.textContent !== 'Leitura concluída.' && Date.now() < referenceDeadline) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.equal(statusEl.textContent, 'Leitura concluída.');
    assert.deepEqual(lastCaptions, ['Tabela: Valores', 'Nome: A. Total: 2 ' + suffix]);
  }

  // IDs simples nesta fixture: o stub de CSS.escape só supre a API ausente no JSDOM.
  if (!window.CSS?.escape) {
    (window as any).CSS = { escape: (id: string) => {
      assert.match(id, /^[a-z]+$/);
      return id;
    } };
  }
  table.innerHTML = '<caption>Valores</caption><thead><tr><th id="nome">Nome</th><th id="total">Total</th></tr></thead><tbody><tr><th>A</th><th>2</th></tr><tr><td headers="total nome">B</td><td headers="total">3</td></tr></tbody><tfoot><tr><td>Soma</td><td>5</td></tr></tfoot>';
  lastCaptions.length = 0;
  playBtn.click();
  const headersDeadline = Date.now() + 1000;
  while (statusEl.textContent !== 'Leitura concluída.' && Date.now() < headersDeadline) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.equal(statusEl.textContent, 'Leitura concluída.');
  assert.deepEqual(lastCaptions, [
    'Tabela: Valores',
    'Nome: A. Total: 2',
    'Total, Nome: B. Total: 3',
    'Nome: Soma. Total: 5'
  ]);

  console.log('table_speech=ok');
} finally {
  dom.window.close();
}
