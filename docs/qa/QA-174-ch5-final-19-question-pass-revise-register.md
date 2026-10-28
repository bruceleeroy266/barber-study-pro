# QA-174 — Final 19-item Academic Pass/Revise Register

**Assessment date:** 2026-10-28. **Status:** 18/19 source-supported or revised-to-source, **1/19 unresolved (Q018)**. This document supersedes the stale all-PENDING summary table in the earlier working register; consult individual evidence sections there. No external instructor signature is required for this internal QA gate. This file is not a production release authorization.

**CI evidence:** GitHub Actions run [#40637308079](https://github.com/bruceleeroy266/barber-study-pro/actions/runs/40637308079): Verify Build **success**; Pilot Onboarding Certification **success**. Applies to its head commit only. Subsequent content changes require new CI.

**Source:** `Milady_Searchable_Pages_081-160.pdf`, original scanned Chapter 5 pages plus searchable text. Printed-page references below are from the recorded source-review evidence; see `QA-174-ch5-independent-instructor-signoff.md` for method and original evidence notes. “PASS” is an internal source-concordance decision, not legal, licensing, or instructor endorsement.

| ID | Key | Printed book page(s) | Decision | Evidence / remaining issue |
|---|---|---|---|---|
| Q006 | C | 105–106 | **REVISED—source aligned** | Comb teeth smooth/rounded; prior replacement criterion removed |
| Q008 | B | 110 | **PASS** | Shear-size preference and distractors supported |
| Q012 | C | 111–112 | **REVISED—source aligned** | Blending ends/removing bulk; absolute length claim removed |
| Q017 | B | 116,118 | **PASS** | Outliner blade clearance and pressure |
| Q018 | D | 116–118; maintenance passage pending | **REVISE / NOT CLOSED** | Four-part snagging troubleshooting procedure not explicitly supported |
| Q019 | A | 116 | **REVISED—source aligned** | T-blade rounded/difficult areas; overstatement removed |
| Q023 | B | 123 | **PASS** | Strop smooths/aligns/polishes |
| Q024 | D | 120 | **PASS** | Task-specific razor shaving grip |
| Q025 | A | 120,125–126; honing guidelines | **REVISED—source aligned** | Shank control and even blade contact; no identical-grip claim |
| Q027 | D | 119 Fig.5-39 | **PASS** | Razor anatomy list not exhaustive |
| Q031 | A | 130–131 | **REVISED—source aligned** | Hard-rubber comb barrier for heated thermal iron |
| Q034 | A | 130 | **PASS with rationale noted** | Dryer-near-water prohibition; electrical risk is explanation |
| Q037 | A | 133–134 | **PASS** | Honing sequence |
| Q038 | C | 135 | **PASS** | Reverse on razor back during stropping |
| Q039 | D | 128–130 | **PASS** | Shaving/comfort appliances |
| Q040 | B | 132 | **PASS** | Sanitary loose-hair removal |
| Q045 | D | 116 Table 5-4 | **PASS** | Clipper motor comparison |
| Q047 | C | 116,118 | **REVISED—source aligned** | Removed unsupported free-wrist expression |
| Q050 | C | 130–131,138–139 | **PASS** | Thermal-iron preparation and scalp protection |

## Unresolved item: Q018

**Question:** “Clippers begin pulling and snagging during a service. What should the barber do FIRST?”

**Current keyed D:** “Stop and inspect cleanliness, lubrication, alignment, and blade condition.” The stop-and-inspect approach is sound as a safety recommendation, but the original Chapter 5 excerpt and images reviewed do not establish this full four-part response as an exact prescribed source procedure. The updated explanation identifies that it is a safety-first inference. **Decision: REVISE/PENDING** until an exact textbook passage is found or the stem and choices are rewritten around an explicitly supported Chapter 5 maintenance point. Do not represent it as fully textbook-certified.

## Release gate

- [x] 19 flagged items have a recorded answer/key and review decision.
- [x] CI run #40637308079 passed on the corrected branch snapshot.
- [ ] Resolve Q018 and review the final wording, answer choices, and explanation against the original image.
- [ ] Re-run build/unit/integration checks after any additional changes, ensuring CI covers the exact final head.
- [ ] Reconcile PR #452/#453 approval and merge status; document authorized release decision.

**Academic acceptance criterion: NOT YET CLOSED. Release decision: NO-GO.**
