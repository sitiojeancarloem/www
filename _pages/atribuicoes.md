---
title: Atribuições
layout: single
permalink: /atribuicoes/
toc: false
share: false
author_profile: false
---

Esta página reúne os avisos exigidos pelos recursos de terceiros efetivamente entregues com o site.

{% for item in site.data.jcem_attributions %}
## {{ item.name }}{% if item.version %} {{ item.version }}{% endif %}

- **Recurso usado:** {{ item.resource }}
- **Autor ou titular:** {{ item.author }}
- **Origem oficial:** [{{ item.origin }}]({{ item.origin }})
- **Licença:** [{{ item.license }}]({{ item.license_url }})
- **Aviso:** {{ item.copyright }}

{% if item.embedded_notice %}{{ item.embedded_notice }}{% endif %}

{% if item.notice_ref %}<details class="jcem-attribution-license"><summary>Texto da licença</summary><pre>{{ site.data.jcem_license_texts[item.notice_ref] | escape }}</pre></details>{% endif %}
{% endfor %}
