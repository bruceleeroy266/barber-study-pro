# C21-6 — Combined Gap Detection + Compliance Escalation + Targeted Remediation

## Parent head
C21-6 is stacked on C21-5 head `199b9b4b1f9ef1a6d0ef1cc9e43a82c644a51f76`.

## Objective
C21-6 turns all certified Chapter 21 learning evidence into one canonical diagnostic and targeted-remediation signal.

The combined detector now uses:

1. **17-question initial assessment**
2. **16 immutable micro-check first attempts**
3. **60 flashcard activity signals**
4. **13 real scored scenario/application items**

All four evidence sources resolve to the same eight canonical concept families.

## Scenario evidence
Chapter 21 contains four two-item scenario blocks plus five real-shop scenarios, for **13 scored scenario/application items**.

Item-level mappings prevent mixed sections from contaminating one concept with another.

Examples:

- `ch21-kc1:0` → Business Entry Paths
- `ch21-kc1:1` → Shop Opening & Planning
- `ch21-kc4:0` → Recordkeeping & Financial Compliance
- `ch21-kc4:1` → Booth Rental & Independent Business Responsibilities
- `ch21-real-shop-scenarios:1` → Shop Operations & Management
- `ch21-real-shop-scenarios:4` → Advertising, Marketing & Client Consent

The four reflection prompts remain reflection content and are not fabricated into scored correctness evidence.

## Scenario-content integrity repair
Because scenario/application results now become durable diagnostic evidence, C21-6 also removes stale pre-hardening scenario claims.

The scored scenarios no longer teach that:

- a booth-renter label automatically creates independent status;
- every booth renter handles taxes identically;
- a particular tax form always follows from the label;
- the renter universally supplies the same insurance/tools/supplies;
- one promotion formula is always the correct slow-day response.

Correctness is now derived from the hardened business rules established in C21-2 through C21-4.

## Server-authoritative activity evidence
Chapter 21 flashcard and scenario evidence posts through:

`/api/chapter-21/activity-evidence`

The browser supplies only the activity source, item ID, and learner response/signal.

The server derives:

- authenticated user;
- chapter `ch-21`;
- canonical concept;
- scenario definition;
- correctness;
- server timestamp.

A duplicate first-attempt insert returns the already-preserved row on PostgreSQL `23505`.

The client cannot authoritatively submit user ID, concept ID, or correctness.

## Combined gap detection
`detectAllChapter21CombinedConceptGaps` adapts the four evidence sources into the shared concept-detection engine.

This keeps the detection math shared rather than creating a Chapter 21-specific scoring formula.

## Compliance escalation
Chapter 21 still has **zero bodily-safety concept families**.

Five concept families are compliance/legal critical:

1. Shop Opening & Planning
2. Ownership & Legal Structures
3. Recordkeeping & Financial Compliance
4. Booth Rental & Independent Business Responsibilities
5. Advertising, Marketing & Client Consent

They are grouped into four compliance domains:

- business licensing / entity;
- recordkeeping / tax reporting;
- booth rental / worker classification;
- privacy / advertising / consent.

Rules:

- one tagged miss → targeted compliance review;
- two distinct recent tagged misses → elevated compliance intervention;
- elevated intervention → instructor review + formal 5-question reassessment;
- compliance reassessment threshold → **80%**;
- three consecutive correct tagged observations clear the active compliance intervention.

No Chapter 21 compliance miss invokes the shared urgent-safety **100%** rule.

## Targeted remediation
Every canonical family routes to:

- its exact hardened LO section;
- its exact mapped flashcard subset;
- a planned five-question formal reassessment at 80%.

Because the source deck is intentionally uneven, flashcard remediation subsets preserve the C21-1 distribution:

**5 / 5 / 10 / 10 / 5 / 5 / 10 / 10**

The remediation planner does not invent extra cards to force equal counts.

Compliance targets are prioritized before standard targets, but every Chapter 21 target has:

`safetyEscalation: null`

Original evidence is returned unchanged with the plan.

## Shared runtime registration
C21-6 registers Chapter 21 with:

- `concept-mastery/activity-evidence-registry`
- `remediation/chapter-registry`
- `remediation/content-provider-registry`
- `remediation/detection-orchestrator`

The production orchestrator fetches persisted Chapter 21 micro-check and activity rows server-side before creating remediation cycles.

## Live learner feedback
A missed compliance-sensitive Chapter 21 micro-check displays:

**Compliance review required**

and a **Targeted Compliance Review** explanation.

No safety-warning language is used for business/legal compliance misses.

## Shared grading
C21-6 does not change the chapter grade:

- micro-checks: **20%**
- flashcards/study: **10%**
- chapter assessment: **40%**
- scenario/application: **15%**
- remediation/reassessment: **15%**

## Next phase
**C21-7 — Fresh Reassessment Reserve + Mastery Recovery:** create exactly **40 fresh reassessment questions — 5 per each of the 8 canonical concept families** — keep them separate from the 17-question assessment and 16 micro-check namespaces, require 80% for both ordinary and compliance recovery, preserve original misses, register Chapter 21 with the shared reassessment provider, and prove successful recovery can raise mastery without erasing diagnostic history.
