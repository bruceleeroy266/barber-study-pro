# Instructor Portal — Phase 4A Hour Tracker + Board Hours Report

**Project:** `C:\Users\skyfl\Desktop\barber-study-pro-v2`  
**Branch:** `demo-polish-ascyn-pro`  
**Date:** 2026-06-22  
**Scope:** Build the foundation of a school-grade hour tracking system with instructor-approved hours and a printable board hours summary report.

---

## Summary

Phase 4A introduces an **Hour Tracker** on the student detail page, a **Daily Hour Log** table, an **Instructor Approval Queue** placeholder on the instructor dashboard, and a printable **Board Hours Summary Report**. Hours are stored and calculated in minutes, then displayed in the required `Xh Ym` format. Only logs with `status = 'approved'` count toward official completed hours; pending and rejected logs are excluded.

Student clock-in/out, submission workflows, and actual approval actions are intentionally out of scope.

---

## Data Model

### New Type: `HourLog` (`src/types/index.ts`)

```typescript
export type HourCategory = 'Theory' | 'Practical' | 'Clinic' | 'Sanitation' | 'Makeup Hours' | 'Other'
export type HourStatus = 'pending' | 'approved' | 'rejected'

export interface HourLog {
  id: string
  user_id: string
  date: string
  category: HourCategory
  minutes: number
  status: HourStatus
  notes: string | null
  created_at: string
  updated_at: string
}
```

### Storage Rule

- All hour values are stored as **integer minutes**.
- Required program hours default to **1500 hours** (90,000 minutes).
- If decimal hours are imported later, the conversion rule is `Math.ceil(decimalHours * 60)`.

### Hour Calculation Logic

```typescript
const REQUIRED_MINUTES = 1500 * 60
const approvedMinutes = hourLogs
  .filter(h => h.status === 'approved')
  .reduce((sum, h) => sum + h.minutes, 0)
const pendingMinutes = hourLogs
  .filter(h => h.status === 'pending')
  .reduce((sum, h) => sum + h.minutes, 0)
const remainingMinutes = Math.max(0, REQUIRED_MINUTES - approvedMinutes)
const completionPercentage = Math.round((approvedMinutes / REQUIRED_MINUTES) * 100)
```

### Display Format

```typescript
function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}
```

Examples:
- `1460` minutes → `24h 20m`
- `480` minutes → `8h 0m`
- `90000` minutes → `1500h 0m`

---

## What Was Built

### 1. Student Detail Hour Tracker (`src/app/instructor/student/[studentId]/page.tsx`)

Added an **Hour Tracker** section with:

- **Approved Hours** — only approved logs
- **Pending Approval** — pending logs (excluded from totals)
- **Required Hours** — 1500h 0m default
- **Remaining Hours** — required minus approved
- **Completion Percentage** — approved / required

### 2. Daily Hour Log Table

Columns:

- Date
- Category
- Minutes
- Display Hours (`Xh Ym`)
- Status (approved / pending / rejected badge)
- Notes

A separate **Rejected Logs** subsection renders when rejected logs exist, with an explanation that they do not count toward official hours.

### 3. Hour Categories

Supported categories in data and UI:

- Theory
- Practical
- Clinic
- Sanitation
- Makeup Hours
- Other

### 4. Instructor Approval Queue Placeholder (`src/app/instructor/page.tsx`)

Added a new **Hours Pending Approval** card on the instructor dashboard that:

- Groups pending hour logs by student
- Shows total pending hours per student
- Displays "Approval workflow coming soon" subtitle

### 5. Board Hours Summary Report

Added a print-friendly report section on the student detail page containing:

- Student name/email
- Program type (static: Barbering)
- State (static: Oklahoma)
- Required Hours
- Approved Hours
- Remaining Hours
- Completion Percentage
- Approved Daily Hour Logs table
- Generated date
- Disclaimer: "Verify state-specific submission requirements before submitting to a licensing board."

Print CSS isolates the report section so only the board hours report prints.

### 6. Demo Fallback Data (`src/lib/demo-data.ts`)

Added `demoHourLogs` with:

