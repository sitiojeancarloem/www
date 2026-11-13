---
name: egw-source-verification
description: Localiza e confirma trechos e variantes em bibliotecas locais de publicações Ellen G. White em EPUB/PDF. Use quando uma fonte EGW precisar de evidência reproduzível; não use para completar ou editar texto editorial.
---

# Verificação de fontes EGW

## Autoridade e limite

Carregue `RCFs/verificacao-fontes-egw.md`. Esta Skill produz evidência de localização; não atribui citação por semelhança, não edita o texto pesquisado e não publica conteúdo.

Exija raiz da biblioteca e consulta explícitas. Trate a biblioteca como somente leitura. Não fixe paths privados na saída, em documentação ou em commits.

## Estratégia

1. Comece por EPUB para localizar texto e contexto com menor custo.
2. Restrinja por idioma, título ou sigla quando esses dados forem conhecidos.
3. Use tolerância zero para trecho literal. Aumente `--tolerance` apenas para variação justificável e mantenha o valor explícito.
4. Use `--cross-check` quando a página física ou a compatibilidade entre edições precisar de confirmação. O script procura o PDF correspondente e informa a página extraída.
5. Inspecione o estado e as ocorrências. Não converta `located`, `divergent`, `ambiguous`, `absent` ou `unavailable` em `confirmed` por inferência.

## Execução

```powershell
python .ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py `
  --library-root <biblioteca> `
  --query "trecho procurado" `
  --language pt `
  --title "nome ou sigla" `
  --formats epub,pdf `
  --cross-check `
  --context 180 `
  --limit 10 `
  --pretty
```

Use um interpretador com `pypdfium2` para leitura de PDF. Se ele não estiver disponível, o resultado estruturado será `unavailable` e listará a dependência ausente. EPUB usa somente a biblioteca padrão do Python.

## Leitura da saída

- `located`: evidência encontrada em um formato, sem confirmação cruzada suficiente;
- `confirmed`: identidade da obra e idioma comprovados, evidências compatíveis entre EPUB e PDF e página PDF; aproximação isolada não confirma;
- `divergent`: um formato localiza e a edição correspondente não sustenta a consulta;
- `ambiguous`: múltiplas obras, identidade insuficiente ou correspondência apenas aproximada impedem confirmação determinística;
- `absent`: consulta concluída nos formatos disponíveis sem ocorrência;
- `unavailable`: entrada, formato ou mecanismo necessário não pôde ser lido.

Cada ocorrência preserva o trecho extraído e usa path relativo à raiz. A chave `diagnostics` informa limites, formatos lidos e impedimentos sem expor path absoluto.

## Verificação

Confirme que raiz e consulta vieram da solicitação; tolerância e filtros estão registrados; página só aparece para PDF; estado corresponde às evidências; nenhuma citação foi fabricada; e os hashes das fontes consultadas permaneceram inalterados.
