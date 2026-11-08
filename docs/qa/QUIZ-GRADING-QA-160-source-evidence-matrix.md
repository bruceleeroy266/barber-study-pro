# QA-160 — Per-question original-scan evidence matrix (unresolved)

**Decision: NO-GO. No merge authorization.** This register distinguishes section-level OCR mapping from actual per-question scan certification, with all four distractors and explanations separately required for full sign-off. Source: Milady barbering Chapter 5, complete-book PDF pages 98–137; pagination is PDF index, not printed book page.

| Question ID | Whole-book PDF page locator (prior QA-149 mapping) | Source-image audit and answer-option sign-off |
|---|---|---|
| qq-5-001 | 100–102 | Section mapped; complete full-resolution item review pending |
| qq-5-002 | 100–101 | Section mapped; complete full-resolution item review pending |
| qq-5-003 | 101 | Section mapped; complete full-resolution item review pending |
| qq-5-004 | 110–112 | Section mapped; complete full-resolution item review pending |
| qq-5-005 | 102–103 | Section mapped; complete full-resolution item review pending |
| qq-5-006 | 100–103 | Section mapped; complete full-resolution item review pending |
| qq-5-007 | 104–105 | Section mapped; complete full-resolution item review pending |
| qq-5-008 | 104–106 | Section mapped; complete full-resolution item review pending |
| qq-5-009 | 104–109 | Section mapped; complete full-resolution item review pending |
| qq-5-010 | 104–109 | Section mapped; complete full-resolution item review pending |
| qq-5-011 | 105–106 | Section mapped; complete full-resolution item review pending |
| qq-5-012 | 106–107 | Section mapped; complete full-resolution item review pending |
| qq-5-013 | 104–106 | Section mapped; complete full-resolution item review pending |
| qq-5-014 | 109 | Targeted scan passage checked; full item certification still pending |
| qq-5-015 | 110–112 | Section mapped; complete full-resolution item review pending |
| qq-5-016 | 110–111 | Section mapped; complete full-resolution item review pending |
| qq-5-017 | 111–112 | Section mapped; complete full-resolution item review pending |
| qq-5-018 | 110–113 | Section mapped; complete full-resolution item review pending |
| qq-5-019 | 111–112 | Section mapped; complete full-resolution item review pending |
| qq-5-020 | 110–112 | Section mapped; complete full-resolution item review pending |
| qq-5-021 | 110–112 | Section mapped; complete full-resolution item review pending |
| qq-5-022 | 113–115 | Section mapped; complete full-resolution item review pending |
| qq-5-023 | 118–121,130–131 | Section mapped; complete full-resolution item review pending |
| qq-5-024 | 114–115 | Section mapped; complete full-resolution item review pending |
| qq-5-025 | 118–121,128–131 | Section mapped; complete full-resolution item review pending |
| qq-5-026 | 116 | Section mapped; complete full-resolution item review pending |
| qq-5-027 | 114–116 | Section mapped; complete full-resolution item review pending |
| qq-5-028 | 117 | Section mapped; complete full-resolution item review pending |
| qq-5-029 | 125–126 | Section mapped; complete full-resolution item review pending |
| qq-5-030 | 126 | Targeted scan passage checked; full item certification still pending |
| qq-5-031 | 125–126 | Section mapped; complete full-resolution item review pending |
| qq-5-032 | 124–125 | Section mapped; complete full-resolution item review pending |
| qq-5-033 | 125–126 | Section mapped; complete full-resolution item review pending |
| qq-5-034 | 124–126 | Section mapped; complete full-resolution item review pending |
| qq-5-035 | 122–124 | Section mapped; complete full-resolution item review pending |
| qq-5-036 | 123–124 | Section mapped; complete full-resolution item review pending |
| qq-5-037 | 118–119,128–129 | Section mapped; complete full-resolution item review pending |
| qq-5-038 | 119–121,130–131 | Section mapped; complete full-resolution item review pending |
| qq-5-039 | 122–127 | Section mapped; complete full-resolution item review pending |
| qq-5-040 | 127 | Section mapped; complete full-resolution item review pending |
| qq-5-041 | 110–112 | Section mapped; complete full-resolution item review pending |
| qq-5-042 | 105–106 | Section mapped; complete full-resolution item review pending |
| qq-5-043 | 103–105 | Section mapped; complete full-resolution item review pending |
| qq-5-044 | 106–107 | Section mapped; complete full-resolution item review pending |
| qq-5-045 | 110–111 | Section mapped; complete full-resolution item review pending |
| qq-5-046 | 115–116 | Section mapped; complete full-resolution item review pending |
| qq-5-047 | 111–112 | Section mapped; complete full-resolution item review pending |
| qq-5-048 | 110–116 | Section mapped; complete full-resolution item review pending |
| qq-5-049 | 118–121,128–131 | Section mapped; complete full-resolution item review pending |
| qq-5-050 | 125–126 | Section mapped; complete full-resolution item review pending |

## Known facts and gates
- All 50 unique IDs exist in the bank; QA-159 eliminated the Q014 double-defensible-answer situation and preserved key B.
- Q014 primary shear restriction verified in source image PDF p.109; Q030 five-second tissue test verified image PDF p.126. Those targeted passages do not certify all answer options, distractors or other claims.
- Source PDF page overview inspection in QA-159 does not count as full-resolution per-item certification. **No item has an independently complete four-option, stem, key, and explanation sign-off**.
- The other 48 items require actual high-resolution scans in their source ranges and per-option evidence. Special attention: 026,036,045,048 and safety/razor passages.
- Latest code change under review: QA-159 Q014, test assertion, and docs, PR #452. The green run 40364309462 predates these edits; final-head run 40366607569 must pass before technical clearance.
- Required before GO: 50 complete item-evidence records + both CI jobs passing on the same final immutable head + explicit owner authorization. Do not merge or deploy.
