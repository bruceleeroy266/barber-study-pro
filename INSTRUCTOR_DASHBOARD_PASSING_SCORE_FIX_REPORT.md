# Instructor Dashboard Passing Score Fix Report

**Issue:** `src/app/instructor/student/[studentId]/page.tsx` hardcoded 75% for chapter quiz pass/fail summaries, conflicting with Chapter 16's configured 80% passing score.  
**Phase:** 2C — Fix Instructor Dashboard Passing Score Display  
**Date:** 2026-06-29  
**Fix Author:** Ping  
**Status:** Resolved

---

## 1. Root Cause

The instructor student-detail page used hardcoded `75` in multiple places to determine whether a student's chapter quiz score was passing:

- `getBoardRisk()` counted chapters as passing if `score >= 75`.
- The chapter-by-chapter progress list colored the best score green if `bestScore >= 75`.
- The chapter progress bar turned green at `pct >= 75`.
- The recent quiz attempts table colored the percentage green if `percentage >= 75`.
- The weak-areas list labeled scores as "Below passing threshold" if `score < 75`.

After Phase 2B, Chapter 16's quiz correctly uses `passing_score: 80` in the student-facing `QuizClient`. However, the instructor dashboard still treated any score ≥ 75 as passing, so a Chapter 16 score of 76–79% would appear green/passing to instructors while the student was correctly marked as not passing.

---

## 2. Files Changed

| File | Change |
|---|---|
| `src/app/instructor/student/[studentId]/page.tsx` | Updated all quiz pass/fail and weak-area thresholds to use the quiz-specific `passing_score` with a 75% fallback. |

No quiz questions, flashcards, or lesson content were modified.

---

## 3. Fix Made

### 3.1 Added `getLocalQuiz` Import

```typescript
import { localChapters, getLocalQuiz } from '@/lib/local-data'
```

### 3.2 Added `passingScore` to `ChapterScore`

```typescript
interface ChapterScore {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  score: number
  attempted: boolean
  passingScore: number
}
```

### 3.3 Updated `computeChapterScores` to Include Passing Score

```typescript
function computeChapterScores(
  chapters: { id: string; chapter_number: number; title: string }[],
  progressRecords: StudentProgress[]
): ChapterScore[] {
  return chapters.map((chapter) => {
    const progress = progressRecords.find((p) => p.chapter_id === chapter.id)
    const score = progress?.best_quiz_score ?? 0
    const quiz = getLocalQuiz(chapter.id)
    return {
      chapterId: chapter.id,
      chapterNumber: chapter.chapter_number,
      chapterTitle: chapter.title,
      score,
      attempted: score > 0,
      passingScore: quiz?.passing_score ?? 75,
    }
  })
}
```

### 3.4 Added Quiz-ID-to-Passing-Score Helper

```typescript
function getPassingScoreByQuizId(quizId: string): number {
  const chapterId = quizId.replace('quiz-', 'ch-')
  return getLocalQuiz(chapterId)?.passing_score ?? 75
}
```

### 3.5 Updated `getBoardRisk` to Use Per-Chapter Passing Scores

```typescript
const passingCount = attemptedChapters.filter((c) => c.score >= c.passingScore).length
// ...
if (passingRate < 0.8 || attemptedChapters.some((c) => c.score < c.passingScore)) {
  // Moderate Risk
}
```

### 3.6 Updated Chapter-by-Chapter Progress List

```typescript
const chapterPassingScore = getLocalQuiz(chapter.id)?.passing_score ?? 75
// ...
<span className={bestScore >= chapterPassingScore ? 'text-green-400' : 'text-yellow-400'}>
  Best: {bestScore}% (pass: {chapterPassingScore}%)
</span>
// ...
className={`h-2 rounded-full transition-all ${
  pct >= chapterPassingScore ? 'bg-green-500' :
  pct >= 50 ? 'bg-yellow-500' :
  pct > 0 ? 'bg-[#D4AF37]' : 'bg-gray-700'
}`}
```

### 3.7 Updated Recent Quiz Attempts Table

