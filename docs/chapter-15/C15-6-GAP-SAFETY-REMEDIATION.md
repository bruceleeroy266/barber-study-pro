# C15-6 — Gap Detection + Safety Escalation + Targeted Remediation Architecture

C15-6 adds weak-concept detection and safety-sensitive remediation policy without changing any certified Chapter 15 instructional inventory.

## Locked inventories

- 54 lesson sections
- 90 flashcards
- 72 assessment questions
- 14 micro-check questions
- seven canonical concept families
- shared 20/10/40/15/15 grading contract

## Combined-evidence gap detection

Chapter 15 remediation can now reason over immutable evidence from:

- micro-checks
- flashcards
- chapter assessment
- scenario/application evidence
- future remediation/reassessment evidence

Evidence is deduplicated by student + chapter + source + attempt phase + item ID, preserving the original academic record.

An ordinary remediation target is created when a concept has sufficient evidence and mastery at or below 70%, or when it contains at least two preserved initial misses.

## Canonical targeted remediation paths

Each weak concept resolves to its existing C15-1 mappings:

- mapped lesson content blocks are primary remediation material
- mapped flashcards are supplementary review
- no generic or unrelated Chapter 15 material is substituted
- all seven concept families have non-empty lesson and flashcard paths

Chapter 15 is also registered in the shared concept-detection/remediation-assignment registry.

## Safety-sensitive escalation

Four high-risk hazard classes are recognized:

1. medication scope boundary
2. surgical scope boundary
3. attachment cure / water-exposure control
4. chemical-service compatibility

A single tagged miss causes immediate targeted review and instructor visibility.

Two distinct recent high-risk misses spanning at least two hazard classes cause an urgent intervention. Urgent affected concepts require the policy equivalent of a fresh five-question reassessment at 100% before safety mastery can recover. The fresh reserve itself is intentionally deferred to the next reassessment phase.

Repeated misses from one hazard class alone do not automatically create an urgent multi-hazard intervention.

An active safety intervention clears only after five consecutive correct tagged observations.

## Student-facing boundaries

Safety messages instruct the learner to:

- stay within barbering scope
- refer individualized medical decisions appropriately
- follow verified product/manufacturer instructions
- verify chemical-service compatibility before proceeding

The messages do not diagnose a condition, prescribe treatment, choose medication dosage, or assert an allergic reaction.

## Certification gate

C15-6 is GREEN only after the combined-evidence planner, shared detection registry binding, safety escalation rules, immediate micro-check safety UI, inventory preservation, full Engineering Verification, and exact-head Vercel preview all pass.
