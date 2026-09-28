# C14-6 — Safety Escalation + Hazard Mapping

C14-6 defines Chapter 14's genuinely high-risk miss patterns and connects repeated hazardous misses to the same urgent-safety recovery standard used by the hardened earlier chapters.

## Hazard boundary

Chapter 14 does **not** treat every wrong haircutting answer as a safety incident.

Only two high-risk hazard categories are presently justified by the certified Chapter 14 evidence inventory:

1. **compromised_skin_service_deferral**
   - shaving through broken or compromised skin can create avoidable injury/exposure risk
   - tagged evidence: `mcq-14-013`

2. **thermal_burn_prevention**
   - prolonged concentrated blow-dryer heat can create avoidable thermal injury risk
   - tagged evidence: `mcq-14-014`, `qq-14-070`

Ordinary technique, style, design, tool-selection, and terminology misses remain ordinary academic evidence and do not trigger safety escalation by themselves.

## Escalation rules

Chapter 14 inherits the established safety pattern:

- evaluate the most recent 3 tagged safety observations
- a single tagged miss → targeted safety review + instructor visibility
- urgent escalation requires at least 2 distinct missed safety items across at least 2 distinct hazards
- urgent escalation requires exactly 5 fresh safety reassessment questions
- urgent safety pass requirement = **100% (5/5)**
- ordinary reassessment remains **80% (4/5)**
- safety intervention clears only after 5 consecutive correct tagged safety observations

## Evidence integrity

C14-6 does not rewrite, delete, or replace first-attempt evidence.

Safety evaluation reads the existing evidence records and returns an intervention state. The original wrong answer remains preserved. Future reassessment is a separate `remediation_reassessment` evidence record.

## Student-facing language

Safety messages stay within barbering service-decision scope:

- observe broken or compromised skin
- defer the affected shave service when unsafe
- keep thermal airflow moving
- monitor client comfort
- do not diagnose or prescribe

## Runtime feedback

The Chapter 14 micro-check card now surfaces targeted safety feedback when a tagged first-attempt answer is incorrect.

This does not alter the C14-5 persistence contract: the first attempt remains locked and immutable.

## Certification gate

C14-6 is GREEN only after:

1. tagged IDs all exist in the current certified micro-check/assessment inventory,
2. only genuine high-risk hazards are escalated,
3. one hazard miss triggers review but not formal urgent reassessment,
4. two distinct hazards inside the recent window trigger urgent escalation,
5. urgent recovery requires exactly 5/5,
6. ordinary recovery remains 4/5,
7. original evidence is not mutated,
8. student safety messaging stays within scope,
9. Engineering Verification is GREEN on the exact head,
10. matching Vercel preview is GREEN on the same exact head.
