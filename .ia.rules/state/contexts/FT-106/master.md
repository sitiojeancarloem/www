# Contexto mestre — FTs 106 a 111

Estado: inicializadas; FT-106 em equalização normativa.

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
