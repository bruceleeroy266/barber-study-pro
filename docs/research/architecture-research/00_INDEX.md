# Architecture Research Index

**Section:** Architecture Research  
**Purpose:** Preserve current architecture audit findings and future requirements research  
**Status:** ACTIVE

---

## Research Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [Current Architecture Audit](current-architecture-audit.md) | Existing system capabilities | ✅ Active |
| [Future Requirements](future-requirements.md) | Requirements for future architecture | ✅ Active |
| [Exam Blueprint Requirements](exam-blueprint-requirements.md) | Exam blueprint architecture needs | ✅ Active |
| [Competency Requirements](competency-requirements.md) | Competency taxonomy needs | ✅ Active |
| [Intervention Workflow Requirements](intervention-workflow-requirements.md) | Intervention tracking needs | ✅ Active |
| [Integration Requirements](integration-requirements.md) | External integration needs | ✅ Active |
| [Architecture Risks](architecture-risks.md) | Risk register | ✅ Active |

---

## Current Architecture Status

### Existing Capabilities

| Capability | Status | Location |
|------------|--------|----------|
| Board Readiness Engine | ✅ Implemented | `src/lib/readiness/` |
| Weak-Area Analytics | ✅ Implemented | `src/lib/analytics/` |
| Missed Question Bank | ✅ Implemented | `src/lib/questions/` |
| Instructor Notes | ⚠️ Partial | UI ready; persistence pending |
| Student Roster / At-Risk Flags | ✅ Implemented | `src/components/instructor/` |
| AI Tutor / Remediation | ✅ Implemented | `src/lib/ai/` |
| School Dashboard | ✅ Implemented | `src/app/admin/` |
| NABBA Demo | ✅ Implemented | `src/app/demo/` |

### Partial Capabilities

| Capability | Status | Gap |
|------------|--------|-----|
| Competency tracking | ⚠️ Partial | No formal taxonomy |
| Intervention workflow | ⚠️ Partial | No outcome tracking |
| Readiness sophistication | ⚠️ Partial | No exam blueprint alignment |
| Student-status classification | ⚠️ Partial | Basic at-risk flags only |
| Question/competency relationships | ⚠️ Partial | Chapter-level only |

### Missing Capabilities

| Capability | Status | Priority |
|------------|--------|----------|
| Exam blueprint architecture | ❌ Missing | Post-NABBA |
| Competency taxonomy | ❌ Missing | Post-NABBA |
| Intervention outcome tracking | ❌ Missing | Post-NABBA |
| Targeted remediation assignment | ❌ Missing | Post-NABBA |
| Retesting/verification | ❌ Missing | Post-NABBA |
| Integration layer | ❌ Missing | Post-NABBA |
| Predictive analytics | ❌ Missing | Future research |

---

## Future Architecture Vision

**Conceptual Model (Research Only):**

```
Jurisdiction
    ↓
License
    ↓
Examination
    ↓
Exam Developer
    ↓
Exam Administrator
    ↓
Exam Version
    ↓
CIB
    ↓
Exam Domains
    ↓
Competencies
    ↓
ASCYN PRO Content / Questions
```

**Status:** CONCEPTUAL — Do not implement

---

## Critical Architectural Distinction

**EXAM DEVELOPER ≠ EXAM ADMINISTRATOR**

| Role | Definition | Examples |
|------|------------|----------|
| **Exam Developer** | Organization responsible for examination content | NIC, PSI |
| **Exam Administrator** | Organization responsible for delivering the examination | Prov, PSI, Prometric, DL Roope |

**These are NOT the same concept and must not be collapsed.**

---

## Versioning Requirement

**Question:** Which licensing blueprint was this student preparing against at the time this performance was recorded?

**Status:** NOT architecturally resolved — Flag as future design consideration

**Requirement:** Preserve:
```
Exam → Exam Version → Effective Date → CIB → Blueprint
```

Do not silently recalculate historical performance against different blueprints.

---

## Implementation Guardrails

**DO NOT IMPLEMENT:**

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

**Protected Baseline:** `61a8ef8`

---

*Last Updated: 2026-08-14*
