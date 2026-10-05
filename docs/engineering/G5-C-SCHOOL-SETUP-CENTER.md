# G5-C — School Setup Center

## Purpose

Give school administrators one persistent, plain-language setup surface that consumes the frozen G5-B onboarding status resolver.

G5-C is a presentation layer only. It does not create new readiness rules, onboarding tables, invitation logic, enrollment logic, or instructor-assignment logic.

## Source of truth

The School Setup Center consumes `loadSchoolOnboardingStatus()` from the certified G5-B onboarding module.

The UI renders:

- setup progress percentage;
- completed steps versus total steps;
- every resolver-owned setup step;
- launch blockers;
- one canonical next action;
- explicit Ready-to-Launch state.

## Placement

The Setup Center is rendered persistently near the top of the School Dashboard for school administrators. It replaces the former empty-school-only launch guide so setup guidance remains available after the first instructor or student is added.

## UX contract

- The most important next action appears before the detailed checklist.
- Blockers use the resolver-provided action label and destination.
- Ready-to-Launch is displayed only when G5-B returns `readyToLaunch: true`.
- Progress is exposed visually and through an accessible progressbar.
- No local database queries or duplicated launch-readiness conditions exist inside the UI component.

## Compatibility

The G5-A launch-guide regression assertion is evolved to certify that guided launch setup remains present through the canonical G5-B/G5-C path. The certified underlying invitation, account, enrollment, assignment, configuration, and onboarding capabilities remain unchanged.

## Certification boundary

G5-C is GREEN only when:

1. G5-C certification tests pass;
2. the existing onboarding regression suite remains green;
3. Engineering Verification passes on the exact PR head;
4. Vercel preview is READY on the exact same PR head;
5. the PR head remains unchanged before merge.

After merge, exact production main and production Vercel must be verified before G5-C is formally closed.
