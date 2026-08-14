# Architecture Risks

**Document:** Architecture Risk Register  
**Last Updated:** 2026-08-14  
**Status:** ACTIVE

---

## Risk Overview

This document captures architectural risks identified during research. These risks should be considered before any future implementation.

---

## Cross-State Architecture Findings (Batch 1 + Batch 2 — 2026-08-14)

**Finding:** The national barber licensing landscape cannot be accurately represented as simply `State → NIC or PSI`.

### FINDING 1 — APPLICATION PROCESSOR MAY BE A SEPARATE ROLE

Illinois demonstrates a three-role model:

**Exam Developer** → **Application/Eligibility Processor** → **Testing/Delivery Vendor**

| Role | Illinois Example |
|------|-----------------|
| Exam Developer / Content Owner | NIC |
| Application / Eligibility Processor | Continental Testing Services (CTS) |
| Testing / Delivery Vendor | PSI |

**Implication:** Do NOT create one generic `exam_provider` concept. At least three potentially distinct roles exist.

---

### FINDING 2 — ADMINISTRATOR DOES NOT IDENTIFY THE EXAM

Indiana demonstrates:

**PSI administration** ≠ **PSI National Exam**

Indiana uses PSI to administer a **state-specific examination** (the Board chose to continue updating its own questions rather than adopting the PSI National exam).

**Implication:** The exam developer/content owner must be tracked independently of the administrator.

---

### FINDING 3 — LICENSE STAGE MATTERS

Kentucky demonstrates that examination requirements can differ according to the stage of licensure:

```
Kentucky
└── Barber Profession
    ├── Probationary / Apprentice Barber → Written Examination
    └── Barber (post-experience) → Practical Examination
```

**Implication:** Future research must not model simply `State → Barber → Exam`. Preserve license stage as a distinct concept.

---

### FINDING 4 — ONE LICENSE MAY REQUIRE MULTIPLE EXAMS

Kansas demonstrates a structure involving:

- NIC Barber Stylist Theory (via Prov) — 80% minimum
- Kansas Rules & Regulations Examination — 80% minimum
- Kansas Board Practical Examination

**Implication:** `License → Single Exam` is not a safe assumption. Future architecture should support `License → Multiple Examination Requirements`.

---

### FINDING 5 — ADDITIONAL SERVICE CREDENTIALS MAY EXIST

Iowa demonstrates that professional authorization may include an additional service-specific certification (shaving certification) beyond the primary barber license.

**Implication:** Future licensing intelligence may need to distinguish **Primary License** from **Endorsement / Certification / Service Authorization**.

---

### FINDING 6 — PRACTICAL DELIVERY VARIES SIGNIFICANTLY

Across Batch 1 + Batch 2, practical structures identified include:

| Delivery Type | States |
|---------------|--------|
| Traditional external practical | Alabama, Colorado, Georgia |
| Board-administered practical | Kansas, Kentucky |
| Computer-based practical | Arizona |
| Remote/virtual practical | Maine, Maryland |
| School/instructor proficiency | Alaska |
| No state practical licensing exam | California |

**Implication:** Practical examination delivery type must be a distinct field in any future data model.

---

### Updated Research Taxonomy (Batch 1 + Batch 2)

Based on all research to date, the current research taxonomy is:

```
Jurisdiction / State
  └── Profession
        └── License
              └── License Stage
                    └── Credential / Endorsement (if applicable)
                          └── Examination Requirement
                                └── Exam
                                      └── Exam Developer / Content Owner
                                            └── Application / Eligibility Processor (if applicable)
                                                  └── Administrator / Delivery Vendor
                                                        └── Exam Version
                                                              └── Effective Date
                                                                    └── CIB
                                                                          └── Exam Blueprint
                                                                                └── Domain / Competency
                                                                                      └── Passing Standard
                                                                                            └── Practical Requirement / Delivery Type
```

**Status:** RESEARCH ONLY — Do NOT implement this as a database schema.

---

### Developer/Administrator Patterns Identified (Batch 1 + Batch 2)

| Pattern | Developer | Administrator | States |
|---------|-----------|---------------|--------|
| NIC + Prov | NIC | Prov | Alaska, Maine, Oklahoma |
| NIC + PCS | NIC | PCS | Arizona |
| NIC + Prometric | NIC | Prometric | Connecticut, Delaware |
| NIC + CTS + PSI | NIC | CTS (application) + PSI (delivery) | Illinois |
| PSI + PSI | PSI | PSI | Alabama, California, Colorado, Georgia, Maryland |
| State-specific + PSI | State | PSI | Indiana |
| State-specific + Pearson VUE | UNKNOWN | Pearson VUE | Florida |
| State-board-controlled | State Board | State Board | Kentucky |
| NIC + Prov (likely) | NIC | Prov | Idaho (unconfirmed) |
| Vendor transition | UNKNOWN | Prometric → PSI | Hawaii |
| Multiple sources | NIC + State Board | Prov + State Board | Kansas |
| UNKNOWN | UNKNOWN | UNKNOWN | Arkansas, Louisiana |

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

**Batch 1 Evidence:** 6 distinct developer/administrator patterns confirmed across just 10 states.

---

### TR3: Multi-State Complexity

**Risk:** 50 states with different exams, versions, and blueprints creates significant complexity.

**Impact:** Medium — Could slow development and increase errors

**Likelihood:** High — National expansion requires multi-state support

**Mitigation:** Phased rollout; start with Oklahoma; validate before expanding

**Status:** IDENTIFIED — Mitigation: Phased approach

**Batch 1 Evidence:** 10 states researched; 6 distinct patterns identified; multiple exam tracks per state confirmed.

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

### TR6: Exam Track Proliferation

**Risk:** States with multiple exam tracks (e.g., Delaware's 4 tracks) could multiply data model complexity.

**Impact:** Medium — Each track may have different blueprints and versions

**Likelihood:** High — Batch 1 confirmed multiple tracks in Delaware and Alaska

**Mitigation:** Design for multiple exams per state per license type from the start

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
| TR6: Exam track proliferation | Medium | High | Medium |
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
