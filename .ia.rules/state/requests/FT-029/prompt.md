# FT-029 — Fonte humana integral

Origem: `TODO.ia.md` versionado na revisão `14366812a5` e prompt humano de 2026-08-12.

Estado de incorporação: capturado; vinculado ao equalizer vigente.

## Solicitação de execução

> realize o item equalizer da TODO, de forma completo, até o final total, e publique.

## Frentes operacionais vigentes

> - [ ] Corrigir regressão visual exclusiva da página 404
>   - Conforme `.ia.rules\state\requests\evidencias\evidencia1.png`, somente a página 404 deixou de reproduzir corretamente o comportamento já existente do logotipo, que DEVE extrapolar suavemente os limites da barra em vez de permanecer cropado/confinado dentro dela.
>   - Identificar e corrigir cirurgicamente a causa específica da divergência da 404, preservando o comportamento correto das demais páginas e SEM alterar desnecessariamente estilos, estrutura ou contratos compartilhados.
>   - NÃO regredir responsividade, posicionamento, sobreposição, clipping, navegação ou qualquer recurso já consolidado.
>
> - [ ] Harmonizar tabelas com o modo escuro
>   - Conforme `.ia.rules\state\requests\evidencias\evidencia2.png`, corrigir a tematização das tabelas em dark mode para assegurar contraste, legibilidade e coerência visual equivalentes ao modo claro.
>   - A correção DEVE abranger somente os aspectos necessários dos elementos efetivamente componentes da tabela e respectivos estados, respeitando a tematização e normas existentes.
>   - NÃO introduzir paleta arbitrária, alterar sem necessidade o modo claro nem regredir acessibilidade, hierarquia visual ou estilos válidos já implementados.
>
> - [ ] Disponibilizar visualização ampliada de toda imagem de conteúdo
>   - Conforme `.ia.rules\state\requests\evidencias\evidencia3.png`, toda imagem exibida ao usuário, independentemente do dispositivo, DEVE disponibilizar controle para visualização maximizada/em tela cheia.
>   - O controle DEVE ser sutil, preferencialmente iconográfico, claramente acionável e posicionado sem encobrir conteúdo relevante, prejudicar a imagem, quebrar o layout ou interferir no fluxo textual.
>   - Sua área acionável DEVE ser adequada tanto a mouse quanto a toque, sem pressupor mecanismo, biblioteca ou implementação inexistente.
>   - Para preservar a visualização integral da imagem, o controle PODE permanecer oculto por padrão e tornar-se visível quando necessário: em dispositivos com mecanismo de apontamento compatível, mediante `hover`; e, em interfaces por toque/clique, a partir da primeira interação com a imagem. A implementação DEVE também contemplar interação por teclado quando aplicável.
>   - A aparição do controle NÃO DEVE deslocar conteúdo, alterar dimensões da imagem, provocar reflow relevante nem ocultar região significativa da imagem. Seu estado de visibilidade e interação DEVE ser previsível e compatível com os diferentes métodos de entrada, sem depender exclusivamente de `hover`.
>   - A ampliação DEVE preservar proporção e qualidade disponível da imagem e permitir retorno inequívoco ao contexto anterior.
>   - A implementação DEVE respeitar responsividade, acessibilidade e comportamentos existentes, reutilizando mecanismos já presentes somente se comprovadamente adequados.
>   - Inspecionar previamente o estado real e aplicar a solução de modo geral às imagens pertinentes, SEM criar exceções arbitrárias por página, formato ou dispositivo e SEM interferir em imagens cujo comportamento normativo específico exija tratamento distinto.
