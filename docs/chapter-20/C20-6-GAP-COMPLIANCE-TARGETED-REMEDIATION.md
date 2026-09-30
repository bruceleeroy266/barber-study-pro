# C20-6 — Gap Detection + Compliance Escalation + Targeted Remediation

## Parent head
C20-6 is stacked on C20-5 head `b93e7d8cb083b480c79d933eb7538ec8c391e50b`.

## Objective
C20-6 turns Chapter 20's certified learning evidence into one production remediation signal.

The detector now combines:

1. the 17-question initial assessment;
2. 12 immutable micro-check first attempts;
3. 60-card flashcard study evidence;
4. real scenario/application evidence from the lesson.

No caller-supplied concept ID or correctness value is authoritative for Chapter 20 durable activity evidence.

## Combined concept detection
`detectAllChapter20CombinedConceptGaps` adapts all four evidence sources into the existing shared concept-detection engine.

Evidence stays at item level and is mapped to one of the six canonical concept families.

The mixed `ch20-real-shop-scenarios` section is explicitly mapped by scenario index rather than by one broad section label:

- index 0 → teamwork/workplace relationships
- index 1 → ethical selling/retailing
- index 2 → financial responsibility/income reporting
- index 3 → ethical selling/retailing
- index 4 → employment classification/compensation

This prevents cross-concept contamination.

## Compliance escalation
Chapter 20 still has **zero bodily-safety families**.

The following remain compliance-sensitive:

- employment classification & compensation;
- financial responsibility & income reporting;
- client retention, marketing & consent.

Compliance domains are:

- worker classification / compensation;
- tax / income reporting;
- privacy / client consent.

A single tagged miss produces targeted compliance review.

Two distinct recent tagged compliance misses elevate the intervention and require a formal five-question reassessment at **80%**, not 100%.

The urgent 100% bodily-safety rule is never applied to Chapter 20.

## Targeted remediation
Every canonical family routes to:

- its matching LO lesson block;
- its exact 10-card flashcard subset;
- a planned five-question reassessment at 80%.

Compliance targets are ordered ahead of ordinary targets, but remain `safetyEscalation: null`.

Original evidence is returned unchanged with the remediation plan and is not erased by routing.

## Shared runtime registration
C20-6 registers Chapter 20 with:

- `activity-evidence-registry`;
- `remediation/chapter-registry`;
- `remediation/content-provider-registry`;
- `remediation/detection-orchestrator`.

This means a persisted Chapter 20 quiz completion can now create the same idempotent remediation-cycle structure used by the shared runtime.

## Server-authoritative activity evidence
Chapter 20 flashcard and scenario/application evidence now posts through:

`/api/chapter-20/activity-evidence`

The server:

- authenticates the user;
- resolves the canonical concept itself;
- resolves the scenario itself when applicable;
- derives correctness server-side;
- writes with the service-role client;
- preserves the first row on duplicate submission.

The client does not authoritatively supply user ID, concept ID, or correctness.

## Live compliance feedback
The Chapter 20 micro-check card now surfaces a **Targeted Compliance Review** when a first-attempt miss belongs to a compliance-sensitive family.

No safety warning is shown for Chapter 20 compliance mistakes.

## Certification target
C20-6 is GREEN only when the exact final head passes:

1. all prior C20-1 through C20-5 certification tests;
2. C20-6 combined detection / compliance / remediation certification;
3. shared runtime registration tests;
4. TypeScript, unit, and build Engineering Verification;
5. exact-head Vercel deployment.

## Next phase
**C20-7 — Fresh Reassessment Reserve + Mastery Recovery:** create exactly 30 fresh reassessment questions — five for each of the six canonical concept families — keep them separate from the 17-question assessment and 12 micro-check namespaces, apply 80% recovery to both ordinary and Chapter 20 compliance remediation, preserve the original misses, and prove successful reassessment can raise mastery without erasing diagnostic history.
