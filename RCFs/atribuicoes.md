<!-- AI-PROCESSED -->

# RCF-JCEM-ATRIBUICOES-001

Status: normatizado na FT-038; implementação pendente na FT-043.

Escopo: página pública `/atribuicoes/` e inventário das obrigações de atribuição de dependências, bibliotecas, fontes, temas, ícones e demais recursos efetivamente distribuídos pelo JeanCarloEM Blog.

## Regras normativas

- A página DEVE listar somente recurso efetivamente presente no artefato público cuja licença ou termo aplicável exija atribuição, aviso, copyright, link, texto de licença ou reconhecimento equivalente. Dependência exclusivamente de desenvolvimento/build, recurso não distribuído ou licença sem obrigação de atribuição pública não entra por completude aparente.
- A decisão DEVE partir do lock/manifesto e do artefato efetivo, confrontados com o texto oficial da licença de cada candidato. Nome do pacote, mera presença em `package.json`/`Gemfile` ou classificação automática de scanner NÃO comprovam obrigação isoladamente.
- Cada registro DEVE conter, quando exigido ou comprovado: nome, recurso efetivamente usado, autor ou titular, origem oficial, versão aplicável, licença com link e texto/aviso obrigatório. Campo não demonstrado permanece ausente; autoria ou obrigação NÃO PODEM ser inferidas.
- Texto obrigatório de licença DEVE ser preservado literalmente dentro dos limites aplicáveis. Resumo editorial PODE acompanhar o registro, mas não substituir aviso, copyright ou licença integral quando sua reprodução for exigida.
- O inventário autoritativo DEVE residir em dados estruturados versionados e consumidos pela página; HTML manual duplicado, lista derivada somente do gerenciador de pacotes ou varredura em runtime são proibidos.
- `/atribuicoes/` DEVE reutilizar layout, tipografia, tokens, tabela/lista acessível, navegação, rodapé e impressão vigentes. A introdução é sucinta; a página não altera identidade global nem usa aparência de documento normativo interno.
- A rota DEVE ser alcançável a partir da região institucional/legal existente, integrar mapa quando aplicável e permanecer disponível sem JavaScript.

## Validação

- Gate de licenças DEVE comparar inventário, locks, assets client-side locais e artefato construído, falhando diante de obrigação comprovada ausente ou entrada órfã sem recurso distribuído.
- Build DEVE gerar `/atribuicoes/index.html`, link institucional válido e HTML semântico com URLs oficiais resolvíveis.
- Validação renderizada DEVE comprovar legibilidade, responsividade, teclado, tema claro/escuro e impressão, sem exigir PageSpeed por página quando o layout já estiver representado por amostra estritamente pertinente.