```typescript
{attemptRecords.map((attempt) => {
  const attemptPassingScore = getPassingScoreByQuizId(attempt.quiz_id)
  return (
    <tr key={attempt.id}>
      {/* ... */}
      <span className={attempt.percentage >= attemptPassingScore ? 'text-green-400' : 'text-yellow-400'}>
        {attempt.percentage}%
      </span>
      {/* ... */}
    </tr>
  )
})}
```

### 3.8 Updated Weak Areas List

```typescript
<p className="text-xs text-gray-500">
  {area.score < area.passingScore
    ? `Below passing threshold (${area.passingScore}%)`
    : area.score < 80
    ? 'Needs polish'
    : 'Lowest relative score'}
</p>
// ...
<div className={`text-xl font-bold ${
  area.score >= area.passingScore ? 'text-yellow-400' :
  area.score >= 60 ? 'text-orange-400' : 'text-red-400'
}`}>
  {area.score}%
</div>
```

---

## 4. Impact Analysis

| Chapter | Old Instructor Dashboard Behavior | New Instructor Dashboard Behavior |
|---|---|---|
| 1–15, 17–21 | Passing threshold hardcoded at 75% | Passing threshold reads `passing_score: 75` from quiz metadata |
| 16 | Passing threshold hardcoded at 75% | Passing threshold correctly reads `passing_score: 80` |

No functional change for chapters 1–15 and 17–21. Chapter 16 now displays and evaluates scores using its intended 80% threshold across the instructor dashboard.

---

## 5. Validation Results

### 5.1 TypeScript Compilation

**Command:** `npx tsc --noEmit`

**Result:** ✅ Pass

```
(no output)
```

### 5.2 ESLint

**Command:** `npx eslint "src/app/instructor/student/[studentId]/page.tsx"`

**Result:** ✅ Pass

```
(no output)
```

### 5.3 Production Build

**Command:** `npm run build`

**Result:** ✅ Pass

```
▲ Next.js 16.2.6 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 4.2s
  Running TypeScript ...
  Finished TypeScript in 7.7s ...
  Generating static pages using 15 workers (0/36) ...
✓ Generating static pages using 15 workers (36/36) in 507ms
  Finalizing page optimization ...

Route (app)
├ ƒ /instructor/student/[studentId]
...
```

All 36 static pages generated successfully.

---

## 6. Remaining Risks

1. **Aggregate metrics still use 75%.**
   The stats grid uses `overallProgress >= 75` and `avgQuizScore >= 75` for color thresholds. These are overall/average metrics, not per-quiz pass/fail logic, so they were intentionally left unchanged. If desired, they can be made configurable through school configuration later.

2. **`WeakAreaAnalytics` component may still use hardcoded thresholds.**
   The `WeakAreaAnalytics` component imported at line 607 receives `analytics.weakAreas` from the `analyzePerformance` library. That component was not inspected or modified in this fix. If it uses hardcoded 75% thresholds internally, it could still show inconsistent labels for Chapter 16.

3. **Quiz ID parsing assumes `quiz-{number}` format.**
   The `getPassingScoreByQuizId` helper converts `quiz-16` to `ch-16`. This matches the current naming convention. If quiz IDs change format, the helper will need updating.

4. **Database-backed quizzes need `passing_score` column.**
   The fix relies on `passing_score` being present in the demo/local quiz metadata. When quizzes are loaded from Supabase, the `quizzes` table and its mapper must include `passing_score`.

---

## 7. Summary

- **Root cause:** Instructor dashboard hardcoded 75% for all quiz pass/fail evaluations, conflicting with Chapter 16's 80% passing score.
- **Fix:** Added `passingScore` to chapter score calculations and updated all per-quiz pass/fail UI thresholds on the instructor student-detail page to use quiz-specific passing scores with a 75% fallback.
- **Validation:** TypeScript, ESLint, and production build all pass.
- **Scope:** Only the instructor student-detail page was modified. No quiz questions, flashcards, or lesson content were changed.

Chapter 16 is now consistent between the student quiz experience and the instructor dashboard.
