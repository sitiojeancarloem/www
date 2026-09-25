---
name: cover-image-prompt
description: Estrutura prompts de imagem para COVER, OG e thumbnail com proporção, hierarquia, safe area de overlay e critérios verificáveis. Use antes de gerar ou adaptar imagem editorial; não use para editar binários de overlay.
---

# Prompt de COVER, OG e thumbnail

## Autoridade e limites

Carregue primeiro `RCFs/carregamento-progressivo.md` e `docs/MODO-DE-USO-COVER-E-HERO.md`. O overlay resolvido em `assets/images/overlays/` é referência visual e entrada read-only: nunca o gere, edite, substitua ou incorpore como base de nova arte.

Esta Skill prepara o prompt e os critérios. Ela não escolhe fatos do artigo, não inventa identidade visual e não dispensa inspeção do resultado.

## Entrada obrigatória

Declare, sem deixar decisões materiais implícitas:

1. objetivo da peça;
2. tipo: `cover`, `OG` ou `thumbnail`;
3. proporção e dimensões alvo;
4. contexto do artigo e público;
5. assunto central e tom;
6. elementos obrigatórios e proibidos;
7. hierarquia visual;
8. referência visual disponível;
9. safe area ocupada pelo overlay;
10. texto/título e sua posição;
11. formato final e critérios de aceite.

## Construção do prompt

Instrua a composição a manter fundo contínuo, pertinente e visualmente completo também sob o overlay. Oriente o olhar para regiões seguras sem concentrar artificialmente todos os elementos em um único ponto. Título, rosto, símbolo principal e demais elementos críticos ficam fora da área material do overlay.

Use prioridades explícitas: fidelidade ao tema, legibilidade, continuidade, hierarquia e acabamento profissional. Inclua restrições negativas diretas contra vazio reservado, corte perceptível, texto encoberto, deformação, marca d'água inventada, assinatura indevida, baixa resolução e elementos não sustentados pelo artigo.

Quando houver imagem de referência, identifique o que deve ser preservado e o que pode variar. Não prometa controle de referência, formato ou compressão que a ferramenta efetivamente usada não ofereça.

## Saída

Entregue um bloco pronto para o gerador escolhido com as seções `Objetivo`, `Composição`, `Safe area`, `Elementos`, `Restrições`, `Renderização` e `Aceite`. Registre separadamente tipo, proporção, formato e referências fornecidas.

## Aceite

Rejeite o resultado quando o overlay encobrir título ou elemento central, houver descontinuidade sob a camada, a proporção estiver errada, o assunto perder reconhecimento, o texto não estiver legível ou o acabamento não for adequado à publicação. A aprovação visual humana continua necessária para uma nova peça editorial.
