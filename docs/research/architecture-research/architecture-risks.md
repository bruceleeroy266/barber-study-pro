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
| Board-administered practical | Kansas, Kentucky, Minnesota, Mississippi, Nebraska |
| Computer-based practical | Arizona |
| Remote/virtual practical | Maine, Maryland |
| School/instructor proficiency | Alaska |
| No state practical licensing exam | California, Massachusetts |

**Implication:** Practical examination delivery type must be a distinct field in any future data model.

---

### FINDING 7 — PROFESSION-SPECIFIC EXAMINATION SYSTEMS (Batch 3)

Nebraska demonstrates that examination structures can differ by profession within the same state. Nebraska barbering and Nebraska cosmetology do NOT share the same examination structure.

**Implication:** Never infer barber examination requirements from cosmetology examination arrangements. The minimum safe research relationship is `State → Profession → License → Exam Requirement`.

---

### FINDING 8 — STATE-SPECIFIC KNOWLEDGE EXAMINATIONS (Batch 3)

Mississippi demonstrates a three-component structure:

- **National Theory** (NIC Barber Theory)
- **State Law/Sanitation** (Mississippi Law & Sanitation Examination)
- **Practical** (Mississippi Barber Practical Examination)

**Implication:** A future licensure-readiness model may require separate measurement of national technical knowledge and state-specific regulatory knowledge.

---

### FINDING 9 — ORAL EXAMINATIONS EXIST (Batch 3)

Nevada requires an **oral examination** component in addition to written and practical.

**Implication:** Exam types must not be limited to `Theory + Practical`. The examination-type taxonomy now includes: Theory/Written, Practical, State Law/Jurisprudence, Sanitation, Oral, Proficiency, Service-specific certification, Computer-based practical, Remote/virtual practical.

---

### FINDING 10 — EXAM MIGRATIONS MUST BE HISTORICAL (Batch 3)

Michigan transitioned from a state exam to PSI National (October 2, 2024), then updated PSI content (February 11, 2026). New Hampshire transitioned from DL Roope/Prometric to Prov.

**Implication:** Do not overwrite historical exam/provider relationships when a state changes programs. Preserve full transition history.

---

### FINDING 11 — LICENSE SUBTYPE MATTERS (Batch 3)

New Hampshire uses different NIC examination tracks for different license levels:

- Barber → NIC Barber 1
- Master Barber → NIC Barber Styling

**Implication:** License subtype must remain part of the research taxonomy.

---

### FINDING 12 — NATIONAL PROGRAM PARTICIPATION CAN BE PARTIAL (Batch 3)

Massachusetts participates in PSI's national program for **theory only**. No separate practical licensing examination was identified.

**Implication:** Do NOT assume national-program participation means a jurisdiction uses every component of that program.

---

### FINDING 13 — OFFICIAL EXAM REFERENCE SOURCES MATTER (Batch 4)

Oregon and Pennsylvania demonstrate that official examination programs may identify specific textbooks/reference materials.

| State | Reference Sources |
|-------|-----------------|
| Oregon | Milady, Pivot Point |
| Pennsylvania | Milady Standard Barbering 7th ed. (2025), Pivot Point Fundamentals: Barbering 1st ed. (2018) |

**Potential future conceptual relationship:**

```
Exam → Exam Version → Official Reference Source → Edition / Effective Period
```

**Do NOT implement.**

**Implication:** Keep examination-reference intelligence separate from claims that a state exam is "Milady" or "Pivot Point." A reference textbook is NOT the same thing as an exam developer.

---

### FINDING 14 — EXAM ORGANIZATIONS MAY PERFORM MULTIPLE ROLES (Batch 4)

Pennsylvania demonstrates that one organization can potentially perform:

- Application processing
- Exam creation
- Exam scoring
- Exam reporting
- Exam delivery/administration

**Implication:** Preserve the roles conceptually rather than creating one generic provider concept. Do NOT collapse those roles conceptually merely because one vendor currently performs several of them.

---

### FINDING 15 — EXAM ELIGIBILITY AND LICENSURE ELIGIBILITY CAN DIFFER (Batch 4)

South Carolina permits examination before completion of 100% of required school hours.

| Threshold | Requirement |
|-----------|-------------|
| **Exam Eligibility** | 90% program completion |
| **Licensure Eligibility** | 100% program completion |

**Implication:** Distinguish conceptually between **Eligible to Test** and **Eligible for License**.

---

### FINDING 16 — SCHOOL OUTCOME DATA MAY BE AN EXTERNAL INTELLIGENCE SOURCE (Batch 4)

