# C19-0 — Baseline + Collision Audit

**Chapter:** 19 — Preparing for Licensure and Employment  
**Baseline:** `main` at `0b0175f6e42c9d3a485a569b02d2977a1dc79853`  
**Audit branch:** `chapter-19-c19-0-baseline`  
**Scope:** inventory only; no production behavior changes

## Verdict

**C19-0 GREEN — baseline established, collisions identified, and C19-1 architecture frozen for implementation.**

Chapter 19 has a usable legacy content layer, but it is not aligned with the shared Chapters 14–18 mastery pipeline. The current production inventory contains one lesson runtime shell, 60 flashcards, 15 chapter-assessment questions, and 18 legacy remediation entries. It does not yet contain Chapter 19 concept-family types, canonical mappings, micro-check evidence, shared grading wrappers, combined-evidence gap detection, escalation logic, a reassessment provider/reserve, mastery recovery, or instructor/school-admin diagnostics.

## Existing Chapter 19 inventory

| Surface | Current state | C19-0 result |
|---|---|---|
| Lesson | `src/lib/chapter-19-premium-content.ts`; one runtime HTML lesson shell | KEEP, map semantically in C19-1 |
| Flashcards | `src/lib/chapter-19-premium-flashcards.ts`; 60 cards | KEEP inventory; source/provenance hardening deferred to C19-3 |
| Assessment | `src/lib/chapter-19-premium-quiz.ts`; 15 questions | KEEP inventory, but mappings require correction in C19-4 |
| Legacy remediation | `src/lib/chapter-19-premium-remediation.ts`; 18 entries | DO NOT use as canonical concept evidence until remapped |
| Concept architecture | none | MISSING |
| Micro-checks | none | MISSING |
| Immutable evidence persistence | none for Chapter 19 | MISSING |
| Shared 20/10/40/15/15 wrapper | none for Chapter 19 | MISSING |
| Gap detection | none | MISSING |
| Safety/legal escalation | none | MISSING |
| Shared reassessment provider | none | MISSING |
| Fresh reassessment reserve | none | MISSING |
| Mastery recovery | none | MISSING |
| Instructor/school-admin Chapter 19 diagnostics | none | MISSING |

## Legacy content shape

The 60-card deck currently spans ten categories:

- Introduction & Career Mindset — 4
- Licensure & Exam Preparation — 7
- Test-Taking Strategies — 8
- Barber Law & Practical Exams — 6
- Employment Readiness — 5
- Résumé & Portfolio — 9
- Job Search & Networking — 5
- Interview Preparation — 6
- Interview Etiquette & Follow-Up — 5
- Legal & Professional Conduct — 5

The lesson currently presents eight main learner-facing sections:

1. Know Your Licensing Path
2. Prepare for the Written or Theory Examination
3. Prepare for Any Practical or Skills Component
4. Turn School Experience into Employment Evidence
5. Research the Shop Before You Apply
6. Interview Like a Professional
7. Read Before You Agree
8. Career Launch Checklist

The current assessment contains 15 questions and declares only three legacy learning-objective labels: `LO-1`, `LO-2`, and `LO-3`.

## Collision register

### C19-C01 — quiz/remediation semantic drift — HIGH

The current remediation bank's per-question records no longer describe the same question content as the current quiz after the first few IDs.

Examples:
- `qq-19-04` currently asks about **integrity**, while `CH19-R-qq-19-04` remediates **scanning the whole test and budgeting time**.
- `qq-19-05` currently asks about **work ethic**, while `CH19-R-qq-19-05` remediates **eliminating duplicate answer choices**.
- `qq-19-07` currently asks about **résumé scan time**, while `CH19-R-qq-19-07` remediates **practical exam skills**.
- `qq-19-13` currently asks about **interview attire/grooming**, while `CH19-R-qq-19-13` remediates **shop-visit résumé/cover-letter follow-up**.
- `qq-19-15` currently asks about **employment contracts/noncompete review**, while `CH19-R-qq-19-15` remediates **illegal interview questions**.

**Constraint:** C19-1 must not inherit legacy remediation-by-question mappings as authoritative. Canonical mappings must be rebuilt from the active lesson, cards, and assessment.

