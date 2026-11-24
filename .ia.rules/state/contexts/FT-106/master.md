# Contexto mestre — FTs 106 a 111

Estado: FT-106 normatizada; FT-107 tecnicamente concluída, pendente de validação humana; FT-108 a FT-111 aguardam execução das respectivas unidades autorizadas.

## Objetivo

Entregar páginas de doação orientadas por dados, QR Codes confiáveis e uma cadeia comum de assets oficiais, integrada ao Jekyll e à home sem duplicação manual.

## Fases

1. FT-106 — inventário e contrato de dados, rotas, QR, assets, acessibilidade e segurança.
2. FT-107 — fonte JSON, pipeline client-side de QR/cópia/download e resolução de assets.
3. FT-108 — página `/doe` responsiva nos temas claro e escuro.
4. FT-109 — `/doe/obrigado` derivada da home com hero especializado.
5. FT-110 — workflow mensal único de verificação de ícones e metadados.
6. FT-111 — integração, decodificação de QR, visual, acessibilidade, build e regressão.

## Dependências e limites

- Inspecionar primeiro arquitetura, tema, home, layouts, assets e pipeline existentes.
- Reutilizar a biblioteca QR madura já disponível ou adicionar dependência somente se necessária e mantida.
- Nenhum QR pode ser aceito apenas por aparência; payload final deve ser decodificado em teste.
- O workflow não pode substituir asset válido por aproximação nem gerar churn sem mudança material.

## Retomada da FT-107 — U1

FT-106 concluída (histórico canônico); implementação autorizada. Inventário job76db6458: nenhum arquivo de doação ou QR localizado nas fontes versionadas; Jekyll usa _data e domínio https://www.jeancarloem.com. U1: _data/donations.json e teste de valores exatos contra TODO canônico. Sem UI/QR/assets externos nesta unidade; contrato, biblioteca QR, composição, decodificação e ações serão checkpoints posteriores. Preservar seis meios informados, redes, payloads e link PayPal literalmente; não inferir identidade de tokens.

## Checkpoint U1 aprovado

Fonte _data/donations.json v1 com PIX, quatro criptos e PayPal preservados. Teste scripts/test_donations_data.ts compara com TODO canônico; job e7dec2f0-8f26-42bd-98cb-8b84b282c219 exit0. Correções preservadas: contrato de campos e extração restrita à seção/linhas. Sem QR/UI/assets; FT-107 em andamento. Próximo U2: validação reutilizável tipada e extensão por dados, sem valores financeiros recadastrados.

## Checkpoint U2A aprovado

Módulo assets/jcem/ts/donations-data.ts e JS compilado: união discriminada coerente ao JSON, validação estrutural pura e URL PayPal com query preservada. Job e6f48d2b-a4d1-4c0b-b0d9-c18aef03875d: patch, build e baseline exit0; JSON real aceito sem mutação. U2B pendente: regressões negativas e inclusão por dados. Nenhum QR/UI conectado; FT-107 segue em andamento.

## Checkpoint U2B aprovado

Teste scripts/test_donations_contract.ts: baseline, extensão por dados, null/versão e 72 rejeições com preservação; job64e0173a-bdd5-4fb5-a63b-dc092effc403 exit0. U2A commit ee997954a2, primeiro teste4f44abcb30. Contrato de dados validado; QR, composição/decodificação, ações e assets comuns pendentes. Próximo U3A: inventário delimitado de bibliotecas locais e símbolo de logo já autorizado; nenhuma instalação antes desse checkpoint.

## Checkpoint U3C aprovado

qrcode-generator2.0.4 (MIT) local em assets/jcem/lib e jsqr1.4.0 (Apache-2.0) em scripts/vendor, excluído do Jekyll. Hashes SHA256 e SRI nos manifests; licenças preservadas. Job2f865db2: vendor/smoke/attributions exit0, geração→leitura básica aprovada e cinco atribuições válidas. scripts/vendor é ignorado pelo Git; somente os três arquivos fixados do decoder serão adicionados explicitamente. Sem UI/composição final; ainda requer símbolo/legenda, decodificação de payloads reais e ações.

## Checkpoint U3D aprovado

Derivação payload/legenda commit2fb4a8fd26; adaptador matriz delega à biblioteca local com H/Byte e dimensão limitada. Jobbb98c72d-ac1f-4a7c-9dc4-e19da66f40a2 build/test exit0: cinco payloads reais decodificados byte a byte; teste persistente scripts/test_donations_qr.ts. Composição visual e ações pendentes. Logo local inspecionado: símbolo à esquerda e wordmark à direita; requer inspeção finita dos frames antes de escolher recorte sem texto para canvas.

## Checkpoint U3E aprovado

