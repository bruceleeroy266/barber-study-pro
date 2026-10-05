# G5-G — Ready-to-Launch Preflight

## Purpose

Make the certified onboarding resolver the single authority for whether a school is operationally ready to launch.

G5-G does not create a second readiness engine and does not add a new launch-state table or launch mutation.

## Canonical authority

The preflight consumes the frozen G5-B `SchoolOnboardingStatus` result.

It verifies the same eight required setup checks:

1. School profile/settings
2. Active academic program
3. Active school administrator
4. Active instructor
5. Active learner
6. No unresolved onboarding invitations
7. Active enrollment for every active learner
8. Active instructor assignment for every active learner

The preflight is authorized only when:

- `readyToLaunch === true`;
- all eight required checks are present and complete;
- `blockers.length === 0`;
- `sourceErrors.length === 0`.

If a required check is unexpectedly missing, the preflight fails closed.

## User experience

The School Setup Center now shows a Ready-to-Launch Preflight panel.

When blocked it shows:

- **Launch Locked**
- passed-check count;
- failed required checks;
- the existing resolver-owned launch blockers and guided recovery actions.

When every check passes it shows:

- **Launch Authorized**
- 8 of 8 checks passed;
- the existing Ready to Launch confirmation.

## Scope boundary

ASCYN PRO currently has no separate persisted "launch school" mutation or launch-state record. G5-G therefore governs operational launch authorization in the setup workflow without inventing a duplicate lifecycle.

Any future explicit launch mutation must consume this same canonical preflight and fail closed when `authorized === false`.

## Certification

G5-G is GREEN only when:

- launch preflight unit tests pass;
- Setup Center regression tests pass;
- Engineering Verification succeeds;
- exact-head Vercel preview is READY.
