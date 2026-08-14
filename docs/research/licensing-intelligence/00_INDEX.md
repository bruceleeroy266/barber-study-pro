# Licensing Intelligence Index

**Section:** Licensing Intelligence  
**Purpose:** Preserve state licensing requirements, exam structures, and regulatory research  
**Status:** ACTIVE

---

## Research Scope

National barber licensing research covering:
- State licensing requirements
- Exam developers and administrators
- Candidate Information Bulletins (CIBs)
- Exam blueprints and versions
- Theory and practical examination requirements

---

## Critical Architectural Distinction

**EXAM DEVELOPER ≠ EXAM ADMINISTRATOR**

| Role | Definition | Examples |
|------|------------|----------|
| **Exam Developer** | Organization responsible for examination content | NIC, PSI |
| **Exam Administrator** | Organization responsible for delivering the examination | Prov, PSI, Prometric, DL Roope, state boards |

**These are NOT the same concept and must not be collapsed.**

---

## Exam Organizations

| Organization | Role | Research Status | Documentation |
|--------------|------|---------------|---------------|
| [NIC](nic.md) | Exam Developer | Initial research | ✅ Active |
| [PSI](psi.md) | Developer + Administrator | Initial research | ✅ Active |
| [Prov](prov.md) | Administrator | Initial research | ✅ Active |
| [Prometric](prometric.md) | Administrator | Initial research | ✅ Active |
| [DL Roope](dl-roope.md) | Administrator | Initial research | ✅ Active |

---

## State Research

| State | License Type | Exam Developer | Administrator | Status | Documentation |
|-------|--------------|----------------|---------------|--------|---------------|
| [Oklahoma](state-research/oklahoma.md) | Barber | NIC | Prov | CONFIRMED | ✅ Active |
| [Texas](state-research/texas.md) | Class A Barber | PSI | PSI | CONFIRMED | ✅ Active |
| [Alaska](state-research/alaska.md) | Barber | NIC | Prov | CONFIRMED | ✅ Active |
| [Delaware](state-research/delaware.md) | Barber | TBD | Prometric | PARTIAL | ✅ Active |
| [Washington](state-research/washington.md) | Barber | NIC | DL Roope | CONFIRMED | ✅ Active |
| [Wisconsin](state-research/wisconsin.md) | Barber | NIC | DL Roope | CONFIRMED | ✅ Active |
| [West Virginia](state-research/west-virginia.md) | Barber | NIC | DL Roope | CONFIRMED | ✅ Active |

**Remaining States:** PENDING RESEARCH — Do not populate without verification.

---

## Research Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [National Overview](national-overview.md) | National licensing landscape | ✅ Active |
| [Candidate Information Bulletins](candidate-information-bulletins.md) | CIB tracking and versioning | 📝 Template |
| [Exam Blueprints](exam-blueprints.md) | Blueprint structures and domains | 📝 Template |
| [Exam Versions](exam-versions.md) | Version tracking and effective dates | 📝 Template |
| [50-State Master Map](50-state-master-map.md) | Comprehensive state matrix | 📝 Template |

---

## National Administration Landscape

Initial research indicates barber/cosmetology examination administration can involve:

- **Prov**
- **PSI**
- **Prometric**
- **DL Roope**
- **PCS**
- **Individual state boards/agencies**

**Conclusion:** Future ASCYN PRO architecture should NOT assume a single national exam provider.

---

## Versioning Requirement

Candidate Information Bulletins and exam blueprints can change.

**Preserve:**
```
Exam → Exam Version → Effective Date → CIB → Blueprint
```

**Do NOT overwrite historical findings simply because a newer CIB appears.**

---

## Future Architecture Consideration

**Question:** Which licensing blueprint was this student preparing against at the time this performance was recorded?

**Status:** NOT architecturally resolved — Flag as future design consideration.

---

## Source Standard

**Prioritized Sources:**
1. State licensing boards/agencies
2. NIC
3. PSI
4. Prov
5. Prometric
6. DL Roope
7. Other officially designated examination administrators

**Third-party 50-state summaries** may be useful for discovery but should NOT become authoritative ASCYN PRO licensing data without verification.

---

## Source Index

See [Licensing Sources](../sources/licensing-sources.md) and [State Sources](../sources/state-sources.md) for detailed source tracking.

---

*Last Updated: 2026-08-14*