Renderer donations-qr-canvas.ts/JS: jobd4c8e0fd create/build/render-test exit0; cinco PNGs Edge headless decodificados byte a byte. PIX em tmp/ft107-qr-base/pix.png inspecionado: margem branca, moldura e legenda legíveis. Sem símbolo; original GIF intacto. Próximo: geometria protegida derivada da tabela do gerador pinado, para escolher espaço central sem cobrir módulos funcionais. Depois composição/ação/integração.

## Checkpoint U3F1 aprovado

Geometria baseada na tabela MIT do gerador2.0.4. Correções do jobffb788f5: iteração dos centros reais, guardas inteiras/NaN, build e teste40versões+invalidos exit0. Reserva conservadora de borda11 e quadrados de alinhamento5x5; só admite área central livre. Próximo: seleção finita da versão QR que comporte símbolo central sem afetar módulos funcionais; depois compositor com figura real e decodificação final.

## Checkpoint U3F2 aprovado

Seletor finito de versão e teste permanente: job6d61550b create/build/test exit0. Cinco QRs com área central apagada decodificam byte a byte. PIX versão14 após chamadas[0,14]; criptos usam automática, versões5/4/6/4. Região central não cobre reserva funcional. Próximo: camada canvas com recorte da figura do logo original, bitmap do primeiro frame; validar cinco PNGs finais e regiões protegidas. Sem alterações do GIF ou de payloads.

## Checkpoint U3G aprovado

Composição com figura real do primeiro frame, recorte0,0,190,192 sem wordmark. Job3803412e create-test/test exit0: cinco PNGs decodificados byte a byte e outside=0; teste permanente scripts/test_donations_qr_composed.ts usa canvas isolado com willReadFrequently. PIX, USDT e BTC inspecionados: figura central, moldura/legenda/quietzone legíveis. Evidência tmp/ft107-composed-test-wHLq8u. Falha1609eab8 outside1185 não reproduzida pelo diagnóstico cad1ed1d; causa não comprovada, sem alegação de correção GPU. Renderer preservado, backend explícito só no teste. Próximo: reutilização do catálogo/metadados de assets antes de meios/redes e ações; UI/docs/gates continuam pendentes.

## Checkpoint U4A aprovado

Job bb93446f-cfc8-45ed-9367-0f9c2fd92f8f: create/build/test exit0, FIVE_FULL_COPY_VALUES_SHORTENING_AND_PNG_ERRORS_OK. Revisão das funções e teste: cinco valores integrais, exibição até10 caracteres, erros de clipboard/PNG propagados e dados preservados. Git determinístico confirmou três arquivos novos sem commit do Worker; supervisor assume versionamento. Funções reutilizáveis; controles de UI, acessibilidade e download efetivo ainda pendentes. Próximo: catálogo/resolver comum de assets, reutilizando metadados existentes.


## Checkpoint U4B aprovado

Jobs7d35cb27 e1e22c73b: WORKER_INCOMPLETE, leituras/listagens repetidas sem alterações; não infraestrutura. Estratégia corrigida6e9d5fc6: sequência determinística create/build/test exit0, ASSET_CATALOG_STRUCTURE_RESOLUTION_AND_REJECTIONS_OK. Revisão do módulo/teste aceita: catálogo e resolvedor comum por ID, paths locais restritos, HTTPS sem credenciais, hash estrutural, preservação dos dados. Git determinístico ahead32 confirmou três arquivos novos, zero commits do Worker. Sem catálogo real ou verificação física/licenciamento dos assets; próxima unidade aquisição/proveniência e integração JSON, reutilizando metadados existentes.


## Checkpoint U4C2 aprovado

Aquisição da2d7453 e integração8f3f3f3d concluídas: install/catalog-test/financial-test/attributions exit0; dois hashes físicos válidos e seis atribuições. PNGs Bitcoin/Tether128alpha inspecionados no candidato, copiados byte a byte; licençaMIT2018ErikThiart preservada e fonte pinada8dcc316d95f0bbdf6f3b220745ae05f1ef00e79e no JSON único. Revisão diff confirmou methods intactos. Git determinístico ahead33 trouxe sete alvos alterados/novos, sem commit do Worker. Catálogo inicial parcial; contrato DonationsData ainda não valida assets e não há referências de métodos/UI. Próximo: integrar validação tipada de catálogo no contrato, mantendo validadores unitários QR/cópia compatíveis; demais ícones/referências pendentes.


## Checkpoint U4D1 aprovado

Job8930238a patch/build/contract/actions/qr exit0. Revisão diff: DonationsData.assets opcional reutiliza validateDonationAssets; testes rejeitam catálogo malformado e preservam compatibilidade sem catálogo. Cinco cópias e cinco matrizes QR continuam corretas byte a byte. Git determinístico ahead34 confirmou três alvos modificados, zero commits do Worker. Próximo: refs de ícones/redes no JSON e validação referencial completa; separar guarda de método (para QR/cópia) do contexto de catálogo para não quebrar chamadas unitárias. Sem aceite global FT107.


