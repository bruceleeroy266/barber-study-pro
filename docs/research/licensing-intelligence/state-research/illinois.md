# Illinois — State Licensing Research

**State:** Illinois  
**License Type:** Barber  
**Research Date:** 2026-08-14  
**Status:** PARTIAL — Practical examination and CIB require verification

---

## Licensing Authority

| Field | Value |
|-------|-------|
| **State Board** | UNKNOWN / REQUIRES VERIFICATION |
| **License Name** | Barber |
| **Theory Exam Required** | Yes |
| **Practical Exam Required** | UNKNOWN / REQUIRES VERIFICATION |

---

## Theory Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | NIC | CONFIRMED |
| **Application/Eligibility Processor** | Continental Testing Services (CTS) | CONFIRMED |
| **Testing/Delivery Network** | PSI testing-center network | CONFIRMED |
| **Exam Name** | Illinois Barber Examination (NIC content) | CONFIRMED |

---

## Important Finding: Three Distinct Roles

Illinois demonstrates that the national model may involve more than just Exam Developer and Exam Administrator. There may also be a separate **Application/Eligibility Processor**.

| Role | Organization | Confidence |
|------|-------------|------------|
| **Exam Developer / Content Owner** | NIC | CONFIRMED |
| **Application / Eligibility Processor** | Continental Testing Services (CTS) | CONFIRMED |
| **Testing / Delivery Vendor** | PSI | CONFIRMED |

**Architecture Implication:** Do NOT create one generic `exam_provider` concept in future architecture. At least three potentially distinct roles exist.

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
| **CIB URL** | UNKNOWN / REQUIRES VERIFICATION | PENDING |
| **CIB Version** | UNKNOWN / REQUIRES VERIFICATION | PENDING |
| **Effective Date** | UNKNOWN / REQUIRES VERIFICATION | PENDING |

---

## Exam Blueprint

| Field | Value | Status |
|-------|-------|--------|
| **Blueprint Source** | NIC | CONFIRMED |
| **Domain Structure** | UNKNOWN / REQUIRES VERIFICATION | PENDING |
| **Domain Weights** | UNKNOWN / REQUIRES VERIFICATION | PENDING |
| **Passing Standard** | UNKNOWN / REQUIRES VERIFICATION | PENDING |

---

## ASCYN PRO Implication

Illinois is a critical finding for future architecture. The three-role model (Developer → Application Processor → Delivery Vendor) means that a simple two-role developer/administrator distinction may be insufficient for some states. Any future data model must accommodate this complexity.

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| Illinois state licensing information | State licensing board | 2026-08-14 | CONFIRMED |
| NIC examination content | Exam developer | 2026-08-14 | CONFIRMED |
| Continental Testing Services | Application/eligibility processor | 2026-08-14 | CONFIRMED |
| PSI testing-center network | Testing/delivery vendor | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| Practical exam requirement | High priority | Close gap |
| CIB version/effective date | High priority | Required for curriculum alignment |
| Passing standard | High priority | Close gap |

---

*Last Updated: 2026-08-14*
