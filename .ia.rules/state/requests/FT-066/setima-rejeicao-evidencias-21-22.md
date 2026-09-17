# Fonte complementar da FT-066 — sétima rejeição das evidências 21 e 22

- Origem: prompt humano de 2026-09-16.
- Solicitação íntegra: `O defeito apresentado pelas evidencia21.png e evidencia22.png já mencionados em momento anterior ainda persistem: corrija.`
- Evidências vinculadas: `../evidencias/evidencia21.png` e `../evidencias/evidencia22.png`.
- Fonte detalhada herdada: `quinta-correcao-geometria-inicializacao-blur.md`.
- FTs reabertas: FT-066 e FT-067.
- RCFs de destino: RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001 e RCF-JCEM-COMPONENTES-COMPARTILHADOS-001.
- Estado de incorporação: rejeição capturada; diagnóstico e correção em andamento; aceite humano permanece pendente.

## Efeito da rejeição

A aprovação técnica anterior não demonstra aceite: a divergência lateral marcada nas evidências e a perda visual do `backdrop-filter` continuam presentes. A interpretação que excluiu a rota real das evidências da prova de colinearidade deve ser reavaliada contra a fonte humana, o DOM, os modos canônicos e a renderização real, sem usar a própria classificação implementada como justificativa circular.

O teste anterior também é insuficiente para a persistência do blur: contador interno, propriedade computada e captura imediatamente após um resize automatizado não equivalem à permanência do efeito depois do ciclo de abrir e fechar o inspetor. A nova prova deve falhar se as duas escritas de desativação/restauração forem coalescidas pelo compositor ou se o raster perder o desfoque depois da mudança de viewport/composição.

## Preservação obrigatória

- manter os valores manuais vigentes de fumê, blur, saturação, bordas e sombra;
- preservar FLAG, título, SVGs, sobreposição vertical e modos explicitamente governados pela janela;
- não alterar a largura canônica do artigo para acomodar a COVER;
- não encerrar a TO-DO nem FT sujeita a aceite humano;
- não considerar a sétima correção concluída sem comparação raster causal em Chrome e Brave e sem a rota real das evidências.
