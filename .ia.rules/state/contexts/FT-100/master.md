# Contexto mestre — FTs 100 a 102

Estado: inicializadas; FT-100 em equalização normativa, implementação expressamente autorizada após sua conclusão.

## Objetivo

Criar uma capacidade local, estreita e reutilizável para localizar e verificar trechos atribuídos a Ellen G. White em EPUB/PDF, com evidência auditável e falha preservadora, sem processar o conteúdo do draft que originou o requisito.

## Estado real inventariado

- A biblioteca configurável pode conter pares EPUB/PDF e metadados `.source.json`; a instância local observada possui 550 EPUBs e 539 PDFs.
- EPUB oferece busca textual e estrutura; PDF é a fonte apropriada para confirmação de página quando o texto é extraível.
- O ambiente do blog não declara parser PDF próprio; a capacidade deve detectar `pypdfium2` e falhar localmente com diagnóstico quando ele não estiver disponível.
- Skills editoriais existentes não devem receber lógica mecânica de busca ou parsing.

## Fases

1. FT-100 — normatizar entrada, estratégia, evidência, estados, limites e preservação.
2. FT-101 — implementar Skill local, descritor, configuração e script determinístico EPUB/PDF.
3. FT-102 — validar fixtures, integração real somente leitura, roteamento, documentação operacional e ausência de efeitos no draft/biblioteca.

## Limites

- Não editar o draft nem aplicar qualquer outra diretiva de seu cabeçalho.
- Não alterar, indexar por escrita, baixar ou reorganizar a biblioteca externa.
- Não considerar similaridade como confirmação; divergência ou evidência insuficiente permanece explícita.
- Não acessar rede automaticamente; conferência web futura depende de ação e autorização próprias.
