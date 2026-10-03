# ADM-1E — Attendance & Hours Parity

**Status:** In progress  
**Scope:** Student → Instructor → School/Admin/report parity for attendance and official-hour summaries.

## Canonical contract

| Metric | Canonical evidence / calculation |
| --- | --- |
| Attendance rate | `calculateAttendanceSummary()` over the learner's persisted attendance records |
| Present / Absent / Tardy / Excused | Counts returned by the same attendance summary |
| Approved hours | `calculateOfficialApprovedMinutes()` / `getOfficialMinutes()` from `effective_hour_logs` |
| Pending hours | Sum of raw minutes for `status='pending'`; informational only |
| Required hours | `resolveStudentProgramRequirements()` or the batch resolver, with the same 1200-hour fallback |
| Remaining hours | `max(0, requiredMinutes - approvedMinutes)` |
| Completion percentage | Approved ÷ required, rounded and clamped to 0–100 |
| Rejected hours | Never count toward official, pending, remaining reduction, or completion |
| Adjusted approved hours | Use `effective_minutes`, never stale original minutes |

## First ADM-1E findings and repairs

1. **Instructor detail could exceed 100% completion.** Student Hours and staff/admin management already capped completion at 100%, while instructor detail did not.
2. **Hours math was duplicated across three surfaces.** Student Hours, instructor detail, and staff/admin management now route through `calculateHoursProgressSummary()`.
3. **Student Progress could load demo attendance whenever live attendance was empty.** That could create a false attendance rate in production. Demo attendance is now gated behind `isDemoFallbackEnabled()`.
4. **Instructor detail labeled its attendance summary “Last 11 school days” while calculating over all fetched attendance records.** The label now matches the actual evidence window: “All recorded school days.”
5. **Attendance-rate formula itself was already shared** through `calculateAttendanceSummary()` on student, instructor, and school analytics surfaces.

## Deferred from this slice

- Attendance policy semantics (for example, whether a tardy day should count as present for a specific school/state rule) are not changed here. ADM-1E parity locks every surface to the same current rule without inventing a licensing policy.
- Historical/export formatting can be hardened in the next ADM-1E slice if exact minute-vs-rounded-hour presentation still differs in reports.
