# EXAM-MERGE-4C — Server-side selection reconciliation plan (design only)

Status: **PROPOSED / NOT AUTHORIZED FOR DATABASE EXECUTION**. No migrations, SQL writes, activation, or deployments in this stage.

## Verified architecture boundary

- Existing runtime: `supabase/migrations/20261002160000_po1c3_comprehensive_exam_runtime.sql`, function `public.start_or_resume_comprehensive_exam(uuid)`.
- Existing SQL chooses 35/10/40/15 scored items by per-domain randomized rank, then chooses **10 unscored items globally** from eligible items excluding scored picks. This does **not** guarantee 4/1/4/1 experimental quotas.
- Offline reference policy: `src/lib/exam-ready-import/draft-exam-plan.ts`, with 35/10/40/15 scored and 4/1/4/1 experimental, 110 unique items total.
- Existing runtime stores immutable attempt-item snapshots (prompt, shuffled options, correct-option snapshot, explanation) and config metadata snapshots. Preserve those semantics.

## Proposed later SQL reconciliation (requires separate approval)

1. Create a **new** versioned draft config (new slug/version or otherwise collision-safe version), never mutate an existing active config or its linked question set.
2. Import 573 rows to the private question registry only through a separately authorized, idempotent, transactionally validated executor. Check live `source_question_id` collisions and content-version parity before writing.
3. Link eligible questions to the new draft config via `comprehensive_exam_config_questions`; all imported rows may be scored/unscored eligible, but scored and unscored selections within each attempt must be disjoint.
4. In a **separate reviewed migration**, retain the existing scored selection, and replace the single global unscored `ORDER BY gen_random_uuid() LIMIT 10` with per-domain randomized ranks and caps:
   - scientific_concepts: 4
   - implements_equipment: 1
   - hair_care_services: 4
   - facial_hair_skin_care_services: 1
   - Exclude scored selections **before** ranking experimental candidates; use disjoint question IDs.
5. Keep the server's randomized option permutation and correct-key remapping intact. Continue rejecting an attempt transaction if any count, quota, or unique-ID invariant fails. Preserve 100 scored / 10 unscored, expiration, idempotent submit, student-only access, school scoping, and answer-key confidentiality.
6. Validate availability **after scored picks**: each domain must have enough remaining unscored-eligible items. Avoid an unsafe assumption that aggregate 573 inventory alone guarantees sufficient eligible candidates after per-config restrictions.
7. Explicitly confirm the approved time limit and passing threshold; 5,400 seconds and 70% in the offline draft are **proposals**, not licensing-authority claims.
8. Activate the new config **only after** isolated QA, migration review, 1,000 randomized SQL-equivalent attempts, negative tests, existing-attempt regression, and separate production authorization.

## SQL shape (pseudocode only; DO NOT EXECUTE)

```sql
-- Within the existing transaction after the scored CTE:
unscored_ranked AS (
  SELECT q.*, row_number() OVER (
    PARTITION BY q.domain ORDER BY gen_random_uuid()
  ) AS experimental_rank
  FROM comprehensive_exam_config_questions cq
  JOIN comprehensive_exam_questions q ON q.id = cq.question_id
  WHERE cq.config_id = v_config.id
    AND cq.is_active AND cq.unscored_eligible AND q.status = 'active'
    AND NOT EXISTS (SELECT 1 FROM scored s WHERE s.id = q.id)
),
unscored AS (
  SELECT u.*, false AS is_scored
  FROM unscored_ranked u
  WHERE (domain = 'scientific_concepts' AND experimental_rank <= 4)
     OR (domain = 'implements_equipment' AND experimental_rank <= 1)
     OR (domain = 'hair_care_services' AND experimental_rank <= 4)
     OR (domain = 'facial_hair_skin_care_services' AND experimental_rank <= 1)
)
```

**Implementation note:** The actual migration must preserve `UNION ALL` column shape and types (e.g., align scored `domain_rank` and unscored ranking fields). The snippet above is illustrative, not ready-to-run SQL.

## Required proof before any activation

- Typecheck, build, and offline 1,000-exam tests pass at exact head.
- Database migration tests verify 35/10/40/15 scored, 4/1/4/1 unscored, 110 unique IDs, answer-key permutation, and fail-closed rollback.
- Test against existing active/expired/completed attempts, including snapshots, timer, score, history, tenant isolation, and zero changes to grades/attendance.
- Restore and run the deferred upstream `full-bank-adversarial-certification.ts` only when `@/lib/exam/simulator` is implemented; remove the temporary tsconfig exclusion then.
- Require separate approvals for the import executor, SQL migration, and production activation.
