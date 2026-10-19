# Exam Ready — prioritized remediation backlog (read-only)

Status: DRAFT / REVIEW REQUIRED. No production edits or source-bank release authorization.
Pinned question bank: `bb995882ecf95a00ee409a749114e13e5273c3e3`
Source assembly: `src/lib/exam-ready-import/index.ts` combines infection, anatomy, scientific gaps, hair/scalp, hair-structure, implements/equipment, hair-care, and facial hair/skin modules.
Release PR: #426 (draft); previous academic audit issue: #403.

## P0 — blocks publisher-sensitive real-bank release

| ID | Issue | Required evidence / independent decision | Acceptance criterion |
|---|---|---|---|
| ORIG-1 | Source wording and distractor similarity cannot be inferred safe from fact checks | Compare **assembled post-hardening** questions against licensed source within bounded reviewer process; record source PDF physical page and edition/version, provenance, independent-drafting evidence | Every in-scope item has a reviewer disposition: independently authored / needs rewrite / license evidence needed. Do not equate factual correctness with copyright clearance |
| LIC-1 | Commercial publisher-rights unknown | Authorized rights or legal/licensing review; preserve restrictions on internal reference and production usage | Explicit written clearance before import |
| REV-1 | No independent reviewer assigned/approved | Qualified independent curriculum/content reviewer and release signoff (cannot be simulated by CI or assistant) | Review findings closed and approval documented |
| SAFE-1 | HP-012 and HP-050 generalize chemical processing decisions | Validate safe alternatives against manufacturer instructions, contraindications, and strand-test practice | No instruction implies coarse texture automatically warrants stronger processing; source bank unchanged until approved |
| SCI-1 | HS-051 textbook canities taxonomy versus pili annulati optical explanation | Direct page cross-check plus independent dermatology source; review proposed language | Independently support scientific description without misattributing textbook or copying publisher expression |

## P1 — content accuracy and assessment quality

| ID | Issue | Scope / candidate question IDs | Acceptance criterion |
|---|---|---|---|
| FACT-1 | HP-020 strength-proportion claim lacks item-level source verification | HP-020, HP-038 | Remove unsupported numeral or cite precisely; distinguish factual basis from original wording |
| DEDUP-1 | Follicle, arrector pili, sebaceous repeats | HP-004/027/041; HP-006/042; HP-007/043 | Audit cognitive objective and blueprint coverage; retain distinct learning outcomes or propose independently authored replacements |
| DEDUP-2 | Hair-analysis cluster near-repeats | HP-008/009/021/025/028/029/040/049; HP-010/011/022/023/030/031/039/045/046 | Cluster by learning objective; mark near-identical stems and weak distractors for manual assessment |
| DEDUP-3 | Hair composition and bonds repetition | HP-016/017/035/047; HP-018/019/020/036/037/038 | Assess post-hardening key/distractor uniqueness and blueprint coverage |
| CAL-1 | Difficulty overstatement | HP-040, HP-044, HP-048, HP-049, HP-050; several 'scenario' items are recall-like | Expert-rated cognitive level, then optional item-statistics validation; not a mere label change without evidence |

## P2 — long-term measurement

| ID | Scope | Acceptance criterion |
|---|---|---|
| PSY-1 | Item discrimination and distractor functioning | Only characterize discrimination after adequate, consented pilot responses and minimum sample sizes; preflight judgments must be labeled editorial heuristics |
| GOV-1 | Versioned audit/change log | Keep original IDs, before/after representations, rationale, source citations, approvals, and rollback plan |

## First next verified assembled items after HP-050

