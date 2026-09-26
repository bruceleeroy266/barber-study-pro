# C8-7 — Targeted Remediation + 5-Question Reassessment Reserve

## Goal

Use preserved Chapter 8 evidence to identify the exact concept families that need remediation, then require a fresh five-question reassessment without overwriting first-attempt evidence.

## Rules implemented in the first C8-7 slice

### Ordinary concept gaps
A concept is targeted when:
- mastery is at or below 70%, or
- there are at least two preserved initial misses.

Ordinary targeted concepts use:
- 5-question formal reassessment,
- 80% pass threshold.

### Critical safety concepts
The stricter C8 safety families remain:
- `ch8-equipment-safety`
- `ch8-light-therapy-safety`

A single scenario-level miss can place the concept on targeted review/watch.

Repeated hard safety misses that reach the existing urgent escalation require:
- instructor review,
- targeted remediation,
- 5-question formal reassessment,
- 100% pass threshold.

### Evidence integrity
C8-7 never rewrites or replaces initial evidence.

Reassessment records must be added as:
- source: `remediation_reassessment`
- attempt phase: `reassessment`

The original evidence array remains unchanged and the recovery evidence is appended as a separate later phase.

## Reassessment reserve — current implementation

The reserve now contains 50 fresh questions total: five for each of the ten canonical Chapter 8 concept families.

The two critical safety families still keep their stricter 100% pass threshold; the remaining eight concept families use the ordinary 80% formal reassessment threshold.

Reserve IDs use the `r8-` namespace so they cannot collide with:
- initial chapter assessment IDs (`qq-8-`)
- micro-check IDs (`mcq-8-`)

All safety reserve questions are application/scenario level.

## Remaining C8-7 work

- convert completed reserve responses into `remediation_reassessment` evidence;
- deterministic reserve selection is implemented by concept ID and stable sorted reserve IDs;
- five-question cycle scoring is implemented with 80% ordinary / 100% urgent-safety pass thresholds;
- wire targeted remediation and reassessment into the student remediation flow;
- add persistence and regression coverage;
- run full Engineering Verification and exact-head Vercel certification.

