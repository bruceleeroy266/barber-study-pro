# Kentucky — State Licensing Research

**State:** Kentucky  
**License Type:** Barber (multiple stages)  
**Research Date:** 2026-08-14  
**Status:** CONFIRMED

---

## Licensing Authority

| Field | Value |
|-------|-------|
| **State Board** | Kentucky Board of Barbering |
| **License Name** | Barber (multi-stage pathway) |
| **Theory Exam Required** | Yes — at probationary/apprentice stage |
| **Practical Exam Required** | Yes — at final barber examination stage |

---

## License Stage Structure

Kentucky's barber licensing includes multiple stages:

### Stage 1: Probationary / Apprentice Barber

| Field | Value | Confidence |
|-------|-------|------------|
| **License Stage** | Probationary / Apprentice Barber | CONFIRMED |
| **Examination** | Written examination required | CONFIRMED |
| **Exam Administrator** | Kentucky Board of Barbering | CONFIRMED |

### Stage 2: Barber (after work experience)

| Field | Value | Confidence |
|-------|-------|------------|
| **License Stage** | Barber | CONFIRMED |
| **Prerequisite** | Required work experience after probationary stage | CONFIRMED |
| **Examination** | Practical examination (not another written exam) | CONFIRMED |
| **Exam Administrator** | Kentucky Board of Barbering | CONFIRMED |

---

## Important Finding: License Stage Matters

Kentucky demonstrates that examination requirements can depend on **license stage**.

**Do NOT model:** `Kentucky → Barber → Exam`

**Instead preserve:**

```
Kentucky
└── Barber Profession
    ├── Probationary / Apprentice Barber
    │   └── Written Examination
    └── Barber (post-experience)
        └── Practical Examination
```

---

## Guardrail

PSI national-program information should NOT be used by itself to flatten Kentucky into a generic "PSI National Barber state." The Kentucky Board's actual license pathway must control the state record.

---

## Theory Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Exam Developer** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Exam Administrator** | Kentucky Board of Barbering | CONFIRMED |
| **Exam Name** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## Practical Examination

| Field | Value | Confidence |
|-------|-------|------------|
| **Practical Required** | Yes — at Barber stage | CONFIRMED |
| **Practical Administrator** | Kentucky Board of Barbering | CONFIRMED |
| **Practical Format** | Board-administered practical | CONFIRMED |

---

## Candidate Information Bulletin

| Field | Value | Status |
|-------|-------|--------|
| **CIB Source** | UNKNOWN / REQUIRES VERIFICATION | — |
| **CIB URL** | UNKNOWN / REQUIRES VERIFICATION | — |
| **CIB Version** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Effective Date** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## Exam Blueprint

| Field | Value | Status |
|-------|-------|--------|
| **Blueprint Source** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Domain Structure** | UNKNOWN / REQUIRES VERIFICATION | — |
| **Domain Weights** | UNKNOWN / REQUIRES VERIFICATION | — |

---

## ASCYN PRO Implication

Kentucky's multi-stage license pathway means ASCYN PRO would need to track which stage a student is in to determine applicable examination requirements. The probationary/apprentice stage creates a distinct user population with different needs than post-experience barber candidates. The board-administered examinations (rather than third-party administrators) are also notable.

---

## Source References

| Source | Type | Date Accessed | Confidence |
|--------|------|---------------|------------|
| Kentucky Board of Barbering | State licensing board | 2026-08-14 | CONFIRMED |

---

## Reverification

| Item | Frequency | Reason |
|------|-----------|--------|
| Exam developer/content | High priority | Complete initial research |
| License stage structure | Annually | State may modify pathway |
| CIB/blueprint | High priority | Required for curriculum alignment |

---

*Last Updated: 2026-08-14*
