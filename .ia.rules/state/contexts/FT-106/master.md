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
