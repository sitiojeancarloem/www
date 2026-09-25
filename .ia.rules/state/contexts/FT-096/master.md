# Contexto mestre — FT-096 a FT-098

Estado: fases registradas e bloqueadas pelas normas/implementações predecessoras. Fonte material: `TODO.ia.md` no commit `d6e48a9b90defd21b6ff07760b82cec1456c4362`.

## Objetivo

Implantar revisão automatizada de artigos alterados com seleção mínima, salvaguardas e contratos modulares, aplicando as normas editoriais e visuais pertinentes e preparando material local sanitizado para eventual proposta upstream, sem qualquer atuação externa.

## Estado real inventariado

- `.github/workflows/` contém build/publicação, agendamento e redes sociais; não há workflow de revisão editorial por IA.
- A publicação já produz e consome conjuntos de posts alterados em `scripts/publish.rb`, `.jcem-published-posts.txt` e `scripts/collect_published_posts.rb`; essa infraestrutura deve ser avaliada antes de criar detecção paralela.
- `package.json` expõe mecanismos oficiais gerenciados de workflow, editorial, upstream e estado; qualquer integração deve respeitar as fronteiras do repositório Final.
- O upstream configurado pertence a outro repositório e permanece intocável. Esta frente pode gerar somente arquivos locais de proposta sanitizada.

## Fases e dependências

1. FT-096 — equalização e normatização da Action, interfaces, privilégios, gatilhos, seleção, saída e fronteira upstream; depende das FTs 090 e 093.
2. FT-097 — implementação do workflow/adaptadores e do pacote local de proposta; depende das FTs 091, 094 e 096 e de autorização humana nova.
3. FT-098 — integração e validação sem efeitos externos; depende das FTs 092, 095 e 097 e de autorização própria.

## Limites

- Gatilhos e permissões não serão presumidos antes da inspeção do fluxo e do modelo de segurança real.
- Revisão automática deve limitar-se aos artigos materialmente alterados e produzir resultado revisável; escrita automática no corpus, commit, PR ou publicação exigem contrato e autorização expressos.
- Segredos, conteúdo privado, logs sensíveis e metadados do consumidor não podem integrar proposta upstream.
- É proibido abrir, publicar, atribuir, rotular, implementar ou acompanhar issue no upstream nesta frente.

## Próxima retomada

FT-096 só inicia após a conclusão normativa de FT-090 e FT-093. FT-097 e FT-098 permanecem bloqueadas até as implementações predecessoras e autorizações humanas correspondentes.
