import { cloneJsonState, executeResilientOperation } from './resilient-operation';
import type { JsonValue, Result } from './resilient-operation';
import { classifyProcessOutcome } from './process-outcome';
import type { ProcessOutcome } from './process-outcome';

/**
 * Aguarda uma única execução autorizada, sem retry/fallback automático.
 * run pode encapsular runLongProcess/resumeLongProcess; clones não desfazem I/O.
 * completed, inclusive reused, exige leitura e pós-condição funcional.
 */
export async function executeVerifiedProcess(
  initialState: unknown,
  run: () => Promise<unknown>,
  readCandidate: () => unknown,
  verify: (candidate: JsonValue) => boolean
): Promise<Result> {
  if (typeof run !== 'function' || typeof readCandidate !== 'function' || typeof verify !== 'function') {
    throw new TypeError('INVALID_PROCESS_CALLBACKS');
  }
  const snapshot = cloneJsonState(initialState);
  let evidence: unknown;
  let rejected = false;
  try {
    evidence = await run();
  } catch (error) {
    rejected = true;
    try {
      evidence = typeof error === 'object' && error !== null
        ? (error as Record<string, unknown>).result : undefined;
    } catch {
      evidence = undefined;
    }
  }
  let outcome: ProcessOutcome = 'blocked';
  try {
    outcome = classifyProcessOutcome(evidence);
    if (rejected && outcome !== 'failed') outcome = 'blocked';
  } catch {
    outcome = 'blocked';
  }
  return executeResilientOperation(snapshot, [{
    id: 'process',
    eligible: true,
    blocked: outcome === 'blocked',
    execute: () => {
      if (outcome === 'failed') throw new Error('PROCESS_FAILED');
      return cloneJsonState(readCandidate());
    },
    verify
  }]);
}
