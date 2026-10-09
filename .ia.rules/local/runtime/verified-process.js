"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeVerifiedProcess = executeVerifiedProcess;
const resilient_operation_1 = require("./resilient-operation");
const process_outcome_1 = require("./process-outcome");
/**
 * Aguarda uma única execução autorizada, sem retry/fallback automático.
 * run pode encapsular runLongProcess/resumeLongProcess; clones não desfazem I/O.
 * completed, inclusive reused, exige leitura e pós-condição funcional.
 */
async function executeVerifiedProcess(initialState, run, readCandidate, verify) {
    if (typeof run !== 'function' || typeof readCandidate !== 'function' || typeof verify !== 'function') {
        throw new TypeError('INVALID_PROCESS_CALLBACKS');
    }
    const snapshot = (0, resilient_operation_1.cloneJsonState)(initialState);
    let evidence;
    let rejected = false;
    try {
        evidence = await run();
    }
    catch (error) {
        rejected = true;
        try {
            evidence = typeof error === 'object' && error !== null
                ? error.result : undefined;
        }
        catch {
            evidence = undefined;
        }
    }
    let outcome = 'blocked';
    try {
        outcome = (0, process_outcome_1.classifyProcessOutcome)(evidence);
        if (rejected && outcome !== 'failed')
            outcome = 'blocked';
    }
    catch {
        outcome = 'blocked';
    }
    return (0, resilient_operation_1.executeResilientOperation)(snapshot, [{
            id: 'process',
            eligible: true,
            blocked: outcome === 'blocked',
            execute: () => {
                if (outcome === 'failed')
                    throw new Error('PROCESS_FAILED');
                return (0, resilient_operation_1.cloneJsonState)(readCandidate());
            },
            verify
        }]);
}
