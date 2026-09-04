import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

import { resolveJcemLegacyHeroMode } from '../assets/jcem/js/cover-layout.js';

const image = { imageWidth: 1920, imageHeight: 1002 };
const fitting = resolveJcemLegacyHeroMode({ ...image, viewportWidth: 1280, viewportHeight: 900, heroTopAtScrollZero: 80 });
assert.equal(fitting.mode, 'full', 'hero que cabe nao permaneceu integral');
assert.equal(fitting.availableHeight, 820);
const overflowing = resolveJcemLegacyHeroMode({ ...image, viewportWidth: 2560, viewportHeight: 1080, heroTopAtScrollZero: 80 });
assert.equal(overflowing.mode, 'content', 'hero alto nao alternou para content');
assert.ok(overflowing.projectedFullHeight > overflowing.availableHeight);
const boundary = resolveJcemLegacyHeroMode({ imageWidth: 2, imageHeight: 1, viewportWidth: 1600, viewportHeight: 900, heroTopAtScrollZero: 100 });
assert.equal(boundary.mode, 'full', 'limiar exato oscilou para content');
const stableInputs = Array.from({ length: 20 }, () => ({ ...image, viewportWidth: 2560, viewportHeight: 1080, heroTopAtScrollZero: 80 }));
assert.deepEqual(stableInputs.map(resolveJcemLegacyHeroMode).map(({ mode }) => mode), Array(20).fill('content'), 'decisao identica oscilou');
assert.deepEqual(resolveJcemLegacyHeroMode({ ...image, viewportWidth: 2560, viewportHeight: 1080, heroTopAtScrollZero: 80 }), overflowing, 'decisao incorporou scroll');

