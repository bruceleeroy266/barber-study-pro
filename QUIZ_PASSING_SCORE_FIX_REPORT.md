# Quiz Passing Score Fix Report

**Issue:** Chapter 16 quiz metadata sets passing score at 80%, but `QuizClient` hardcoded 75% for pass/fail and progress tracking.  
**Phase:** 2B — Fix Chapter Quiz Passing Score Logic  
**Date:** 2026-06-29  
**Fix Author:** Ping  
**Status:** Resolved

---

## 1. Root Cause

The `QuizClient` component in `src/components/QuizClient.tsx` used a hardcoded 75% threshold for all quiz-related decisions:

- Determining `quiz_completed` in `student_progress`
- Setting `progress_percentage` to 100% or 50%
- Displaying the passing score on the start screen
- Calculating `passed` on the results screen
- Displaying the retry message on the results screen

Meanwhile, the `Quiz` type in `src/types/index.ts` had no field to store a per-quiz passing score. Chapter 16's quiz metadata in `src/lib/demo-data.ts` only stated the passing score in the description string (`"Passing score: 80%."`), which `QuizClient` did not read.

Result: Chapter 16 students scoring 76–79% would see "PASS" and receive 100% chapter progress, even though the intended threshold was 80%.

---

## 2. Files Changed

| File | Change |
|---|---|
| `src/types/index.ts` | Added optional `passing_score?: number` to the `Quiz` interface. |
| `src/lib/demo-data.ts` | Added `passing_score: 75` to existing chapter quizzes and `passing_score: 80` to the Chapter 16 quiz. Also added `passing_score: 75` to loop-generated placeholder quizzes. |
| `src/components/QuizClient.tsx` | Replaced hardcoded 75% with `quiz.passing_score ?? 75` for all pass/fail and progress decisions; updated UI text to display the configured passing score. |

No quiz questions were modified.

---

## 3. Fix Made

### 3.1 Type Change

```typescript
// src/types/index.ts
export interface Quiz {
  id: string
  chapter_id: string
  title: string
  description: string | null
  is_active: boolean
  passing_score?: number
}
```

Adding `passing_score` as optional ensures backward compatibility. Existing quizzes without the field continue to work.

### 3.2 Data Change

```typescript
// src/lib/demo-data.ts
'ch-16': {
  id: 'quiz-16',
  chapter_id: 'ch-16',
  title: "Women's Haircutting & Styling — Premium Quiz",
  description: '30 board-exam style questions. Passing score: 80%.',
  is_active: true,
  passing_score: 80,
},
```

All other quizzes received `passing_score: 75` to preserve their existing behavior.

### 3.3 Client Logic Change

```typescript
// src/components/QuizClient.tsx
const passingScore = quiz.passing_score ?? 75
```

This value is now used in four places:

1. **Progress tracking:**
   ```typescript
   quiz_completed: percentage >= passingScore,
   progress_percentage: percentage >= passingScore ? 100 : 50,
   ```

2. **Start screen text:**
   ```tsx
   Passing: {passingScore}%
   ```

3. **Results screen pass/fail:**
   ```typescript
   const passed = percentage >= passingScore
   ```

4. **Results screen retry message:**
   ```tsx
   Passing score is {passingScore}%. Review the flashcards and try again.
   ```

### 3.4 Dependency Array Update

Added `passingScore` to the `useCallback` dependency array for `finishQuiz` to satisfy the React Hooks exhaustive-deps rule.

---

## 4. Validation Results

### 4.1 TypeScript Compilation

**Command:** `npx tsc --noEmit`

**Result:** ✅ Pass

```
(no output)
```

### 4.2 ESLint

**Command:** `npx eslint src/components/QuizClient.tsx src/lib/demo-data.ts src/types/index.ts`

**Result:** ✅ Pass

```
(no output)
```

### 4.3 Production Build

**Command:** `npm run build`

**Result:** ✅ Pass

```
▲ Next.js 16.2.6 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 4.0s
  Running TypeScript ...
  Finished TypeScript in 7.6s ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/36) ...
✓ Generating static pages using 15 workers (36/36) in 519ms
  Finalizing page optimization ...

Route (app)
├ ○ /dashboard/assessments
...
```

All 36 static pages generated successfully, including `/dashboard/chapters/[chapterNumber]` which renders Chapter 16.

---

## 5. Impact Analysis

| Chapter | Old Behavior | New Behavior |
|---|---|---|
| 1–15, 17–21 | Passing threshold hardcoded at 75% | Passing threshold explicitly set to 75% via `passing_score` |
| 16 | Passing threshold hardcoded at 75% | Passing threshold correctly set to 80% via `passing_score` |

No functional change for chapters 1–15 and 17–21. Chapter 16 now enforces its intended 80% passing score across pass/fail display, progress tracking, and retry messaging.

---

## 6. Remaining Risks

1. **Instructor dashboard still hardcodes 75%.**
   `src/app/instructor/student/[studentId]/page.tsx` uses `>= 75` in several places for chapter quiz performance summaries. This does not affect the student-facing Chapter 16 quiz, but instructors may see inconsistent "passing" labels for Chapter 16 if a student scores 76–79%.

2. **Database schema not updated.**
   The `passing_score` field exists only in the TypeScript type and demo data. If quizzes are later loaded from Supabase, the database table and query mappers will need to include `passing_score`.

3. **`chapter1QuizMeta` / `chapter8QuizMeta` objects remain unused.**
   These source-file metadata objects contain `passing_score: 75` but are not imported by the platform. They are harmless but represent a parallel metadata pattern that could be consolidated in the future.

---

## 7. Summary

- **Root cause:** `QuizClient` hardcoded a 75% passing threshold, ignoring Chapter 16's intended 80%.
- **Fix:** Added an optional `passing_score` field to the `Quiz` type, set it in `demo-data.ts`, and updated `QuizClient` to use it with a 75% fallback.
- **Validation:** TypeScript, ESLint, and production build all pass.
- **Scope:** Only type, demo data, and client logic were changed. No quiz questions were modified.

Chapter 16 now correctly enforces an 80% passing score.
