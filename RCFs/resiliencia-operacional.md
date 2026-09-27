<!-- AI-PROCESSED -->
# RCF-JCEM-RESILIENCIA-001

Status: vigente.

Escopo: semântica forte de `fail-safe`, resiliência e alternativas técnicas em operações materiais deste produto.

## Resultado exigido

- Operação resiliente DEVE buscar a conclusão correta do objetivo apesar de falhas contornáveis. Apenas encerrar sem corromper estado não satisfaz, por si só, `fail-safe` ou resiliência.
- Falha de método, comando, fonte ou estratégia NÃO encerra a operação enquanto existir alternativa legítima, autorizada e tecnicamente plausível.
- Alternativas DEVEM ser finitas, ordenadas, determinísticas e semanticamente equivalentes quanto ao contrato de saída. Tentativa ilimitada, recursão aberta e retry sem limite são proibidos.

## Limites compulsórios

- Resiliência NÃO autoriza ampliar escopo, contornar segurança, modificar fonte somente leitura, enfraquecer contrato, ignorar gate humano ou inferir autorização.
- Estratégia alternativa que reduza qualidade, precisão, acessibilidade, rastreabilidade ou capacidade existente NÃO é equivalente e NÃO PODE ser usada como sucesso.
- Estado válido anterior DEVE ser preservado até a alternativa concluir e sua aceitação ser verificada. Resultado parcial não validado não substitui o último estado válido.
- Falhas não contornáveis, dependências realmente indisponíveis e conflitos de autoridade DEVEM interromper a mutação correspondente e permanecer explicitamente declarados.

## Registro e estados

- Cada tentativa DEVE registrar identificador estável da estratégia, ordem, início, término, resultado e erro sanitizado, sem segredo ou dado privado.
- A operação DEVE terminar em `completed`, `exhausted` ou `blocked`. `completed` exige pós-condição verificada; `exhausted` exige todas as alternativas elegíveis tentadas; `blocked` exige impedimento de autoridade, segurança ou pré-condição não substituível.
- O registro DEVE distinguir falha técnica contornável de rejeição por contrato. Estratégia inelegível é registrada como ignorada e não conta como tentativa bem-sucedida.

## Aplicação e validação

- Novos fluxos com mais de uma estratégia DEVERÃO reutilizar o executor local comum ou implementar a mesma interface e estados quando outra linguagem for necessária.
- Fluxos existentes são migrados quando alterados ou quando uma FT os selecionar explicitamente; esta norma não autoriza reexecução indiscriminada nem alteração retroativa de artefatos.
- Testes DEVEM provar: sucesso inicial, sucesso por alternativa posterior, esgotamento finito, bloqueio, preservação do último estado válido, pós-condição falsa e ausência de bypass de estratégia inelegível.
- A integração DEVE demonstrar que erros permanecem observáveis e que o mecanismo não converte exceção em sucesso silencioso.
