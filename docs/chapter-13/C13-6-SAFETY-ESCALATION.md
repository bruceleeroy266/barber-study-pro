# C13-6 — Safety Escalation

## Goal

C13-6 adds a **safety escalation layer** to the existing Chapter 13 evidence/mastery system.

It does not create a second grading system.

Ordinary evidence continues through the shared grade/mastery architecture. Only genuinely high-risk shaving misses receive safety-specific intervention and recovery thresholds.

## High-risk hazard categories

C13-6 intentionally limits escalation to four source-supported hazards:

1. **Blood exposure response**
   - visible blood / razor nick
   - stop service
   - standard precautions
   - applicable exposure incident procedure

2. **Compromised skin service deferral**
   - visible pustules or signs of active infection
   - do not shave through the affected area
   - defer/modify service and follow infection-control/referral procedure

3. **Medical scope boundary**
   - inflamed ingrown-hair findings
   - barber may observe and make a service decision
   - barber does not diagnose, prescribe, open lesions, or medically treat

4. **Heat / towel contraindication**
   - chapped, blistered, thin, highly sensitive, or heat-intolerant skin
   - avoid or modify hot-towel preparation

These hazards are grounded in the Milady Chapter 13 pages already certified in C13-2 through C13-4.

## Explicit non-hazards

C13-6 does **not** automatically escalate ordinary misses involving:

- 14-area recall
- body position
- razor-position terminology
- ordinary blade-angle recall
- mustache/beard design
- client satisfaction
- standard shave-type definitions

Those remain ordinary grading/mastery evidence unless a separate safety hazard is present.

## Tagged evidence

Assessment items:

- `qq-13-006` — compromised skin service deferral
- `qq-13-007` — heat/towel contraindication
- `qq-13-010` — blood exposure response
- `qq-13-014` — medical scope boundary

Micro-check items:

- `mcq-13-002` — heat/towel contraindication
- `mcq-13-004` — medical scope boundary
- `mcq-13-013` — blood exposure response

The underlying evidence records remain unchanged. Safety is metadata and interpretation layered on top of the same immutable evidence.

## Escalation rules

A single tagged miss:

- immediate targeted safety review
- instructor visibility required
- does **not** automatically force formal reassessment

Urgent escalation requires recent evidence containing:

- at least **2 distinct tagged safety-item misses**
- spanning at least **2 distinct hazard categories**
- inside the most recent **3 tagged safety observations**

Urgent escalation requires:

- targeted remediation
- instructor review
- formal reassessment
- exactly **5 questions**
- **100% required to recover urgent safety mastery**

Two misses from the same hazard category alone remain targeted review rather than urgent escalation.

## Recovery rule

The shared ordinary reassessment threshold remains **80%**.

For any concept affected by an active urgent safety escalation, the Chapter 13 recovery policy requires **100%**.

This means:

- ordinary concept: 4/5 = 80% → may pass the ordinary recovery rule
- urgent safety concept: 4/5 = 80% → **blocked**
- urgent safety concept: 5/5 = 100% → safety recovery gate satisfied

C13-6 exposes this policy through `getChapter13RequiredReassessmentPassPercent` and `evaluateChapter13SafetyRecovery`.

C13-7 will consume the same functions when it creates the real five-question reassessment reserve and targeted remediation workflow.

## Clearing an active intervention

An active safety intervention may also clear after **5 consecutive correct tagged high-risk observations**, matching the established cross-chapter safety architecture.

This does not erase prior misses; the original immutable evidence remains in the mastery history.

## Student UI

A tagged Chapter 13 micro-check miss now displays:

- **Safety review required**
- a targeted Safety / Scope Intervention message
- source-safe language limited to observation, service decision, exposure procedure, and referral boundaries

Ordinary micro-check misses continue to display ordinary concept review.

## Certification gates

C13-6 is GREEN only when:

1. hazard categories are limited to genuinely high-risk Chapter 13 content
2. every tagged item exists in the certified C13-4/C13-5 banks
3. a single tagged miss triggers targeted review
4. an ordinary miss does not trigger safety escalation
5. distinct high-risk misses can trigger urgent escalation
6. same-hazard repetition alone does not trigger urgent escalation
7. urgent safety recovery requires exactly 5/5 = 100%
8. ordinary recovery remains 4/5 = 80%
9. initial evidence remains immutable
10. student-facing safety language stays within barbering scope
11. shared grading weights remain unchanged
12. exact-head Engineering Verification is GREEN
13. exact-head Vercel preview is READY
