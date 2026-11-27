/*! Autoria: JeanCarloEM — https://www.jeancarloem.com | Origem: https://github.com/sitiojeancarloem/www | MPL-2.0 https://mozilla.org/MPL/2.0/ — sem garantia. RCF: RCFs/doacoes.md; RCFs/componentes-compartilhados.md */

import type { Page } from 'playwright';
import type { DonationsData } from '../../assets/jcem/ts/donations-data.js';
type Options = { fail:(message:string)=>never; screenshotPath:string; loadExpectedData:()=>Promise<unknown>; validateExpectedData:(value:unknown)=>void };
/** Valida shell noscript comum e conteúdo canônico da variante /doe/. Fonte TS compilada para Node24+; callbacks mantêm I/O no executor. */
export const validateNoScriptPage = async (page: Page, url: string, viewportName: string, {fail, screenshotPath, loadExpectedData, validateExpectedData}: Options): Promise<void> => {
 let expectedData: DonationsData | null = null;
 if (new URL(url).pathname === '/doe/') {
  const value: unknown = await loadExpectedData();
  validateExpectedData(value);
  expectedData = value as DonationsData;
 }
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
	await page.waitForTimeout(150);

	const result = await page.evaluate((expectedData: DonationsData | null) => {
		const visible = (element: Element | null | undefined) => {
			if (!element) return false;
			const rect = element.getBoundingClientRect();
			const style = window.getComputedStyle(element);
			return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
		};
		const shell = document.querySelector('.jcem-noscript-page');
		const noScript = document.querySelector('body > noscript');
		const masthead = document.querySelector('.jcem-noscript-masthead');
		const mastheadLogo = masthead?.querySelector('.site-logo img');
		const footer = document.querySelector('.jcem-noscript-footer');
		const featured = document.querySelector('.jcem-noscript-featured');
		const featuredImage = featured?.querySelector('.jcem-featured-image__img');
		const donation = shell?.querySelector('.jcem-donations');
  const panel = expectedData ? donation : document.querySelector('.jcem-noscript__panel');
		const wrapper = document.querySelector('body > .main_jcem_wrapper');
		const loader = document.querySelector('.carregandoPagina');
		const themeToggle = document.querySelector('.jcem-theme-toggle');
		const panelRect = panel?.getBoundingClientRect();
		const featuredRect = featured?.getBoundingClientRect();
		const noScriptRect = noScript?.getBoundingClientRect();
		const mastheadRect = masthead?.getBoundingClientRect();
		const mastheadLogoRect = mastheadLogo?.getBoundingClientRect();
		const shellStyle = shell ? window.getComputedStyle(shell) : null;
		const noScriptStyle = noScript ? window.getComputedStyle(noScript) : null;
		const bodyStyle = window.getComputedStyle(document.body);
		const htmlStyle = window.getComputedStyle(document.documentElement);
		const featuredStyle = featured ? window.getComputedStyle(featured) : null;
		const featuredImageStyle = featuredImage ? window.getComputedStyle(featuredImage) : null;
		const footerStyle = footer ? window.getComputedStyle(footer) : null;
		const footerRegion = footer?.querySelector('.jcem-footer-region');
		const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
		const loaderStyle = loader ? window.getComputedStyle(loader) : null;

  const donationState = expectedData ? (() => {
   const rows = Array.from(donation?.querySelectorAll<HTMLElement>('[data-donation-id]') || []);
   const ownIds = Array.from(donation?.querySelectorAll('[id]') || []);
   const allIds = Array.from(document.querySelectorAll('[id]'));
   const heading = document.getElementById(donation?.getAttribute('aria-labelledby') || '');
   return {
    visible: visible(donation),
    noEnhancements: !!donation && !donation.hasAttribute('data-jcem-donations') && !donation.querySelector('script,button'),
    linkedHeading: !!heading && !!donation?.contains(heading),
    uniqueIds: ownIds.every(node => allIds.filter(other => other.id === node.id).length === 1),
    manualGuide: (donation?.querySelector('.jcem-donation-steps')?.textContent || '').includes('Copie manualmente') && !(donation?.querySelector('.jcem-donation-steps')?.textContent || '').includes('leia o QR'),
    noFeatured: !featured,
    values: rows.length === expectedData.methods.length && expectedData.methods.every(method => {
     const row = rows.find(node => node.dataset.donationId === method.id);
     if (!row || !(row.querySelector('summary') || row.closest('details')?.querySelector('summary'))?.textContent?.includes(method.label)) return false;
     if (method.type === 'paypal') {
      const link = row.querySelector('a.btn--paypal');
      const minimum = Array.from(row.querySelectorAll('p')).find(node => (node.textContent || '').trim().startsWith('Valor mínimo:'))?.textContent?.replace('Valor mínimo:','').trim().match(/^(\d+(?:\.\d+)?)\s+(\S+)$/u);
      const rel = (link?.getAttribute('rel') || '').split(/\s+/);
      return link?.getAttribute('href') === method.url && link.getAttribute('target') === '_blank' && rel.includes('noopener') && rel.includes('noreferrer') && !!minimum && Number(minimum[1]) === method.minimumAmount && minimum[2] === method.currency;
     }
     const field = row.querySelector('textarea');
     if (!field || !field.readOnly || !field.getAttribute('aria-label') || field.value !== (method.type === 'pix' ? method.payload : method.address)) return false;
     if (method.type === 'pix') return row.querySelector('code')?.textContent === method.key;
     const network = Array.from(row.querySelectorAll('p')).find(node => (node.textContent || '').trim().startsWith('Rede:'))?.textContent?.replace(/\s+/g,' ').trim();
     return network === 'Rede: ' + method.network;
    })
   };
  })() : null;
		return {
   donationState,
			hasShell: visible(shell),
			hasMasthead: visible(masthead),
			mastheadHeight: mastheadRect?.height || 0,
			mastheadLogoHeight: mastheadLogoRect?.height || 0,
			mastheadLogoBottomOverflow:
				mastheadRect && mastheadLogoRect
					? mastheadLogoRect.bottom - mastheadRect.bottom
					: 0,
			hasFooter: visible(footer),
			footerMarginTop: Number.parseFloat(footerStyle?.marginTop || '0'),
			footerRegion: {
				visible: visible(footerRegion),
				logoCount:
					footer?.querySelectorAll('.jcem-footer-region__logo img').length ||
					0,
				socialCount:
					footer?.querySelectorAll(
						'.jcem-footer-region__social .social-icons a',
					).length || 0,
				mapLinkHref:
					Array.from(
						footer?.querySelectorAll('.jcem-footer-region__links a') || [],
					).find((link) => (link.textContent || '').trim() === 'Todos os Artigos')
						?.getAttribute('href') || '',
				categoryCount:
					footer?.querySelectorAll('.jcem-footer-region__taxonomy a').length ||
					0,
				oldFooterFollowCount:
					footer?.querySelectorAll(
						':scope > footer > .page__footer-follow:not(.jcem-footer-region__social)',
					).length || 0,
			},
			hasFeatured: visible(featured),
			featuredHeight: featuredRect?.height || 0,
			featuredBg: featuredStyle?.backgroundColor || '',
			shellBg: shellStyle?.backgroundColor || '',
			shellBgImage: shellStyle?.backgroundImage || '',
			noScriptOverflowY: noScriptStyle?.overflowY || '',
			noScriptOverflowX: noScriptStyle?.overflowX || '',
			noScriptPosition: noScriptStyle?.position || '',
			bodyOverflowY: bodyStyle.overflowY || '',
			htmlOverflowY: htmlStyle.overflowY || '',
			noScriptWidth: noScriptRect?.width || 0,
			noScriptRightGap: noScriptRect
				? Math.abs(window.innerWidth - noScriptRect.right)
				: 0,
			pageCanScrollY:
				document.documentElement.scrollHeight >
				document.documentElement.clientHeight + 2,
			overflowX:
				document.documentElement.scrollWidth -
				document.documentElement.clientWidth,
			featuredImageSrc: featuredImage?.getAttribute('src') || '',
			featuredImageObjectFit: featuredImageStyle?.objectFit || '',
			hasThemeToggle: visible(themeToggle) || Boolean(shell?.querySelector('.jcem-theme-toggle')),
			hasPanel: Boolean(panelRect),
			panelWidth: panelRect?.width || 0,
			panelHeight: panelRect?.height || 0,
			wrapperDisplay: wrapperStyle?.display || '',
			loaderDisplay: loaderStyle?.display || '',
			bodyText: document.body.innerText || '',
		};
	}, expectedData);

	if (!result.hasShell || !result.hasMasthead || !result.hasFooter) {
		fail(`Shell noscript sem cabecalho ou footer em ${url} ${viewportName}`);
	}

	if (result.footerMarginTop < 32) {
		fail(`Footer noscript sem espacamento do tema em ${url} ${viewportName}`);
	}

	if (
		!result.footerRegion.visible ||
		result.footerRegion.logoCount < 1 ||
		result.footerRegion.socialCount < 5 ||
		result.footerRegion.categoryCount < 2 ||
		result.footerRegion.oldFooterFollowCount > 0
	) {
		fail(`Footer noscript sem regiao complementar equivalente em ${url} ${viewportName}: ${JSON.stringify(result.footerRegion)}`);
	}

	if (!result.footerRegion.mapLinkHref.endsWith('/mapa/')) {
		fail(`Footer noscript com Todos os Artigos fora do mapa em ${url} ${viewportName}: ${JSON.stringify(result.footerRegion)}`);
	}

	if (
		result.mastheadHeight > 65 ||
		result.mastheadLogoHeight <= result.mastheadHeight ||
		result.mastheadLogoBottomOverflow < 2
	) {
		fail(`Masthead noscript sem geometria do tema em ${url} ${viewportName}: ${JSON.stringify(result)}`);
	}

	if (!result.hasPanel || result.panelWidth <= 1 || result.panelHeight <= 1) {
		fail(`Conteudo noscript ausente em ${url} ${viewportName}`);
	}

	if (
		!expectedData && (!result.hasFeatured ||
		result.featuredHeight < 180 ||
		!result.featuredImageSrc.includes('sem-motor-nao-vai-jcem-ccbysanc.jcem.webp') ||
		result.featuredImageObjectFit !== 'contain' ||
		result.featuredBg !== 'rgb(1, 2, 3)')
	) {
		fail(`Imagem wide noscript invalida em ${url} ${viewportName}: ${JSON.stringify(result)}`);
	}

	if (
		result.shellBg === 'rgb(16, 15, 16)' ||
		result.shellBgImage === 'none' ||
		result.noScriptPosition !== 'static' ||
		result.bodyOverflowY === 'hidden' ||
		result.htmlOverflowY === 'hidden' ||
		result.overflowX > 2 ||
		result.noScriptRightGap > 2
	) {
		fail(`Fundo ou rolagem do noscript invalido em ${url} ${viewportName}: ${JSON.stringify(result)}`);
	}

	if (result.wrapperDisplay !== 'none') {
		fail(`Conteudo do blog visivel sem JavaScript em ${url} ${viewportName}`);
	}

	if (result.loaderDisplay !== 'none') {
		fail(`.carregandoPagina visivel sem JavaScript em ${url} ${viewportName}`);
	}

	if (result.hasThemeToggle) {
		fail(`Noscript exibiu switcher de tema em ${url} ${viewportName}`);
	}

	if (!expectedData && (!result.bodyText.includes('JavaScript is disabled.') || !result.bodyText.includes('O JavaScript está desativado.'))) {
		fail(`Conteudo noscript incompleto em ${url} ${viewportName}`);
	}

 if (expectedData) {
  const state = result.donationState;
  if (!state || !state.visible || !state.values || !state.noEnhancements || !state.linkedHeading || !state.uniqueIds || !state.manualGuide || !state.noFeatured) fail('Dados noscript de doações divergentes em ' + url + ': ' + JSON.stringify(state));
  const scope = page.locator('body > noscript .jcem-donations');
  for (const method of expectedData.methods) {
   const row = scope.locator('[data-donation-id="' + method.id + '"]');
   const details = row.locator('xpath=ancestor::details[1]');
   const summary = details.locator('summary');
   await summary.focus();
   if (!(await details.evaluate(el => (el as HTMLDetailsElement).open))) await page.keyboard.press('Enter');
   if (!(await details.evaluate(el => (el as HTMLDetailsElement).open))) fail('Detalhe noscript não abre por teclado: ' + method.id);
   if (method.type !== 'paypal') {
    const field = row.locator('textarea');
    await field.focus(); await page.keyboard.press('Control+A');
    if (!(await field.evaluate(el => (el as HTMLTextAreaElement).selectionEnd - (el as HTMLTextAreaElement).selectionStart === (el as HTMLTextAreaElement).value.length))) fail('Seleção manual noscript falhou: ' + method.id);
   }
  }
 }
 await page.screenshot({path:screenshotPath,fullPage:true});
};
