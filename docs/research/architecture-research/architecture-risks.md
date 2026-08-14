# Architecture Risks

**Document:** Architecture Risk Register  
**Last Updated:** 2026-08-14  
**Status:** ACTIVE

---

## Risk Overview

This document captures architectural risks identified during research. These risks should be considered before any future implementation.

---

## Technical Risks

### TR1: Historical Performance Recalculation

**Risk:** If exam blueprint changes, historical student performance could be silently recalculated against a different blueprint.

**Impact:** High — Could misrepresent student readiness

**Likelihood:** Medium — Blueprints change periodically

**Mitigation:** Anchor all performance records to specific exam version; never recalculate without explicit design decision

**Status:** IDENTIFIED — No mitigation implemented

---

### TR2: Developer/Administrator Conflation

**Risk:** Collapsing exam developer and exam administrator into single concept.

**Impact:** High — Would lose critical licensing relationship information

**Likelihood:** Medium — Easy to assume `provider = developer`

**Mitigation:** Maintain separate entities in data model; validate at application level

**Status:** IDENTIFIED — No mitigation implemented

---

### TR3: Multi-State Complexity

**Risk:** 50 states with different exams, versions, and blueprints creates significant complexity.

**Impact:** Medium — Could slow development and increase errors

**Likelihood:** High — National expansion requires multi-state support

**Mitigation:** Phased rollout; start with Oklahoma; validate before expanding

**Status:** IDENTIFIED — Mitigation: Phased approach

---

### TR4: Integration Complexity

**Risk:** Integrating with multiple external systems (SIS, curriculum providers, retention platforms) creates maintenance burden.

**Impact:** Medium — Could divert resources from core product

**Likelihood:** Medium — Complement positioning requires integration

**Mitigation:** Prioritize integrations based on school demand; use standard protocols

**Status:** IDENTIFIED — No mitigation implemented

---

### TR5: Data Migration

**Risk:** Migrating existing content to new competency taxonomy could introduce errors.

**Impact:** High — Could corrupt existing curriculum

**Likelihood:** Medium — Migration would be required for new architecture

**Mitigation:** Comprehensive backup; staged migration; extensive testing

**Status:** IDENTIFIED — No mitigation implemented

---

## Strategic Risks

### SR1: Feature Creep

**Risk:** Attempting to build all identified capabilities at once could delay NABBA and destabilize product.

**Impact:** High — Could miss NABBA deadline or introduce bugs

**Likelihood:** Medium — Temptation to add features before validation

**Mitigation:** Strict pre-NABBA freeze; validate at NABBA before authorizing

**Status:** ACTIVE — Mitigation: Protected baseline `61a8ef8`

---

### SR2: Competitive Mispositioning

**Risk:** Claiming differentiation that competitors already provide could damage credibility.

**Impact:** High — Could lose trust with schools

**Likelihood:** Low — Research has clarified competitive landscape

**Mitigation:** Conservative claims; focus on workflow, not features

**Status:** MITIGATED — Research complete; positioning adjusted

---

### SR3: Validation Failure

**Risk:** NABBA validation may not support strategic hypothesis.

**Impact:** High — Would require strategic pivot

**Likelihood:** Medium — Hypothesis not yet validated

**Mitigation:** Structured validation questions; willingness to pivot based on feedback

**Status:** ACTIVE — Awaiting NABBA validation

---

## Operational Risks

### OR1: Research Currency

**Risk:** Licensing and competitive information becomes outdated.

**Impact:** Medium — Could make decisions based on stale data

**Likelihood:** High — Information changes frequently

**Mitigation:** Scheduled reverification; source tracking; change log

**Status:** MITIGATED — Archive includes reverification schedule

---

### OR2: Source Reliability

**Risk:** Third-party sources may be inaccurate or incomplete.

**Impact:** Medium — Could make decisions based on bad data

**Likelihood:** Medium — Not all sources are authoritative

**Mitigation:** Prioritize official sources; verify third-party information

**Status:** MITIGATED — Source standard established

---

## Risk Matrix

| Risk | Impact | Likelihood | Priority |
|------|--------|------------|----------|
| TR1: Historical recalculation | High | Medium | High |
| TR2: Developer/admin conflation | High | Medium | High |
| TR3: Multi-state complexity | Medium | High | Medium |
| TR4: Integration complexity | Medium | Medium | Medium |
| TR5: Data migration | High | Medium | High |
| SR1: Feature creep | High | Medium | High |
| SR2: Competitive mispositioning | High | Low | Medium |
| SR3: Validation failure | High | Medium | High |
| OR1: Research currency | Medium | High | Medium |
| OR2: Source reliability | Medium | Medium | Medium |

---

## Risk Review Schedule

| Review | Frequency | Owner |
|--------|-----------|-------|
| Technical risks | Before any implementation | Ping |
| Strategic risks | Monthly | Gabriel + Ping |
| Operational risks | Quarterly | Ping |

---

*Last Updated: 2026-08-14*
