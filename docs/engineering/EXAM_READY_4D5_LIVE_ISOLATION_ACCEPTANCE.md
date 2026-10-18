# Exam Ready 4D-5 — executable acceptance boundary

Scope: disposable local Supabase only. The draft PR must not be merged on the strength of tests that were not executed.

## Export surface verified from source

`src/components/school-owner/ReportingCenter.tsx` creates a **browser Blob URL** with `convertRowsToCSV(report.rows)` and downloads `<type>-report.csv`. This is not an HTTP CSV API route. Consequently an `EXAM_ISOLATION_EXPORT_PATH` probe against an invented URL or an HTTP 404 proves nothing. To certify CSV isolation:
1. Login with School A's real browser session on local Next.js.
2. Confirm School B owns a unique, populated fixture marker that would appear in School B's rendered Reporting Center, and that School B's download contains it (positive control).
3. Visit School A's Reporting Center, select a relevant report, click **Export CSV** and use Playwright's `page.waitForEvent('download')`.
4. Read the actual downloaded file and assert zero School B names, IDs and fixture markers, while confirming School A's positive-control marker is present.
5. Fail if no download occurs, report is empty, the markers never appear in B's own export, or fixture provisioning is missing.

The separate `/school/pilot-measurement/report/baseline` and `/admin/school/pilot-measurement/report/baseline` routes generate printable HTML reports, not CSV. Test authenticated browser-cookie sessions and HTML content here, not fabricated CSV endpoints.

## Disposable identity + seed requirements

Run under the same disposable database/process as the CI integration tests. Do not point any test at a hosted production/staging instance.

- Provision two active school rows with distinct UUIDs.
- Provision two **real** Supabase Auth users and school-scoped admin profiles; use password login via the local Supabase Auth API, not mocked claims or a service-role request impersonating the user.
- Seed a valid comprehensive-exam configuration plus School A and B attempt records, satisfying the study-session FK and all status/version/attempt invariants.
- Create an active measurement period and a finalized baseline checkpoint per school, including distinct report metrics/identifiers. Ensure both are readable by their respective school admins, and School B's report shows its unique marker.
- Populate underlying Reporting Center records that produce a nonempty downloadable report for each school.
- Sign in from a browser to establish the real cookie/session flow and test actual query, HTML report, and Blob CSV export. Assert positive B visibility and zero B markers under A.
- Write redacted evidence for each assertion. Do not upload raw bank answers, auth tokens, passwords or student records.

## CI certification conditions

An opt-in test file with environment variables is not CI wiring. Required explicit CI steps are: local Supabase start; isolated fixture creation; start local Next; authenticated query test; browser-cookie HTML test; browser download test; redacted artifact upload; local teardown (always). Every step must be part of the exact PR-head workflow and fail closed. Absence of any step is an **uncertified gate**, never PASS.

The 573-question real-bank digest must separately be pinned to a reviewed source commit, SHA-256 and human reviewer approval. Synthetic fixture digest equality does not grant approval.
