// FT-104: tipos e validação para operação resiliente.

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

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
