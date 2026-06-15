# JeanCarloEM Blog

## Blockquotes como painel futurista

O projeto converte, por padrão, os `blockquote` renderizados dentro de posts para o componente `jcem-panel` com visual futurista derivado do `old-root`.

Configuração em `_config.yml`:

```yaml
jcem:
  blockquote_panels: true
```

Para desativar a conversão automática:

```yaml
jcem:
  blockquote_panels: false
```

Quando ativado, o JavaScript estático gerado por `tsc` substitui cada `blockquote` por uma estrutura HTML própria do painel: `div.jcem-panel` contendo uma tabela de setores. O texto original é movido para `.jcem-panel__body`, preservando o conteúdo e mantendo o SVG `assets/jcem/img/painel.svg` aplicado nas quinas sem distorção.
