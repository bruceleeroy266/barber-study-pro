# Exam Ready Stage 4D-3 — isolated draft preparation

Status: development-only; no production database execution or question import authorized.

The pure preflight in `4d3-import-preflight.ts` accepts a **complete** registry snapshot and rejects any overlapping source ID, malformed row, incorrect version, insufficient domain inventory, or incomplete source bank. The caller must separately prove the snapshot is complete; this module does not query Supabase.

The disposable SQL test creates a synthetic draft configuration and four domain rows in a transaction, checks draft-only state, rejects duplicate domain and configuration inserts, and rolls back the entire transaction. It does **not** import the 573 actual questions. Full real-bank import, idempotent executor, production migration, activation, merging, and deployment remain separately gated.

CI workflow currently triggers only for pull requests targeting main. PR #399 is temporarily retargeted to main solely for exact-head CI and must be restored to the stacked 4D-2 base afterward; never merge either draft PR without authorization.
