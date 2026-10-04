export type MicroCheckAttemptState =
  | 'initial_active'
  | 'initial_correct'
  | 'initial_incorrect_hint'
  | 'remediation_active'
  | 'remediation_complete'

export type MicroCheckAttemptEvent =
  | { type: 'SUBMIT_INITIAL'; correct: boolean }
  | { type: 'START_REMEDIATION' }
  | { type: 'SUBMIT_REMEDIATION'; correct: boolean }

export interface MicroCheckAttemptSnapshot {
  state: MicroCheckAttemptState
  initialCorrect: boolean | null
  remediationCorrect: boolean | null
}

export const INITIAL_MICRO_CHECK_ATTEMPT: MicroCheckAttemptSnapshot = {
  state: 'initial_active',
  initialCorrect: null,
  remediationCorrect: null,
}

function invalidTransition(
  state: MicroCheckAttemptState,
  event: MicroCheckAttemptEvent['type'],
): never {
  throw new Error(`Invalid micro-check attempt transition: ${state} -> ${event}`)
}

export function reduceMicroCheckAttempt(
  snapshot: MicroCheckAttemptSnapshot,
  event: MicroCheckAttemptEvent,
): MicroCheckAttemptSnapshot {
  switch (snapshot.state) {
    case 'initial_active': {
      if (event.type !== 'SUBMIT_INITIAL') {
        return invalidTransition(snapshot.state, event.type)
      }

      if (event.correct) {
        return {
          state: 'initial_correct',
          initialCorrect: true,
          remediationCorrect: null,
        }
      }

      return {
        state: 'initial_incorrect_hint',
        initialCorrect: false,
        remediationCorrect: null,
      }
    }

    case 'initial_incorrect_hint': {
      if (event.type !== 'START_REMEDIATION') {
        return invalidTransition(snapshot.state, event.type)
      }

      return {
        ...snapshot,
        state: 'remediation_active',
      }
    }

    case 'remediation_active': {
      if (event.type !== 'SUBMIT_REMEDIATION') {
        return invalidTransition(snapshot.state, event.type)
      }

      return {
        state: 'remediation_complete',
        initialCorrect: snapshot.initialCorrect,
        remediationCorrect: event.correct,
      }
    }

    case 'initial_correct':
    case 'remediation_complete':
      return invalidTransition(snapshot.state, event.type)
  }
}

export function microCheckAttemptAllowsHint(
  snapshot: MicroCheckAttemptSnapshot,
): boolean {
  return (
    snapshot.state === 'initial_incorrect_hint' ||
    snapshot.state === 'remediation_active'
  )
}

export function microCheckAttemptAllowsExplanation(
  snapshot: MicroCheckAttemptSnapshot,
): boolean {
  return (
    snapshot.state === 'initial_correct' ||
    snapshot.state === 'remediation_complete'
  )
}

export function microCheckAttemptAllowsInitialSubmission(
  snapshot: MicroCheckAttemptSnapshot,
): boolean {
  return snapshot.state === 'initial_active'
}

export function microCheckAttemptAllowsRemediationSubmission(
  snapshot: MicroCheckAttemptSnapshot,
): boolean {
  return snapshot.state === 'remediation_active'
}

export function microCheckAttemptIsTerminal(
  snapshot: MicroCheckAttemptSnapshot,
): boolean {
  return (
    snapshot.state === 'initial_correct' ||
    snapshot.state === 'remediation_complete'
  )
}

export function microCheckAttemptEvidencePhases(
  snapshot: MicroCheckAttemptSnapshot,
): readonly ('initial' | 'remediation')[] {
  const phases: Array<'initial' | 'remediation'> = []

  if (snapshot.initialCorrect !== null) {
    phases.push('initial')
  }

  if (snapshot.remediationCorrect !== null) {
    phases.push('remediation')
  }

  return phases
}
