# Kansas — State Licensing Research

**State:** Kansas  
**License Type:** Barber  
**Research Date:** 2026-08-14  
**Status:** CONFIRMED

---

## Licensing Authority

| Field | Value |
|-------|-------|
| **State Board** | Kansas Board of Barbering |
| **License Name** | Barber |
| **Theory Exam Required** | Yes — multiple examinations required |
| **Practical Exam Required** | Yes — administered by Kansas Board |

---

## Examination Requirements

Kansas requires **multiple examinations** for barber licensure:

### 1. NIC Barber Stylist Theory Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | NIC | CONFIRMED |
| **Exam Administrator** | Prov | CONFIRMED |
| **Exam Name** | NIC Barber Stylist Theory Examination | CONFIRMED |
| **Current CIB Date** | January 5, 2026 | CONFIRMED |
| **Minimum Score** | 80% | CONFIRMED |

### 2. Kansas Rules and Regulations Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | Kansas Board | CONFIRMED |
| **Exam Administrator** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Minimum Score** | 80% | CONFIRMED |

### 3. Kansas Board Practical Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Practical Administrator** | Kansas Board | CONFIRMED |
| **Practical Format** | Board-administered practical | CONFIRMED |

---

## Important Finding: Multiple Examinations Per License

Kansas demonstrates that a single license may require multiple examinations from different sources:

```
Kansas Barber License
├── NIC Barber Stylist Theory (via Prov) — 80% minimum
├── Kansas Rules & Regulations Examination — 80% minimum
└── Kansas Board Practical Examination
```

**Architecture Implication:** `License → One Exam` is not a safe assumption. Future architecture should support `License → Multiple Examination Requirements`.

---

## Candidate Information Bulletin

| Field | Value | Confidence |
|-------|-------|------------|
| **CIB Source** | NIC | CONFIRMED |
| **CIB Date** | January 5, 2026 | CONFIRMED |
| **CIB URL** | UNKNOWN / REQUIRES VERIFICATION | — |
| **CIB Version** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## Exam Blueprint

| Field | Value | Status |
|-------|-------|--------|
| **Blueprint Source** | NIC Barber Stylist | CONFIRMED |
| **Domain Structure** | UNKNOWN / REQUIRES VERIFICATION | PENDING |
| **Domain Weights** | UNKNOWN / REQUIRES VERIFICATION | PENDING |

---

## ASCYN PRO Implication

Kansas is a key finding for future architecture. The three-examination structure (NIC theory + state rules + board practical) means ASCYN PRO would need to track multiple exam requirements per license. The 80% minimum on each written exam is higher than many states. The state-specific rules examination is additional content that would need to be developed separately from national exam content.

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| Kansas Board of Barbering | State licensing board | 2026-08-14 | CONFIRMED |
| NIC examination materials | Exam developer | 2026-08-14 | CONFIRMED |
| Prov examination information | Exam administrator | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| CIB version/effective date | Quarterly | NIC updates CIBs periodically |
| State rules exam content | Annually | State may update rules content |
| Practical exam structure | Annually | Board may modify practical |

---

*Last Updated: 2026-08-14*