The `hairStructurePropertyQuestionBank` comprises `HP-001` through `HP-050`. The next `examReadyQuestions` spread is `implementsEquipmentQuestions`, beginning at **IE-001**.
Preliminary read-only review:
- IE-001: A “Haircutting shears” — two opposing sharpened blades; supported common implement function. Distractors (neck strip, cape, towel) are weak.
- IE-002: A “Thinning shears” — reducing bulk while retaining length; supported. Distractors very implausible.
- IE-003: A “Control and elevate hair while guiding the cutting tool” — correct for clipper-over-comb. Distractors clearly irrelevant.
- IE-004: A “Brush” — smoothing/styling; basic recall. Minimal distractor discrimination.
- IE-005: A “Razor” — facial shaving; correct general function. ‘Medium’ difficulty likely overstated.
All IE-001–005 cite a generic 'NIC 2025 Barber Theory' implement-functions topic. **Precise official CIB edition and page mapping unverified**; this does not verify an official 2025 document or source text and does not certify originality.

## Tracking rules

- Academic progress counts *preliminary reviews* only, not question-release certifications.
- Engineering percentage measures previously defined technical/release gates and remains distinct.
- Pending licensing and human review cannot be self-approved by CI.
- No update to `src/lib/exam-ready-import/upstream` or database; no publisher content copied into this backlog.


## Item-specific P0 evidence and acceptance worksheet — 2026-10-19

| Work item | Pinned assembled item(s) | Direct evidence in repository | Required independent evidence | Acceptance (fail closed) |
|---|---|---|---|---|
| SAFE-1 | HP-012, HP-050 | HP-012 assembled override in `hair-structure-properties-hardening.ts` says coarse texture may require stronger processing; HP-050 applies hair-analysis properties before treatment | Validate proposed safe wording with manufacturer procedures and a barbering content reviewer; record product/service scope | Replace unsafe inference with qualified treatment decision; verify one best answer and plausible distractors; reviewer records page/procedure before any source edit |
| SCI-1 | HS-051 | `hair-scalp-disorders-expansion.ts` uses “variation of canities” and alternating pigmentation; scanned Milady PDF physical p256 / printed p261 uses that textbook framing | Independent dermatologic explanation of pili annulati and identification of source edition/terminology | Document whether source and modern account differ, adopt accurate independently written wording, retain traceability without publisher expression |
| FACT-1 | HP-020, HP-038 | HP-020 original explanation contains a numerical strength-proportion claim; HP-038 repeats pH concept; HP-020 assembled override only changes prompt/options | Inspect exact scanned Milady physical p247 / printed p252 for numerical claim and independently validate if retained | Numerical claim removed or independently verified with precise citation; review near-duplicate assessment value |
| ORIG-1 | All 573, priority HS-051, HP-012, HP-020, HP-037, HP-050 | Source question strings and assembled hardening overrides are present; automatic bank validation checks shape, not independent wording | Controlled comparison of each actual assembled stem/4 options/explanation with relevant publisher passages and creation history | Versioned disposition by ID: independently authored, rewrite required, or license required; no unanswered provenance gaps represented as cleared |
| LIC-1 | All publisher-derived references | `sourceBasis` citations prove research dependency, not re-use permission | Documentary licensing permission or appropriately scoped rights/legal review | Positive written use authorization or documented original-content clearance under the adopted release policy |
| REV-1 | All release-bound questions | PR #426 is draft; automated CI has no independent academic authority | Qualified independent human reviewer accepts findings, open exceptions, and final materials | Reviewer identity/role, version reviewed, disposition and approval timestamp recorded; never infer from GitHub green checks |

**Review caution:** A provisional correct answer key is not a citation inspection, originality clearance, or psychometric validation. No release action on this worksheet.

## Verified NIC source mapping and IE-011–IE-015 audit (2026-10-19)

Official-source evidence: NIC *National Barber Theory Examination CIB*, effective June 1, 2025 (revised Sept 1, 2025), content outline printed page 7 / PDF index page 6: **Implements and Equipment Used in Barbering (10%)**. Subdomains list chair/workstation, shears/razors/combs/brushes, towels/drape/neck strips, clippers/blow dryers, safety and sanitation. Provider-hosted copy: https://www.msbcb.ms.gov/wp-content/uploads/2025/08/barber_national_theory_english.pdf and HTML https://prov-testing.github.io/nic_cib/barber_national_theory_english.html. This is exam-domain coverage evidence, **not a source of individualized answer keys** or ASCYN copyright clearance. The bulletin specifies 60 total items, 50 scored; ASCYN's 110-item format is a separate practice simulation, not the official exam format.

