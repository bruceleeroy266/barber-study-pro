# C4 Book Alignment — Source Gap Matrix

## Source basis
Primary source: connected Google Drive `chapter 4.pdf`, 29 pages, Chapter 4 **Infection Control: Principles and Practices**.

The PDF is image-based, so the source was reviewed from rendered pages and OCR only as a reading aid. The scanned pages remain authoritative.

ASCYN PRO will use this source for **coverage, terminology, sequence, procedures, and factual scope**, but production wording, examples, scenarios, flashcards, questions, and remediation will remain original ASCYN PRO content rather than copied textbook prose.

## Existing Chapter 4 architecture
- 8 learning objectives already represented in code
- 6 canonical concept families
- 50 active canonical flashcards
- 30-question initial quiz
- 90-question unseen reassessment reserve (`qq-4-031..120`)
- concept detection + targeted remediation + canonical reassessment adapter already exist

## Source learning objectives and current gaps

| LO | Source-book target | Current state | Exact gap / hardening action |
|---|---|---|---|
| LO-4-01 | Federal/state regulation; OSHA, EPA, SDS/GHS, state rules and barber responsibility | STRONG/PARTIAL | OSHA/EPA/GHS are present, but the lesson should more clearly distinguish federal workplace regulation, EPA product registration, state licensing/rules, and the barber's responsibility to stay current. |
| LO-4-02 | Types/classifications of bacteria and infection fundamentals | PARTIAL | Current lesson covers major pathogen groups and some bacteria, but needs stronger source-aligned morphology/classification coverage (cocci/bacilli/spirilla), active vs inactive stages, and clearer infection terminology. |
| LO-4-03 | Pathogens, bloodborne organisms, and transmission | PARTIAL | Current lesson has pathogen examples but under-teaches direct vs indirect transmission, local vs systemic infection, communicable/contagious disease, immunity, and asymptomatic transmission as organized source concepts. |
| LO-4-04 | Cleaning vs disinfection vs sterilization | PARTIAL / SOURCE-CONFLICT RISK | Core distinction exists, but current lesson contains a universalized “10 minutes” protocol and unsupported kill-percentage claims. Replace with label-directed contact time and source-aligned two-step cleaning → disinfection logic. Add autoclave/spore-test context without implying routine barber sterilization is universally required. |
| LO-4-05 | Disinfectants and antiseptics appropriate for barbering | WEAK/PARTIAL | Current lesson mentions tuberculocidal claims and bleach but under-covers hospital disinfectants, quats, phenolics, sodium hypochlorite/bleach, antiseptics, isopropyl alcohol limitations, and label-directed selection. |
| LO-4-06 | Standard Precautions and blood/body-fluid exposure procedures | PARTIAL | Blood response and PPE exist, but “Standard Precautions” itself is under-taught. Add the source principle that blood/body fluids are treated as potentially infectious and connect handwashing, gloves, sharps handling, and exposure incidents. |
| LO-4-07 | Safe work practices that prevent accidents/injuries | PARTIAL | Current lesson has GFCI/water/cord safety but needs the source’s broader work-practice coverage: water temperature, tools/appliances, dropped tools, latherizer placement, fire safety, chemical labeling/storage, ventilation, equipment condition, and trip hazards. |
| LO-4-08 | Professional responsibilities | WEAK/PARTIAL | Current lesson emphasizes safety culture, but needs clearer source responsibilities: follow state/federal rules, keep license current, check rule updates, identify hazards, maintain emergency information, label shop substances, and avoid shortcuts in cleaning/disinfection. |

## Source-conflict / overstatement findings in the current lesson
The following current production statements should be removed or rewritten during lesson hardening because the Chapter 4 source does not support them as universal facts or because they overstate the source:

1. Universal `10 MINUTES` disinfectant contact time
2. “At 5 minutes, roughly 50% of pathogens” / “At 10 minutes, 99.9%” claims
3. “Hepatitis B is 100x more contagious than HIV” as a core teaching claim
4. Universalized `7+ DAYS` survival language used as a dramatic absolute
5. Hypothetical fixed lawsuit amount such as `$50,000+`
6. “One incident = permanent license revocation” style certainty
7. “OSHA inspectors ask for this FIRST” as a universal inspection-order claim
8. Fixed sharps-container replacement threshold unless tied to the controlling workplace/container instructions
9. Any implication that a named disinfectant brand/class or one contact time overrides the product label and current regulation

## Highest-priority lesson hardening
1. LO-4-04 — remove universal contact-time/kill-percentage claims and teach label-directed processing
2. LO-4-05 — disinfectant classes + antiseptic distinctions
3. LO-4-07 — broader safe-work-practice coverage from the source
4. LO-4-08 — explicit professional responsibility block
5. LO-4-02/03 — bacterial classification, transmission, immunity/infection terminology
6. LO-4-06 — explicit Standard Precautions framework
7. LO-4-01 — clearer agency/state-rule distinction

## Alignment strategy
- Preserve the existing 6 Chapter 4 concept families.
- Harden the lesson first.
- Do not change the 50-card deck, 30-question quiz, or 90-question reassessment reserve during the lesson phase.
- Add source-aligned lesson blocks to existing families rather than creating unnecessary new diagnostic families.
- Replace sensational or unsupported absolutes with source-supported, label-directed, regulation-aware wording.
- After lesson certification, audit the 50 flashcards, then the 30-question quiz, then the 90-question reserve.
- Finish with an end-to-end serving/remediation/instructor diagnostic certification before merge.
