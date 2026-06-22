# Instructor Portal — Phase 2D Instructor Notes Report

**Project:** `C:\Users\skyfl\Desktop\barber-study-pro-v2`  
**Branch:** `demo-polish-ascyn-pro`  
**Date:** 2026-06-22  
**Scope:** Add instructor notes to the student detail dashboard.

---

## Summary

Phase 2D adds an **Instructor Notes** section to `/instructor/student/[studentId]`. Instructors and admins can view existing notes, see note metadata (type, author, date), and use a simple form to compose new notes. Writes are protected by server-side role checks and are currently wired to Supabase, but the required `instructor_notes` table has **not** been created yet per the instruction to avoid risky database edits without a plan.

Demo fallback notes are included so the feature renders meaningfully in demo mode.

Out-of-scope items (exports, reports, chapter/quiz/flashcard content changes) were intentionally not added.

---

## What Was Built

### 1. Instructor Notes UI (`src/app/instructor/student/[studentId]/page.tsx`)

Added a new "Instructor Notes" panel with:

- **Add Note form** (client component)
  - Note type selector: Coaching, Remediation, Readiness, General
  - Note text textarea
  - Submit button with pending state
  - Inline success/error feedback
- **Notes list**
  - Note type badge (color-coded)
  - Instructor name
  - Created date
  - Full note text
- **Empty state** when no notes exist yet

### 2. Add Note Form Client Component (`src/app/instructor/student/[studentId]/AddNoteForm.tsx`)

- Manages form state with React hooks.
- Calls the `addInstructorNote` server action on submit.
- Clears the form on successful submission.
- Disables submit while pending or when note text is empty.

### 3. Server Action (`src/app/instructor/student/[studentId]/actions.ts`)

`addInstructorNote` handles:

- Re-authenticating the current user.
- Verifying the user is `instructor` or `admin`.
- Validating that note text is non-empty.
- **Demo mode / unconfigured Supabase:** returns a clear read-only message.
- **Real Supabase mode:** attempts to insert into `instructor_notes`. If the table does not exist, returns a message pointing to this implementation plan.

### 4. Data Types (`src/types/index.ts`)

Added the `InstructorNote` interface:

```typescript
export interface InstructorNote {
  id: string
  student_id: string
  instructor_id: string
  instructor_name: string
  note_type: 'coaching' | 'remediation' | 'readiness' | 'general'
  note_text: string
  created_at: string
}
```

### 5. Demo Data (`src/lib/demo-data.ts`)

Added `demoInstructorNotes` with sample notes for:

- Alex Johnson — readiness + coaching notes
- Maria Garcia — general note
- Jordan Smith — remediation note
- Taylor Brown — no notes (empty-state test)

### 6. Server Mock Client (`src/lib/supabase-server.ts`)

Wired `demoInstructorNotes` into the mock `instructor_notes` query builder.

---

## Files Changed

| File | Change |
|------|--------|
| `src/types/index.ts` | Added `InstructorNote` interface |
| `src/lib/demo-data.ts` | Added `demoInstructorNotes` |
| `src/lib/supabase-server.ts` | Wired demo notes into mock client |
| `src/app/instructor/student/[studentId]/page.tsx` | Added Instructor Notes section + data fetch |
| `src/app/instructor/student/[studentId]/AddNoteForm.tsx` | New client form component |
| `src/app/instructor/student/[studentId]/actions.ts` | New server action for adding notes |
| `INSTRUCTOR_PHASE_2D_NOTES_REPORT.md` | This report |

---

## Implementation Plan: Persisting Notes to Supabase

The UI and server action are already in place. To enable real note creation, create the following table in Supabase.

### SQL Schema

```sql
-- Enable Row Level Security
CREATE TABLE instructor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_name TEXT NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('coaching', 'remediation', 'readiness', 'general')),
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by student
CREATE INDEX idx_instructor_notes_student_id ON instructor_notes(student_id);

-- Enable RLS
ALTER TABLE instructor_notes ENABLE ROW LEVEL SECURITY;

-- Instructors/admins can view notes for students in their school
CREATE POLICY "Instructors can view notes for their school" ON instructor_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'admin' OR p.role = 'instructor')
        AND p.school_id = (
          SELECT school_id FROM profiles WHERE id = instructor_notes.student_id
        )
    )
  );

-- Instructors/admins can create notes
CREATE POLICY "Instructors can create notes" ON instructor_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'instructor')
    )
  );
```

### Optional Enhancements

- Add `updated_at` and an edit endpoint if notes need to be modified.
- Add soft-delete (`deleted_at`) instead of hard deletes.
- Add email/push notifications when a new remediation note is added.
- Add a notes summary card to the Phase 2A roster (e.g., "3 unread notes").

---

## Validation

### TypeScript

```bash
npx tsc --noEmit
```

**Result:** Passed (no errors).

### Dev Server / Functional Smoke Tests

Started the dev server in demo mode and verified via HTTP:

- ✅ `/instructor/student/demo-student-1` shows Instructor Notes section with readiness and coaching notes.
- ✅ Note metadata renders: type badge, instructor name "Demo Instructor", and date.
- ✅ Add Note form renders with Note Type selector and submit button.
- ✅ `/instructor/student/demo-student-4` shows "No instructor notes yet" empty state.
- ✅ `/instructor/student/invalid-id` returns HTTP 404.

### Auth Enforcement

Phase 1 auth remains intact and was not modified:

- **Middleware (`src/middleware.ts`):** `/instructor/*` routes require `instructor` or `admin` role; students/apprentices are redirected to `/dashboard`.
- **Server component (`src/app/instructor/student/[studentId]/page.tsx`):** Re-verifies `isInstructorOrAdmin(profile.role)` before loading any student data.
- **Server action (`src/app/instructor/student/[studentId]/actions.ts`):** Re-verifies instructor/admin role before accepting a note submission.

> Note: Browser-based visual validation was blocked by policy, so HTTP smoke tests and code review were used instead.

---

## Demo Fallback Behavior

Notes are read-only in demo mode. The form submits to the server action, which returns a message explaining that note creation requires Supabase and the `instructor_notes` table. Existing demo notes render normally.

---

## What's Out of Scope (Intentionally Not Built)

- ❌ Exports
- ❌ Reports
- ❌ Modifications to chapter, quiz, or flashcard content
- ❌ Actual database table creation (documented in implementation plan instead)

---

## Next Steps for Phase 2E / Beyond

- Run the SQL in the implementation plan to enable real note persistence.
- Test the add-note flow end-to-end against real Supabase.
- Add note editing/deletion if needed.
- Surface recent notes on the Phase 2A roster dashboard.

---

## Notes

- No commits were made per instructions.
- `.env.local` was temporarily switched to demo mode for validation and then restored to its original state (`NEXT_PUBLIC_DEMO_MODE=false` with real Supabase credentials).
- All existing app conventions (dark/gold theme, Tailwind classes, server components, local chapters) were preserved.
