# QA-159 — Chapter 5 50-item academic certification decision

Date: 2026-10-26. **Disposition: NO-GO for merge until independent image-level certification of all 50 bank items and owner approval.**

## Sources and coverage
- Source: barbering Chapter 5 in the image-only 776-page `Whole Text book PDF.pdf`, with Chapter 5 at whole-book PDF pages approximately 98–137, and the shorter 29-page `chapter 5.pdf` visual excerpt. Distinguish PDF page indices from printed textbook pages (e.g., whole-book PDF page 109 displays printed page 114).
- Previous QA-149 register mapped **all 50 IDs** `qq-5-001`–`qq-5-050` to original source headings/PDF page ranges. That is a **source-location crosswalk**, not per-option original-scan certification.
- In QA-159, full-page visual renders sampled 15 source PDF pages: **100, 101, 104, 109, 110, 111, 114, 116, 118, 119, 123, 125, 126, 127, 131**. Full-size images were inspected for **109** (printed p.114) and **126** (printed p.131). The remaining sampled pages were reviewed as overview contact sheets, not examined line-by-line at high resolution. **No claim of 50/50 detailed image comparison is made.**

## Confirmed source evidence
- **Q014**: scan PDF page 109, printed p.114, under handling shears: *Never cut anything but human hair with haircutting shears*; advises less expensive shears for mannequin hair. Previous answer option 'Synthetic hair extensions' was **also defensibly prohibited**, so the item had two potential correct answers. Corrected the stem and options to distinguish forbidden paper/plastic/wire from acceptable clean human hair (wet/dry/curly). Key **B unchanged**.
- **Q030**: scan PDF page 126, printed p.131, thermal iron test: clamp iron on tissue/toweling **five seconds**, scorched/brown tissue signals too much heat; allow cooling, and fine/lightened/damaged hair tolerates less heat. The PR's revised explanation matches this passage; answer key **D unchanged**.
- Other QA-150 changes (Q026, Q036, Q045, Q048) are mapped in QA-149 to relevant source portions but await individual original-scan high-resolution sign-off for all precise claims and distractors.

## Question crosswalk
For each ID below: its topical source locator is registered in `QA-149_Chapter5_Source_Verification.md`. **Detailed scan-certified = NO** unless explicit supporting image comparison is stated above.

| Questions | Image-level status | Notes |
|---|---|---|
| Q001–Q013 | Pending | All source locations mapped; page-overview samples not full per-option verification |
| Q014 | Targeted source verified | Fixed multiple-defensible-answer ambiguity; source PDF 109/printed 114 |
| Q015–Q029 | Pending | All source locations mapped; require high-resolution examination of options and explanations |
| Q030 | Targeted source verified | Tissue test verified source PDF 126/printed 131 |
| Q031–Q050 | Pending | All source locations mapped; require high-resolution examination of options and explanations |

## Engineering and release gates
- Earlier CI run [40364309462](https://github.com/bruceleeroy266/barber-study-pro/actions/runs/40364309462): both required jobs **passed** on commit `2ce33d650f9bc7b85031c9479a8650b17ce3c33e`.
- QA-159 introduced Q014 unique-answer correction and updated one linked objective-evidence assertion; **earlier green CI is not a green certification for this new HEAD**. Obtain both checks on latest HEAD before any merge authorization.
- No merge or production deployment authorized. Release decision: **NO-GO** pending (1) complete source-image audit for all 50 stems, four answer options and explanations; (2) academic/instructor sign-off on remaining potential ambiguities; (3) both required checks green at immutable head; (4) explicit owner GO.

**Owner decision requested only after gates close.** This record is not a merge authorization.
