# C21-5 — Micro-Checks + Immutable Evidence

## Parent head
C21-5 is stacked on C21-4 head `45b28386c135e5586ede18b8c3946be2c4895e6d`.

## Objective
Add a fresh, low-stakes diagnostic layer to Chapter 21 without contaminating the certified 17-question assessment or weakening first-attempt evidence.

## Micro-check inventory
C21-5 creates exactly **8 micro-check blocks** and **16 fresh questions**:

- `mc-21-01` → `mcq-21-001`–`002` → Business Entry Paths
- `mc-21-02` → `mcq-21-003`–`004` → Shop Opening & Planning
- `mc-21-03` → `mcq-21-005`–`006` → Ownership & Legal Structures
- `mc-21-04` → `mcq-21-007`–`008` → Business Plan & Financial Planning
- `mc-21-05` → `mcq-21-009`–`010` → Recordkeeping & Financial Compliance
- `mc-21-06` → `mcq-21-011`–`012` → Booth Rental & Independent Business Responsibilities
- `mc-21-07` → `mcq-21-013`–`014` → Shop Operations & Management
- `mc-21-08` → `mcq-21-015`–`016` → Advertising, Marketing & Client Consent

Every family receives exactly **2** fresh questions.

The questions use understanding, application, and scenario reasoning. No recall-only micro-check was introduced.

## Namespace isolation
The initial assessment remains:

`qq-21-01` through `qq-21-17`

Micro-checks use only:

`mcq-21-001` through `mcq-21-016`

The namespaces and prompts are certified as separate.

## Lesson placement
Each block is rendered immediately after its matching LO:

- after `ch21-lo1` through `ch21-lo8`.

The original eight C21-2 **Apply It** anchors remain ungraded and separate from the micro-check evidence.

## First-attempt evidence
C21-5 uses the existing shared `chapter_micro_check_attempts` table.

The browser sends only:

- `questionId`
- `selectedAnswer`

The authenticated server derives:

- authenticated user ID;
- chapter ID `ch-21`;
- check ID;
- canonical concept ID;
- difficulty;
- correctness;
- server timestamp.

The client cannot submit authoritative user IDs, concept IDs, correctness, or evidence timestamps.

## Immutability
The write path performs an INSERT rather than update/upsert.

The existing unique first-attempt constraint is relied on to return PostgreSQL `23505` on a duplicate.

On `23505`, the server reads and returns the already-preserved first-attempt row.

It does **not** overwrite, update, upsert, or delete the original answer.

## Completion hardening
Chapter 21 already contains graded scenario/application sections.

C21-5 requires **both**:

1. every required scenario/application section completed; and
2. all 16 Chapter 21 micro-check questions durably recorded.

Scenario completion alone cannot set Chapter 21 knowledge checks complete.

The same persisted rows that drive completion can later feed C21-6 combined gap detection and the shared 20% micro-check grade.

## Shared grading
No percentages change:

- micro-check: **20%**
- flashcards/study: **10%**
- chapter assessment: **40%**
- scenario/application: **15%**
- remediation/reassessment: **15%**

C21-5 adds the real persisted micro-check evidence source; it does not invent a second grading formula.

## Criticality boundary
C21-5 records evidence only.

Compliance escalation is intentionally deferred to **C21-6** so this phase does not duplicate or prematurely fork escalation logic.

Chapter 21 still has zero bodily-safety concept families.

## Certification target
C21-5 is GREEN only after its exact head passes:

1. all prior C21-1 through C21-4 certifications;
2. exactly 16 fresh micro-check questions;
3. exactly 2 questions per canonical family;
4. namespace/prompt isolation from the 17-question assessment;
5. immutable first-attempt evidence tests;
6. authenticated server-authoritative write tests;
7. completion-bypass prevention tests;
8. TypeScript/unit/build Engineering Verification;
9. exact-head Vercel deployment.

## Next phase
**C21-6 — Combined Gap Detection + Compliance Escalation + Targeted Remediation:** combine the 17-question assessment, 16 immutable micro-checks, 60 flashcards, and real scenario/application evidence; detect weak concepts; apply compliance/legal escalation without inventing bodily-safety escalation; and route students to canonical targeted remediation.