- Alex Johnson: 5 approved logs, 1 pending log, 1 rejected log
- Maria Garcia: 2 approved logs, 1 pending log
- Jordan Smith: 2 approved logs, 1 pending log
- Taylor Brown: no logs

### 7. Mock Supabase Support (`src/lib/supabase-server.ts`)

Wired `demoHourLogs` into the mock `hour_logs` query builder.

---

## Files Changed

| File | Change |
|------|--------|
| `src/types/index.ts` | Added `HourLog`, `HourCategory`, `HourStatus` types |
| `src/lib/demo-data.ts` | Added `demoHourLogs` |
| `src/lib/supabase-server.ts` | Wired demo hour logs into mock query builder |
| `src/app/instructor/page.tsx` | Added Hours Pending Approval queue placeholder |
| `src/app/instructor/student/[studentId]/page.tsx` | Added Hour Tracker, Daily Hour Log, and Board Hours Report |
| `INSTRUCTOR_PHASE_4A_HOUR_TRACKER_REPORT.md` | This report |

---

## Validation

### TypeScript

```bash
npx tsc --noEmit
```

**Result:** Passed (no errors).

### Functional Smoke Tests

Started the dev server in demo mode and verified via HTTP:

- ✅ `/instructor/student/demo-student-1` shows Hour Tracker section.
- ✅ Approved hours display as `24h 20m`.
- ✅ Pending hours display as `8h 0m` and do not count toward approved/remaining totals.
- ✅ Required hours display as `1500h 0m`.
- ✅ Remaining hours display as `1475h 40m`.
- ✅ Daily Hour Log table shows categories, minutes, display hours, statuses, and notes.
- ✅ Board Hours Summary Report renders with disclaimer.
- ✅ `/instructor` shows Hours Pending Approval queue with Maria Garcia and Jordan Smith.
- ✅ `/instructor/student/invalid-id` returns HTTP 404.
- ✅ Existing dashboard button polish still works (`Start Chapter` instead of `Start ?`).

### Auth Enforcement

- ✅ Middleware and server components preserve instructor/admin access control.
- ✅ No security regressions.

---

## Out of Scope (Intentionally Not Built)

- ❌ Student clock in/out
- ❌ Student submission workflow
- ❌ Instructor approve/reject/edit actions
- ❌ State-specific board forms
- ❌ Payroll or financial tracking
- ❌ Time punches

---

## Future Approval Workflow Recommendation

When Phase 4B is approved, build the following:

1. **`hour_logs` table** in Supabase with the schema documented below.
2. **Student submission UI** — a form to log daily hours by category and submit for approval.
3. **Instructor approval actions** — approve/reject/edit buttons in the queue placeholder.
4. **Server actions** for approve/reject/edit with role checks.
5. **Email notifications** to instructors when hours are submitted.
6. **Audit trail** — track who approved each log and when.

### Recommended Supabase Schema

```sql
CREATE TABLE hour_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Theory','Practical','Clinic','Sanitation','Makeup Hours','Other')),
  minutes INTEGER NOT NULL CHECK (minutes > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hour_logs_user_id ON hour_logs(user_id);
CREATE INDEX idx_hour_logs_status ON hour_logs(status);
CREATE INDEX idx_hour_logs_date ON hour_logs(date);

ALTER TABLE hour_logs ENABLE ROW LEVEL SECURITY;

-- Students can view their own logs
CREATE POLICY "Students view own hour logs" ON hour_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Students can insert pending logs
CREATE POLICY "Students insert hour logs" ON hour_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Instructors/admins can view logs for their school
CREATE POLICY "Instructors view school hour logs" ON hour_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'admin' OR p.role = 'instructor')
        AND p.school_id = (SELECT school_id FROM profiles WHERE id = hour_logs.user_id)
    )
  );

-- Instructors/admins can update status
CREATE POLICY "Instructors review hour logs" ON hour_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'admin' OR p.role = 'instructor')
        AND p.school_id = (SELECT school_id FROM profiles WHERE id = hour_logs.user_id)
    )
  );
```

---

## Notes

- `.env.local` was temporarily switched to demo mode for validation and restored afterward.
- No chapter, quiz, or flashcard content was modified.
- No commits were made per instructions.
