# C19-1 — Canonical Concept Architecture Blueprint

This file is the implementation contract produced by C19-0. It defines the exact Chapter 19 concept namespace before any production behavior is changed.

## Canonical concept families

1. `ch19-licensing-requirements-verification` — Licensing Requirements & Official Verification
2. `ch19-exam-preparation-test-reasoning` — Exam Preparation & Test Reasoning
3. `ch19-practical-exam-safety-readiness` — Practical Exam, Infection Control & Safety Readiness
4. `ch19-employment-readiness-professionalism` — Employment Readiness & Professionalism
5. `ch19-resume-portfolio-application-materials` — Résumé, Portfolio & Application Materials
6. `ch19-job-search-shop-research-interview` — Job Search, Shop Research & Interview Practice
7. `ch19-employment-law-contracts-compliance` — Employment Law, Contracts & Professional Compliance

## Canonical learning objectives

| ID | Statement | Concept |
|---|---|---|
| `LO-19-01` | Verify the licensing path and current requirements using applicable official sources. | `ch19-licensing-requirements-verification` |
| `LO-19-02` | Apply effective written/theory examination preparation and test-reasoning strategies. | `ch19-exam-preparation-test-reasoning` |
| `LO-19-03` | Prepare for practical/skills testing while applying infection-control and service-safety expectations. | `ch19-practical-exam-safety-readiness` |
| `LO-19-04` | Evaluate personal strengths, professional behaviors, and transferable skills for employment readiness. | `ch19-employment-readiness-professionalism` |
| `LO-19-05` | Build accurate, professional résumé, portfolio, cover-letter, and application materials. | `ch19-resume-portfolio-application-materials` |
| `LO-19-06` | Research employers, network, prepare for interviews, and apply professional interview/follow-up practices. | `ch19-job-search-shop-research-interview` |
| `LO-19-07` | Recognize employment-law boundaries and review workplace agreements/terms carefully before accepting obligations. | `ch19-employment-law-contracts-compliance` |

## Criticality policy

Only `ch19-practical-exam-safety-readiness` is designated **safety-critical** for the shared urgent-safety pathway.

`ch19-licensing-requirements-verification` and `ch19-employment-law-contracts-compliance` are **compliance/legal-critical**, but they are not bodily-safety hazards and must not inherit the 100% urgent-safety rule merely because the consequences can be serious.

C19-6 must implement compliance/legal escalation distinctly from urgent safety.

## Lesson semantic mapping target

The existing single runtime lesson shell remains intact. C19-1 will map semantic lesson sections as follows:

| Current lesson section | Canonical concept families |
|---|---|
| Know Your Licensing Path | licensing requirements & verification |
| Prepare for Written/Theory Examination | exam preparation & test reasoning |
| Prepare for Any Practical/Skills Component | practical exam/safety; licensing verification |
| Turn School Experience into Employment Evidence | employment readiness; résumé/portfolio |
| Research the Shop Before You Apply | job search/shop research/interview; employment readiness |
| Interview Like a Professional | job search/shop research/interview; employment law/contracts where legal interview boundaries appear |
| Read Before You Agree | employment law/contracts/compliance |
| Career Launch Checklist | all seven as a summary surface |

The runtime remains one lesson shell; semantic mappings carry multi-concept coverage, following the Chapter 18 pattern rather than inventing fake runtime section IDs.

## Flashcard mapping policy

All 60 cards must receive one primary canonical concept family. Category strings are hints, not authority.

Expected category-to-family starting map:

| Current category | Primary family |
|---|---|
| Introduction & Career Mindset | employment readiness & professionalism |
| Licensure & Exam Preparation | licensing requirements & verification OR exam preparation/test reasoning, item-by-item |
| Test-Taking Strategies | exam preparation & test reasoning |
| Barber Law & Practical Exams | licensing verification OR practical exam/safety, item-by-item |
| Employment Readiness | employment readiness & professionalism |
| Résumé & Portfolio | résumé/portfolio/application materials |
| Job Search & Networking | job search/shop research/interview |
| Interview Preparation | job search/shop research/interview |
| Interview Etiquette & Follow-Up | job search/shop research/interview |
| Legal & Professional Conduct | employment law/contracts/compliance |

C19-1 certification must reject unmapped cards and duplicate primary mappings.

## Assessment mapping policy

The active wording of each `qq-19-XX` question is authoritative for concept mapping. Legacy `learningObjective` values and legacy remediation IDs are not authoritative because the audit found semantic drift.

The 15 assessment IDs remain stable in C19-1. Their content is not rewritten until C19-4.

## Namespace contract

Planned namespaces:

- assessment: `qq-19-01` … `qq-19-15`
- micro-check: `mc-19-01` … `mc-19-14`
- reassessment: dedicated `ra-19-...` namespace, 35 items total

No item may appear in more than one assessment namespace.

## Shared grading contract

Chapter 19 will use the existing shared weights unchanged:

- micro-check = 20%
- flashcard = 10%
- chapter assessment = 40%
- scenario/application = 15%
- remediation reassessment = 15%

No durable Chapter 19 scenario inventory currently exists. C19-1 must not fabricate one. The 15% scenario/application source remains absent until a real scenario source is built.

## C19-1 implementation files

C19-1 should add, at minimum:

- `src/lib/chapter-19-concepts/types.ts`
- `src/lib/chapter-19-concepts/concepts.ts`
- `src/lib/chapter-19-concepts/mappings.ts`
- `src/lib/chapter-19-concepts/c19-1-architecture-certification.test.ts`

C19-1 is architecture-only. It must not yet:
- alter learner-facing lesson wording,
- rewrite flashcards,
- rewrite assessment questions,
- replace legacy remediation runtime behavior,
- add micro-check UI,
- change grading,
- add reassessment behavior,
- expose diagnostics.

## C19-1 certification invariants

1. Exactly seven active concept families.
2. Exactly seven canonical learning objectives.
3. Every concept has at least one semantic lesson mapping.
4. All 60 flashcards map exactly once to a primary concept.
5. All 15 active assessment IDs map exactly once by active meaning.
6. No mapping depends on stale legacy remediation text.
7. Practical safety is the only urgent-safety concept family.
8. Legal/compliance criticality remains distinct from urgent safety.
9. Existing learner runtime behavior is unchanged.
10. Shared 20/10/40/15/15 weights are not modified.

**Implementation may begin only from this contract.**