| Item | Key | Provisional result | Official blueprint mapping | Item-specific residual issue / acceptance |
|---|---|---|---|---|
| IE-011 | A | Secure chair reduces injury risk | Equipment: chair/workstation + safety | Review plausible alternatives; maintain seat-stability safety rather than easy nonsense distractors |
| IE-012 | A | Unclean workstation is unsafe | Equipment: workstation + sanitation | Separate sanitation from housekeeping; verify applicable state rules when asserting specific cleaning sequence |
| IE-013 | A | Neck strip as sanitary barrier | Supplies/materials: neck strips | Scope accurate; stronger distractors and local sanitation verification |
| IE-014 | A | Cape protects clothing | Supplies/materials: drape | Low-discrimination distractors; avoid treating blueprint example as exact answer-key authority |
| IE-015 | A | Launder used towel before reuse | Supplies/materials: towels + sanitation | Cite specific current Oklahoma sanitation rule separately; publisher/NIC outline alone does not establish laundry handling rule |

General official-source verification for IE-001–015: **blueprint topic mapped**, not page-level answer verification, originality review, or state-regulatory certification. Proposed corrections only. No frozen-bank changes.


## Oklahoma sanitation rule verification and IE-016–020 (October 19, 2026)

Official governing text: Oklahoma State Board of Cosmetology and Barbering Rules & Regulations, effective December 1, 2025:
https://oklahoma.gov/content/dam/ok/en/cosmo/documents/rules-and-regulations/NEWER%202025.rule.book.print.effective.12.1.2025.pdf

| Governing section | Supported detail | Audited item |
|---|---|---|
| OAC 175:10-7-12 | Fresh clean towels per client; used linens laundered before reuse; soiled towels/capes in covered vented containers; appropriate neck-strip supply | IE-013, IE-014, IE-015 |
| OAC 175:10-7-13(a) | Maintain workstation/shampoo area in sanitary condition; no used implements on work station or floor; remove loose/cut hair immediately after patron service | IE-012 |
| OAC 175:10-7-6 | EPA-registered disinfection according to product label, treatment of tools after use, disinfected implement storage free of contamination | IE-016, IE-017, IE-019 |
| OAC 175:10-7-15(b) | Electrical equipment maintained in working order according to installation standards | IE-009, IE-010 (general corroboration, not answer key) |

### IE-016–IE-020 provisional factual review

- **IE-016** answer A (remove debris, clean, disinfect a reused nonporous comb) supported by hygiene/disinfection requirements; source's broad 'Oklahoma 2025 sanitation rules' should cite section 175:10-7-6 precisely.
- **IE-017** answer A (visible debris compromises disinfectant effectiveness) supported by cleaning/disinfection procedures; device components require compatible product/manufacturer instructions, not indiscriminate soaking.
- **IE-018** answer A (manufacturer-guided clipper blade lubrication reduces friction) sound general equipment-care practice; separate manufacturer manual preferable to claiming the NIC outline provides this specific answer.
- **IE-019** answer A (reprocess possibly recontaminated comb) consistent with clean-storage requirements.
- **IE-020** answer A (unsafe loose shear pivot taken out of service until adjusted/repaired) plausible safety practice; precise NIC question-specific sourcing not established. Distractors relatively stronger than adjacent items.

**Review status:** Preliminary factual/key screening only, not publisher originality, individual answer-key verification by NIC, or independent approval. IE-016–020 source question objects unchanged.


## Implements & Equipment — completion of IE-001–IE-050 overlap audit (2026-10-19)

**Scope:** Fifty IE questions through IE-050 preliminarily screened against frozen source `bb995882ecf95a00ee409a749114e13e5273c3e3`. This is a qualitative content/blueprint overlap assessment, **not** psychometric discrimination or full publisher clearance. IE-051 onward remain to be audited.

