# Subcontexto - TOC automático e TTS

- identidade: `FT-053/TOC-TTS`
- ordem: 1/3
- fase: normatização seguida por implementação autorizada
- objetivo: gerar TOC no build após o primeiro parágrafo real e equalizar sua leitura nos três modos TTS.
- entradas: `TODO.ia.md`, `RCFs/leitura-acessivel-e-tts.md`, `RCFs/impressao-ieee.md`, layout single, normalizador acessível e runtime TTS.
- dependências: preservação integral dos modos contínuo, resumido e completo.
- entregáveis: contrato RCF, transformação HTML idempotente, componente retraído acessível, CSS responsivo/temático, fala seletiva e testes.
- validações: posição com e sem blockquote inicial, Markdown inalterado, teclado, temas, 320 px, três modos TTS e impressão.
- estado: pendente