## Checkpoint U4D2 aprovado

Job0f654462 patch/build/contract/actions/qr/financial/assets exit0. Revisão diff aceita: BTC compartilha bitcoin para moeda/rede; USDT referencia tether; guarda de método separada da validação referencial completa, que rejeita IDs ausentes/inseguros e rede em não cripto. Valores financeiros preservados, cinco cópias e cinco matrizes QR aprovadas byte a byte, dois hashes reais válidos. Git determinístico ahead35 confirmou oito alvos alterados, zero commits do Worker. Próximo: candidatos reais e pinados para eCash/BitTorrent/BNB/TRON; sem inventar equivalência semântica ou completar FT107 antes dos assets/ações restantes.


## Checkpoint U4E2 aprovado

Jobd86bae63 install/contract/assets/financial/attributions exit0. Revisão diff aceita: eCash e TRON pinados no catálogo4assets, XEC compartilha eCash para moeda/rede, BTTC referencia somente redeTRON. Quatro hashes físicos e seis atribuições válidos; dados financeiros intactos. PNGs inspecionados no checkpoint de aquisição8b040730 e cópia byte a byte comprovada. Git determinístico ahead36 confirmou quatro alvos alterados/novos, sem commit do Worker. Próximo: confirmar candidatos BNB/BitTorrent por fontes primárias; depois providersPIX/PayPal e ações/integração pendentes. Sem concluir FT107.


## Checkpoint U4F1 aprovado

Job73a0d24b install/contract/assets/financial/attributions exit0. Diff revisado: somente PNGnovoBitTorrent, catálogo5assets e atribuição; BTTC/TRON/endereço intactos. Cinco hashes e seis atribuições válidos. Escolha bittorrent-new fundamentada no comunicado primário BitTorrentInc de25/01/2022 https://medium.com/@BitTorrent/announcements-on-btt-redenomination-plan-supported-by-exchanges-and-btt-renaming-af8441c2b486: BTTC naBinance é ticker do novoBTT; candidato já inspecionado em8b040730. Git determinístico ahead37 confirmou três alvos, sem commitWorker. Próximo: comparação visual delimitada do logoBNBoficial com candidatos antes de selecionar; providersPIX/PayPal e ações restantes pendentes.


## Checkpoint U4F2 — integração BNB em revisão

Seleção do supervisor: candidato bnb.png (cubo) confirmado frente à guia primária BNB Chain; binance-coin.png (outro símbolo) não selecionado. Evidência .ia.rules/cache/FT-107/bnb-compare-20261116/report.json. PNG pinado e MIT do pacote já usado; não inferir licença de marca/afiliação da referência primária. Cópia byte a byte e referência somente da rede USDT/BNB. Catálogo local atende contrato específico de disponibilidade/integridade/privacidade de doações. Validações desta unidade pendentes; provedores PIX/PayPal e UI/automação/gate global seguem pendentes.

Validações executadas nesta sequência: fonte financeira canônica, contrato, assets e teste oficial de atribuições aprovados. Comparação antes/depois prova alteração somente do networkAssetId de USDT/BNB e inclusão do novo asset, sem mutação financeira. Aprovação final do supervisor e commit ainda pendentes.

## Retomada U4G — provedores

Revisão do supervisor concluiu U4F2: diff/PNG/finanças/contrato/assets/atribuições conferidos, Q8S registrado; commit 66133b66a1 integra BNB. O primeiro git add retornou erro de ignore, mas os seis alvos foram preparados; índice foi reconciliado antes do commit, sem repetir staging. Exceção local exata para este contexto corrige o caso subsequente. Próximo: candidatos PIX/PayPal e licença/proveniência, sem seleção ou publicação automática.

## Checkpoint U4G2 — provedores em revisão

Supervisor inspecionou representações PIX e PayPal do Font Awesome Free 7.3.1. SVGs copiados sem alterações e avisos preservados; licença do pacote publicada junto aos arquivos. Catálogo compartilhado recebe duas referências de provedor, sem mudar recebimento. Atribuição existente estendida, sem duplicar o recurso. CSS/CDN @latest preexistente não foi alterado. Validações e revisão final desta unidade pendentes; sem conclusão global.

Dados canônicos, contrato, oito hashes reais e atribuições aprovados nesta sequência. Comparação independente com snapshot preservou todos os métodos removendo apenas as duas referências novas para teste de igualdade. Revisão/commit do supervisor e conferência final de cobertura/documentação FT107 continuam pendentes.


## Checkpoint U5B corretivo

