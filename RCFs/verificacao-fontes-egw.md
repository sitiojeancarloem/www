<!-- AI-PROCESSED -->
# RCF-JCEM-FONTES-EGW-001

Status: vigente.

Escopo: localização reutilizável, somente leitura, de texto e variantes em bibliotecas locais de publicações de Ellen G. White, com confirmação opcional entre EPUB e PDF.

## Fronteira e autoridade

- A capacidade DEVE ser acionada por entrada explícita: raiz da biblioteca, consulta e, quando conhecidos, idioma, obra ou sigla. Ela NÃO PODE fixar artigo, draft, estação de trabalho ou biblioteca privada como caso único.
- A Skill local decide a estratégia e apresenta os limites; o script associado executa descoberta, extração, normalização, correspondência e serialização determinísticas.
- A capacidade é instrumento de evidência. Ela NÃO autoriza editar, completar, revisar, publicar ou atribuir texto editorial, nem transformar aproximação em citação.
- Biblioteca consultada, draft e demais fontes DEVE permanecer somente leitura. Saída temporária ou cache, quando solicitado, DEVE residir fora da biblioteca e ser dispensável.

## Descoberta e correspondência

- EPUB DEVE ser lido como contêiner estruturado, respeitando metadados e ordem de leitura disponíveis. PDF DEVE ser lido por mecanismo que preserve número físico da página extraída.
- A normalização PODE equalizar Unicode, caixa, espaços, pontuação tipográfica e diacríticos para descoberta de variantes; o trecho apresentado como evidência DEVE preservar o texto extraído da fonte.
- Busca aproximada DEVE possuir tolerância explícita e limitada. Resultado aproximado nunca equivale sozinho a confirmação literal.
- Filtros de idioma, obra ou sigla DEVEM reduzir o conjunto sem ocultar a identidade real do arquivo e da publicação encontrados.
- O contexto DEVE ser configurável e suficiente para inspeção humana, com limites explícitos de resultados, arquivos e tamanho processado.

## Cruzamento EPUB/PDF e estados

- A estratégia preferencial é localizar no EPUB e, quando paginação ou referência física for necessária, confirmar na edição PDF correspondente. Busca direta em PDF continua válida quando solicitada ou quando não houver EPUB utilizável.
- Correspondência entre formatos DEVE usar identidade verificável da obra, idioma e metadados disponíveis; igualdade inferida apenas por semelhança de nome deve ser declarada como ambígua.
- A saída estruturada DEVE declarar exatamente um estado principal: `located`, `confirmed`, `divergent`, `ambiguous`, `absent` ou `unavailable`.
- `confirmed` exige evidência compatível nos formatos cruzados e página PDF identificada. `divergent` exige registrar as evidências incompatíveis sem escolher silenciosamente uma. `unavailable` cobre formato, dependência ou entrada inacessível, sem ser convertido em ausência textual.
- Cada ocorrência DEVE identificar formato, arquivo relativo à raiz, obra, idioma, localização interna ou página, contexto preservado, método e pontuação quando houver aproximação.

## Segurança, portabilidade e validação

- Paths externos absolutos, nomes de usuário e metadados privados NÃO PODEM aparecer na saída sanitizada; paths de resultado são relativos à raiz explícita.
- O script DEVE funcionar com biblioteca explicitamente fornecida e usar somente leitura. Dependência PDF ausente DEVE produzir `unavailable` e código previsível, nunca confirmação simulada.
- Fixtures DEVEM cobrir EPUB, PDF, variante normalizada, contexto, paginação, divergência, ausência, limite e mecanismo PDF indisponível.
- A validação de integração DEVE executar ao menos uma consulta real em biblioteca disponível, registrar hashes antes/depois do draft e de amostra da biblioteca e provar ausência de mutação.
- Nenhum trecho localizado no ciclo desta FT PODE ser aplicado ao draft; uso editorial posterior exige solicitação e autorização próprias.