const root = path.resolve(process.env.JCEM_SITE_ROOT || '_site');
const types = new Map([['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.svg', 'image/svg+xml']]);
const targetFor = (requestPath) => {
	const clean = decodeURIComponent(requestPath.split('?')[0]).replace(/^[/\\]+/, '');
	let target = path.join(root, clean || 'index.html');
	if (requestPath.endsWith('/')) target = path.join(target, 'index.html');
	return path.relative(root, target).startsWith('..') ? null : target;
};
const server = createServer(async (request, response) => {
	const target = targetFor(request.url || '/');
	if (!target || !existsSync(target)) { response.writeHead(404); response.end('Not found'); return; }
	response.writeHead(200, { 'content-type': types.get(path.extname(target)) || 'application/octet-stream' });
	response.end(await readFile(target));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const executablePath = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'].find(existsSync);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

const fixtures = [
	['full-window', 'external', 'auto', 'top-left'],
	['window-height', 'external', 'height', 'top-right'],
	['window-width', 'external', 'width', 'bottom-left'],
	['inner-full-window', 'inner', 'auto', 'bottom-right'],
	['inner-window-height', 'inner', 'height', 'center'],
	['inner-window-width', 'inner', 'width', 'full'],
];

try {
	const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
	await page.addInitScript(() => {
		localStorage.setItem('silktideCookieBanner_InitialChoice', '1');
		localStorage.setItem('silktideCookieChoice_obrigat_rios', 'true');
	});
	for (const [mode, scope, axis, zone] of fixtures) {
		await page.goto(`http://127.0.0.1:${port}/_fixtures/covers/${mode}/`, { waitUntil: 'load' });
		await page.waitForSelector('[data-jcem-cover-hero]');
		if (scope === 'external') {
			await page.waitForFunction(() => document.querySelector('.masthead')?.getAttribute('data-jcem-cover-header-state') === 'translucent');
		}
		await page.waitForFunction((expectedScope) => {
			const stage = document.querySelector('.jcem-featured-image__stage')?.getBoundingClientRect();
			const masthead = document.querySelector('.masthead')?.getBoundingClientRect();
			if (!stage || !masthead) return false;
			return expectedScope === 'external'
				? Math.abs(stage.top) <= 0.51 && Math.abs(stage.bottom - window.innerHeight) <= 0.51
				: Math.abs(stage.top - masthead.bottom) <= 0.51 && Math.abs(stage.bottom - window.innerHeight) <= 0.51;
		}, scope);
		const state = await page.evaluate(() => {
			const cover = document.querySelector('[data-jcem-cover]');
			const stage = cover?.querySelector('.jcem-featured-image__stage');
			const useful = cover?.querySelector('[data-jcem-cover-useful]');
			const hero = cover?.querySelector('[data-jcem-cover-hero]');
			const masthead = document.querySelector('.masthead');
			const header = document.querySelector('.jcem-post-header');
			const articleZone = document.querySelector('article.page .page__inner-wrap');
			const upperBar = header?.querySelector('[data-jcem-title-bar="upper"]');
			const lowerBar = header?.querySelector('[data-jcem-title-bar="lower"]');
			const flag = header?.querySelector('.jcem-date-flag');
			const triangleBase = flag?.querySelector('[data-jcem-flag-triangle-base]');
			const title = header?.querySelector('.page__title');
			const rect = (node) => node?.getBoundingClientRect().toJSON();
			return {
				mode: cover?.getAttribute('data-jcem-cover-mode'),
				scope: cover?.getAttribute('data-jcem-cover-scope'),
				axis: [...(cover?.classList || [])].find((name) => name.startsWith('jcem-cover--axis-'))?.replace('jcem-cover--axis-', ''),
				fit: [...(cover?.classList || [])].find((name) => name.startsWith('jcem-cover--fit-'))?.replace('jcem-cover--fit-', ''),
				zone: hero?.getAttribute('data-jcem-hero-zone'),
				cover: rect(cover), stage: rect(stage), useful: rect(useful), hero: rect(hero), masthead: rect(masthead),
				articleZone: rect(articleZone), upperBar: rect(upperBar), lowerBar: rect(lowerBar), flag: rect(flag), triangleBase: rect(triangleBase),
				titleParent: title?.parentElement?.getAttribute('data-jcem-title-bar') || '',
				heroContent: rect(cover?.querySelector('.jcem-cover__hero-content')),
				heroOverflow: cover?.querySelector('.jcem-cover__hero-content') ? getComputedStyle(cover.querySelector('.jcem-cover__hero-content')).overflowY : '',
				headerState: masthead?.getAttribute('data-jcem-cover-header-state'),
				mastheadBackground: masthead ? getComputedStyle(masthead).backgroundColor : '',
				usefulStyle: useful ? {
					position: getComputedStyle(useful).position,
					left: getComputedStyle(useful).left,
					width: getComputedStyle(useful).width,
					transform: getComputedStyle(useful).transform,
					offsetParent: useful.offsetParent?.className || '',
				} : null,
				overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				bars: header?.querySelectorAll(':scope .jcem-post-header__topbar, :scope .jcem-post-header__bottombar').length,
				flagInBar: Boolean(header?.querySelector('.jcem-post-header__topbar > .jcem-date-flag')),
				ctaName: cover?.querySelector('.jcem-cover__hero-cta')?.textContent?.trim() || '',
			};
		});
		assert.deepEqual([state.mode, state.scope, state.axis, state.fit, state.zone], [mode, scope, axis, 'auto', zone], `contrato DOM divergente ${mode}`);
		assert.ok(state.stage.height > 0 && state.stage.width > 0, `stage vazio ${mode}`);
		assert.ok(state.useful.left >= state.stage.left - 1 && state.useful.right <= state.stage.right + 1, `area util fora do stage ${mode}: ${JSON.stringify(state)}`);
		assert.ok(state.hero.left >= state.useful.left - 1 && state.hero.right <= state.useful.right + 1, `Hero invadiu pattern ${mode}: ${JSON.stringify(state)}`);
		assert.ok(!['auto', 'scroll'].includes(state.heroOverflow), `Hero criou scroll interno ${mode}`);
		assert.ok(state.heroContent.top >= state.useful.top - 1 && state.heroContent.bottom <= state.useful.bottom + 1, `conteúdo Hero saiu da área útil ${mode}: ${JSON.stringify(state)}`);
		assert.ok(state.overflow <= 1, `overflow horizontal ${mode}: ${state.overflow}`);
		assert.equal(state.bars, 2, `barras editoriais divergentes ${mode}`);
		assert.equal(state.flagInBar, true, `flag fora da estrutura compartilhada ${mode}`);
		assert.equal(state.titleParent, 'lower', `título fora da barra inferior ${mode}`);
		assert.ok(Math.abs(state.stage.bottom - state.upperBar.top) <= 0.51, `fronteira cover/barras divergente ${mode}: ${JSON.stringify(state)}`);
		assert.ok(state.stage.bottom <= state.upperBar.top + 0.51, `cover sobrepôs barras ${mode}: ${JSON.stringify(state)}`);
		if (state.flag) {
			assert.ok(state.stage.bottom <= state.flag.top + 0.51, `cover sobrepôs flag ${mode}: ${JSON.stringify(state)}`);
			assert.ok(Math.abs(state.triangleBase.top - state.upperBar.top) <= 0.51, `base da flag não colinear ${mode}: ${JSON.stringify(state)}`);
		}
		if (mode === 'full-window') assert.equal(state.ctaName, 'Ir ao conteúdo');
		if (scope === 'external') {
			assert.ok(Math.abs(state.stage.height - 720) <= 2, `viewport externo divergente ${mode}`);
			assert.ok(Math.abs(state.stage.top) <= 0.51 && Math.abs(state.stage.bottom - 720) <= 0.51, `viewport externo fora da janela ${mode}: ${JSON.stringify(state)}`);
			assert.equal(state.headerState, 'translucent', `masthead inicial não translúcida ${mode}`);
			await page.evaluate(() => window.scrollTo(0, 80));
			await page.waitForFunction(() => document.querySelector('.masthead')?.getAttribute('data-jcem-cover-header-state') === 'solid');
			const scrolled = await page.evaluate(() => ({
				scroll: window.scrollY,
				background: getComputedStyle(document.querySelector('.masthead')).backgroundColor,
			}));
			assert.ok(scrolled.scroll > 0, `scroll não preservado ${mode}`);
			assert.notEqual(scrolled.background, state.mastheadBackground, `masthead não tornou sólida ${mode}`);
		} else {
			assert.ok(Math.abs(state.stage.height - (720 - state.masthead.bottom)) <= 0.51, `altura inner divergente ${mode}: ${JSON.stringify(state)}`);
			assert.ok(Math.abs(state.stage.top - state.masthead.bottom) <= 0.51, `cover inner não iniciou após masthead ${mode}`);
			assert.ok(Math.abs(state.stage.bottom - 720) <= 0.51, `cover inner não terminou na janela ${mode}: ${JSON.stringify(state)}`);
			assert.equal(state.headerState, null, `masthead inner contaminada ${mode}`);
		}

		const initialTheme = await page.evaluate(() => document.querySelector('input[name="jcem-theme"]:checked')?.value);
		await page.click('[aria-label="Alternar tema"]');
		await page.waitForFunction((previous) => document.querySelector('input[name="jcem-theme"]:checked')?.value !== previous, initialTheme);
		const alternateTheme = await page.evaluate(() => ({
			theme: document.querySelector('input[name="jcem-theme"]:checked')?.value,
			cover: document.querySelector('[data-jcem-cover]')?.getBoundingClientRect().toJSON(),
			overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
		}));
		assert.deepEqual(new Set([initialTheme, alternateTheme.theme]), new Set(['light', 'dark']), `temas não alternaram ${mode}`);
		assert.ok(Math.abs(alternateTheme.cover.width - state.cover.width) <= 1 && alternateTheme.overflow <= 1, `tema alterou geometria ${mode}`);
		await page.click('[aria-label="Alternar tema"]');
	}

	await page.setViewportSize({ width: 1024, height: 768 });
	await page.goto(`http://127.0.0.1:${port}/_fixtures/covers/inner-full-window/`, { waitUntil: 'load' });
	await page.evaluate(() => window.scrollTo(0, 40));
	const scrollBeforeResize = await page.evaluate(() => window.scrollY);
	await page.setViewportSize({ width: 768, height: 1024 });
	const portrait = await page.evaluate(() => ({
		scroll: window.scrollY,
		stage: document.querySelector('.jcem-featured-image__stage')?.getBoundingClientRect().toJSON(),
		overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
	}));
	assert.ok(Math.abs(portrait.scroll - scrollBeforeResize) <= 1 && portrait.stage.height <= 1024 && portrait.overflow <= 1, `resize/orientação inválido ${JSON.stringify(portrait)}`);

	await page.goto(`http://127.0.0.1:${port}/_fixtures/covers/content/`, { waitUntil: 'load' });
	for (const [width, height] of [[360, 800], [480, 800], [768, 1024], [1024, 768], [1280, 720]]) {
		await page.setViewportSize({ width, height });
		const resized = await page.evaluate(() => {
			const rect = (node) => node?.getBoundingClientRect().toJSON();
			return {
				stage: rect(document.querySelector('.jcem-featured-image__stage')),
				article: rect(document.querySelector('article.page .page__inner-wrap')),
				masthead: rect(document.querySelector('.masthead')),
				upperBar: rect(document.querySelector('[data-jcem-title-bar="upper"]')),
				overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});
		assert.ok(
			Math.abs(resized.stage.left - resized.article.left) <= 0.51 &&
			Math.abs(resized.stage.right - resized.article.right) <= 0.51 &&
			Math.abs(resized.stage.top - resized.masthead.bottom) <= 0.51 &&
			Math.abs(resized.stage.bottom - resized.upperBar.top) <= 0.51 &&
			Math.abs(resized.stage.width / resized.stage.height - 1200 / 630) <= 0.002 &&
			resized.overflow <= 1,
			`resize contínuo rompeu cover comum ${width}x${height}: ${JSON.stringify(resized)}`,
		);
	}

	await page.setViewportSize({ width: 1280, height: 720 });
	for (const mode of ['legacy', 'content', 'wide-single', 'wide-triptych']) {
		await page.goto(`http://127.0.0.1:${port}/_fixtures/covers/${mode}/`, { waitUntil: 'load' });
		const legacy = await page.evaluate(() => {
			const rect = (node) => node?.getBoundingClientRect().toJSON();
			const featured = document.querySelector('.jcem-featured-image, .jcem-legacy-hero');
			const stage = featured?.querySelector('.jcem-featured-image__stage, .page__hero');
			const articleZone = document.querySelector('article.page .page__inner-wrap');
			const upperBar = document.querySelector('[data-jcem-title-bar="upper"]');
			const lowerBar = document.querySelector('[data-jcem-title-bar="lower"]');
			const flag = document.querySelector('.jcem-post-header .jcem-date-flag');
			const triangleBase = flag?.querySelector('[data-jcem-flag-triangle-base]');
			const center = featured?.querySelector('.jcem-featured-image__center');
			const masthead = document.querySelector('.masthead');
			const title = document.querySelector('.jcem-post-header .page__title');
			return {
				coverExtension: Boolean(document.querySelector('[data-jcem-cover]')),
				heroExtension: Boolean(document.querySelector('[data-jcem-cover-hero]')),
				featured: Boolean(featured),
				overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				featuredRect: rect(featured), stage: rect(stage), articleZone: rect(articleZone), upperBar: rect(upperBar), lowerBar: rect(lowerBar),
				flag: rect(flag), triangleBase: rect(triangleBase), center: rect(center), masthead: rect(masthead),
				titleParent: title?.parentElement?.getAttribute('data-jcem-title-bar') || '',
			};
		});
		assert.deepEqual(
			{ coverExtension: legacy.coverExtension, heroExtension: legacy.heroExtension, featured: legacy.featured, overflow: legacy.overflow },
			{ coverExtension: false, heroExtension: false, featured: true, overflow: 0 },
			`regressão na fixture ${mode}`,
		);
		assert.equal(await page.locator('.jcem-post-header__topbar, .jcem-post-header__bottombar').count(), 2, `estrutura de barras legada divergente ${mode}`);
		assert.equal(legacy.titleParent, 'lower', `título fora da barra inferior ${mode}`);
		assert.ok(Math.abs(legacy.stage.top - legacy.masthead.bottom) <= 0.51, `cover não iniciou após masthead ${mode}: ${JSON.stringify(legacy)}`);
		assert.ok(Math.abs(legacy.stage.bottom - legacy.upperBar.top) <= 0.51, `fronteira cover/barras divergente ${mode}: ${JSON.stringify(legacy)}`);
		assert.ok(legacy.stage.bottom <= legacy.upperBar.top + 0.51, `cover sobrepôs barras ${mode}: ${JSON.stringify(legacy)}`);
		if (legacy.flag) {
			assert.ok(legacy.stage.bottom <= legacy.flag.top + 0.51, `cover sobrepôs flag ${mode}: ${JSON.stringify(legacy)}`);
			assert.ok(Math.abs(legacy.triangleBase.top - legacy.upperBar.top) <= 0.51, `base da flag não colinear ${mode}: ${JSON.stringify(legacy)}`);
		}
		if (mode === 'content') {
			assert.ok(Math.abs(legacy.stage.left - legacy.articleZone.left) <= 0.51 && Math.abs(legacy.stage.right - legacy.articleZone.right) <= 0.51, `cover comum fora da zona do artigo ${JSON.stringify(legacy)}`);
			assert.ok(Math.abs(legacy.stage.width / legacy.stage.height - (1200 / 630)) <= 0.002, `proporção comum divergente ${JSON.stringify(legacy)}`);
		}
		if (mode === 'wide-triptych') {
			assert.ok(Math.abs(legacy.center.left - legacy.articleZone.left) <= 0.51 && Math.abs(legacy.center.right - legacy.articleZone.right) <= 0.51, `centro triplo fora da zona do artigo ${JSON.stringify(legacy)}`);
		}
	}

	await page.setViewportSize({ width: 320, height: 800 });
	await page.goto(`http://127.0.0.1:${port}/_fixtures/covers/full-window/`, { waitUntil: 'load' });
	const mobile = await page.evaluate(() => ({
		width: document.querySelector('[data-jcem-cover]')?.getBoundingClientRect().width,
		height: document.querySelector('.jcem-featured-image__stage')?.getBoundingClientRect().height,
		useful: document.querySelector('[data-jcem-cover-useful]')?.getBoundingClientRect().toJSON(),
		content: document.querySelector('.jcem-cover__hero-content')?.getBoundingClientRect().toJSON(),
		overflowY: getComputedStyle(document.querySelector('.jcem-cover__hero-content')).overflowY,
		overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
	}));
	assert.ok(Math.abs(mobile.width - 320) <= 1 && Math.abs(mobile.height - 800) <= 2 && mobile.overflow <= 1, `mobile 320 inválido ${JSON.stringify(mobile)}`);
	assert.ok(mobile.content.top >= mobile.useful.top - 1 && mobile.content.bottom <= mobile.useful.bottom + 1 && !['auto', 'scroll'].includes(mobile.overflowY), `Hero mobile inválido ${JSON.stringify(mobile)}`);

	const dprPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
	await dprPage.goto(`http://127.0.0.1:${port}/_fixtures/covers/wide-triptych/`, { waitUntil: 'load' });
	const dpr = await dprPage.evaluate(() => {
		const rect = (node) => node?.getBoundingClientRect().toJSON();
		return {
			devicePixelRatio,
			center: rect(document.querySelector('.jcem-featured-image__center')),
			article: rect(document.querySelector('article.page .page__inner-wrap')),
			stage: rect(document.querySelector('.jcem-featured-image__stage')),
			upperBar: rect(document.querySelector('[data-jcem-title-bar="upper"]')),
			overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
		};
	});
	assert.ok(
		dpr.devicePixelRatio === 2 &&
		Math.abs(dpr.center.left - dpr.article.left) <= 0.51 &&
		Math.abs(dpr.center.right - dpr.article.right) <= 0.51 &&
		Math.abs(dpr.stage.bottom - dpr.upperBar.top) <= 0.51 &&
		dpr.overflow <= 1,
		`DPR 2 rompeu geometria tripla: ${JSON.stringify(dpr)}`,
	);
	await dprPage.close();
} finally {
	await browser.close();
	await new Promise((resolve) => server.close(resolve));
}

console.log('cover_runtime=ok legacy=4 extended=6 hero_zones=6 viewports=2');
