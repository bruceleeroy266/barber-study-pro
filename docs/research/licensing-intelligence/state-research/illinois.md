# Illinois — State Licensing Research

**State:** Illinois  
**License Type:** Barber  
**Research Date:** 2026-08-14  
**Status:** CONFIRMED — Core examination structure established

---

## Licensing Authority

| Field | Value |
|-------|-------|
| **State Board** | Illinois Department of Financial and Professional Regulation (IDFPR) |
| **License Name** | Barber |
| **Theory Exam Required** | Yes |
| **Practical Exam Required** | UNKNOWN / REQUIRES VERIFICATION |

---

## Multi-Organization Examination Workflow

Illinois demonstrates a **multi-organization examination workflow** with distinct roles:

| Role | Organization | Confidence |
|------|-------------|------------|
| **Regulator** | Illinois IDFPR | CONFIRMED |
| **Application / Eligibility Processor** | Continental Testing Services (CTS) | CONFIRMED |
| **Exam Developer / Content Owner** | NIC | CONFIRMED |
| **Testing / Delivery Vendor** | PSI | CONFIRMED |

**Architecture Implication:** These roles must remain conceptually distinct. Do NOT create one generic `exam_provider` concept.

---

## Theory Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | NIC | CONFIRMED |
| **Application/Eligibility Processor** | Continental Testing Services (CTS) | CONFIRMED |
| **Testing/Delivery Network** | PSI testing-center network | CONFIRMED |
| **Exam Name** | NIC Barber Examination | CONFIRMED |
| **Passing Standard** | 75% | CONFIRMED |

---

## Future Language Change

Current IDFPR information states that effective **October 1, 2026**, barber examinations will be available in:

| Language | Status |
|----------|--------|
| English | Current |
| Spanish | Future effective 2026-10-01 |
| Chinese | Future effective 2026-10-01 |
| Korean | Future effective 2026-10-01 |
| Vietnamese | Future effective 2026-10-01 |

**Important:** Store this as a **future-effective examination attribute**, not as though it were already historically effective before October 1, 2026.

---

## Practical Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Practical Required** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Practical Administrator** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## Candidate Information Bulletin

| Field | Value | Status |
|-------|-------|--------|
| **CIB Source** | NIC | CONFIRMED |
| **CIB URL** | UNKNOWN / REQUIRES VERIFICATION | — |
| **CIB Version** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Effective Date** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## Exam Blueprint

| Field | Value | Status |
|-------|-------|--------|
| **Blueprint Source** | NIC | CONFIRMED |
| **Domain Structure** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Domain Weights** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## ASCYN PRO Implication

Illinois is a critical finding for future architecture. The **four-role model** (Regulator → Application Processor → Exam Developer → Delivery Vendor) means that a simple two-role developer/administrator distinction is insufficient for some states. The future language availability (October 1, 2026) demonstrates the need for effective-dated examination attributes.

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| Illinois IDFPR | State licensing board | 2026-08-14 | CONFIRMED |
| NIC examination content | Exam developer | 2026-08-14 | CONFIRMED |
| Continental Testing Services | Application/eligibility processor | 2026-08-14 | CONFIRMED |
| PSI testing-center network | Testing/delivery vendor | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| Practical exam requirement | High priority | Close gap |
| CIB version/effective date | High priority | Required for curriculum alignment |
| Language availability implementation | Monitor | Track October 2026 implementation |

---

*Last Updated: 2026-08-14*
