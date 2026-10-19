# Exam Ready isolated integration test — gated runbook

Status: PREPARED; NOT EXECUTED end-to-end.
Scope: ASCYN PRO development branch only. Never activate production exam config or import/modify the frozen 573-question bank.

## Verified baseline (2026-10-18)
- Main ASCYN PRO Supabase project `hgyznydxepjsvbjsirpv`: comprehensive exam configs, questions and attempts tables exist. One config, zero active.
- Independent project `oyeedazfwqnrdagejgzl` (exam-ready) has a different schema and is NOT an appropriate replacement.
- Temporary Supabase QA branch `xnqkzoxnevqogbijdbib` was created, found to lack all three tables via `to_regclass`, and deleted. We did not capture branch migration history before deletion; exact reason the migrations did not apply is NOT established.
- Repository includes seven ordered PO-1C migrations:
  1. `20261002122100_po1c1_comprehensive_exam_database_foundation.sql`
  2. `20261002143000_po1c2_comprehensive_exam_config_seed.sql`
  3. `20261002143100_po1c2_scientific_concepts_inventory.sql`
  4. `20261002143200_po1c2_implements_equipment_inventory.sql`
  5. `20261002143300_po1c2_hair_care_inventory.sql`
  6. `20261002143400_po1c2_facial_hair_skin_inventory.sql`
  7. `20261002160000_po1c3_comprehensive_exam_runtime.sql`
- Applied production migration versions differ from source filename timestamps (e.g. PO-1C1 `20261002140406`, runtime `20261002164201`). Do NOT assume repository filename version is identical to production migration history.

## Preflight before paying for another branch
1. Verify Supabase GitHub integration/branch migration source and deployment target; the branch schema is not automatically certified just because branch status is FUNCTIONS_DEPLOYED.
2. Reconcile the migration baseline and ordering with production's applied versions, reconcile divergent timestamped migration names, and check full dependency chain including auth/profiles/study sessions.
3. Check the complete migration application report and errors before interpreting the schema. Do not manually mark migrations applied or run production DDL.
4. Verify a repeatable, clean local or disposable database migration replay first if available, with zero failures and expected counts. Existing CI build success does not establish database replay success.
5. Obtain separate cost authorization for any further billable branch; preplan immediate deletion and verify it disappears from list_branches.

## Strict test steps on a NEW authorized disposable branch
1. Record branch project_ref and migration history/status immediately. Stop if any baseline migration failed.
2. Run read-only SQL probes:
   - `select to_regclass('public.comprehensive_exam_configs'), to_regclass('public.comprehensive_exam_questions'), to_regclass('public.comprehensive_exam_attempts'), to_regclass('public.comprehensive_exam_attempt_items');`
   - Inspect status/counts, RLS, RPC functions and permissions. No production project ID should appear in mutation calls.
3. Seed ONLY newly authored synthetic QA question data and approved disposable test accounts, and only after schema validation. Do not copy publisher materials or any production student records. Transactionally isolate and clean up.
4. Configure a disposable, synthetic, usable 110-item dataset conforming to the simulator's 100-scored/10-unscored and per-domain 35/10/40/15 quotas. Do not assume a 1-item fixture satisfies production runtime constraints.
5. Authenticate the QA student (not service-role impersonation) and call `/api/comprehensive-exam/config`, start/resume, GET attempt, save synthetic answer, history, and submit as appropriate against a development application wired ONLY to the disposable branch. Never accidentally hit `ascynpro.com` production.
6. Verify populated response JSON: allowlisted keys; no `sourceBasis`, `sourceProvenance`, correct_option_snapshot, internal audit labels, publisher markers. Confirm expected synthetic prompt and answer options, ownership enforcement and student-only access. Review textual originality separately: a keyword scan alone is insufficient.
7. Capture sanitized request/response schemas, counts and pass/fail checks (redact tokens, student identifiers and secret keys). Assert cross-user unauthorized attempts cannot read or mutate another attempt.
8. Delete disposable branch in all outcomes, then confirm absence from list_branches and record any final cost.

## Stop conditions
- Missing tables or migration failures; mixed production/development URLs; unverified test-account roles; any publisher-content originality uncertainty; insufficient test inventory; unapproved compute charges.
- Do not merge PR #426, approve publisher content, or unfreeze the 573-question bank based solely on this runbook or static tests.