Job 3f48f0e4 criou rascunho sem leituras normativas nem comandos requeridos: não aceito; Q8S3. Arquivo preservado no cache docs-correction-20261116/before.md. Nova unidade determinística leu normas antes de novos efeitos; isso não convalida a ordem anterior. Corrigidos acessibilidade, clipboard e exemplo: JS compilado, dados derivados, asserts que falham, cópia em memória. Links e exemplo executável passaram nesta sequência; revisão/commit pendentes. README, documentação de dados/QR e aceite FT107 seguem pendentes; nenhuma FT concluída.


## Checkpoint U5C — índice e estado reconciliados

Revisão 51c8be0c aceita/Q8S10; commit 554836e601 documenta APIs de assets e ações. README indexa a página canônica e link existe; preservadas todas as demais linhas. FT107 continua em andamento: documentação de dados/QR e cobertura final pendentes. FT116 corrigida: merges 5d4254371f/4e23e3a66a e upstream 756be748 comprovados ancestrais do HEAD; obstáculos históricos não são bloqueios atuais. Rastreamento nesta unidade HEAD...upstream=5	0 (ahead/behind); sem novo fetch, push ou alegação de gate global aprovado. Demais FTs e TODO preservados; projeções sincronizadas pelo mecanismo oficial.

## Checkpoint U7 — conclusão técnica FT-107

Documentação de dados, especificação QR e matriz/canvas concluída nos commits6193e1b829,bd11f2c341 e414a55cabb; links, assinaturas e preservação do conteúdo anterior conferidos. Índice README atualizado. Evidências aceitas U1/U2B/U3G/U4A e catálogo8assets/1972d950f7 mantidos, sem repetição de testes confiáveis. Auditoria52cfb0fc/Q8S4 foi parcial: repetiu U5C antigo e ignorou documentação atual; sua conclusão de ausência foi rejeitada pelo supervisor, sem invalidar suas referências históricas corretas.

Conclusão técnica registrada pelo mecanismo oficial concludeFeatureState, com developerValidated=false. HistóricoFT107 e índices gerados, demais seções e TODO preservados, projeções conferidas. Aceite humano permanece externo. UI/expansão/download integrado pertencem à FT108; retornoFT109,workflowFT110 e integração globalFT111 permanecem pendentes. Próxima unidade: inventário delimitado para página /doe, reutilizando fonte e helpers existentes.

## FT-108 — plano de execução após I1

I1/c5230448 recebido e revisado/Q8S6: inventário parcial; layout captura HTML sem filtro ativo de compressão, dados/QR existentes apenas não fornecidos. Trechos canônicos confirmam módulo global no head/custom:193 e initDOMContentLoaded em site.ts; novo runtime de doações ficará no menor ponto de composição, sem inclusão global. Supervisor carregou integralmente governança auxiliar (mudança de rota), RCFs desempenho/progressivo e capacidades WEB-BROWSER/WEB-STATIC; WEB-EDITORIAL não é disparada pela página utilitária.

1/4 P1 — base estática reutilizável: propor página _pages/doe.html e partial _includes/jcem/donations-content.html com Liquid/JSON, escape, detalhes nativos, campo readonly para cópia manual e CTA PayPal. Sem novos scripts/imagens/estilos nessa unidade; não apresentar controles sem comportamento. Estado: elaboração local da proposta; implementação só após revisão.
2/4 P2 — aprimoramentos QR/cópia/expansão/download com helpers já aceitos e carga exclusiva ao componente após conteúdo inicial; não duplicar payloads/encurtador.
3/4 P3 — aparência responsiva/claro-escuro, assets comuns e integração do fallback noscript por composição; carregar RCF de componentes compartilhados antes de alterar esse fallback. Todo conteúdo essencial permanece legível, sem bloqueio de inicialização.
4/4 P4 — artefato renderizado, teclado/foco, dados exatos, QR final decodificado, documentação e gates pertinentes; aceite integrado/globalFT111 permanece separado.

Levantamento do fallback atual mostrou painel genérico em _includes/jcem/noscript-content.html; a base P1 não prova ainda o aceite sem JavaScript do site completo. Nenhuma mudança compartilhada ou publicação é autorizada por uma proposta preliminar. Reutilizar metadados/licença e biblioteca local já adotados, sem nova dependência.

### P1 — revisão da proposta688f8f59

Retorno recebido uma vez/Q8S3: page truncada e duplicada, sem include alegado; escapes/licença incorretos. Preservar proposta original no job. Partial reaproveitada com correções pontuais de atributos, autoria/licença, rótulos, raiz única e remoção do noscript local; page mínima composta pelo padrão de front matter/include já existente. Artefato revisado: .ia.rules/cache/FT-108/P1/reviewed.json. Sem reescrita volumosa pelo supervisor.

