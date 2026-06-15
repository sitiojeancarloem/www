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

Quando ativado, o Markdown original permanece como `blockquote`; a conversão ocorre no JavaScript estático gerado por `tsc`, preservando o texto original dentro de `.jcem-panel__body`.
