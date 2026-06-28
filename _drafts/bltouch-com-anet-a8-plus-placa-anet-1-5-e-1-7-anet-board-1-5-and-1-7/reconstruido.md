---
title: "BLTouch com Anet A8 (Plus) - placa Anet 1.5 e 1.7 - Anet Board 1.5 and 1.7"
date: 2020-08-10 19:18:51
last_modified_at: 2020-08-13 23:40:07
published: false
wp_status: publish
wp_post_id: 3237
wp_post_type: post
wp_slug: bltouch-com-anet-a8-plus-placa-anet-1-5-e-1-7-anet-board-1-5-and-1-7
author: jeancarlo
categories: 
  - Maker
  - Profissional
tags: 
  - 3D Touch
  - 3DTouch
  - Anet A8
  - Anet A8 Plus
  - Anet Board
  - BL Touch
  - BLTouch
  - Placa Anet
reconstruction:
  primary_source: wordpress_wxr_2023_08_09
  content_sha256: c0fe61f99a6786fe39cc11a92f4e970c377d7bf4aa6488dbbf893dbd4c37f338
  source_urls: 
  - https://blog.jeancarloem.com/bltouch-com-anet-a8-plus-placa-anet-1-5-e-1-7-anet-board-1-5-and-1-7/
excerpt: "É fácil localizar na internet instruções de como instalar o BLTouch ou 3DTouch na Anet A8, mas o mesmo não é verdade para a Anet A8 Plus. Embora a instalação seja muito parecida, há uma única diferença que pode levar a horas de pesquisa."
---

JCEM\_COMMENT\_0\_TOKEN

É fácil localizar na internet instruções de como instalar o BLTouch ou 3DTouch na Anet A8, mas o mesmo não é verdade para a **Anet A8 Plus**. Embora a instalação seja muito parecida, há uma única diferença que pode levar a horas de pesquisa. Vamos facilitar?

JCEM\_COMMENT\_1\_TOKEN JCEM\_COMMENT\_2\_TOKEN

## Requisitos

JCEM\_COMMENT\_3\_TOKEN JCEM\_COMMENT\_4\_TOKEN

-   BLTouch ou 3DTouch;
-   Uma impressora com placa Anet 1.5 ou 1.7 (*pode servir para outras versões, mas terá que testar os pinos 3 ou 7 - sem risco*);
-   *Jumper* de prototipagem, ponta macho-fêmea (*NÃO estrague o cabo flat do LCD de sua Anet*), serão usados 10 fios;
-   Marlin 2.0+.

JCEM\_COMMENT\_5\_TOKEN JCEM\_COMMENT\_6\_TOKEN

