# QUIZ-MICRO-ANALYTICS-2 — academic-v1 contract (draft)

## Non-negotiable semantics
1. **Measured assessment accuracy** = correct / answered x 100, from persisted question responses. Missing observations are null, not zero and never chapter completion percentage. The denominator must be displayed alongside the percentage.
2. **Passing** compares unrounded correct/answered with the configured quiz threshold. **Completion** is an independent curriculum requirement. Passing never implies 100% accuracy.
3. **Concept accuracy** includes only records whose immutable question ID has an approved learning-concept mapping; report counts and distinguish limited evidence (< 3 observations by default). Do not call one incorrect response a diagnosed persistent weakness.
4. **Latest, best and original attempts** are separate. An instructor view and student view must select the *same* attempt and evidence scope before calling the pure contract; the contract does not choose an attempt.
5. **Micro-checks** use persisted unique first-attempt evidence where chapter policy requires it; repeated views and login cannot add scored items. A recovery check is new tagged evidence, not an overwrite of first attempts.
6. **Overall combined accuracy** is pooled correct/answered across the two sources; it is **not** the existing weighted chapter grade. The existing shared grade (micro 20%, flashcard 10%, assessment 40%, scenario 15%, recovery 15%) remains unchanged until approved after a separately documented grading-policy review.
7. Results carry `academic-v1` to support future changes without silent historical reinterpretation.

## Integration gates (NOT COMPLETED)
- Map each production chapter quiz item and persisted micro-check ID to an approved concept ID and version; reject unmapped evidence rather than assigning invented concepts.
- Select latest initial quiz attempt deterministically and persist immutable answer-level source evidence. Never merge answers across quiz retakes.
- Audit the legacy `calculateChapterPerformance` fallback of `bestScore || progress_percentage` and remove score substitution in a separate controlled integration change.
- Connect student, instructor, school-admin and reporting exports to the same scoped canonical selector and scoring contract, including clear labels for provisional / unassessed.
- Verify micro-check answer rows against database-backed RLS and school membership before serialization. Neither browser input nor the pure scoring function provides authorization.
- Establish chapter applicability and component denominators for the *weighted* academic grade. Distinguish grade from pooled accuracy.
- Run unit suite, typecheck and full authenticated Playwright checks with **two fully disposable schools** and disposable student/instructor identities. Assert school A cannot query school B evidence. Capture report and CSV parity.
- Do not modify, reset, seed, export or delete any live student record. Especially protect Elevate data. **No production merge/deploy permitted until independent academic review and authenticated disposable tests are recorded.**

## Current implementation scope
`src/lib/analytics/academic-contract-v1.ts` is an isolated **pure calculation module**, with unit fixtures in `academic-contract-v1.test.ts`. It has no database calls or production wiring. The new unit tests are authored, not yet reported as executed. Its caller must independently verify evidence provenance, attempt selection and school authorization.