Dependências de verificação comprovadas: Ruby4.0.5/Liquid4.0.4/Nokogiri1.19.4 via bundler/setup. Primeiro processo no sandbox falhou0xC0000022 antes da execução; mesma checagem somente leitura com permissão ampliada aprovou, sem instalação/alteração do ambiente. Próxima unidade determinística lerá normas antes de aplicar e verificará Liquid, valores canônicos, controles nativos, URL PayPal e escape com entrada adversarial; ainda não equivale a build/validação visual do site completo.

### P1 aplicada; validação corretiva

586c36ed: read-contracts e apply-foundation exit0; novos _pages/doe.html e _includes/jcem/donations-content.html conferem exatamente com reviewed.json. verify-foundation falhou antes da renderização por NameError:data; supervisor omitiu data=JSON.parse(data_text), não é falha da implementação ou infraestrutura. Q8S10 pela sequência determinística cumprida, parada sem replay. Aceite/commit P1 pendentes. Próximo job somente leitura executará verificador corrigido, sem reaplicar arquivos ou repetir exploração.

### P1 aceita; P2A conector de cópia

8f7e9f9d recebido uma vez: verificação corrigida exit0, seis meios canônicos, valores completos, URL PayPal protegida, atributos/textarea escapados com controle negativo. Templates examinados/Q8S10; commit exclusivo8dda4fe088, staging herdado preservado. P1 concluída no escopo da base; build/visual/noscript completo ainda P3/P4.

P2A: propor módulo TypeScript de aprimoramento de cópia/endereços, exportado e sem auto-init nesta primeira subunidade. Reusar validateDonationsData, getDonationCopyValue, shortenDonationAddress e copyDonationValue; nenhum algoritmo/valor financeiro duplicado. Método PayPal não recebe cópia. DOM seguro, nomes acessíveis, feedback textual, idempotência e fallback nativo intacto. Montagem, fonte JSON cacheável e agendamento exclusivo pós-pintura serão P2B; QR composto/expansão/download, P2C. Não ligar no site antes de teste do conector e integração própria.

P2A/f9253680 recebido uma vez/Q8S3, não aplicado: ausência de cabeçalho/idempotência/reuso de copyDonationValue, tipoDOM inválido HTMLSummaryElement, botão com role=status dentro do summary, label duplicada e timers arbitrários. Sem efeitos/novos arquivos no Git determinístico. Correção local será outra proposta estritamente do mesmo módulo, com algoritmo de bind especificado: resumo e valor acessível no summary existente; botão/status separado no corpo; copyDonationValue com await/catch; flag por método apenas após append; sem timers. Revisão/compilação/teste de DOM continuam obrigatórios antes da integração.

P2A/b2281683 recebido uma vez/Q8S2: repetiu tipo inválido/role/timer e omitiu importDonationMethod; nota afirma código diferente do entregue. Não aplicado. Sem nova geração livre nas mesmas condições: supervisor preservou fonte e corrigiu somente declarações/trechos objetivamente defeituosos por substituições exatas. Artefato .ia.rules/cache/FT-108/P2A/reviewed.json mantém algoritmo/maior parte da proposta e rastreia correções.

Transpilação seguirá tsconfig canônico, isolando emissão em cache e publicando apenas donations-ui.js. Novo chunk entra no comando build:ts/injetor já existente para preservar banner em builds futuros. Config/code-metadata.json possui upstream legado /blog, incompatível com RCFdocumentação que exige /www; alterar somente esse campo da SSOT como precondição do banner correto, sem editar gerador ou recompilar artefatos alheios. Não é evolução de norma/negócio nem nova dependência. Teste reutilizará Playwright/Edge e imports dataURL do padrão test_donations_qr_composed.ts, com partial Liquid real, valores do JSON e clipboard em memória.

