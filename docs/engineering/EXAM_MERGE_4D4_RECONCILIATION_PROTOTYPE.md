# Exam Ready 4D-4 — development-only reconciliation prototype

The pure reconciliation function requires a caller-attested complete, consistent registry snapshot. It computes missing rows, exact-match reused rows, and fails closed on changed content. This is **not** an implementation of fetching all paginated database rows; no production connection is present.

The SQL test is an isolated, synthetic single-question idempotency proof with BEGIN/ROLLBACK. It is not the full 573-row transactional import executor. Before any real import, implement and independently certify a single transaction that locks the configuration, reconciles the full source manifest and existing registry, inserts missing questions without overwriting changed content, links exactly 573 questions to a draft config, checks quotas, and rolls back on any mismatch. Test retries, races, partial failures and tenant noninterference in disposable Supabase.

No production import, activation, migration, merge, or deployment is authorized.
