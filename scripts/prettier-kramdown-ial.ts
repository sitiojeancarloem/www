// scripts/prettier-kramdown-ial.ts
// Fábrica de plugin Prettier3 para extensão de parser/print nativos.
// Recebe markdownPlugin e builders via createPlugin; delega a eles diretamente.
// Preserva AST e assinaturas nativas; associação IAL será implementada na próxima unidade.

// Helpers mortos removidos nesta etapa: extractIALFromRaw, preprocess, printBlockWithIAL

/**
 * Fábrica que captura markdownPlugin e builders em closure e produz plugin compatível.
 * - Herda parsers.markdown e printers.mdast diretamente do markdownPlugin.
 * - Delega preprocess/print/embed/getVisitorKeys a eles sem modificações nesta etapa.
 * - Não usa options/plugins dinâmicos; não busca parsers/printers recursivamente.
 * - builders não é usado nesta etapa; parâmetro mantido para compatibilidade de API.
 */
export function createPlugin(markdownPlugin: any, builders: unknown): any {
  return {
    parsers: {
      markdown: {
        ...markdownPlugin.parsers.markdown,
        astFormat: 'mdast',
      },
      mdast: {
        ...markdownPlugin.parsers.mdast,
        astFormat: 'mdast',
      },
    },
    printers: {
      mdast: {
        ...markdownPlugin.printers.mdast,
        // preprocess e embed mantidos nativos nesta etapa
      },
    },
    // options/optionsDefinitions não são ativados nesta etapa
  };
}

export default (markdownPlugin: any, builders: unknown) => createPlugin(markdownPlugin, builders);
