# ASCYN PRO Content-Source Audit — NABBA 2026

**Date:** 2026-09-20  
**Scope:** Active production content, curriculum provenance, publisher references, exam/licensing sources, and content-governance risk.  
**Purpose:** Ensure ASCYN PRO can accurately explain where its educational content comes from and avoid unsupported affiliation, alignment, or copyright claims.

## Executive Summary

ASCYN PRO has a workable source framework, but the current repository contains a mixed provenance model:

1. **Original ASCYN PRO wording and enrichment** — strongest category.
2. **Official/public regulatory and exam-source material** — appropriate when verified and current.
3. **Textbook-derived / Milady-supported topic mapping** — useful for scope comparison, but needs stronger separation from active learning copy.
4. **Legacy or active files containing Milady-branded headings, textbook-derived structure, and potentially close paraphrase or copied prose** — highest risk and should be reviewed before broad commercialization.

### Current Risk Rating: AMBER / HIGH ATTENTION

The platform should not claim formal Milady or Pivot Point alignment, endorsement, licensing, or partnership unless such a relationship is documented.

The safest public description is:

> "ASCYN PRO builds supplemental study content from authoritative licensing and exam sources, state-board information, established barbering subject matter, and original ASCYN PRO learning materials. We review commonly used industry curricula for topic coverage, but ASCYN PRO is independent and is not endorsed by those publishers."

---

## 1. Source Categories Found

### A. Official / Authoritative Sources — LOW RISK when current
Examples found in repository research:
- State licensing boards/agencies
- NIC examination materials and candidate information bulletins
- Prov examination information
- PSI / Prometric administration information where applicable
- Oklahoma barbering rules and sanitation requirements
- OSHA / EPA / SDS-GHS safety frameworks where relevant

**Action:** Keep date-verified source records and distinguish exam developer from exam administrator.

### B. ASCYN ORIGINAL / ASCYN ENRICHMENT — LOWEST RISK
Repository code explicitly uses provenance classes such as:
- `ASCYN_ORIGINAL`
- `ASCYN_EXTENSION`
- Original ASCYN PRO wording
- Scenario-based learning and instructor notes written independently

**Action:** Expand this category and make it the default for learner-facing prose.

### C. TEXTBOOK_DERIVED / MILADY_SUPPORTED_EXPANSION — MEDIUM-HIGH RISK
The active codebase includes provenance labels such as:
- `TEXTBOOK_DERIVED`
- `MILADY_SUPPORTED_EXPANSION`
- Comments referring to "DIRECT MILADY"
- Learning objectives described as a Milady backbone
- Source-basis fields naming specific Milady chapters

Examples:
- `src/lib/chapter-2-concepts/types.ts`
- `src/lib/chapter-2-concepts/concepts.ts`
- `src/lib/chapter-3-concepts/concepts.ts`
- `src/lib/chapter-3-key-terms.ts`
- `src/lib/chapter-3-premium-flashcards.ts`
- `src/lib/chapter-5-concepts/concepts.ts`

**Risk:** Topic coverage and factual subject matter are not inherently proprietary, but textbook-specific structure, distinctive learning objectives, wording, sequencing, and copied or close paraphrase can create copyright and affiliation risk.

**Action:** Replace publisher-named provenance in production-facing content metadata with neutral internal provenance categories such as:
- OFFICIAL_REGULATORY
- EXAM_BLUEPRINT_DERIVED
- INDUSTRY_STANDARD_SUBJECT_MATTER
- ASCYN_ORIGINAL
- ASCYN_TRANSFORMED_REFERENCE

Do not expose publisher-specific internal labels to end users.

---

## 2. Highest-Risk Findings

### HIGH RISK: Chapter 19 active content
Files:
- `src/lib/chapter-19-premium-content.ts`
- `content-library/Milady Barber/Chapter 19/ASCYN_PRO_Chapter19_Lesson_Phase1.md`
- `content-library/Milady Barber/Chapter 19/ASCYN_PRO_Chapter19_Quiz_Study_Guide.md`
- `src/lib/chapter-19-premium-remediation.ts`

Findings:
- Active content explicitly uses the heading "Milady Standard Barbering".
- Some learner-facing prose appears closely tied to textbook wording and structure.
- Study-guide folders and remediation naming reinforce publisher association.

