# Fonte complementar da FT-066 — recomposição persistente do backdrop

- Origem: prompt humano de 2026-09-16.
- Relato: `backdrop-filter` torna-se visualmente funcional após desabilitar e reabilitar a propriedade no inspetor, porém perde novamente o efeito quando o inspetor é fechado.
- FTs: FT-066 e FT-067.
- RCFs: RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001 e RCF-JCEM-COMPONENTES-COMPARTILHADOS-001.
- Estado de incorporação: correção e validação em andamento; aceite humano permanece pendente.
- Preservação: geometria, fumê de 35%, blur responsivo de 10 a 15 px, FLAG, título, SVGs, modos COVER/Hero e colinearidade vigentes não podem regredir.

## Diagnóstico

A recomposição anterior alterava apenas uma variável de saturação em `0,000001` e restaurava-a no frame seguinte. O compositor podia coalescer essa diferença subvisual sem reconstruir a camada nativa de `backdrop-filter`. As causas estruturais remanescentes eram o `z-index` do ancestral `#main` e o contexto de composição retido pelo `fill-mode: both` de sua animação `intro`: ambos isolavam o deck da imagem pertencente ao ramo irmão anterior. O inspetor forçava uma recomposição temporária, mas o isolamento voltava a prevalecer ao fechá-lo. Além disso, o teste comprovava propriedade computada e contador interno, mas não comparava a saída rasterizada automática com a saída sem blur e com o toggle manual.

## Correção requerida

A COVER moderna e o hero legado devem conter os seus próprios níveis de `z-index`, preservando a precedência de FLAG e barras, enquanto o ancestral do deck permanece fora de um contexto de empilhamento que o impeça de enxergar a imagem. A animação de entrada deve ser preservada integralmente e seu backdrop root liberado por conclusão observável da própria animação, sem timeout arbitrário. Como resiliência complementar, a invalidação local deve alternar a propriedade nativa entre `none` e o valor canônico, com recálculo síncrono dos dois estados antes da pintura. Deve aguardar geometria estável, consolidar resize/orientação, reagir à mudança real de tamanho do stage/deck e concluir sem estilo inline, frame visível sem blur, polling, timeout ou promoção permanente de camada.

## Prova requerida

Em Chrome e Brave, a captura automática do deck no primeiro carregamento e após resize deve ser materialmente diferente da captura com blur desabilitado e equivalente à captura após toggle manual. A propriedade computada, o baseline visual e todas as geometrias anteriores continuam sendo aferidos separadamente.
