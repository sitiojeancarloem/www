<!-- AI-PROCESSED -->
# RCF-JCEM-DOACOES-001

Status: vigente.

Escopo: dados, experiência pública, QR Codes, assets, retorno de agradecimento e validação das rotas `/doe` e `/doe/obrigado`.

## Fonte de verdade e extensibilidade

- Uma única fonte JSON versionada DEVE conter meios, provedores, moedas, redes, endereços, payloads, links, legendas, assets e metadados necessários. Templates, scripts e testes DEVEM consumir essa fonte sem recadastrar valores.
- O schema DEVE permitir adicionar meio, moeda ou rede por dados, sem criar estrutura HTML especializada. Exceções de comportamento precisam ser tipadas e justificadas no JSON.
- Segredos, tokens e credenciais são proibidos. Chaves e endereços publicados são dados públicos de recebimento e DEVEM ser reproduzidos sem normalização semântica.

## Experiência `/doe`

- A página DEVE explicar sucintamente por que doar, como doar e meios disponíveis, com composição infográfica, responsiva, acessível e coerente com os temas claro e escuro.
- PIX, criptomoedas e PayPal DEVEM permanecer inequivocamente distinguíveis. Rede, tipo de endereço, valor mínimo ou livre e alertas necessários DEVEM aparecer junto à ação pertinente.
- Endereço visualmente resumido DEVE expor no máximo dez caracteres, preservar o integral por tecnologia assistiva e copiar sempre o valor completo.
- Ações de copiar, expandir, fechar, baixar e doar DEVEM funcionar por teclado, ter foco visível, nome acessível e feedback não dependente apenas de cor.
- O CTA PayPal DEVE apontar diretamente ao URL oficial configurado, abrir com proteção contra acesso ao contexto de origem e não usar intermediário.

## Pipeline de QR

- QR DEVE ser gerado no cliente por biblioteca madura distribuída localmente, sem serviço remoto. Payload codificado é exatamente o valor canônico do JSON.
- A composição para exibição e download DEVE manter quiet zone, contraste, módulos funcionais e correção de erro suficiente para o símbolo central. Moldura e legenda ficam fora da matriz codificada.
- O símbolo central DEVE usar somente a figura do logo local autorizado, com fundo mínimo de contraste, dimensões limitadas e sem wordmark.
- PIX usa legenda `PIX: <chave-pix>`; cripto usa `<SIGLA> | <DOM>`, com domínio canônico do site sem protocolo, `www`, path, query ou fragmento.
- O artefato final de cada QR DEVE ser decodificado automaticamente e comparado byte a byte ao payload esperado, inclusive após símbolo, moldura e legenda.

## Assets externos

- Moedas, redes e provedores compartilham um catálogo e um resolvedor. Asset DEVE ser real, semanticamente correto, transparente quando possível, versionado ou fixado por hash e acompanhado de fonte e licença aplicáveis.
- Um único workflow mensal DEVE validar disponibilidade, MIME, integridade, identidade programaticamente verificável e ausência de mudança material. Atualização só ocorre após validação e não produz churn por metadado irrelevante.
- Falha da fonte principal DEVE acionar alternativas finitas conforme `RCFs/resiliencia-operacional.md`. O último asset válido permanece publicado até substituição verificada; falha incontornável permanece registrada sem apagar o válido.

## Retorno `/doe/obrigado`

- A rota DEVE derivar continuamente da estrutura canônica da home e substituir somente seu destaque superior por bloco de agradecimento; duplicação estática da home é proibida quando o layout compartilhado puder expressar a variação.
- O bloco contém, nesta ordem, imagem edge-to-edge, título normal `Obrigado` e mensagem cordial, direta e sucinta. O conteúdo subsequente DEVE usar o mesmo mecanismo da home.
- A imagem DEVE ser acolhedora, predominantemente ilustrativa, sem texto embutido e seguir os contratos vigentes de COVER e carregamento. Segmentos adicionais, se usados, precisam ser gerados e validados como composição contínua.
- Configuração externa do retorno PayPal é apenas documentada quando não existir integração local comprovada; o repositório não presume mutação remota.

## Segurança e aceite

- Renderização oriunda do JSON DEVE escapar texto e atributos. URLs externas DEVEM aceitar somente protocolos previstos; payloads não podem ser executados como marcação.
- Testes DEVEM cobrir JSON para UI, extensão por dados, valores exatos, cópia integral, QR composto e decodificado, temas, responsividade, contraste, teclado, foco, modal, download, PayPal, retorno e build.
- A validação visual DEVE inspecionar desktop e mobile, claro e escuro, ausência de overflow e legibilidade real dos QRs. Nenhum tratamento visual PODE prevalecer sobre sua leitura.
