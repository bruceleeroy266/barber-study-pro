# Oklahoma — State Licensing Research

**State:** Oklahoma  
**License Type:** Barber  
**Research Date:** 2026-08-14  
**Status:** CONFIRMED — Initial research complete

---

## Licensing Authority

| Field | Value |
|-------|-------|
| **State Board** | Oklahoma State Board of Cosmetology and Barbering |
| **License Name** | Barber |
| **Theory Exam Required** | Yes |
| **Practical Exam Required** | Yes |

---

## Theory Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | NIC | CONFIRMED |
| **Exam Administrator** | Prov | CONFIRMED |
| **Exam Name** | NIC Barber Styling Theory Examination | CONFIRMED |

---

## Exam Blueprint

### NIC Barber Styling Theory Examination

| Domain | Weight | Question Allocation | Source | Confidence |
|--------|--------|---------------------|--------|------------|
| Scientific Concepts | 35% | TBD | NIC CIB | CONFIRMED |
| Implements & Equipment | 10% | TBD | NIC CIB | CONFIRMED |
| Hair Care Services | 40% | TBD | NIC CIB | CONFIRMED |
| Facial Hair & Skin Care Services | 15% | TBD | NIC CIB | CONFIRMED |

**Total:** 100%

---

## Candidate Information Bulletin

| Field | Value | Status |
|-------|-------|--------|
| **CIB Source** | NIC | CONFIRMED |
| **CIB URL** | TBD | PENDING RESEARCH |
| **CIB Version** | TBD | PENDING RESEARCH |
| **Effective Date** | TBD | PENDING RESEARCH |

---

## Practical Examination

| Field | Value | Status |
|-------|-------|--------|
| **Practical Required** | Yes | CONFIRMED |
| **Practical Administrator** | TBD | PENDING RESEARCH |

---

## Critical Architectural Distinction

**DO NOT model Oklahoma as:**
```
exam_provider = NIC
```

**Accurate model:**
```
Oklahoma → Barber License → NIC Examination → Administered through Prov
```

**Exam Developer:** NIC (content creator)  
**Exam Administrator:** Prov (delivery provider)

---

## ASCYN PRO Implication

Oklahoma is ASCYN PRO's home state and initial market. The confirmed NIC/Prov relationship establishes the pattern for:
- Developer vs. administrator distinction
- CIB versioning requirements
- Blueprint alignment needs

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| Oklahoma State Board of Cosmetology and Barbering | State licensing board | 2026-08-14 | CONFIRMED |
| NIC Barber CIB | Exam developer documentation | 2026-08-14 | CONFIRMED |
| Prov Oklahoma information | Exam administrator documentation | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| Exam blueprint | Annually | CIB updates |
| Administrator | Annually | Provider changes |
| Passing standard | Annually | Policy changes |

---

*Last Updated: 2026-08-14*  
*Next Review: 2026-11-14*
