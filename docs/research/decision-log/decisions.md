# ASCYN PRO — Strategic Decisions

**Document:** Strategic Decision Log  
**Last Updated:** 2026-08-14  
**Status:** ACTIVE

---

## DECISION — Protect NABBA Baseline

**Decision ID:** DEC-2026-08-14-001  
**Date:** 2026-08-14  
**Status:** ACTIVE  
**Impact:** High

### Decision

Preserve commit `61a8ef8` as the protected Phase 6 NABBA baseline.

### Rationale

- Verified Phase 6 NABBA demo
- Stability required for conference presentation
- Prevents destabilization before validation

### Evidence

- Git commit: `61a8ef8` — "checkpoint: NABBA demo Phase 6 presentation hardening complete"
- Phase 6 completion report: `docs/engineering/phases/PHASE_6_INSTRUCTOR_WORKFLOW_CERTIFICATION_REPORT.md`

### Implications

- No code changes that could destabilize demo
- No database schema changes
- No content changes that affect demo flow
- Bug fixes only if critical and verified

### Review Date

Post-NABBA (2026-09-21)

---

## DECISION — No Major Pre-NABBA Architecture

**Decision ID:** DEC-2026-08-14-002  
**Date:** 2026-08-14  
**Status:** ACTIVE  
**Impact:** High

### Decision

Do not implement major new architecture before NABBA.

### Rationale

- Protect stability for NABBA demo
- Validate product direction with actual schools first
- Avoid building features that may not address validated needs

### Evidence

- Competitive research: Feature overlap with Pivot Point, Milady, CourseKey
- Strategic hypothesis: Not yet validated
- NABBA validation plan: `docs/research/nabba-validation/`

### Prohibited

- Exam blueprint schema
- Competency taxonomy migration
- Major content migration
- New readiness algorithm
- CIB weighting engine
- Persistent intervention architecture
- Predictive analytics
- Major Supabase migration
- External integration architecture
- Major demo restructuring

### Authorized

- Critical bug fixes
- Stability improvements
- Critical presentation fixes
- Explicitly approved minor NABBA changes

### Review Date

Post-NABBA (2026-09-21)

---

## DECISION — No Pass Probability Claims

**Decision ID:** DEC-2026-08-14-003  
**Date:** 2026-08-14  
**Status:** ACTIVE  
**Impact:** High

### Decision

Do not claim ASCYN PRO predicts licensing-exam pass probability.

### Rationale

- Exam blueprint weighting does not establish predictive validity
- No real-world outcome dataset to support predictions
- Regulatory and ethical concerns about unsubstantiated claims

### Evidence

- Competitive research: No competitor makes validated pass probability claims
- Data availability: No outcome dataset collected
- Legal review: Unsubstantiated claims could create liability

### Prohibited Claims

- "Predicts licensing exam pass probability"
- "Scientifically validated readiness probability"
- "Guaranteed pass"
- "X% of students pass after using ASCYN PRO"

### Permitted Claims

- "Helps identify learning gaps"
- "Supports targeted remediation"
- "Tracks progress toward exam readiness"
- "Documents improvement over time"

### Review Date

After collecting sufficient outcome data (minimum 1-2 years)

---

## DECISION — Blueprint Alignment Not Unique

**Decision ID:** DEC-2026-08-14-004  
**Date:** 2026-08-14  
**Status:** ACTIVE  
**Impact:** High

### Decision

Do not position CIB/exam-blueprint alignment alone as ASCYN PRO's unique differentiator.

### Rationale

- Competitive research confirmed Milady ExamReady already provides CIB-aligned preparation
- Exam alignment is becoming table stakes, not differentiation
- Differentiation must come from workflow, not features

### Evidence

- Milady ExamReady documentation: CIB alignment confirmed
- Pivot Point documentation: Exam-category performance confirmed
- Competitive analysis: `docs/research/competitive-intelligence/`

### Implications

- Do not claim "unique exam alignment"
- Do not claim "only system aligned to licensing exam"
- Position alignment as infrastructure, not differentiator
- Focus differentiation on instructor workflow

### Permitted Positioning

- "Aligns to licensing exam blueprints" (factual)
- "Supports state-specific exam preparation" (factual)
- "Enables targeted remediation based on exam domains" (workflow focus)

### Review Date

Ongoing — Monitor competitive landscape

---

## DECISION — Complement Existing Systems

**Decision ID:** DEC-2026-08-14-005  
**Date:** 2026-08-14  
**Status:** STRATEGIC HYPOTHESIS / VALIDATION REQUIRED  
**Impact:** High

### Decision

Investigate positioning ASCYN PRO alongside existing curriculum/education systems rather than requiring replacement.

### Rationale

- Schools have invested in existing systems (Pivot Point, Milady, CourseKey)
- Replacement creates switching costs and resistance
- Complement positioning reduces adoption friction

### Evidence

- Competitive research: Schools use multiple systems
- Market analysis: Integration preferred over replacement
- Strategic hypothesis: `docs/research/product-strategy/strategic-hypotheses.md`

### Validation Required

- NABBA interviews: Confirm schools prefer complement
- Integration requirements: Identify specific integration needs
- Pricing validation: Confirm willingness to pay for complementary system

### Implications

- Position as "works alongside" not "replaces"
- Develop integration capabilities (future)
- Focus on unique value, not feature parity

### Review Date

Post-NABBA (2026-09-21)

---

## Decision History

| Date | Decision | Status | Change |
|------|----------|--------|--------|
| 2026-08-14 | Protect NABBA baseline | ACTIVE | Initial |
| 2026-08-14 | No major pre-NABBA architecture | ACTIVE | Initial |
| 2026-08-14 | No pass probability claims | ACTIVE | Initial |
| 2026-08-14 | Blueprint alignment not unique | ACTIVE | Initial |
| 2026-08-14 | Complement existing systems | HYPOTHESIS | Initial |

---

*Last Updated: 2026-08-14*
