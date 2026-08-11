<!-- AI-PROCESSED -->
# RCF-JCEM-NAMESPACES-EDITORIAIS-001

Status: vigente.

Escopo: namespaces de topo, subnamespaces, título lógico, nome físico e URL pública de classes editoriais.

## Conceitos e autoridade

- Namespace editorial é identificador de classe anteposto ao título lógico, análogo a namespace da Wikipédia; não é diretório-fonte, categoria nem taxonomia ordinária.
- Todo namespace de topo DEVE terminar semanticamente em `:`. A configuração `content_namespaces` é a única autoridade do mapeamento entre chave, título, prefixo físico, segmento público e rota.
- Nome físico, namespace lógico, título e URL pública são representações distintas e deterministicamente conversíveis. Limitação de filesystem somente PODE alterar a representação física.
- Plugin ou adaptador DEVE consumir a configuração central; permalink individual, regra por artigo, substituição pública ad hoc ou inferência por conteúdo são proibidos.

## Topo e subnamespaces

- A URL canônica DEVE seguir `/p/<namespace>:<subnamespace-1>/.../<subnamespace-N>/<titulo-normalizado>/`, com profundidade `N` não limitada artificialmente.
- Subnamespace DEVE pertencer a um único namespace de topo, ser um segmento normalizado próprio e não receber `:`; sequência vazia, `.`, `..`, barra embutida, separador de sistema, segmento duplicado ou valor que altere a raiz DEVE falhar.
- Subnamespaces DEVEM ser declarados como lista ordenada em `content_subnamespaces` no front matter ou produzidos por adaptador especializado com evidência inequívoca. Quantidade de citações ou palavra isolada NÃO DEVEM criar subnamespace.
- Normalização DEVE usar Unicode determinístico, minúsculas, transliteração/slugificação vigente do projeto e rejeitar resultado vazio. A mesma entrada DEVE produzir a mesma URL em Windows, Linux, desenvolvimento, build e GitHub Pages.
- O nome físico PODE representar subnamespaces por diretórios portáveis. O segmento público do namespace de topo DEVE conservar literalmente `:`; `%3A`, hífen ou forma física NÃO DEVEM tornar-se canonical.

## Integração e publicação

- O plugin DEVE derivar URL e destino, limpar `permalink` concorrente, validar prefixo de título e contrato especializado e expor metadados de namespace/subnamespace ao artefato.
- Em filesystem incompatível com `:`, o destino local DEVE usar `physical_prefix`; em destino publicável compatível, o artefato DEVE materializar o segmento lógico literal.
- Redirecionamento ou canonical alternativo somente PODE existir por contrato explícito de migração; a rota lógica permanece autoridade.
- Nova classe editorial DEVE ser adicionada por configuração e sub-RCF própria quando possuir regras de negócio, sem condicional privada no núcleo do plugin.

## Validação

- Testes DEVEM cobrir zero, um e múltiplos subnamespaces; profundidade arbitrária; Unicode; entrada inválida; prefixo físico; URL literal; destino Windows/Linux; canonical; idempotência e duas classes configuradas.
- Build local e publicável DEVEM produzir conteúdo e URL equivalentes, ressalvada somente a representação física documentada.

