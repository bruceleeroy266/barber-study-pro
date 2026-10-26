# QA-150 Chapter 5 academic source review (draft / unmerged)

**Scope:** 50 questions in `src/lib/chapter-5-premium-quiz.ts`. All IDs retained; six flagged items revised, existing correct-answer letters unchanged. **Do not infer that all 50 question keys are fully scan-certified.**

## Reference evidence
- Original Milady barbering Chapter 5 scan `chapter 5.pdf`, Drive ID `1ZTwzf8yUDGR9eUN-_wTiMs_0yFjgPPtJ` (29 scanned pages); OCR extract `Chapter_05.txt`, Drive ID `16RAZ1VfTq4fq2Vsv8vVoksgT1vpqOzEA`, identifies original whole-book PDF pages 98–137.
- Wrong-source warning: Drive `Chapter 05.pdf`, ID `1FjoJBa961SdLwdQdGWtYhh_LLr0cpowQ`, is cosmetology infection control; **not** a Chapter 5 barbering reference.
- Previous per-item 50-question tentative source-page crosswalk: QA-149 report. This does not amount to authoritative printed-page proof for each distractor.

## Review changes (key letters unchanged)
| ID | Evidence from original chapter / OCR whole-book PDF page | Proposed adjustment |
|---|---|---|
| qq-5-014 | p109, shear care: haircutting shears reserved for human hair, separate inexpensive shears for mannequin hair | Remove problematic blanket 'clean hair' wording; specify paper/plastic/wire and protecting fine shears |
| qq-5-026 | p116, concave versus wedge razor geometry; beard resistance | Replace unsupported fine-beard/coarse-beard recommendations in explanation |
| qq-5-030 | p126, five-second *clamped* tissue/toweling test | Correct explanation conflicting with keyed option; retain D |
| qq-5-036 | pp123–124 draping/barrier | Clarify sanitary neck-strip function, remove absolute hair-exclusion promise |
| qq-5-045 | p111 Table 5-4, motor comparison | Explicitly contextualize motor description as textbook table, retain D |
| qq-5-048 | pp110–116 cover selection of clippers, guards, trimmers and razors but do not require razor in every fade | State razor is requested optional finishing work; avoid universally required claim, retain D |

## 50-question coverage
All 50 source IDs and initial source sections were mapped in QA-149. The changed file preserves the complete 50-item sequence and answer keys. Original-scan inspection and the OCR study reference support the six decisions above. **Full-resolution independent image verification of every question, choice, explanation and figure across all 50 is NOT independently completed in this QA-150 pass.** Requires a follow-on academic reviewer crosswalk; refrain from claiming 50/50 certified.

## Release controls
- Review branch only; draft PR, no merge.
- No DB or production changes.
- CI and authenticated QA still required on the PR head before approval.
- Source is educational reference only; do not reproduce textbook passages publicly.
