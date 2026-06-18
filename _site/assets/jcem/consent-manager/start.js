(() => {
	const seAceite = (essencial, analitics, publicitários) => {
		const args = { essencial, analitics, publicitários };
		const check = (x) => x !== null && x !== undefined;

		if (
			!check(essencial) &&
			!check(analitics) &&
			!check(publicitários)
		) {
			return;
		}

		for (const k of Object.keys(args)) {
			((name) => {
				const fullName = `jcem_aceite_${name}`;
				const value = args[name];
				const r = check(value)
					? value
						? Math.floor(Date.now() / 1000)
						: 0
					: window.localStorage.getItem(fullName) ?? 0;

				window.localStorage.setItem(fullName, r);
			})(k);
		}
	};

	silktideCookieBannerManager.updateCookieBannerConfig({
		background: {
			showBackground: true,
		},
		cookieIcon: {
			position: 'bottomLeft',
		},
		cookieTypes: [
			{
				id: 'obrigat_rios',
				name: 'Obrigatórios',
				description:
					'<p>Esses cookies são necessários para o funcionamento correto da plataforma e não podem ser desativados. Eles ajudam em funções como fazer login e definir suas preferências de privacidade.</p>',
				required: true,
				onAccept: function () {
					seAceite(1, null, null);
				},
				onReject: function () {
					seAceite(0, null, null);
				},
			},
			{
				id: 'estat_sticos',
				name: 'Estatísticos',
				description:
					'<p>Utilizamos cookies estatísticos para coletar informações sobre a forma como as interações ocorem, a fim de medir e aprimorar o desempenho da experiência. Esses dados, que podem ser agregados e anonimizados, nos ajudam a entender o uso da plataforma e são, em sua maioria, implementados por serviços de terceiros.</p>',
				required: false,
				onAccept: function () {
					try {
						gtag('consent', 'update', {
							analytics_storage: 'granted',
						});
						dataLayer.push({
							event: 'consent_accepted_estat_sticos',
						});
					} catch (error) {}

					seAceite(null, 1, null);
				},
				onReject: function () {
					try {
						gtag('consent', 'update', {
							analytics_storage: 'denied',
						});
					} catch (error) {}
					seAceite(null, 0, null);
				},
			},
			{
				id: 'publicit_rios',
				name: 'Publicitários',
				description:
					'<p>Cookies de publicidade são usados para criar perfis baseados em suas interações e interesses, permitindo a exibição de anúncios personalizados relevantes, dentro e fora da nossa plataforma. Esses dados nos ajudam a medir a eficácia das campanhas publicitárias e são, em sua maioria, fornecidos por parceiros de publicidade terceirizados.</p>',
				required: false,
				onAccept: function () {
					try {
						gtag('consent', 'update', {
							ad_storage: 'granted',
							ad_user_data: 'granted',
							ad_personalization: 'granted',
						});
						dataLayer.push({
							event: 'consent_accepted_publicit_rios',
						});
					} catch (error) {}

					seAceite(null, null, 1);
				},
				onReject: function () {
					try {
						gtag('consent', 'update', {
							ad_storage: 'denied',
							ad_user_data: 'denied',
							ad_personalization: 'denied',
						});
					} catch (error) {}

					seAceite(null, null, 0);
				},
			},
		],
		text: {
			banner: {
				description:
					'<p>O uso deste,&nbsp;<b>requer </b>a aceitação <b>integral </b>de nossos <a href="https://jeancarloem.com/termos-de-uso" target="_blank">Termos de Uso</a>,&nbsp;<a href="https://jeancarloem.com/avisos-gerais/" target="_blank">Advertências </a>e <a href="https://jeancarloem.com/privacidade/" target="_blank">Política de Privacidade</a>. Utilizamos <b>cookies</b> para a navegação básica, estatísticas e personalização. Gerencie suas preferências para cookies não essenciais.</p>',
				acceptAllButtonText: 'Aceitar tudo com todos os cookies',
				acceptAllButtonAccessibleLabel:
					'Aceitar tudo, e todos os cookies',
				rejectNonEssentialButtonText:
					'Aceito tudo com cookies essenciais',
				rejectNonEssentialButtonAccessibleLabel:
					'Aceita tudo, mas rejeita os cookies não essenciais',
				preferencesButtonText: 'Preferências',
				preferencesButtonAccessibleLabel: 'Mude as preferências',
			},
			preferences: {
				title: 'Personalize suas preferências de cookies',
				description:
					'<p>Respeitamos o seu direito à privacidade. Você pode optar por não permitir alguns tipos de cookies. Suas preferências de cookies serão aplicadas em todo o nossa plataforma (se site: especificamente o domínio e subdomínios atuais).</p><p><b>Exemplos de Cookies Essenciais: </b></p><ul><li><b>Autenticação</b>: Cookies que mantêm o usuário logado enquanto navega entre páginas. Sem eles, o usuário precisaria fazer login em cada nova página.</li><li><b>Carrinho de Compras</b>: Cookies que lembram os itens que o usuário adicionou ao carrinho em um e-commerce. </li><li><b>Segurança</b>: Cookies que ajudam a detectar tentativas de fraude ou ataques de segurança. </li><li><b>Preferências do Usuário</b> (Básicas): Cookies que lembram se o usuário aceitou a política de cookies, ou qual idioma ele selecionou, garantindo que essas escolhas persistam durante a sessão. </li><li><b>Balanceamento de Carga</b>: Cookies que distribuem o tráfego de conexões entre vários servidores;</li><li><b>Configurações de interface do usuário</b>:&nbsp;Cookies que lembram a preferência de visualização do usuário, como o tamanho da fonte ou o tema da página (claro/escuro), para aquela sessão específica.</li></ul>',
				creditLinkText: 'Silktide',
				creditLinkAccessibleLabel: 'Silktide',
			},
		},
		position: {
			banner: 'bottomCenter',
		},
	});
})();
