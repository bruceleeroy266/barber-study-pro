# PO-1C.2 — Certified Question Registry / Inventory Audit

**Status:** IMPLEMENTATION CANDIDATE — NO SIMULATOR UI  
**Source baseline:** `15dc88e5561d05004a066d22a9c7c1e1e095d381`

## Purpose

PO-1C.2 imports only current premium chapter-quiz questions that are suitable for the locked four-domain comprehensive-exam blueprint.

Excluded by design:

- reassessment reserve questions,
- legacy `practice-exam.html` / `missed-questions.html` banks,
- business/licensure/employment chapters,
- ambiguous chapter-domain mappings,
- any new/generated question content,
- simulator UI/runtime,
- readiness writes,
- attendance/hour writes.

## Domain mapping

| Comprehensive domain | Approved chapter sources | Imported | Scored quota | Spare after scored quota |
| --- | --- | ---: | ---: | ---: |
| Scientific Concepts | Ch4 Infection Control; Ch6 Anatomy & Physiology; Ch7 Chemistry; Ch8 Electricity | 48 | 35 | 13 |
| Implements & Equipment | Ch5 Implements, Tools & Equipment | 24 | 10 | 14 |
| Hair Care Services | Ch11 Hair/Scalp Treatment; Ch14 Men's Haircutting & Styling; Ch18 Haircoloring & Lightening | 52 | 40 | 12 |
| Facial Hair & Skin Care Services | Ch12 Facial Massage/Treatments; Ch13 Shaving/Facial-Hair Design | 30 | 15 | 15 |
| **Total** | 10 current premium chapter banks | **154** | **100** | **54** |

The 54-item spare pool is more than sufficient to choose 10 unique unscored/pilot items without consuming the 100 scored-item quotas.

## Selection rule

PO-1C.2 does not import every available chapter item.

For each approved source bank, it uses deterministic even-coverage selection across the current bank order so the comprehensive registry samples the beginning, middle, and end of the certified chapter assessment instead of taking only the first N items.

Imported counts:

- Ch4: 12
- Ch6: 12
- Ch7: 12
- Ch8: 12
- Ch5: 24
- Ch11: 20
- Ch14: 22
- Ch18: 10
- Ch12: 15
- Ch13: 15

## Provenance

Every imported question records:

- `source_kind = chapter_quiz`
- original stable `source_question_id`
- source chapter ID
- exact comprehensive domain
- exact source repository path
- exact source repository commit:
  `15dc88e5561d05004a066d22a9c7c1e1e095d381`
- selection rule: `po1c2_even_coverage`
- certification tag: `current_premium_quiz`

The imported prompt, four options, canonical correct option, and explanation are snapshots of the certified current source.

## Configuration state

PO-1C.2 seeds:

- slug: `nic-barber-theory`
- version: `1`
- blueprint: `nic-barber-blueprint-2026-08-14`
- question-bank version: `po1c2-certified-bank-2026-10-02`
- scoring policy: `po1c-scoring-v1`

The configuration remains **draft**.

PO-1C.2 intentionally does not invent:

- the final exam time limit,
- the final passing threshold.

Therefore it does not call `activate_comprehensive_exam_config()`.

## Quality gates

The migration regression suite proves:

1. exact domain counts are 48 / 24 / 52 / 30;
2. total imported count is 154;
3. all source IDs are unique across domains;
4. each domain meets its scored quota;
5. aggregate spare inventory is 54, comfortably above the 10 unscored requirement;
6. only approved chapter prefixes appear in each domain;
7. every imported record carries repository provenance;
8. every imported item is eligible for scored or unscored selection;
9. no reassessment/legacy HTML source enters the registry;
10. no simulator UI/runtime is introduced;
11. no readiness formula/write is introduced;
12. no H&A/attendance write is introduced;
13. the exam config remains draft until timer/pass policy is explicitly locked.

## Certification boundary

Passing PO-1C.2 means the private database registry contains enough certified, provenance-traceable inventory to support the locked 110-question simulator blueprint.

It does **not** mean a student can launch the simulator yet.

The next implementation slice remains PO-1C.3 — attempt generation, timer authority, persistence, answer/flag save, scoring/finalization, and concurrency runtime.
