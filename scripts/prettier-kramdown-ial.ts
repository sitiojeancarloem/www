// Extensão local Prettier: associação IAL de tabelas e títulos raiz.
// Demais categorias e integração do editor ainda não ativadas.

export function createPlugin(markdownPlugin: any, builders: any): any {
  const sourceMap = new WeakMap<object, string>();
  const baseParser = markdownPlugin.parsers.markdown;
  const basePrinter = markdownPlugin.printers.mdast;

  const parser = {
    ...baseParser,
    astFormat: 'mdast',
    async parse(text: string, options: any): Promise<any> {
      const ast = await baseParser.parse(text, options);
      sourceMap.set(ast, text);
      return ast;
    }
  };

  const preprocess = basePrinter.preprocess
    ? async function preprocess(ast: any, options: any): Promise<any> {
        const source = sourceMap.get(ast);
        if (!source) {
          return basePrinter.preprocess!(ast, options);
        }
        const pairs = collectBlockIals(ast, source);
        const processed = await basePrinter.preprocess!(ast, options);
        return wrapBlockIals(processed, pairs);
      }
    : async function preprocess(ast: any, options: any): Promise<any> {
        const source = sourceMap.get(ast);
        if (!source) {
          return ast;
        }
        const pairs = collectBlockIals(ast, source);
        return wrapBlockIals(ast, pairs);
      };

  const print = function print(path: any, options: any, print: any): any[] {
    const node = path.node;
    if (node.type === 'jcemIalBlock') {
      const childPrinted = path.call(print, 'children', 0);
      return [childPrinted, builders.hardline, node.raw];
    }
    return basePrinter.print(path, options, print);
  };

  const getVisitorKeys = function getVisitorKeys(node: any, ...args: any[]): string[] {
    if (node.type === 'jcemIalBlock') {
      return ['children'];
    }
    return basePrinter.getVisitorKeys(node, ...args);
  };

  return {
    parsers: {
      markdown: parser
    },
    printers: {
      mdast: {
        ...basePrinter,
        preprocess,
        print,
        getVisitorKeys
      }
    }
  };
}

export default createPlugin;

function wrapBlockIals(ast: any, pairs: Array<{ blockIndex: number; ialIndex: number; raw: string }>): any {
  if (pairs.length === 0) return ast;

  const ialIndexSetByBlock = new Map<number, Set<number>>();
  for (const pair of pairs) {
    let set = ialIndexSetByBlock.get(pair.blockIndex);
    if (!set) {
      set = new Set();
      ialIndexSetByBlock.set(pair.blockIndex, set);
    }
    set.add(pair.ialIndex);
  }

  const newChildren: any[] = [];
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i];
    const blockIndex = i;
    const set = ialIndexSetByBlock.get(blockIndex);
    if (pairs.some(pair => pair.ialIndex === i)) {
      // omitir nós cujo índice esteja em ialIndex
      continue;
    }
    if (set) {
      // O wrapper ocupa a posição do bloco.
      const blockChild = child;
      const pair = pairs.find(p => p.blockIndex === blockIndex);
      if (blockChild && pair) {
        newChildren.push({
          type: 'jcemIalBlock',
          children: [blockChild],
          raw: pair.raw,
          position: {
            start: blockChild.position.start,
            end: ast.children[pair.ialIndex].position.end
          }
        });
      }
    } else {
      newChildren.push(child);
    }
  }

  return { ...ast, children: newChildren };
}

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
