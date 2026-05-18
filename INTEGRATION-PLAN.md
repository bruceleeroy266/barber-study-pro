# Orphaned Flashcard Integration Plan
**Date:** May 18, 2026
**Status:** Phase 1 — Schema Audit Complete

---

## PHASE 1 AUDIT RESULTS ✅

### Schema Compatibility Analysis

| Source Schema | Target Schema (V2) | Compatible? | Transform Needed? |
|--------------|-------------------|:-----------:|:-----------------:|
| `chapterNumber: number` | `chapter_id: string` | ⚠️ Partial | ✅ Yes — convert `6` → `"ch-6"` |
| `front: string` | `front: string` | ✅ Yes | ❌ No |
| `back: string` | `back: string` | ✅ Yes | ❌ No |
| `category: string` | `category: string` | ✅ Yes | ❌ No |
| `difficulty: 'easy'|'medium'|'hard'` | `difficulty: 'easy'|'medium'|'hard'` | ✅ Yes | ❌ No |
| ❌ Missing | `id: string` | — | ✅ Yes — generate `"fc-{ch}-{index}"` |
| ❌ Missing | `order_index: number` | — | ✅ Yes — generate from array index |
| ❌ Missing | `is_active: boolean` | — | ✅ Yes — set `true` |

**Verdict:** Schema is 80% compatible. Simple transform function needed.

### Orphaned File Inventory

| File | Chapter | Export Name | Card Count | Status |
|------|---------|-------------|------------|--------|
| flashcard-expansion.ts | 2 | chapter2Flashcards | 25 | ⚠️ Ch 2 already has active cards |
| flashcard-expansion.ts | 4 | chapter4Flashcards | ~20 | ✅ Ready |
| flashcard-expansion.ts | 5 | chapter5Flashcards | ~20 | ✅ Ready |
| chapter6-enhanced-flashcards.ts | 6 | chapter6AllEnhanced | 106 | ✅ Ready |
| chapter7-enhanced-flashcards.ts | 7 | chapter7Flashcards | 51 | ✅ Ready |
| chapter8-enhanced-flashcards.ts | 8 | chapter8Flashcards | 46 | ✅ Ready |
| chapter9-enhanced-flashcards.ts | 9 | chapter9Flashcards | 45 | ✅ Ready |
| chapter9-enhanced-flashcards-part2.ts | 9 | chapter9Part2Flashcards | 36 | ✅ Ready |
| chapter10-enhanced-flashcards.ts | 10 | chapter10AllFlashcards | 93 | ✅ Ready |
| chapter11-enhanced-flashcards.ts | 11 | chapter11Flashcards | 51 | ✅ Ready |
| chapter12-enhanced-flashcards-part1-4.ts | 12 | chapter12AllFlashcards | 76 | ✅ Ready |
| chapter15-enhanced-flashcards-part1-2.ts | 15 | chapter15Flashcards | 28 | ✅ Ready |

**Total Orphaned Cards:** ~500+

### Duplicate Risk Assessment

| Chapter | Active Cards | Orphaned Cards | Duplicate Risk |
|---------|:------------:|:--------------:|:--------------:|
| 1 | 25 | 0 | ✅ None |
| 2 | 22 | 25 | ⚠️ MEDIUM — different content, same chapter |
| 3 | 22 | 0 | ✅ None |
| 4 | 3 placeholder | ~20 | ✅ None (placeholders will be replaced) |
| 5 | 3 placeholder | ~20 | ✅ None |
| 6-12, 15 | 3 placeholder each | Various | ✅ None |

**Decision:** For Chapter 2, orphaned cards have DIFFERENT content than active cards. We can either:
- A) Merge both sets (47 total cards for Ch 2)
- B) Keep active only (22 cards)
- C) Use orphaned only (25 cards)

**Recommendation:** A) Merge — more content is better for education.

---

## PHASE 2 — INTEGRATION BATCHES

### Batch 1: Chapters 4, 5, 6
**Estimated Cards:** ~146
**Risk:** Low (no active cards exist)
**QA:** Build + spot check rendering

### Batch 2: Chapters 7, 8, 9
**Estimated Cards:** ~132
**Risk:** Low
**QA:** Build + spot check rendering

### Batch 3: Chapters 10, 11, 12
**Estimated Cards:** ~220
**Risk:** Low
**QA:** Build + spot check rendering

### Batch 4: Chapter 2 Merge + Chapter 15
**Estimated Cards:** ~53
**Risk:** Medium (Ch 2 merge)
**QA:** Build + verify no duplicates

---

## PHASE 3 — TRANSFORM FUNCTION

```typescript
// Convert orphaned schema to V2 schema
function transformFlashcards(
  source: FlashcardData[], 
  chapterNum: number
): Flashcard[] {
  return source.map((card, idx) => ({
    id: `fc-${chapterNum}-${String(idx + 1).padStart(3, '0')}`,
    chapter_id: `ch-${chapterNum}`,
    front: card.front,
    back: card.back,
    category: card.category,
    difficulty: card.difficulty,
    order_index: idx + 1,
    is_active: true,
  }))
}
```

---

## PHASE 4 — IMPLEMENTATION STEPS

1. Create `src/lib/orphaned-flashcards.ts` — import all orphaned files
2. Export unified `orphanedFlashcards` object keyed by chapter
3. Update `demo-data.ts` to merge orphaned + active flashcards
4. Replace placeholder flashcards for chapters with real data
5. Build + QA after each batch

---

## APPROVAL REQUIRED

Ready to proceed with Batch 1 (Chapters 4, 5, 6) integration.

Estimated time: 1 session
Expected result: +146 real flashcards active
