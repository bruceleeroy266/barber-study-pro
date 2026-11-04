# Stage 4D-5 — Real-bank import integration review and authorization gate

**State:** review-only, no actual real-bank import authorized. This is a proposal, not a production runbook approval.

## Source and integrity

Use the private server-only 573-question registry adapter and `prepareImportReviewManifest()` to derive a deterministic SHA-256 digest of sorted canonical source rows, IDs, and expected domain counts 274/56/173/70. Digest is a review artifact, not a cryptographic signature or a database snapshot. Do not put raw question content, answer keys, or the import payload in browser bundles, logs, pull-request comments, or publicly accessible artifacts.

## Security review gates

1. Run only as a narrowly privileged trusted backend/operator, not as a student or browser RPC. Explicitly verify no grants to anon/authenticated, no question answer-key leakage, and no student-facing route imports.
2. Obtain a complete, consistent registry snapshot using database transaction isolation, not paginated reads across different snapshots. Fail closed on duplicates, missing pages, content/version mismatch, or conflicting source IDs.
3. Keep school/tenant authorization boundaries intact. Importing the global private question registry must not create student attempts, sessions, grades, attendance hours, or tenant-visible answers.
4. Lock the draft configuration and coordinate concurrent import attempts. Verify config slug/version/blueprint/bank/scoring policy, 100/10 quotas, and 90-minute/70% **product defaults**; do not represent those defaults as official licensing standards.
5. Stage all 573 rows inside one database transaction; validate exact row fields, source IDs, provenance, content version and domain counts. Use insert-only conflict handling followed by full equality verification; never silently overwrite existing content.
6. Link exactly 573 distinct questions to the draft config with eligibility flags. Check four domain records and exact link identity. Refuse active or retired configuration, any unexpected existing links, or any other mismatch.
7. Test repeat import, interrupted/partial import, content collision, simultaneous attempts, rollback, and cross-school read/write isolation in disposable Supabase before any environment change.
8. Record operator, approved environment, commit SHA, manifest digest, config ID, row/link counts, timestamp, and outcome in a restricted audit record without question text or answer keys. Do not log credentials.

## Separate authorization sequence

**A. Development/disposable testing (current authorization):** generate offline review manifest and run synthetic disposable tests only. No real-bank rows inserted anywhere.

**B. Real-bank disposable import (NOT authorized):** require explicit permission identifying that the real 573-question bank may be inserted into an isolated disposable database. Only then test the actual content against the final executor and compare exact manifest digest, counts, links, and rollback.

**C. Staging or production import (NOT authorized):** require a second explicit authorization identifying the target environment, approved exact commit, verified backups/recovery, reviewed least-privilege operator, and approved maintenance window. Import must leave configuration draft.

**D. Activation (NOT authorized):** separate authorization and independent readiness review; never couple import to activation, merge, or deployment.

## Known gaps / blockers

The Stage 4D-4 executor is currently a temporary SQL function in a disposable test file with synthetic content, not a production-grade operational command. The complete-registry snapshot attestation in the TypeScript reconciliation module is caller-provided, not independently verified. Provenance equality and source manifest digest are not yet enforced in the SQL executor. Concurrency, adversarial permissions, and actual-bank content validation are not fully certified. Therefore Stage 4D-5 cannot authorize an actual import, and a green CI result would certify only the offline review artifacts.
