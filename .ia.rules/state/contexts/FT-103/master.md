# Contexto mestre — FTs 103 a 105

Estado: inicializadas; FT-103 em equalização normativa.

## Objetivo

Consolidar uma semântica forte e operacional de resiliência: falha contornável aciona alternativa oficial finita; conclusão sem objetivo cumprido somente ocorre após esgotamento comprovado, com estado e diagnóstico preservados.

## Fases

1. FT-103 — norma global e compatibilização dos conceitos existentes.
2. FT-104 — implementação no mecanismo reutilizável apropriado e nos testes de governança.
3. FT-105 — integração, regressão e evidência de alternativas finitas.

## Limites

- Segurança, autorização, escopo e contrato prevalecem sobre qualquer fallback.
- Ausência de alternativa legítima não autoriza improvisação nem simulação de sucesso.
- A implementação deve reutilizar os contratos de scripts, hooks, fallbacks e longa duração já gerenciados.