![anet-requisitos-bltouch-3d-touch](https://blog.jeancarloem.com/wp-content/uploads/2020/08/anet-requisitos.jpg)

JCEM\_COMMENT\_7\_TOKEN JCEM\_COMMENT\_8\_TOKEN

**NOTA**: a versão 3 do BLtouch funciona apenas no Marlin 2.0 ou superior, embora exista no **[github, uma alteração que você pode fazer facilmente](https://github.com/InsanityAutomation/Marlin/commit/15ce74badfd3a1b6e6ffabf882234ffa77682715)**, para habilitar o mesmo no Marlin 1.1.9 - eu fiz e testei, funciona! Porém, NÃO há vantagem em permanecer no Marlin 1.1.9, já que em ambas as versões, haverá necessidade de desabilitar o suporte ao SD, por falta de memória.

JCEM\_COMMENT\_9\_TOKEN JCEM\_COMMENT\_10\_TOKEN

## Passo 1 - Conecte o LCD com Jumpers

JCEM\_COMMENT\_11\_TOKEN JCEM\_COMMENT\_12\_TOKEN

Nada de cortar o cabo flat do LCD de sua Anet, pelo contrário, sempre preservar o máximo possível, para evitar que em futuros upgrades, como para placa de 32 bits, tenha que adquiria um novo cabo flat.

JCEM\_COMMENT\_13\_TOKEN JCEM\_COMMENT\_14\_TOKEN

Para isso, adquiria *jumper* de prototipagem com ponta macho-fêmea e, com eles, faça a conexão de todos os fios do cabo flat LCD ao socket próprio do LCD na placa Anet, exceto o pino 3 ou pino 7, dependendo da sua versão da placa (*versão 1.5, use o pino 3 e placa 1.7, use o pino 7*).

JCEM\_COMMENT\_15\_TOKEN JCEM\_COMMENT\_16\_TOKEN

![](https://blog.jeancarloem.com/wp-content/uploads/2020/08/anet-pino.png)

JCEM\_COMMENT\_17\_TOKEN JCEM\_COMMENT\_18\_TOKEN

O *jumper* do pino 3 ou 7 NÃO deve ser ligado ao cabo flat mas sim ao BLTouch.

JCEM\_COMMENT\_19\_TOKEN JCEM\_COMMENT\_20\_TOKEN

![](https://blog.jeancarloem.com/wp-content/uploads/2020/08/anet-foto-pinos-bl-touch-jumper.png)

JCEM\_COMMENT\_21\_TOKEN JCEM\_COMMENT\_22\_TOKEN

## Passo 2 - Conecte o BL-Touch

JCEM\_COMMENT\_23\_TOKEN JCEM\_COMMENT\_24\_TOKEN

O BLTouch deve ser conectado igual ao esquema usado para Anet A8 (placa versão 1.5), atentando para a diferença que há entre as versões da paca ao conectar o pino 3 ou 7 do socket do LCD, conforme passo anterior. Confira o esquema para a placa versão 1.5 (Anet A8):

JCEM\_COMMENT\_25\_TOKEN JCEM\_COMMENT\_26\_TOKEN

![](https://blog.jeancarloem.com/wp-content/uploads/2020/08/3D-Touch-AnetA8-Board-1.jpg)

JCEM\_COMMENT\_27\_TOKEN JCEM\_COMMENT\_28\_TOKEN

Para evitar erros, certifique-se de verificar que as cores dos fios podem ser diferente, por isso, perceba que há dois tipos de conectores, um de duas entradas e outro de três. Além disso, atrás do BLTouch existe na placa inscrição com o tipo de fio.

JCEM\_COMMENT\_29\_TOKEN JCEM\_COMMENT\_30\_TOKEN

## Passo 3 - Verifique se liga

JCEM\_COMMENT\_31\_TOKEN JCEM\_COMMENT\_32\_TOKEN

Ligue a impressora e, verifique se a luz do BLTouch acende. Se acender, significa que está funcionando. Caso, não acenda, ou apresente problemas posteriores, basta inverter o pino 3 e 7, do socket do LCD, sem prejuízo para a placas, nas versões citadas.

JCEM\_COMMENT\_33\_TOKEN JCEM\_COMMENT\_34\_TOKEN

## Passo 4 - Configure o Marlin

JCEM\_COMMENT\_35\_TOKEN JCEM\_COMMENT\_36\_TOKEN

O software padrão da Anet não permite o use do BLTouch, por isso, será necessário fazer a configuração e instalação do Marlin, ou outro que prefira, que disponibilize este recurso.

JCEM\_COMMENT\_37\_TOKEN JCEM\_COMMENT\_38\_TOKEN

Atente que a versão 3 do BL Touch funciona apenas com Marlin 2.0 ou superior, exceto se aplicado **[esta](https://github.com/InsanityAutomation/Marlin/commit/15ce74badfd3a1b6e6ffabf882234ffa77682715)** alteração.

JCEM\_COMMENT\_39\_TOKEN JCEM\_COMMENT\_40\_TOKEN

Para que o BLTouch esteja habilitado no Marlin, deve-se editar o arquivo ***Configuration.h***. Para tanto, abra este arquivo e localize as linhas a seguir e altere-as.

JCEM\_COMMENT\_41\_TOKEN JCEM\_COMMENT\_42\_TOKEN

De:

JCEM\_COMMENT\_43\_TOKEN JCEM\_COMMENT\_44\_TOKEN

// #define BLTOUCH

JCEM\_COMMENT\_45\_TOKEN JCEM\_COMMENT\_46\_TOKEN

Para:

JCEM\_COMMENT\_47\_TOKEN JCEM\_COMMENT\_48\_TOKEN

#define BLTOUCH

JCEM\_COMMENT\_49\_TOKEN JCEM\_COMMENT\_50\_TOKEN

E, de:

JCEM\_COMMENT\_51\_TOKEN JCEM\_COMMENT\_52\_TOKEN

// #define AUTO\_BED\_LEVELING\_BILINEAR

JCEM\_COMMENT\_53\_TOKEN JCEM\_COMMENT\_54\_TOKEN

Para:

JCEM\_COMMENT\_55\_TOKEN JCEM\_COMMENT\_56\_TOKEN

#define AUTO\_BED\_LEVELING\_BILINEAR

JCEM\_COMMENT\_57\_TOKEN JCEM\_COMMENT\_58\_TOKEN

Você também precisará desabilitar o suporte ao SD, então, altere a linha:

JCEM\_COMMENT\_59\_TOKEN JCEM\_COMMENT\_60\_TOKEN

#define SDSUPPORT

JCEM\_COMMENT\_61\_TOKEN JCEM\_COMMENT\_62\_TOKEN

Para:

JCEM\_COMMENT\_63\_TOKEN JCEM\_COMMENT\_64\_TOKEN

// #define SDSUPPORT

JCEM\_COMMENT\_65\_TOKEN JCEM\_COMMENT\_66\_TOKEN

Depois disso, é só fazer o upload do firmware, e pronto!

JCEM\_COMMENT\_67\_TOKEN JCEM\_COMMENT\_68\_TOKEN

## Passo 5 - Instale o Marlin

JCEM\_COMMENT\_69\_TOKEN JCEM\_COMMENT\_70\_TOKEN

O Procedimento para instalação do Marlin na placa Anet 1.7 (A8 plus e A6) segue o mesmo passo a passo da instalação na versão 1.5. Há diversos vídeos na internet ensinando como fazer, corrigir bugs, prevenir falhas e instalar o *bootloader*.

JCEM\_COMMENT\_71\_TOKEN JCEM\_COMMENT\_72\_TOKEN

Uma vez que a instalação do Marlin foge do escopo deste artigo, abaixo listo alguns vídeos em inglês que recomendo:

JCEM\_COMMENT\_73\_TOKEN JCEM\_COMMENT\_74\_TOKEN

-   [Quatro formas de instalar o bootloader e firmwares](https://www.youtube.com/watch?v=wRODgnAqp1A);
-   [Sete passos para Instalar o Marlin na Anet A8](https://www.youtube.com/watch?v=ePgpzkjriso&list=PLV3fxzgNDX7wy83xTrakkdpqkxoezr26k&index=32);
-   [Marlin 2.0 na Anet A8 Plus](https://www.youtube.com/watch?v=38PkynA1uGI).

JCEM\_COMMENT\_75\_TOKEN JCEM\_COMMENT\_76\_TOKEN

JCEM\_COMMENT\_77\_TOKEN
