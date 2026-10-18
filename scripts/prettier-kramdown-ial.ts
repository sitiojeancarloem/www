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

export function collectBlockIals(ast: any, source: string): Array<{ blockIndex: number; ialIndex: number; raw: string }> {
  const result: Array<{ blockIndex: number; ialIndex: number; raw: string }> = [];
  if (!ast || ast.type !== 'root' || !Array.isArray(ast.children)) return result;

  for (let i = 0; i < ast.children.length; i++) {
    const next = ast.children[i];
    if (next?.type !== 'table' && next?.type !== 'heading') continue;
    if (i + 1 >= ast.children.length) continue;
    const para = ast.children[i + 1];
    if (para?.type !== 'paragraph') continue;

    const blockEnd = next.position?.end?.offset;
    const ialStart = para.position?.start?.offset;
    const ialEnd = para.position?.end?.offset;
    if (para.position?.start?.column !== 1 || !Number.isInteger(para.position.start.line) || para.position.start.line !== para.position.end?.line) continue;

    if (!Number.isInteger(blockEnd) || !Number.isInteger(ialStart) || !Number.isInteger(ialEnd)) continue;
    if (!(0 <= blockEnd && blockEnd <= ialStart && ialStart < ialEnd && ialEnd <= source.length)) continue;

    const gap = source.slice(blockEnd, ialStart);
    if (gap !== '\n' && gap !== '\r\n') continue;

    const raw = source.slice(ialStart, ialEnd);
    if (!raw.startsWith('{:') || !raw.endsWith('}')) continue;
    if (raw.includes('\r') || raw.includes('\n')) continue;
    if (raw.startsWith('{::')) continue;
    if (/^\{:\s*[\w-]+:/.test(raw)) continue;

    result.push({ blockIndex: i, ialIndex: i + 1, raw });
  }

  return result;
}
