# Future Requirements

**Document:** Future Architecture Requirements  
**Last Updated:** 2026-08-14  
**Status:** RESEARCH ONLY — Not authorized for implementation

---

## Overview

This document captures requirements for future ASCYN PRO architecture based on competitive research, licensing research, and strategic hypothesis. These requirements are NOT authorized for implementation.

---

## Functional Requirements

### FR1: Exam Blueprint Management

**Requirement:** Store and manage exam blueprints for multiple states and exam versions.

**Rationale:** Support state-specific exam preparation and CIB alignment.

**Data Elements:**
- State
- License type
- Exam developer
- Exam administrator
- Exam name
- Exam version
- Effective date
- CIB reference
- Domain structure
- Domain weights

**Status:** RESEARCH ONLY

---

### FR2: Competency Taxonomy

**Requirement:** Hierarchical competency structure mapped to exam domains.

**Rationale:** Enable granular tracking of student mastery at competency level.

**Data Elements:**
- Competency ID
- Competency name
- Parent competency (if hierarchical)
- Exam domain mapping
- Question mappings

**Status:** RESEARCH ONLY

---

### FR3: Intervention Tracking

**Requirement:** Persistent tracking of instructor interventions with outcome verification.

**Rationale:** Document remediation effectiveness for accreditation and improvement.

**Data Elements:**
- Intervention ID
- Student ID
- Instructor ID
- Intervention type
- Intervention date
- Target competencies
- Pre-intervention assessment
- Post-intervention assessment
- Outcome status
- Evidence of improvement

**Status:** RESEARCH ONLY

---

### FR4: Targeted Remediation Assignment

**Requirement:** System-generated remediation assignments based on identified gaps.

**Rationale:** Automate remediation targeting to reduce instructor workload.

**Data Elements:**
- Assignment ID
- Student ID
- Source gap identification
- Assigned content
- Due date
- Completion status
- Verification assessment

**Status:** RESEARCH ONLY

---

### FR5: Retesting/Verification

**Requirement:** Structured retesting to verify remediation effectiveness.

**Rationale:** Provide evidence that remediation worked.

**Data Elements:**
- Retest ID
- Original assessment ID
- Remediation assignment ID
- Retest date
- Retest score
- Improvement delta
- Verification status

**Status:** RESEARCH ONLY

---

### FR6: Integration Layer

**Requirement:** APIs to integrate with external systems.

**Rationale:** Enable complement positioning with existing school systems.

**Potential Integrations:**
- Student Information Systems (SIS)
- Curriculum providers (Pivot Point, Milady)
- Retention platforms (CourseKey)
- State licensing boards

**Status:** RESEARCH ONLY

---

## Non-Functional Requirements

### NFR1: Versioning

**Requirement:** Preserve historical exam blueprint versions.

**Rationale:** Student performance must remain anchored to the exam version it was measured against.

**Implementation:** Exam → Exam Version → Effective Date → CIB → Blueprint

**Status:** RESEARCH ONLY

---

### NFR2: Developer/Administrator Distinction

**Requirement:** Maintain separate entities for exam developer and exam administrator.

**Rationale:** These are different roles that must not be collapsed.

**Example:** Oklahoma uses NIC (developer) administered through Prov (administrator).

**Status:** RESEARCH ONLY

---

### NFR3: Multi-State Support

**Requirement:** Support all 50 states with state-specific exam blueprints.

**Rationale:** National expansion requires state-specific content.

**Status:** RESEARCH ONLY

---

### NFR4: Audit Trail

**Requirement:** Complete audit trail for all interventions and outcomes.

**Rationale:** Accreditation and accountability require documentation.

**Status:** RESEARCH ONLY

---

## Data Model (Conceptual)

```
Jurisdiction (State)
    ↓
License Type
    ↓
Examination
    ↓
Exam Developer (NIC, PSI, etc.)
    ↓
Exam Administrator (Prov, PSI, Prometric, DL Roope, etc.)
    ↓
Exam Version
    ↓
Candidate Information Bulletin (CIB)
    ↓
Exam Domains
    ↓
Competencies
    ↓
ASCYN PRO Content / Questions
```

**Status:** CONCEPTUAL — Do not implement

---

## Implementation Priority

| Priority | Requirement | Blocker |
|----------|-------------|---------|
| Post-NABBA | Exam Blueprint Management | Validation of school needs |
| Post-NABBA | Competency Taxonomy | Exam Blueprint Management |
| Post-NABBA | Intervention Tracking | Competency Taxonomy |
| Post-NABBA | Targeted Remediation | Competency Taxonomy |
| Post-NABBA | Retesting/Verification | Intervention Tracking |
| Future | Integration Layer | Validated complement positioning |
| Future | Predictive Analytics | Outcome dataset (1-2 years) |

---

*Last Updated: 2026-08-14*