Oregon indicates school graduate examination reports may be available upon request.

**Implication:** Preserve this as potential future business/market intelligence. Do NOT create scraping, collection or analytics functionality.

---

### FINDING 17 — SCHOOL-ADMINISTERED PRACTICALS EXIST (Batch 4)

Oregon reinforces that a practical examination can be administered by the educational institution rather than a state Board or national testing vendor.

**Practical-delivery taxonomy should preserve:**

- State/Board administered
- External testing vendor
- Computer-based
- Remote/virtual
- School-administered
- Proficiency-based
- No separate practical

---

### FINDING 18 — PUBLISHED EXAM OUTCOMES CAN REVEAL MARKET NEED (Batch 5)

Texas publishes examination performance showing a substantial difference between written and practical barber results.

| Examination | Pass Rate |
|-------------|-----------|
| Written | 37.25% |
| Practical | 89.80% |

**Implication:** Preserve aggregate examination outcomes as **Market / Educational Intelligence**, not **Individual pass prediction**.

---

### FINDING 19 — SCHOOL EXAM REPORTING INFRASTRUCTURE EXISTS (Batch 5)

Texas/PSI provides school examination reporting/export capabilities.

| Feature | Detail |
|---------|--------|
| Effective Date | August 1, 2026 |
| Export Formats | Excel, PDF, CSV, HTML |

**Implication:** Preserve as potential future integration research, school analytics research, market validation. Do NOT implement an integration.

---

### FINDING 20 — TRAINING REQUIREMENTS ARE VERSIONED (Batch 5)

Virginia demonstrates that required educational hours can change over time.

| Effective Date | Hours |
|----------------|-------|
| December 1, 2025 | 750 hours |
| Prior | 1,100 hours |

**Implication:** Future research architecture must preserve **Requirement**, **Effective Date**, **Historical Value**.

---

### FINDING 21 — FUTURE EXAM VERSIONS MAY BE PUBLISHED BEFORE EFFECTIVE DATE (Batch 5)

Wisconsin currently has both:

- Current exam material (through August 31, 2026)
- Future exam material (effective September 1, 2026)

published simultaneously.

**Implication:** Do not overwrite one with the other. Future licensing intelligence must support effective-dated versions.

---

### FINDING 22 — INTEGRATED COMPETENCY EXAMS EXIST (Batch 5)

Utah's ICA demonstrates that knowledge and practical competency may be integrated into one assessment structure.

**Implication:** Add **Integrated Competency Assessment** to the research exam-format taxonomy. Do NOT assume theory and practical always occur as completely separate examination events.

---

### FINDING 23 — PROVIDER RELATIONSHIPS MAY BE LICENSE-TRACK-SPECIFIC (Batch 5)

West Virginia and Wyoming reinforce that provider/exam relationships may differ according to the specific barber credential or track.

**Implication:** Practical-delivery information belongs at the appropriate exam/license-track level rather than only at state level.

---

### FINDING 24 — SCHOOL COMPETENCY CAN DETERMINE EARLY EXAM ELIGIBILITY (Closure Batch 1)

Florida demonstrates a pathway where:

**School competency determination**

can permit:

**early examination eligibility**

before completion of the standard maximum education-hour pathway.

| Concept | Florida Example |
|---------|-----------------|
| Training Requirement | 900 hours standard |
| Exam Eligibility Threshold | 600 hours |
| School Competency Determination | Required for early eligibility |
| Reexamination Requirement | Remaining 300 hours if failed |

**Implication:** Preserve conceptually as potentially distinct research concepts. Do NOT implement.

---

### FINDING 25 — EXAM REQUIREMENTS CAN CHANGE BY LICENSE STAGE (Closure Batch 1)

North Carolina demonstrates:

```
Apprentice Barber → Written + Practical
Licensed Barber → Practical
```

This strengthens the conceptual research relationship:

```
State → Profession → License Stage → Eligibility → Examination Requirement → Examination Component
```

**Implication:** Do NOT implement this architecture. Preserve as research only.

---

### FINDING 26 — STATE/BOARD-ADMINISTERED EXAMINATION SYSTEMS (Closure Batch 2)

Arkansas and North Dakota demonstrate **Board-centered examination systems** where the state board directly administers examinations rather than using a national testing vendor.

| State | Examination Components | Administrator |
|-------|------------------------|---------------|
| Arkansas | Practical + Written + Oral | Arkansas State Board of Barber Examiners |
| North Dakota | Written + Practical + Oral | North Dakota Board of Barber Examiners |

