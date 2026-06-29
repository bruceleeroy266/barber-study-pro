# /dashboard/assessments Build Fix Report

**Issue:** Pre-existing build failure during prerender of `/dashboard/assessments`  
**Error:** `TypeError: a.from(...).select(...).or is not a function`  
**Date:** 2026-06-29  
**Fix Author:** Ping  
**Status:** Resolved

---

## 1. Root Cause

The `/dashboard/assessments` page calls Supabase's `.or()` filter method:

```typescript
const { data: rubricsData } = await supabase
  .from('assessment_rubrics')
  .select('*')
  .or(`school_id.eq.${schoolId},school_id.is.null`)
```

During production build / static prerender, Supabase environment variables are not configured. The `createClient()` function in `src/lib/supabase-server.ts` falls back to a mock server client (`createMockServerClient`) to prevent crashes. However, the mock query builder returned by `createMockQueryBuilder()` did not implement an `.or()` method. When the assessments page attempted to call `.or()`, the runtime threw:

```
TypeError: a.from(...).select(...).or is not a function
```

This issue is unrelated to Chapter 16 content, flashcards, or quiz work.

---

## 2. Files Changed

| File | Change |
|---|---|
| `src/lib/supabase-server.ts` | Added an `.or()` method to the mock query builder so fallback/demo mode can handle OR filter strings. |

No other files were modified.

---

## 3. Fix Made

### 3.1 Implementation

Added `.or()` to the chainable mock query builder in `createMockQueryBuilder()`:

```typescript
or: (filterString: string) => {
  const conditions = filterString.split(',').map((cond) => cond.trim())
  filters.push((item) => {
    return conditions.some((cond) => {
      // Parse simple field.operator.value patterns used in the app
      // e.g., school_id.eq.abc123, school_id.is.null
      const match = cond.match(/^(.+?)\.(eq|neq|gt|gte|lt|lte|is)\.(.+)$/)
      if (!match) return false
      const [, field, op, rawValue] = match
      if (op === 'is') {
        if (rawValue === 'null') return item[field] === null || item[field] === undefined
        if (rawValue === 'true') return item[field] === true
        if (rawValue === 'false') return item[field] === false
        return item[field] == rawValue
      }
      // Comparison operators: use the raw string value
      if (op === 'eq') return item[field] == rawValue
      if (op === 'neq') return item[field] != rawValue
      if (op === 'gt') return item[field] > rawValue
      if (op === 'gte') return item[field] >= rawValue
      if (op === 'lt') return item[field] < rawValue
      if (op === 'lte') return item[field] <= rawValue
      return false
    })
  })
  return builder
},
```

### 3.2 How the Fix Works

- Splits the `.or()` filter string on commas into individual conditions.
- Parses each condition as `field.operator.value`.
- Supports `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, and `is` operators.
- Handles `is.null`, `is.true`, and `is.false` semantics.
- Adds a single filter that returns `true` if **any** condition matches the item.
- Preserves the existing chainable builder pattern.

### 3.3 Why This Preserves Safety

- The fix only affects the **mock/fallback client** used when Supabase is not configured or when demo mode is active.
- When real Supabase credentials are present, `createClient()` returns the official `@supabase/ssr` client, which uses the real `.or()` implementation.
- No changes were made to the assessments page query logic.
- No environment checks or demo guards were weakened.

---

## 4. Validation Results

### 4.1 TypeScript Compilation

**Command:** `npx tsc --noEmit`

**Result:** ✅ Pass

```
(no output)
```

### 4.2 ESLint

**Command:** `npx eslint src/lib/supabase-server.ts "src/app/(dashboard)/dashboard/assessments/page.tsx"`

**Result:** ⚠️ Pre-existing issues only

ESLint reported 34 problems in `src/lib/supabase-server.ts`. These are all pre-existing warnings/errors (`no-explicit-any`, `prefer-const`, `no-unused-vars`) unrelated to the `.or()` fix. The number of issues decreased by 2 after the fix because the new implementation did not introduce any new `any` types or unused parameters.

The assessments page itself (`page.tsx`) passed ESLint cleanly.

### 4.3 Production Build

**Command:** `npm run build`

**Result:** ✅ Pass

```
▲ Next.js 16.2.6 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 4.2s
  Running TypeScript ...
  Finished TypeScript in 7.6s ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/36) ...
✓ Generating static pages using 15 workers (36/36) in 515ms
  Finalizing page optimization ...

Route (app)
├ ○ /dashboard/assessments
...
```

`/dashboard/assessments` now prerenders successfully. The remaining "Supabase not configured" console messages are expected warnings from the fallback client during static generation; they do not block the build.

---

## 5. Repository Audit

| Check | Status |
|---|---|
| Temporary files created | ✅ None |
| Debug code added | ✅ None |
| TODOs/FIXMEs added | ✅ None |
| Duplicate questions introduced | ✅ N/A (no quiz changes) |
| Orphaned imports | ✅ None |
| Unused exports | ✅ None |
| Accidental modifications outside scope | ✅ None |
| Chapter 16 content modified | ✅ None |

Only `src/lib/supabase-server.ts` was changed.

---

## 6. Remaining Risks

1. **Mock `.or()` parser is limited.** It handles the simple `field.operator.value` patterns used in the app today. Complex Supabase `.or()` strings (nested conditions, referenced tables, quoted values with commas, or `.or()` combined with `.and()`) may not parse correctly. If future code uses more complex OR filters, the mock will need to be extended.

2. **`assessment_rubrics` table not seeded in mock data.** The mock builder returns an empty array for `assessment_rubrics`, so the demo fallback path is what actually populates rubrics on the assessments page. This is existing behavior and not a regression.

3. **Pre-existing ESLint issues remain.** The `supabase-server.ts` file has 27 pre-existing `no-explicit-any` errors and several unused-variable warnings. These do not affect functionality but should be addressed in a future cleanup pass.

---

## 7. Summary

- **Root cause:** Mock Supabase client in `supabase-server.ts` lacked an `.or()` method, causing `/dashboard/assessments` to fail during prerender when Supabase was not configured.
- **Fix:** Added a simple `.or()` parser to the mock query builder.
- **Validation:** TypeScript passes, production build passes, and the assessments page prerenders successfully.
- **Scope:** Only `src/lib/supabase-server.ts` was modified. No Chapter 16 content, flashcards, or quiz files were touched.

The build blocker is resolved.
