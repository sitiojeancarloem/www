# Modo de uso — Verificação de fontes EGW

Localize trechos em EPUB e confirme evidências em PDF sem alterar a biblioteca ou o conteúdo editorial. Esta ferramenta não fabrica citações nem paginação.

## Demonstração reproduzível

Na raiz do repositório, com Python disponível, execute:

```powershell
python scripts/test_egw_source_verification.py
```

O teste cria EPUBs e um mecanismo PDF simulado em diretório temporário, verifica os estados e remove as fixtures ao terminar. A saída esperada é `EGW_SOURCE_VERIFICATION_OK`. Esse exemplo não consulta uma biblioteca real nem comprova extração real de PDF.

## Biblioteca real

Informe explicitamente uma biblioteca existente e a consulta. Os campos entre sinais de menor e maior no modelo abaixo devem ser substituídos. EPUB usa a biblioteca padrão do Python; PDF requer `pypdfium2` no mesmo interpretador. Não publique caminhos privados nem copie resultados para um artigo sem autorização editorial.

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

## Limites de leitura EPUB

Antes de descomprimir entradas, o leitor rejeita EPUBs com mais de 4096 entradas, entrada maior que 8 MiB ou soma descomprimida maior que 64 MiB. O resultado é `unavailable`, código 3, com aviso `EPUB_LIMIT_EXCEEDED`. A fonte permanece intacta.

## Códigos de saída

| Código | Estados |
|---|---|
| 0 | `located`, `confirmed` |
| 2 | `divergent`, `ambiguous`, `absent`; também uso inválido da CLI |
| 3 | `unavailable` |

Use `--help` para consultar os limites e valores padrão disponíveis na versão instalada. Os testes com fixtures não substituem a validação de integração em biblioteca real.

Contrato: [verificação de fontes EGW](../RCFs/verificacao-fontes-egw.md). Procedimento do agente: [Skill EGW](../.ia.rules/local/skills/egw-source-verification/SKILL.md).

### Limite inicial de tamanho PDF

Cada PDF pode ter até 64 MiB (`PDF_MAX_FILE_BYTES`). Arquivos maiores são recusados antes da abertura do mecanismo PDF: a resposta usa `unavailable`, código de saída 3 e aviso `PDF_LIMIT_EXCEEDED`. A fonte permanece inalterada.

Esse limite cobre o tamanho do arquivo; ainda não limita a quantidade de páginas nem o volume de texto extraído. A integração com a biblioteca real permanece pendente.
