# Gate 6 Heavy Audit — Automated Pilot Measurement

## Scope
Post-close adversarial review of PO-1E.1 through PO-1E.6 against production main, live Supabase policy state, report semantics, cohort membership, role scope, cutoff integrity, and deployment state.

## Findings repaired

### H1 — Instructor official checkpoint scope
Already repaired in PO-1E.6. Instructors no longer read school-wide finalized checkpoint snapshots; official checkpoint RLS is school-admin/platform-admin only.

### H2 — Disabled learner aggregate contamination
The canonical resolver excluded `include_in_school_metrics=false` learners but still included disabled learner accounts in aggregate counts and metrics. The locked contract requires disabled accounts to stay out where active-account participation matters.

Repair:
- disabled learners remain individually visible;
- `includedInAggregate=false` for disabled learners;
- their study/exam/readiness evidence cannot affect aggregate pilot metrics;
- regression coverage added.

### H3 — Pilot timezone ignored by checkpoint windows
The pilot period stores an IANA timezone, but runtime checkpoint windows were built using UTC midnight/end-of-day. This could truncate a local checkpoint day by multiple hours and advance live checkpoint phase too early.

Repair:
- pilot start window begins at local midnight converted to UTC;
- checkpoint cutoff ends at the next local midnight minus 1 ms;
- DST is handled through `Intl.DateTimeFormat` timezone conversion;
- instructor live phase uses the pilot's local calendar date;
- school/admin live view and completed-pilot cutoff use the stored timezone;
- platform-admin preview/finalization uses the stored timezone;
- DST/local-boundary regression tests added.

## Live production observations
At audit time the production PO-1E persistence tables contained zero pilot periods and zero checkpoints. This means database structure/security can be verified live, but no real finalized pilot checkpoint exists yet to compare against a production cohort.

## Closure rule
The heavy audit is GREEN only after the exact repair head passes TypeScript, changed-file lint, unit/regression tests, production build, Pilot Onboarding Certification, Vercel preview READY, merge, and production READY verification.
