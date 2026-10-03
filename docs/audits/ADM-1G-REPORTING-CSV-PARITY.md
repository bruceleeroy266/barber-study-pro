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
