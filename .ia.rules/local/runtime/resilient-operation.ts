// FT-104: tipos e validação para operação resiliente.

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Copia profundamente valores JSON sem compartilhar objetos.
 * Rejeita: undefined, funções, símbolos, bigint, NaN, Infinity, objetos exóticos, Promises, ciclos,
 * propriedades accessor (sem executar getters/toJSON), __proto__ como propriedade não própria.
 * Limites: até 100 níveis e 10000 nós; exceder lança TypeError('INVALID_JSON_STATE').
 * Usa conjunto de ancestrais por chamada (não global) para detectar ciclos.
 */
export function cloneJsonState(value: unknown): JsonValue {
  const maxDepth = 100;
  const maxNodes = 10000;
  let nodeCount = 0;

  function clone(v: unknown, depth: number, ancestors: Set<unknown>): JsonValue {
    // Contagem de nós na entrada de cada nó
    nodeCount++;
    if (nodeCount > maxNodes) {
      throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
    }

    // Profundidade máxima
    if (depth > maxDepth) {
      throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
    }

    // Primitivos JSON finitos
    if (v === null || typeof v !== 'object') {
      if (v === undefined || typeof v === 'function' || typeof v === 'symbol' || typeof v === 'bigint') {
        throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
      }
      if (typeof v === 'number' && (Number.isNaN(v) || !Number.isFinite(v))) {
        throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
      }
      return v as JsonValue;
    }

    // Ciclo detectado por ancestral atual
    if (ancestors.has(v)) {
      throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
    }

    // Adicionar ancestral antes de descer
    ancestors.add(v);
    try {
      if (Array.isArray(v)) {
        // Prototype exato Array.prototype
        if (Object.getPrototypeOf(v) !== Array.prototype) {
          throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
        }

        const ownKeys = Reflect.ownKeys(v);
        // Só índices 0..length-1 e 'length'
        if (ownKeys.length !== v.length + 1) {
          throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
        }
        for (const key of ownKeys) {
          if (typeof key === 'symbol') {
            throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
          }
          if (key !== 'length' && (typeof key !== 'string' || !/^[0-9]+$/.test(key))) {
            throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
          }
        }

        const arr: JsonValue[] = [];
        for (let i = 0; i < v.length; i++) {
          const desc = Object.getOwnPropertyDescriptor(v, i);
          if (!desc || desc.get !== undefined || desc.set !== undefined || desc.enumerable !== true) {
            throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
          }
          // Verificar existência direta (arrays esparsos rejeitadas)
          if (!Object.prototype.hasOwnProperty.call(v, i)) {
            throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
          }
          arr.push(clone(desc.value, depth + 1, ancestors));
        }

        // Clonar propriedade 'length' com desc.value
        const lengthDesc = Object.getOwnPropertyDescriptor(v, 'length');
        if (!lengthDesc || lengthDesc.get !== undefined || lengthDesc.set !== undefined) {
          throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
        }
        Object.defineProperty(arr, 'length', {
          value: lengthDesc.value,
          writable: lengthDesc.writable,
          enumerable: lengthDesc.enumerable,
          configurable: lengthDesc.configurable,
        });

        return arr;
      }

      // Objeto: prototype simples (Object.prototype ou null)
      const proto = Object.getPrototypeOf(v);
      if (proto !== Object.prototype && proto !== null) {
        throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
      }

      const obj: { [key: string]: JsonValue } = {};
      const ownKeys = Reflect.ownKeys(v);

      for (const key of ownKeys) {
        if (typeof key === 'symbol') {
          throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
        }

        const desc = Object.getOwnPropertyDescriptor(v, key);
        if (!desc || desc.get !== undefined || desc.set !== undefined) {
          throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
        }
        if (!desc.enumerable) {
          throw Object.assign(new TypeError('INVALID_JSON_STATE'), { code: 'INVALID_JSON_STATE' });
        }

        // Definir TODAS propriedades próprias via Object.defineProperty
        if (key === '__proto__') {
          Object.defineProperty(obj, '__proto__', {
            value: clone(desc.value, depth + 1, ancestors),
            writable: true,
            enumerable: true,
            configurable: true,
          });
        } else {
          Object.defineProperty(obj, key, {
            value: clone(desc.value, depth + 1, ancestors),
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
      }

      return obj;
    } finally {
      ancestors.delete(v);
    }
  }

  try {
    return clone(value, 0, new Set<unknown>());
  } finally {
    // visited não é usado, limpeza redundante removida
  }
}

export interface Strategy {
  id: string;
  eligible: boolean;
  blocked?: boolean;
  execute: (state: JsonValue) => JsonValue;
  verify: (candidate: JsonValue) => boolean;
}

export interface Attempt {
  id: string;
  order: number;
  startedAt: string;
  finishedAt: string;
  outcome: string;
  errorCode?: string;
}

export interface Result {
  status: 'completed' | 'exhausted' | 'blocked';
  state: JsonValue;
  attempts: Attempt[];
}

/**
 * Valida um array de estratégias.
 * - Denso: sem elementos nulos ou undefined; array denso exige Object.prototype.hasOwnProperty.call(value,i) antes de ler value[i].
 * - Tamanho: entre 1 e 64 elementos.
 * - IDs: únicos, não vazios, /^[A-Za-z0-9_-]{1,64}$/
 * - eligible: booleano.
 * - blocked: ausente ou booleano.
 * - callbacks: funções síncronas puras (não são executadas aqui).
 * - TypeError com código fixo 'INVALID_STRATEGIES' para entrada inválida.
 */
export function validateStrategies(value: unknown): asserts value is Strategy[] {
  if (!Array.isArray(value)) {
    throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
  }

  if (value.length < 1 || value.length > 64) {
    throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
  }

  const seenIds = new Set<string>();

  for (let i = 0; i < value.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(value, i)) {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }
    const s = value[i];

    if (s === null || s === undefined || typeof s !== 'object') {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }

    const { id, eligible, blocked, execute, verify } = s as Strategy;

    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }

    if (seenIds.has(id)) {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }
    seenIds.add(id);

    if (typeof eligible !== 'boolean') {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }

    if (blocked !== undefined && typeof blocked !== 'boolean') {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }

    if (typeof execute !== 'function') {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }

    if (typeof verify !== 'function') {
      throw Object.assign(new TypeError('INVALID_STRATEGIES'), { code: 'INVALID_STRATEGIES' });
    }
  }
}