**Required action:** Conduct line-by-line originality review. Remove publisher-branded headings from ASCYN PRO learner-facing content unless licensed. Rewrite any passage that is copied or too close to source prose.

### HIGH RISK: Chapter 10 audit history
File:
- `CHAPTER-10-REVIEW-REPORT.md`

Finding:
- Internal report explicitly notes that Chapter 10 follows Milady chapter progression, mirrors emphasis patterns, and raises copyright concern if derived without licensing.

**Required action:** Treat Chapter 10 as a priority originality review target.

### MEDIUM-HIGH RISK: Chapters 2, 3, 4, 5 concept architecture
Files include publisher-specific source-provenance labels and learning-objective mapping.

**Required action:** Preserve factual concepts, but rewrite learning objectives and teaching prose independently. Maintain source documentation privately without implying official curriculum alignment.

---

## 3. Claims ASCYN PRO Should Avoid

Do not say:
- "We are Milady aligned."
- "We are Pivot Point aligned."
- "Milady content is built into ASCYN PRO."
- "Our questions come from the state-board exam."
- "These are the exact questions students will see."
- "Milady/Pivot Point endorsed us."
- "We follow the Milady textbook" unless licensed and formally documented.

Use instead:
- "ASCYN PRO is supplemental."
- "Schools keep their existing curriculum."
- "We use authoritative licensing and exam sources plus established barbering subject matter."
- "We create our own learning activities, checks, scenarios, and remediation."
- "We review common industry curricula for topic coverage, not as an endorsement or affiliation."

---

## 4. Recommended Content Governance Standard

Every active lesson, quiz, flashcard bank, scenario, and remediation item should carry internal provenance metadata:

- **source_type**
  - OFFICIAL_REGULATORY
  - OFFICIAL_EXAM_GUIDE
  - PUBLIC_DOMAIN / OPEN_LICENSE
  - INDUSTRY_STANDARD_SUBJECT_MATTER
  - ASCYN_ORIGINAL
  - TRANSFORMED_REFERENCE

- **source_name**
- **source_url or internal reference**
- **date_verified**
- **author/reviewer**
- **originality_status**
  - ORIGINAL
  - REWRITTEN_AND_VERIFIED
  - NEEDS_REVIEW
- **legal_review_status**
  - NOT_REQUIRED
  - PENDING
  - CLEARED

No production content should remain in NEEDS_REVIEW before commercial scale.

---

## 5. Priority Remediation Order

### Priority 1 — Before external commercialization
1. Chapter 19 learner-facing content
2. Chapter 10
3. Any file with "Milady Standard Barbering" in learner-facing output
4. Any verbatim or near-verbatim textbook prose
5. Any publisher-branded learning-objective wording

### Priority 2
6. Chapters 2, 3, 4, and 5 source-provenance cleanup
7. Remove "DIRECT MILADY" labels from production-facing code paths
8. Replace publisher-named sourceBasis values with neutral provenance terminology

### Priority 3
9. Add a centralized source registry
10. Add source review to the chapter release checklist
11. Add automated checks for publisher names in production-facing learner content

---

## 6. NABBA Answer — Where Does Your Content Come From?

**Short answer:**

> "We build our supplemental content from authoritative licensing and exam sources, state-board information, established barbering subject matter, and original ASCYN PRO learning materials."

**If pressed about Milady or Pivot Point:**

> "We review commonly used industry curricula for topic coverage, but ASCYN PRO is independent. We do not claim endorsement, affiliation, or formal alignment with those publishers."

**If asked whether content is copied:**

> "Our goal is original ASCYN PRO learning content built around established subject matter and authoritative sources. We are also auditing our legacy content so anything that is too close to a publisher source is rewritten before broader commercialization."

That final sentence is the most defensible answer until the full remediation pass is complete.

---

## 7. Bottom Line

ASCYN PRO has a defensible content strategy available, but the repository still contains legacy and active publisher-derived material that needs cleanup.

The company should move toward:
**official source -> factual concept -> original ASCYN explanation -> original assessment -> documented provenance**

and away from:
**publisher chapter -> closely mirrored structure/prose -> ASCYN wrapper**

This audit does not constitute legal advice. For commercial launch, material derived from proprietary textbooks should receive qualified copyright/licensing review.