Correção da estratégia antes de efeitos: probe real de TypeScript transpileModule(removeComments=true) preservou comentário /*! e removeu JSDoc comum. Logo não há necessidade de alterar package/config/injetor: usar marcador de banner suportado pelo compilador canônico. A proposta anterior de metadados não foi executada e fica superada; o upstream legado permanece dívida externa ao microescopo. Alvos funcionais continuam apenas donations-ui.ts/.js. Compilação isolada herda tsconfig vigente, sem substituir opções de linguagem/comentários; publica só o novo JS. Teste usa Playwright/Edge já instalado, conforme padrão existente.

Aplicação P2A preparada: reviewed.json09f93728656b626dbace41705fba8b3e49266903dd2e43d3a5a4558670c324c0 inclui Array.from para libDOM/ES2019 canônica. Verificador temporário4892d1ff1cd07d60c6bfdb997a836d0b44c7ecc77fe84429f8faa67d890970b2 passou syntax-check Node/strip-types. Sequência ler→aplicarTS/configisolada→tsc→publicarsóJS→testeDOM. Teste gera somente perfil/cache dentro da raiz (comando write declarado), usa partialLiquid e JSON atuais, cinco cópias integrais por Enter, idempotência, nome nativo/status separado, PayPal excluído, dado inválido sem mutação e falha de clipboard/label adversarial. Não é integração/aceite visual da página.

P2A/5d34f597 recebido uma vez: quatro primeiros comandos exit0; TS aplicado, compilação canônica e publicação do novo JS comprovadas e comparadas aos artefatos, sem alterações em package/config. Verificador não iniciou o navegador: extensão .ts sob .ia.rules/package.json(typecommonjs) rejeitou importsESM. Causa no contrato de execução do teste fornecido pelo supervisor, não nos módulos nem instalação. Q8S10 pela sequência determinística/parada correta, sem reaplicação. Cópia byte a byte do teste para verify-copy.mts preserva original e força ESM sem mudar pacote; hash permanece4892d1ff... e syntax-check aprovado. Próximo job apenas verificação com auxiliares de browser em cache; aceite/commit ainda pendentes.

### P2A aceita; P2B montagem

c8fd7a96 recebido uma vez: testeEdge exit0, cinco cópias porEnter, idempotência/status/fallback/PaysPal/dadoinválido/labeladversarial comprovados. Fonte examinada/Q8S10; commit exclusivo7e459a0f2f, documentaçãoAPI emdacc119f22. Sem ligação automática ainda; staging herdado preservado.

P2B: bootstrap exclusivo do componente, apósDOMContentLoaded e duas oportunidades requestAnimationFrame; import dinâmico do conector depois dessa pintura. Dados no próprio componente em script application/json,data-jcem-donations-data,gerados do mesmoJSON que renderiza campos. Decisão substitui endpoint/fetch planejado: snapshot4527bytes medidos elimina uma requisição e preserva identidade entre valores exibidos/copiados no mesmo artefato, sem duplicação autoral de configuração ou JSONconcorrente. Preferência genérica por configcacheável cede neste componente à coerência do snapshot e menor número de requisições; nenhuma norma é alterada.

Serialização Jekyll4.4.1 jsonify/replace('<','\\u003c') comprovada com fechamento adversarial de script e roundtrip, sem perda de dados. Módulo externo referenciado pelo include próprio, usando relative_url; não mudar site.ts/head ou carregar recursos em páginas sem o componente. JSONerro ou falha de módulo preserva HTML/nativo e informa cópia manual por status; sem retries/timers/ocultação. Clipboard acessado somente no gesto pelo adaptador, erros tratados pelo conector já testado. Aplicação/compilação/teste integrado posteriores à revisão da proposta.

P2B/af43d509 recebido uma vez/Q8S3: imports/tipos inexistentes, schema paralelo, carga estática contrária ao pós-pintura e estado de erro incompleto. Nada aplicado. Fonte preservada; substituições exatas removem imports/schema duplicado, usam unknown e tipoDOM existente, import dinâmico real, guarda loading/ready, erro na raiz e documentação das declarações. Fluxo de status/agendamento/adaptador foi reaproveitado. Artefato revisado em cacheFT108/P2B/reviewed.json inclui tagsinertes/module literais já verificadas. Próxima sequência aplicará TS+partial, compilará com tsconfig herdado/publicará só bootstrapJS e verificará renderização/snapshot/pós-pintura/fallback em Edge, mantendo P2C/P3/P4 pendentes.

P2B preparado: artefato05c965ad1b2af07a99ea0e7b1ee6bfbd082355875ea6d69be9829d4c76391e83 e verificador95db0e38aecc25892002c0607795fac20d7c5ab8fce0aaeedd32ed2142accfb7(syntax-check aprovado). Contexto real Jekyll::Site/relative_url validado com cache local e plugins desativados para fixture. Teste mantém conector pendente, observa import apósDOMContentLoaded+doisframes, snapshot exato/campos disponíveis, cópia viaEnter, JSONinválido/fallbackmanual, labeladversarial sem script e fixture sem componente sem scripts. Todos requests servidos em memória por Playwright, sem rede externa; perfil/cache só na raiz. Não comprova build/visual do site inteiro.

### P2B aceita; P2C segmentada

2480905c recebido uma vez: cinco comandos exit0; snapshotexato, importemdoframes2, cópiateclado, JSONinválido/escape/fallback comprovados no componente. Fonte/diffexaminados/Q8S10; commit exclusivoe0a84fa9df e docsf1da8371dd. Stagingherdado preservado. Sem aceite visual/global.

P2C1: apenas novo export enhanceDonationQr no mesmo móduloUI, recebendo callback async openQr(method,opener) que resolve no fechamento/rejeita emfalha. Cinco métodos com botão/nome acessível, status separado, idempotência e guarda de acionamento simultâneo; não tocar cópia nem ligar botão na página antes de callbackfuncional. P2C2: diálogo nativo/fallback/composição/download com helpers/decoder já existentes e carga local sob gesto; depois integrar no bootstrap. P2C3: prova de QRfinal/cicloabrir-fechar/PNG/fontesfoco antes de P3/P4. Isto segmenta escopo, não cria biblioteca/framework ou garante recurso ainda não feito.

P2C1/661f583f recebido uma vez/Q8S8: função aderente; cabeçalho/imports extras contradiziam nota de append. Extração literal apenas de JSDoc+função preserva proposta sem recodificação. Artefatodfcace942dceb4a9f39d10bf20ca1ff3ba2983e45de130f6e0189e7ec3bdf1ee; verificadorc903473b01091ee5dadaeb9854b278f78d0c702cd4569b7112a48d77b04cac16 parte do fixtureJekyll já usado e importsdataURL do teste anterior. Compilará sóUI/deps em cache, preservando prefixoTS antigo byte a byte; publicará somenteUIJS. TesteEdge observa cinco callbacks com dados exatos, Enterrepetido bloqueado durantePromise, foco apósresolver, rejeição/fallbackmanual, idempotência, coexistência com cópia e labeladversarial. Não compõeQR nem aceita diálogo inexistente.

### P2C1 aceita; P2C2 por recursos e apresentação

971b0931 recebido uma vez: cinco comandos exit0, prefixoTS/cópia preservado; callback/método exato, guarda busy e fallback comprovados, Q8S10. Commit exclusivoec8b4f8da3, docscc7499becd. Foco no diálogo real continua pendente, conforme limite do fixture. Nenhum botão QR ligado à página ainda.

P2C2A — recurso cancelável: novo donations-qr-resource.ts com prepareDonationQr(doc,method,siteUrl,logoUrl,signal):Promise<HTMLCanvasElement>. Reusar getDonationQrSpec/createDonationQrForSymbol/renderDonationQrWithSymbol; importar biblioteca local51907bytes sob demanda; fetch do logo somente mesma origem,comAbortSignal; criar/fecharBitmap emfinally,checar cancelamento entrefases,retornarcanvasacessível. Dados/legendas sem recadastro. APInecessária para cancelar carregamento ao fechar o diálogo, não wrapper de inferência geométrica.
P2C2B — host de diálogo consumindo produtor(signal),com fechar/Escape/foco/tab/download e AbortController; deve poder fechar durante a preparação. Callback resolve no fechamento; erros preservam cópia manual.
P2C2C — ligação no bootstrap sob gesto, com siteURL de site.url e URLlocal homologada do logo no componente,seguida de testePNG/decoder/ciclo completo. Configsite.logo atual é externo; não usá-lo. Fonte local autorizada permanece assets/jcem/img/logo-animado.gif(88309bytes),bitmap372x192 e recorte controlado pelos helpersFT107.

P2C2A/18da997f recebido uma vez/Q8S3: bitmap fechado antes do draw, checks de abort incompletos/JSDoc ausente/licença incorreta. Nada aplicado. Correção pontual movefinally para envolver desenho/retorno, verifica cancelamento em fronteiras, preserva reason mesmo nulo, corrigebanner/JSDoc/aria e nega redirects para preservar origemlocal. Artefatod89f4fd73e1c0b30f532f4e12f11706056ca8af756d87ab81317e064cdec4d12. Verificadordfed580d525dd22e950986fd17b2be6c9fb870d0ffa4e0915cc0eb173f980e13 passou syntax-check; Sharp0.34.4/jsQR1.4.0 carregados no runtime real. Teste produzirá5PNGs/decoderbytes, checkcloseBitmap, cancelamento prévio/fetch/pósBitmap,HTTP503/origem/credenciais/redirect/PayPal e imutabilidade. Perfis/renders/cache apenas P2C2A; endpoints atendidos em memória,sem redeexterna. Somente recurso/canvas,sem diálogo ou aceitevisualglobal.

### P2C2A aceita; próxima unidade P2C2B

82377ef6 recebido uma vez: sequência determinística de cinco comandos exit0. Cinco PNGs decodificados byte a byte contra JSON canônico; cancelamento antes/fetch/pós-bitmap, limpeza, origem/credenciais/redirect/HTTPerro/PayPal e imutabilidade comprovados. Fonte examinada; ajuste exclusivamente de indentação com emissão idêntica. Q8S10 registrado/revisão1; commit exclusivo feca552be5. Git determinístico não alegava commit: arquivos eram novos, agora versionados pelo supervisor; staging herdado preservado.

P2C2B será proposta local somente leitura de donations-qr-dialog.ts: host recebe produtor(signal), mostra diálogo antes da preparação, permite fechar/Escape durante a carga, prepara link PNG nativo, limpa abort/canvas/objectURL e resolve somente ao fechar. Sem ligação no bootstrap nesta unidade. Testes posteriores cobrirão foco real, teclado, download e corridas de fechamento; aparência/global continuam P3/P4. Escopo estimado: um módulo, evidência de APIs/requisitos mínima, sem nova exploração nem dependência.

42d9159f recebido uma vez: WORKER_INCOMPLETE/RESPONSE_CONTRACT na resposta final, dois candidatos excedem maxLength4000 por campo. Sem ferramentas/efeitos; Git determinístico mantém dev ahead15 e staging herdado. Revisão encontrou promessa sem assentamento no fechamento, handlers tardios, helper duplicado e fallback inválido; Q8S2 registrado/revisão1. Não é falha de infraestrutura. Rascunho1 preservado em .ia.rules/cache/FT-108/P2C2B/rejected-draft1.json; cabeçalho/validação/nós DOM básicos recuperáveis, restante recusado. Escopo anterior sobrecarregou a resposta; nova unidade gera apenas o corpo de um executor Promise com nós já definidos, até4000 caracteres, sem recodificar módulo inteiro. Aplicação/compilação/teste ainda não autorizados por este rascunho e serão unidade expect_changes=true após revisão.

546a6a8e recebido uma vez/COMPLETED somente proposta, zero comandos/commits: body regenerou função inteira e anulou resolve/reject; Q8S3 registrado/revisão1. Código não aceito diretamente; Git determinístico ahead15, sem módulo novo. Original lifecycle-original.json preservado. Correções delimitadas: executor Promise real, remoção de resolve/reject falsos e duplicação de cleanup, async IIFE com catch, finish(false) explícito, delete busy, validação, título/seletor e tipo da lista de foco; cabeçalho/JSDoc adotados. Nós/fluxo originais preservados, sem nova geração livre. Formatação determinística por scanner/printer TypeScript comprovou tokens idênticos. Reviewed.json 0e3f921e951781a7c93127a1ddfc3222579c203751cfee9db2207a00e61be983.

Sequência preparada: ler contratos antes dos efeitos → aplicar só donations-qr-dialog.ts → compilar com tsconfig canônico e outDir cache → publicar só donations-qr-dialog.js → verificar Edge. Teste0914ad675db0e5437350fbf24860878b384f63408f888167d62d3424ea80e6bc/operate40afdcf48171b81b6138bb50ec761bd681c60c59be11cad6ec3311aef57de26d passaram syntax-check. Fixture com métodos do JSON e binder real, modal/foco/Tab/ShiftTab/retorno opener, downloadPNG/pixels independentes, fechamento antes do produtor e durante blob, descarte tardio, URL/revogação, rejeição null/undefined, concorrência, showModal inválido, fallback e cancel. Não repete decoder de payload já aceito; integração real e visual seguem pendentes. Comandos browser escrevem somente cache/perfil local; sem rede externa ou mudanças compartilhadas.

d23939a8 recebido uma vez: read/apply/compile exit0; publish exit1 na guarda do banner, verificador não executado. Git determinístico mostra somente novo TS, JS ausente; probe confirmou TS exato do reviewed.json. Q8S10 registrado/revisão1 pela execução determinística/parada correta. Causa na formatação preparada pelo supervisor: printer suprimiu linha vazia entre /*! e import; tokens idênticos não garantiam preservação de comentário no emit TypeScript. Probe original=false/gap=true/afterImport=false isolou uma linha vazia como correção. Não é infraestrutura nem defeito de lógica conhecido. Continuação não reaplica implementação: repair-banner.cjs aceita só original/corrigido, insere uma linha vazia, exige banner emitido e mesmo JavaScript após removê-lo; depois recompila/publica/testa. Reviewed original preservado; versão corrigida terá artefato próprio. Aceite/commit continuam pendentes.

### P2C2B aceita; próxima integração P2C2C

a00dda0a recebido uma vez: cinco comandos exit0, teste Edge do host aprovado. TS corrigido/JS emitido conferidos, staging herdado intacto. Q8S10 registrado/revisão1. Commit exclusivo1708c55be0; Git determinístico antes do commit mostrava os dois arquivos novos, não versionados. Modal real/Tab/foco/retorno opener, PNG baixado/pixels, abort/corridas/recursos, falhas e fallback cobertos. Sem alegar integração nem visual global.

P2C2C: ligação mínima no bootstrap já existente. Metadados locais escapados na raiz: site.url canônico e logo GIF homologado via relative_url, nunca site.logo externo. UI continua após dois frames; callback de QR importa host sob gesto, produtor importa recurso QR com AbortSignal e mostra diálogo antes de esperar recursos pesados. Reusar dados do snapshot e helpers, sem redefinir payload/legenda. Não alterar site.ts, dados, biblioteca, CSS ou noscript. Teste renderizará partial real com Jekyll e baixará cinco PNGs pela UI, decoder independente contra JSON, keyboard/foco e carga exclusiva/sob demanda. P3/P4 e demais FTs continuam pendentes.