### C19-C02 — learning-objective labels are semantically stale — HIGH

The current quiz labels `qq-19-01` through `qq-19-07` as `LO-1`, even though questions 4–7 concern integrity, work ethic, transferable skills, and résumé review rather than a single licensure/exam domain. The three-label scheme is too coarse for shared concept mastery and has drifted from the current question meanings.

**Constraint:** C19-1 introduces canonical Chapter 19 learning-objective IDs and concept-family mappings. Legacy `LO-1` / `LO-2` / `LO-3` remain compatibility metadata until later hardening; they do not drive mastery.

### C19-C03 — release/QA reports describe an older provenance state — MEDIUM

The July Chapter 19 release and Phase 5 reports describe a textbook-derived Phase 1 release and old learning-objective/remediation alignment. On September 20, commit `add6e0022b825704da5f579115fb51e283167e46` replaced the learner lesson with original ASCYN copy and revised remediation provenance. Therefore the old release reports are historical records, not a reliable description of the current runtime.

**Constraint:** new C19 certification docs must describe the current `main` state, not reuse the July PASS verdict as present-day architecture certification.

### C19-C04 — provenance firewall coverage is incomplete — MEDIUM

`src/lib/chapter-19-content-provenance.test.ts` checks only:
- `chapter-19-premium-content.ts`
- `chapter-19-premium-remediation.ts`

It does **not** cover the active Chapter 19 flashcard or quiz modules. Those modules still contain textbook-style page references such as `p. 710`, `p. 716`, etc.

**Constraint:** C19-3/C19-4 must source/provenance-harden active flashcard and assessment copy and extend the firewall to those surfaces before final certification.

### C19-C05 — no canonical concept IDs — HIGH

Chapter 19 has category strings and legacy LOs but no stable concept-family namespace equivalent to Chapters 14–18.

**Constraint:** C19-1 creates exactly seven canonical concept families and seven canonical learning objectives.

### C19-C06 — no shared evidence chain — HIGH

There is no Chapter 19 implementation for:
- shared evidence records,
- micro-check evidence,
- chapter-specific grading wrapper,
- combined-evidence concept mastery,
- reassessment evidence,
- immutable initial-miss preservation.

**Constraint:** C19-1 defines mappings only. C19-5 onward adds evidence behavior without rewriting history.

### C19-C07 — no Chapter 19 detection/remediation provider — HIGH

The shared reassessment/remediation registries contain adapters for modernized prior chapters, but no Chapter 19 detection provider or content provider registration exists.

**Constraint:** provider registration is deferred until the Chapter 19 concept namespace is stable and the assessment/micro-check mappings are certified.

### C19-C08 — no fresh reassessment namespace — HIGH

Chapter 19 has no dedicated reassessment reserve. Reusing the 15 chapter-assessment items would contaminate recovery evidence.

**Constraint:** C19-7 will create **35 fresh reassessment questions — exactly five per canonical concept family** — in a namespace separate from assessment and micro-checks.

### C19-C09 — safety and legal concepts must not be conflated — HIGH

Chapter 19 contains:
- practical-exam infection-control and client/procedure safety,
- licensing/regulatory compliance,
- interview-law awareness,
- employment-contract/legal-review cautions.

Only the practical safety domain should enter the existing **urgent safety** path. Licensing or contract mistakes can be important compliance/legal gaps but must not be falsely classified as bodily safety hazards.

**Constraint:** C19-6 will maintain separate escalation semantics:
- **urgent safety** only for genuine practical/service safety and infection-control hazards;
- **compliance/legal review** for licensing, interview-law, and contract concepts;
- ordinary targeted remediation for career-preparation errors.

### C19-C10 — scenario/application component absent — MEDIUM

No genuine durable Chapter 19 scenario/application evidence inventory exists today.

**Constraint:** the shared 15% scenario/application weight remains unchanged and absent evidence remains absent. The grade must remain provisional rather than fabricating a scenario score, matching the integrity rule used in Chapter 18.

## Alignment target inherited from Chapters 14–18

Chapter 19 must ultimately satisfy the same end-to-end contract:

`lesson → flashcards → assessment → micro-checks → gap detection → escalation → targeted remediation → fresh reassessment → mastery recovery → instructor/school-admin diagnostics`

Shared grading remains:

- micro-check: 20%
- flashcard: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation reassessment: 15%

Recovery policy target:

- ordinary recovery: 80%
- urgent safety recovery: 100%
- original misses remain immutable
- reassessment appends evidence; it never rewrites the initial attempt

## C19-1 architecture decision

C19-1 is frozen at **seven canonical concept families** so Chapter 19 can use the same 14-micro-check / 35-reassessment shape as Chapters 17–18 without forcing unrelated content together.

| Canonical ID | Name | Primary scope | Critical handling |
|---|---|---|---|
| `ch19-licensing-requirements-verification` | Licensing Requirements & Official Verification | jurisdiction-specific requirements, applications, official sources, current exam-provider requirements | compliance review, not urgent safety |
| `ch19-exam-preparation-test-reasoning` | Exam Preparation & Test Reasoning | study planning, written/theory preparation, stems, qualifiers, elimination, deductive reasoning, time management | ordinary remediation |
| `ch19-practical-exam-safety-readiness` | Practical Exam, Infection Control & Safety Readiness | practical/skills components, equipment readiness, infection control, procedure safety | **safety-critical** |
| `ch19-employment-readiness-professionalism` | Employment Readiness & Professionalism | self-inventory, integrity, work ethic, motivation, transferable skills, career mindset | ordinary remediation |
| `ch19-resume-portfolio-application-materials` | Résumé, Portfolio & Application Materials | résumé, cover letter, portfolio evidence, accomplishments, application materials | ordinary remediation |
| `ch19-job-search-shop-research-interview` | Job Search, Shop Research & Interview Practice | networking, target-shop research, visits, interview preparation, presentation, etiquette, follow-up | ordinary remediation |
| `ch19-employment-law-contracts-compliance` | Employment Law, Contracts & Professional Compliance | prohibited interview questions, ADA/legal awareness, agreements, noncompete/confidentiality cautions, compensation/terms review | compliance/legal review, not urgent safety |

## Canonical learning objectives frozen for C19-1

- `LO-19-01` — Verify the licensing path and current requirements using applicable official sources.
- `LO-19-02` — Apply effective written/theory examination preparation and test-reasoning strategies.
- `LO-19-03` — Prepare for practical/skills testing while applying infection-control and service-safety expectations.
- `LO-19-04` — Evaluate personal strengths, professional behaviors, and transferable skills for employment readiness.
- `LO-19-05` — Build accurate, professional résumé, portfolio, cover-letter, and application materials.
- `LO-19-06` — Research employers, network, prepare for interviews, and apply professional interview/follow-up practices.
- `LO-19-07` — Recognize employment-law boundaries and review workplace agreements/terms carefully before accepting obligations.

## Planned evidence inventory

C19-1 will define mappings only. Later stages must converge on:

- one existing runtime lesson shell with semantic section mappings across all seven concepts;
- all 60 existing flashcards mapped exactly once to a primary concept family;
- all 15 existing assessment questions mapped by active question meaning, not stale legacy LO/remediation labels;
- 14 fresh micro-check questions — exactly 2 per concept family;
- 35 fresh reassessment questions — exactly 5 per concept family;
- targeted remediation coverage for every concept family;
- shared provider registration after mappings are certified;
- same-school authorized instructor/school-admin diagnostics.

## C19-0 close criteria

- [x] Exact baseline identified.
- [x] Existing Chapter 19 runtime inventory recorded.
- [x] Shared Chapters 14–18 architecture compared.
- [x] Missing modern architecture surfaces identified.
- [x] Semantic collisions recorded.
- [x] Provenance/test-coverage collision recorded.
- [x] Safety vs legal/compliance escalation boundary defined.
- [x] Seven-family C19-1 concept architecture frozen.
- [x] No production behavior changed.

**C19-0 status: GREEN.**

**Next task:** implement C19-1 canonical concept architecture and certification tests from this frozen blueprint, without yet changing learner-facing content, grading behavior, remediation behavior, or production UI.