**Implication:** National licensing architecture must not assume every examination is administered by PSI, Prov, Prometric, DL Roope, Pearson VUE, PCS, or another national vendor. Preserve **State/Board Administered** as a distinct administrator type.

**Status:** RESEARCH ONLY — Do NOT implement architecture changes.

---

### FINDING 27 — ORAL BARBER EXAMINATIONS STILL EXIST (Closure Batch 2)

Arkansas and North Dakota establish **oral testing** as part of their statutory barber examination structures.

| State | Oral Component |
|-------|---------------|
| Arkansas | Required by Board |
| North Dakota | Required by statute |

**Implication:** Preserve **Oral** as a distinct examination-component type alongside Theory/Written, Practical, State Law, Integrated Competency Assessment, and other verified formats.

**Status:** RESEARCH ONLY — Do NOT implement architecture changes.

---

### FINDING 28 — PROPOSED LICENSING STRUCTURES MUST NOT REPLACE EFFECTIVE LAW (Closure Batch 2)

New Jersey's 2026 legislative activity demonstrates the need to distinguish:

| Category | Treatment |
|----------|-----------|
| **Current Effective Requirement** | Documented as confirmed research |
| **Proposed/Pending Requirement** | Tracked separately; NOT treated as current law |

Future research architecture may eventually require concepts such as:
- Effective
- Future effective
- Proposed
- Repealed/superseded
- Historical

**Implication:** Do NOT implement this architecture now. Preserve the distinction between current effective requirements and proposed/pending legislation.

**Status:** RESEARCH ONLY — Do NOT implement architecture changes.

---

### Updated Examination-Type Taxonomy (Batches 1–5 + Closure Batch 1 + Closure Batch 2)

- Theory / Written
- Practical
- State Law / Jurisprudence
- Sanitation
- Oral
- Proficiency
- Service-specific certification
- Computer-based practical
- Remote / virtual practical
- Integrated Competency Assessment

**Status:** RESEARCH ONLY — Do NOT implement as application architecture.

---

### Updated Research Taxonomy (Batches 1–5 + Closure Batch 1 + Closure Batch 2)

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

### Developer/Administrator Patterns Identified (Batches 1–5 + Closure Batch 1 + Closure Batch 2)

| Pattern | Developer | Administrator | States |
|---------|-----------|---------------|--------|
| NIC + Prov | NIC | Prov | Alaska, Maine, Montana, New Hampshire, Oklahoma, South Carolina, Utah, Virginia, Washington |
| NIC + PCS | NIC | PCS | Arizona, New Mexico |
| NIC + Prometric | NIC | Prometric | Connecticut, Delaware |
| NIC + CTS + PSI | NIC | CTS (application) + PSI (delivery) | Illinois |
| NIC + Board (multiple exams) | NIC + State Board | Prov + State Board | Kansas, Mississippi |
| NIC + DL Roope | NIC | DL Roope | Wisconsin |
| PSI + PSI | PSI | PSI | Alabama, California, Colorado, Georgia, Maryland, Michigan, Texas |
| PSI theory-only | PSI | PSI | Massachusetts |
| PSI-administered (developer unknown) | UNKNOWN | PSI | Rhode Island, Tennessee |
| State-specific + PSI | State | PSI | Indiana |
| State-specific + Pearson VUE | UNKNOWN | Pearson VUE | Florida |
| Pearson VUE (multi-role) | Pearson VUE | Pearson VUE | Pennsylvania |
| State-board-controlled | State Board | State Board | Kentucky, Minnesota, Nebraska, Nevada, Ohio, South Dakota |
| State-controlled (multi-stage) | State Board | State Board | North Carolina |
| State/Board-administered | State Board | State Board | Arkansas, North Dakota |
| State-specific + state-administered | State | State | New York |
| State-specific + school-administered practical | State | School | Oregon |
| NIC + Prov (likely) | NIC | Prov | Idaho (unconfirmed) |
| Vendor transition | UNKNOWN | Prometric → PSI | Hawaii |
| Vendor transition | NIC | DL Roope → Prov | Washington |
| Vendor transition | NIC | UNKNOWN → Prov | Virginia |
| Prometric | UNKNOWN | Prometric | New Jersey |
| Multiple provider footprints | NIC | UNKNOWN (multiple) | West Virginia |
| UNKNOWN | UNKNOWN | UNKNOWN | Louisiana, Vermont |

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
*Closure Batch 1 Archived: 2026-08-14*
*Closure Batch 2 Archived: 2026-08-14*
