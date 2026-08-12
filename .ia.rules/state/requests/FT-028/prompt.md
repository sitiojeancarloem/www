# FT-028 — Fonte humana integral

Origem: prompt humano de 2026-08-12.

Estado de incorporação: capturado; vinculado ao equalizer vigente.

> Aplique correções **cirúrgicas**, com máxima cautela para NÃO quebrar, interferir ou regredir melhorias, features, recursos ou comportamentos válidos já consolidados. Inspecione a causa real antes de alterar e limite cada correção estritamente ao necessário.
>
> Use as evidências em `.ia.rules\state\requests\evidencias\`:
>
> - `evidencia6.png`: a correção do limite de altura introduziu distorção e violou o preenchimento vertical obrigatório da imagem. Corrija preservando simultaneamente proporção, limite de altura e preenchimento visual exigido, sem deformação.
> - `evidencia7.png`: o topo de algumas flags dos cards está ocultado/cropado, como se a flag estivesse contida pelo clipping do card em vez de sobreposta a ele. Corrija posicionamento, stacking/clipping e ancoragem necessários, preservando integralmente o layout normatizado.
> - `evidencia8.png`: na impressão, blockquotes/citações extensas estão sendo tratados como blocos indivisíveis, impedindo quebra entre colunas e produzindo grandes espaços vazios. Remova essa restrição: citações extensas DEVEM poder continuar naturalmente na coluna seguinte, preservando estrutura, estilo, legibilidade e fluxo tipográfico.
> - `evidencia9.png`: disclaimers e componentes análogos, como `alerta1`, `alerta2` e equivalentes, mantêm espaço interno inferior desnecessário. Corrija a causa do espaçamento excedente sem reduzir o padding legítimo, alterar a composição visual prevista ou afetar outros componentes.
>
> Valide especificamente todos esses cenários e confirme ausência de regressões nos comportamentos adjacentes e nas melhorias já implementadas.
