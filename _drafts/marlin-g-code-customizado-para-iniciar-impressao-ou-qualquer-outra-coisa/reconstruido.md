---
title: "Marlin G-Code Customizado para iniciar impressão ou qualquer outra coisa"
date: 2020-08-26 20:22:51
last_modified_at: 2020-08-26 20:22:51
published: false
wp_status: draft
wp_post_id: 3412
wp_post_type: post
wp_slug: marlin-g-code-customizado-para-iniciar-impressao-ou-qualquer-outra-coisa
author: jeancarlo
categories: 
  - Sem categoria
tags: []
reconstruction:
  primary_source: wordpress_wxr_2023_08_09
  content_sha256: da612185a0b5af05260aa976419ec1e8a6b1dcad0ebda6f14bea241daafb0c89
  source_urls: 
  - "https://blog.jeancarloem.com/?p=3412"
---

JCEM\_COMMENT\_0\_TOKEN

No arquivo *Marlin/src/gcode/gcode.h* adicione o código abaixo após a linha "*static void T(const uint8\_t tool\_index);*"

JCEM\_COMMENT\_1\_TOKEN JCEM\_COMMENT\_2\_TOKEN

/\*
 \* CÓDIGO PERSONALIZADO ADICIONADO POR MIM | JCEM
 \* M7000 - EXECUTA DIVERSOS PROCEDIMENTOS ANTES DE CADA IMPRESSOA, COMO AUTO HOMING, AUTO NIVELAMENTO, ENTRE OUTROS
 \*/
 static void M7000();

JCEM\_COMMENT\_3\_TOKEN JCEM\_COMMENT\_4\_TOKEN

No arquivo *Marlin/src/gcode/gcode.*cpp, localize a linha com o código "*case 'M': switch (parser.codenum) {*". Esta linha abre um bloco de código, com a *TAG* "**{**". Localize o fechamento do bloco. No meu caso, o fechamento do bloco se parece com o seguinte:

JCEM\_COMMENT\_5\_TOKEN JCEM\_COMMENT\_6\_TOKEN

      #if ENABLED(SDSUPPORT)
        case 1001: M1001(); break;                                // M1001: \[INTERNAL\] Handle SD completion
      #endif

      #if ENABLED(MAX7219\_GCODE)
        case 7219: M7219(); break;                                // M7219: Set LEDs, columns, and rows
      #endif

      default: parser.unknown\_command\_warning(); break;
    }

JCEM\_COMMENT\_7\_TOKEN JCEM\_COMMENT\_8\_TOKEN

Antes da linha "*default: parser.unknown\_command\_warning(); break;*" adicione o seu comando, letra + número. deve ser algo que NÃO existe. Fica assim, para o meu caso que adicionei o comando **M7000**:

JCEM\_COMMENT\_9\_TOKEN JCEM\_COMMENT\_10\_TOKEN

      #if ENABLED(SDSUPPORT)
        case 1001: M1001(); break;                                // M1001: \[INTERNAL\] Handle SD completion
      #endif

      #if ENABLED(MAX7219\_GCODE)
        case 7219: M7219(); break;                                // M7219: Set LEDs, columns, and rows
      #endif

         /\*
    \* CÓDIGO PERSONALIZADO ADICIONADO POR MIM | JCEM
    \* M7000  - EXECUTA DIVERSOS PROCEDIMENTOS ANTES DE CADA IMPRESSOA, COMO AUTO HOMING, AUTO NIVELAMENTO, ENTRE OUTROS
    \*/
    case 7000:
      M7000();
      break;

      default: parser.unknown\_command\_warning(); break;
    }

JCEM\_COMMENT\_11\_TOKEN
