# New Mexico — State Licensing Research

**State:** New Mexico  
**License Type:** Barber  
**Research Date:** 2026-08-14  
**Status:** CONFIRMED

---

## Licensing Authority

| Field | Value |
|-------|-------|
| **State Board** | New Mexico Board of Barbers and Cosmetologists |
| **License Name** | Barber |
| **Theory Exam Required** | Yes |
| **Practical Exam Required** | Yes |
| **State Law/Rules Exam Required** | Yes |

---

## Examination Structure

New Mexico requires three examination components for barber licensure:

| Component | Developer | Administrator | Passing Standard |
|-----------|-----------|---------------|------------------|
| **Theory** | NIC | PCS | 75% |
| **Practical** | NIC | PCS | 75% |
| **State Law/Rules** | State-specific | PCS | 75% |

---

## Theory Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | NIC | CONFIRMED |
| **Exam Administrator** | PCS | CONFIRMED |
| **Exam Name** | NIC Barber Theory Examination | CONFIRMED |
| **Passing Standard** | 75% | CONFIRMED |

---

## Practical Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Practical Required** | Yes | CONFIRMED |
| **Exam Developer** | NIC | CONFIRMED |
| **Exam Administrator** | PCS | CONFIRMED |
| **Passing Standard** | 75% | CONFIRMED |

---

## State Law/Rules Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Required** | Yes | CONFIRMED |
| **Content** | New Mexico state laws and rules | CONFIRMED |
| **Passing Standard** | 75% | CONFIRMED |

---

## Architecture / Research Implication

New Mexico reinforces the need to model **multiple examination requirements for one license** rather than `License → One Exam`.

```
New Mexico
└── Barber License
    ├── NIC Theory Examination (75%)
    ├── NIC Practical Examination (75%)
    └── State Law/Rules Examination (75%)
```

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| New Mexico Board of Barbers and Cosmetologists | State licensing board | 2026-08-14 | CONFIRMED |
| NIC examination materials | Exam developer | 2026-08-14 | CONFIRMED |
| PCS examination information | Exam administrator | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| Exam blueprint | Annually | CIB updates |
| Administrator | Annually | Provider changes |
| Passing standards | Annually | Policy changes |

---

*Last Updated: 2026-08-14*  
*Next Review: 2026-11-14*
