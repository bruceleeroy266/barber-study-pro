# ADMIN-SUPPORT-ACCESS-5BD — Release scope and migration recovery checklist

**Status: pre-release review artifact, not a deployment authorization or completed restore certification.**
No production or Elevate records may be used for these tests.

## Scope
PR #429 includes Support Mode access authorization, school/instructor actions, communications, academic reports, CI, and migration changes. The breadth of the change set should be reviewed against the current main branch immediately before merge; avoid attributing unrelated main-branch drift to this PR. If the final diff contains unneeded features, split them into a separate draft PR before approval.

## Migration dependency order
1. `20261019180000_support_access_platform_admin_assignment_read.sql` — assignment SELECT policy.
2. `20261020230000_support_schedule_override_scoped_rpc.sql` — original scoped scheduler RPC.
3. `20261021040000_support_access_session_authorization.sql` — session registry and replacement of scheduler RPC requiring active session.
4. `20261021050000_support_session_active_check.sql` — read-only, actor-bound RPC for general support context.

Run migrations only against a disposable, fixture-populated local Supabase database during rehearsals. CI's `supabase start` path exercises forward local migrations and RLS/browser checks but does **not** establish backup-and-restore or destructive rollback certification.

## Mandatory disposable recovery rehearsal
1. Verify all environment URLs and IDs point to a disposable project; block any environment matching production.
2. Seed fixture Schools A/B, instructor and student accounts, appointments, hours, grades, and academic data.
3. Make a database backup/snapshot using an operator-approved mechanism; record time, engine version, schema migration state, and checksum.
4. Apply all four migrations in order; run CI's authenticated School A/B positive and negative cases.
5. Test active, revoked, expired, cross-target, and non-admin sessions; verify true-actor audit attribution.
6. Simulate application rollback separately; confirm compatibility. Reverting application code alone does not reverse database schema or SECURITY DEFINER function changes.
7. Restore disposable DB from backup into a **new disposable target**; verify a representative row-count/hash manifest, role privileges, RLS, policies, functions, and student records.
8. Rehearse compensating forward migration only if a specific rollback is approved; never delete student records or blindly drop migrated tables.
9. Record commands, exact git SHA, CLI/runtime versions, screenshots/logs, restore duration, data-integrity results, reviewer, and outcomes.

## Production gates — all required
- Updated exact-head CI success, plus independent security review signed against the exact commit.
- Reviewed diff scope, migration order, and staging backup/restore evidence.
- Verified no cross-school privilege escalation in service-role codepaths; privileged audit failure policy decided.
- Written production backup/monitoring plan and designated rollback owner.
- Explicit release approval from project owner.
- Then, and only then, controlled merge/deployment and post-deploy smoke tests.

**Do not merge or deploy based solely on this checklist.**