### IE-046–IE-050 preliminary checks
| ID | Key | Factual disposition | Quality flag |
|---|---|---|---|
| IE-046 | A | Treat exposed implements in clean container as potentially contaminated if a used comb enters | Closely overlaps IE-019, IE-024, IE-042; contingency requires extent-of-contact assessment and exact state storage procedure before universal claim |
| IE-047 | A | Follow manufacturer-compatible method while satisfying sanitation rules; **not** permission to omit mandated disinfection | Near-repeat IE-022/035; ask about regulatory/product-label compatibility in replacement |
| IE-048 | A | Check electrical tool cord, plug, housing, attachments and controls for damage | Overlaps IE-009, IE-020, IE-033, IE-039/050; unlikely 'hard' demand with absurd distractors |
| IE-049 | A | Trimmer/outliner for precise perimeter detail | Near-repeat IE-007 with improved but still distinct distractors; reassess 'hard' |
| IE-050 | A | Remove intermittently failing clipper, select safe sanitized replacement | Integrates safety + selection; overlaps IE-009/020/039 but alternatives more realistic |

### Overlap matrix and recommended reviewer action
| Cluster | IE items | Duplication finding | Review acceptance |
|---|---|---|---|
| Tool function / selection | 001–008, 014, 025, 030–032, 049 | IE-007/049 near-repeat; IE-008/025 both dryer; IE-004/031 brush + dryer | Distinct blueprint competency/cognitive target or documented consolidation candidate |
| Electrical equipment damage and inspection | 009–010, 020, 023, 033–034, 039–040, 048, 050 | Several choose stop-use/inspect; IE-009/039/050 similar scenarios but different hazards | Separate fault diagnosis from hazard response and ensure answer alternatives plausibly competing |
| Clean / used segregation | 012–013, 015–017, 019, 021, 024, 028, 035, 042–047 | IE-019/042/046 same recontamination principle; IE-013/043 barrier; IE-015/045 linen storage | Tag objective and scenario; confirm jurisdictional rule text for correct procedures and exceptions |
| Chair safety | 011, 040 | Stabilize chair before service; near-duplicate | Evaluate distinct response complexity |
| Blow dryer/heat safety | 008, 025, 031, 036, 037 | IE-036/037 near-duplicate heat risk | Distinguish observing injury cues from controlling exposure |
| Shear & razor safety | 001, 005, 020, 021, 026–029 | Several clear-cut remove/replace decisions; IE-020/029 safety hazard variants | Strengthen authentic evidence-based distractors |
| General maintenance/manufacturer | 017–018, 022, 026, 034–035, 047–048 | IE-022/047 both manufacturer-directed care | Differentiate tool-type-specific procedure with manufacturer/regulatory hierarchy |

### Regulatory follow-up flags (not yet exact claim certification)
1. **IE-046 clean-container contamination scope:** whether *all* contents require reprocessing depends on exposure and authoritative Oklahoma wording. Current A appropriately uses 'potentially exposed', but require OAC 175:10-7-6 exact subsection review for a blanket implementation.
2. **IE-047 electrical-unit disinfection:** ensure manufacturer's non-immersion rule and EPA-registered label/surface compatibility satisfy Oklahoma OAC 175:10-7-6. Cannot equate manufacturer's guidance alone with legal compliance.
3. **IE-050 unreliable electrical clipper:** confirm safety withdrawal under manufacturer/equipment-safety recommendations; NIC topic mapping is not a question-specific source citation.
4. **IE-043 neck-strip alternative wording and IE-044 draping:** separately substantiate under OAC 175:10-7-12; do not infer any arbitrary substitute is permitted.

**Source boundaries:** NIC National Barber Theory CIB supports topic categories, not individual answer keys. Oklahoma OAC supports jurisdiction-specific hygiene rules where explicitly mapped. No publisher text similarity clearance, rights permission, or independent reviewer approval is inferred. No changes to question bank or production.
