"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyProcessOutcome = classifyProcessOutcome;
/**
 * verify exige pós-condição funcional, mesmo com reused=true.
 * failed registra saída não zero; não autoriza retry/fallback nem comprova rollback.
 * blocked cobre processo ativo, timeout, cancelamento e resultado desconhecido.
 */
function classifyProcessOutcome(result) {
    if (typeof result !== 'object' || result === null || Array.isArray(result))
        return 'blocked';
    const evidence = result;
    if (evidence.status === 'completed' && evidence.exitCode === 0)
        return 'verify';
    if (evidence.status === 'failed' && typeof evidence.exitCode === 'number' &&
        Number.isInteger(evidence.exitCode) && evidence.exitCode !== 0)
        return 'failed';
    return 'blocked';
}
