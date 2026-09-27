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
