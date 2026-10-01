# TLS-1A.2 — Content-Load Audit

Status: COMPLETE / LOCKED FOR PLANNING — NO RUNTIME CODE CHANGES

Baseline audited: certified production main 03bbd2f5793ca6fa5485dc1abcac0985e6f17801
Depends on: TLS-1A.1 Strong / Improving / Needs Attention rules

## Audit question

Does the certified lesson → flashcards → assessment → micro-check → remediation → reassessment chain provide enough evidence for the three TLS statuses without forcing unnecessary work on every student or creating an instructor data wall?

## Finding

**GREEN with one design constraint: the existing content should be treated as a progressive evidence pipeline, not as one giant mandatory checklist.**

The certified Chapters 1–21 content remains intact. TLS must not normalize chapter counts or reduce certified content merely to make the interface look simpler. The simplification happens in **what is surfaced and when**, not by deleting evidence.

## Content-load model

### 1. Lesson — required learning layer
Purpose: teach the canonical concepts before judging mastery.

TLS rule: keep the chapter lesson available as the primary instruction. Do not add extra TLS lesson blocks merely to generate more evidence.

Load decision: **KEEP AS-IS.**

### 2. Flashcards — low-pressure retrieval layer
Purpose: retrieval practice and early evidence.

TLS rule: flashcards support the certified 10% evidence channel. They should remain practice-oriented and should not become a second chapter exam.

Load decision: **KEEP AS-IS; do not add cards just to strengthen a status label.**

### 3. Micro-checks — early diagnostic layer
Purpose: detect misconceptions close to instruction.

TLS rule: use the existing micro-check evidence as an early signal. Do not create duplicate TLS checks covering the same concept merely to decide Strong / Improving / Needs Attention.

Load decision: **KEEP AS-IS; reuse existing evidence.**

### 4. Chapter assessment — primary verification layer
Purpose: provide the strongest certified assessment evidence and the existing 40% grade channel.

TLS rule: the chapter assessment remains the primary broad mastery verification. TLS status must consume its result rather than introducing a second status exam.

Load decision: **KEEP AS-IS.**

### 5. Scenario/application — transfer layer
Purpose: verify that knowledge can be applied rather than only recalled.

TLS rule: preserve the existing 15% channel. Do not require extra scenario work solely because the dashboard needs a status.

Load decision: **KEEP AS-IS.**

### 6. Remediation — conditional intervention layer
Purpose: target actual detected gaps.

TLS rule: remediation is **not universal workload**. It appears when certified evidence detects a gap or a required safety/compliance condition.

Load decision: **ON-DEMAND ONLY.**

### 7. Reassessment — conditional recovery layer
Purpose: prove recovery using fresh questions while preserving the original miss.

TLS rule: reassessment is **not an additional routine quiz**. It is triggered by remediation/recovery requirements and uses the certified 5-question recovery path and existing thresholds.

Load decision: **ON-DEMAND ONLY.**

## Student-load rule

A student who is demonstrating mastery should not be given extra TLS work simply to prove that they are Strong.

A student with a detected gap should receive only the targeted intervention/recovery work required by the certified system.

A recovered student may display Improving while fresh future evidence establishes sustained mastery; **Improving must not automatically create another mandatory assessment loop.**

## Instructor-load rule

The default instructor surface must not expose every raw evidence event at once.

Primary view:
1. one existing certified score;
2. one TLS status — Strong / Improving / Needs Attention;
3. one recommended action.

Secondary drill-down may expose:
- weak concepts;
- evidence source(s);
- preserved original misses;
- remediation state;
- latest reassessment/recovery;
- safety/compliance state where applicable.

No new instructor task should be created merely because a status changed. Instructor intervention should be requested only when the certified evidence/recovery system actually requires it.

## Status evidence sufficiency

### Strong
Enough evidence: the existing certified mastery result is at least 80% and no required intervention remains unresolved.

**No extra TLS assessment required.**

### Needs Attention
Enough evidence: existing certified evidence shows mastery below 80%, an incomplete/unsuccessful required recovery, or unresolved safety/compliance recovery.

**Trigger targeted existing remediation/reassessment; do not assign a duplicate general chapter test.**

### Improving
Enough evidence: successful required recovery exists while preserved history shows intervention was needed in the current learning cycle.

**Do not force an immediate second reassessment merely to move the label.** Fresh normal evidence can later establish Strong.

## Anti-overload constraints

TLS implementation must NOT:
- add a second grading formula;
- add a second chapter exam;
- require remediation for students without a detected gap;
- require reassessment for students without a recovery requirement;
- require extra questions solely to calculate a TLS status;
- duplicate evidence already captured by lesson micro-checks, flashcards, assessment, scenarios, or recovery;
- erase original misses to simplify the instructor display;
- make instructors review raw evidence before they can understand the student's status;
- standardize every chapter to the same content count when its certified canonical scope differs.

## Certified contracts preserved

- 20/10/40/15/15 shared grade calculation remains unchanged.
- 80% ordinary recovery remains unchanged.
- 100% urgent bodily-safety recovery remains unchanged where certified.
- Chapter 19 safety exception remains unchanged.
- Chapter 21 compliance semantics remain unchanged.
- Original misses and diagnostic history remain preserved.
- Same-school authorization and privacy remain unchanged.
- Chapters 1–21 remain frozen.

## Audit result

**GREEN.** The current certified evidence pipeline is sufficient to support Strong / Improving / Needs Attention without adding a new content layer.

The principal overload risk is not lack of content; it is presenting or requiring too much of the existing content at the same time. TLS should therefore be an **orchestration and presentation layer over existing certified evidence**, with remediation and reassessment remaining conditional.

## Next gate

**TLS-1A.3 — Evidence-to-Status Mapping Specification.**

Define, on paper, the deterministic precedence and transition rules that convert certified evidence into one score, one status, and one recommended action, including:
- initial/no-evidence state;
- partial evidence;
- below-80 mastery;
- open remediation;
- successful recovery;
- unresolved safety/compliance;
- transition from Improving to Strong on fresh normal evidence;
- stale evidence / new chapter-cycle behavior.

No runtime coding is authorized until that mapping is locked.
