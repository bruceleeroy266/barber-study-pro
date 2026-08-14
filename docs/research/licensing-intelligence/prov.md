# Prov — Examination Administrator

**Organization:** Prov  
**Role:** Exam Administrator  
**Research Date:** 2026-08-14  
**Status:** CONFIRMED — Initial research complete

---

## Overview

Prov is an examination administration provider that delivers licensing examinations for various states and professions. Prov administers examinations developed by other organizations (such as NIC).

---

## Role in Licensing Ecosystem

| Aspect | Description |
|--------|-------------|
| **Primary Role** | Exam Administrator (delivery) |
| **Content Development** | No — administers exams developed by others |
| **States Served** | Oklahoma, Alaska, others |

---

## State Examples

### Oklahoma

| Aspect | Value |
|--------|-------|
| **License** | Barber |
| **Exam Developer** | NIC |
| **Exam Administrator** | Prov |
| **Exam** | NIC Barber Styling theory examination |

**Finding:** Oklahoma uses NIC examination content administered through Prov.

**Critical Distinction:** Do NOT model Oklahoma as `exam_provider = NIC`. The accurate model is:
```
Oklahoma → Barber License → NIC Examination → Administered through Prov
```

### Alaska

| Aspect | Value |
|--------|-------|
| **License** | Barber |
| **Exam Developer** | NIC |
| **Exam Administrator** | Prov |

**Finding:** Alaska state examination information directs candidates to NIC/Prov examination materials.

---

## ASCYN PRO Implication

**Key Finding:** Prov is an administrator, not a developer.

When researching a state:
1. Identify if Prov administers the exam
2. Identify who develops the exam content (NIC, PSI, state-specific)
3. Obtain the developer's CIB and version
4. Track the administration relationship

**Do NOT assume:** Prov = exam content source.

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| Prov official website | Exam administrator documentation | 2026-08-14 | CONFIRMED |
| Oklahoma state board information | State licensing documentation | 2026-08-14 | CONFIRMED |
| Alaska state board information | State licensing documentation | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| State coverage | Annually | Jurisdiction changes |
| Administration relationships | Annually | Provider changes |

---

*Last Updated: 2026-08-14*  
*Next Review: 2026-11-14*
