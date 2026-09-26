# Segment E1 — Student Attendance & Hours Portal Audit

Scope: audit what students can currently see for approved hours, pending hours, remaining hours, attendance status, and attendance/hour history before adding anything new.

## Current student-facing surfaces

### Dashboard (/dashboard)

Status: YELLOW.

What students currently see:
- Overall attendance percentage through the existing Attendance metric.

What the page already loads:
- The student's own `attendance_records`.
- An attendance summary.
- Today's attendance status is computed with `getTodayAttendanceStatus(...)`.

Gap:
- `todayStatus` is computed but never rendered.
- No approved-hour total is shown.
- No pending-hour total is shown.
- No remaining-hour count is shown.
- No attendance history is shown.
- No hour history is shown.

### My Progress (/dashboard/progress)

Status: YELLOW.

What students currently see:
- Attendance percentage in the Overview metrics.

Gaps:
- No current/today attendance status.
- No present/absent/tardy/excused breakdown.
- No approved hours.
- No pending hours.
- No remaining hours.
- No attendance history.
- No hour history.

### Compliance (/dashboard/compliance)

Status: PARTIAL GREEN.

What students currently see:
- Graduation Readiness includes `completedHours / requiredHours`.
- Completed hours are derived from `hour_logs` entries with status `approved` only.
- Remaining requirements may include text such as `300 hours remaining`.
- Program-specific required hours are resolved for real students.

What students do not see:
- Pending hours as a separate value.
- Rejected hours.
- Hour-entry history.
- Source/provenance such as Attendance-generated vs Manual.
- Rejection reasons.
- Review/approval timestamps.
- Attendance history or today's attendance status.

### Student navigation

Status: RED for a dedicated portal.

Current student nav includes Dashboard, Chapters, Missed Questions, My Progress, Grades, Assessments, Compliance, Messages, Profile, and Beta Agreement.

Gap:
- There is no dedicated Student Attendance & Hours route or navigation item.

## Data-access readiness

Status: GREEN.

Production RLS currently allows students to select their own records:
- `attendance_records`: `user_id = auth.uid()`
- `hour_logs`: `user_id = auth.uid()`

That means Segment E can build a student portal without weakening row-level security or exposing other students' records.

## Exact E1 answer

| Student need | Current state | Where |
| --- | --- | --- |
| Approved hours | PARTIAL | Compliance shows approved completed hours vs required hours |
| Pending hours | NOT SHOWN | No student-facing surface |
| Remaining hours | PARTIAL | Compliance remaining-items text; not a dedicated metric |
| Attendance percentage | SHOWN | Dashboard and My Progress |
| Today's attendance status | COMPUTED, NOT SHOWN | Dashboard code only |
| Attendance status breakdown | NOT SHOWN | No student-facing surface |
| Attendance history | NOT SHOWN | Instructor/student detail has history, student does not |
| Hour history | NOT SHOWN | Staff Hours view only |
| Rejected hour reason | NOT SHOWN | Staff reviewed history only |
| Attendance-generated/manual source | NOT SHOWN | Staff Hours view only |
| Weekly/monthly/overall hours | NOT SHOWN | School-admin Student Hours view only |
| Dedicated Attendance & Hours portal | DOES NOT EXIST | No student route/nav item |

## E1 conclusion

The backend and RLS foundation are ready, but the student experience is fragmented.

Students currently get:
- attendance percentage;
- approved completed-hours progress indirectly through Compliance;
- remaining hours only as compliance text.

Students do not yet get the operational view needed for a school-hours workflow:
- approved vs pending hours;
- clear remaining hours;
- today/current attendance status;
- attendance history;
- hour history;
- weekly/monthly/overall totals;
- rejection/correction context.

## Recommended E2 scope

Build a dedicated student-only `/dashboard/hours` page and nav item with a small first slice:

1. Approved hours
2. Pending hours
3. Remaining hours
4. Required hours
5. Current/today attendance status

Keep it read-only. Use the existing own-record RLS and approved-only official-total rules. Do not add history yet; history should be the next small segment after the summary is certified.
