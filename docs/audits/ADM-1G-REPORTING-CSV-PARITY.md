# ADM-1G — Reporting + CSV Parity Audit

## Scope
Audit report generation and export behavior across school/admin, compliance, attendance, grade, and hours surfaces.

## Findings

1. **School and compliance CSV exports duplicated ad-hoc serialization**
   - Both report centers only quoted comma-containing cells.
   - Embedded quotes, CR/LF, and Excel-friendly line endings were not handled consistently.
   - They now use the shared CSV serializer in `src/lib/export-utils.ts`.

2. **Attendance export ignored the visible filters**
   - The attendance screen displayed `filteredRecords`, but `useAttendanceExport` received the complete `records` collection.
   - Exported CSV/PDF could therefore contain records not visible in the filtered report.
   - The export hook now receives `filteredRecords`.

3. **Report summaries could contradict report rows**
   - Attendance/readiness/grade/assessment rows already displayed explicit no-data states.
   - Their report summaries still rendered numerical zero when there was no evidence.
   - Summaries now use `No Data`, `No Grade`, or `No Assessments` consistently.

4. **Hours PDF approval timestamp could use the viewer device timezone**
   - The report otherwise uses the school's configured timezone.
   - `Approved At` now renders in that same school timezone.

5. **CSV line-ending/escaping parity**
   - Shared serialization now escapes quotes, commas, CR, and LF.
   - Shared dynamic report CSV output uses CRLF rows.
   - School/compliance report downloads include a UTF-8 BOM for spreadsheet compatibility.

## Existing behavior intentionally retained
- Raw record-level gradebook/assessment/hour export column helpers remain record exports; they do not invent aggregate values.
- State-board hours PDF continues to count only canonical approved/effective hours in official totals.
- Compliance reports retain requirement-fulfillment semantics; zero can be meaningful there even when a general dashboard would show no-data presentation.

## Certification boundary
ADM-1G can close only after the exact PR head passes Engineering Verification and Vercel. No historical trend reconstruction is included; that remains ADM-1I.


## Deeper audit findings and repairs
- School hours report rows previously rounded approved and remaining minutes to whole hours. A valid 7h 30m total could be exported as 8 hours. Hours reports now preserve exact hour/minute values from canonical approved/effective minutes.
- School summary report previously reintroduced numeric 0 for attendance, readiness, and grade even when the specialized reports correctly said No Data / No Grade. School summary now preserves the same evidence-aware semantics.
- Student printable grade report labeled its sections “Recent Grades” and “Recent Assessments” but sliced unsorted input. Both sections now sort newest-first before limiting to ten rows.
- The first ADM-1G certification attempt exposed a TypeScript formatter variance error in the shared export utility. Formatters were hardened to accept unknown input and validate types internally rather than weakening the export-column contract.

## Deeper audit boundary
- The generic UI ExportButton contains a dormant placeholder PDF action but has no production consumer; active attendance PDF export is implemented separately and remains in scope/certified.
- Legacy export-column constants are currently not wired into production aggregate reporting; ADM-1G does not expand them into new features.
- Historical trend reconstruction remains ADM-1I.
