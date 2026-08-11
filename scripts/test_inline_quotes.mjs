/*! Fonte: https://github.com/sitiojeancarloem/blog | Autor: Jean Carlo EM — https://www.jeancarloem.com | Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/ — código aberto, sem garantia. */

import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dom = new JSDOM(`
  <main class="page__content">
    <p id="plain">Ele disse "texto citado" e “outra fala”.</p>
    <p id="apostrophe">It's intact e 'fala curta'.</p>
    <p id="unpaired">Aspas "sem fechamento.</p>
    <p id="explicit"><em class="jcem-inline-quote" data-jcem-inline-quote="explicit">fala explícita</em></p>
    <p id="emphasis"><em>"ênfase autoral"</em></p>
    <p id="code"><code>"codigo"</code></p>
    <blockquote id="native">
      <p>Segundo a fonte, "subcitação".</p>
      <blockquote id="nested"><p>Outro nível contém "subcitação profunda".</p></blockquote>
    </blockquote>
    <div id="custom" role="blockquote"><p>Estrutura com “subcitação customizada”.</p></div>
    <section class="footnotes"><p>"referência excluída"</p></section>
  </main>
`);
Object.assign(globalThis, {
	window: dom.window,
	document: dom.window.document,
	HTMLElement: dom.window.HTMLElement,
	NodeFilter: dom.window.NodeFilter,
});
const { formatJcemInlineQuotes } = await import(
	`${pathToFileURL(path.join(repositoryRoot, 'assets', 'jcem', 'js', 'inline-quotes.js')).href}?test=${Date.now()}`
);
const content = document.querySelector('main');
const before = content.textContent;
const result = formatJcemInlineQuotes(content);

assert.deepEqual(result, { inline: 4, subquotes: 3 });
assert.equal(content.textContent, before, 'texto e delimitadores devem ser preservados');
assert.equal(document.querySelectorAll('#plain .jcem-inline-quote').length, 2);
assert.equal(document.querySelectorAll('#apostrophe .jcem-inline-quote').length, 1);
assert.equal(document.querySelectorAll('#unpaired .jcem-inline-quote').length, 0);
assert.equal(document.querySelectorAll('#emphasis .jcem-inline-quote').length, 0);
assert.equal(document.querySelectorAll('#code .jcem-inline-quote').length, 0);
assert.equal(document.querySelectorAll('.footnotes .jcem-inline-quote').length, 0);
assert.equal(document.querySelectorAll('[data-jcem-subquote="contextual"]').length, 3);
assert.equal(document.querySelector('#native .jcem-inline-quote')?.dataset.jcemQuoteDepth, '1');
assert.equal(document.querySelector('#custom .jcem-inline-quote')?.dataset.jcemQuoteDepth, '1');
assert.equal(document.querySelector('#nested .jcem-inline-quote')?.dataset.jcemQuoteDepth, '2');
assert.equal(document.querySelectorAll('.jcem-subquote--nested').length, 1);
assert.equal(document.querySelector('#explicit').textContent, 'fala explícita');

process.stdout.write(`inline_quotes=ok inline=${result.inline} subquotes=${result.subquotes}\n`);
