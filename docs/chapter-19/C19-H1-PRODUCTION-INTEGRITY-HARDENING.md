# C19-H1 — Production Integrity Hardening

This hardening pass was opened after a post-certification front-end/back-end audit found runtime trust and wiring gaps that the original C19-0 through C19-9 certification did not exercise deeply enough.

## Repairs

1. **80% completion ceiling removed**
   - Chapter 19 has no scenario/application block.
   - All 14 durable Chapter 19 micro-check questions now satisfy the existing `knowledge_checks_completed` progress signal.
   - Lesson 15% + flashcards 15% + micro-check/knowledge checks 20% + quiz 50% can therefore reach 100% without fabricating scenario evidence.

2. **Micro-check writes are server-authoritative**
   - Browser submissions send only the question ID and selected answer.
   - The authenticated server route resolves the canonical question, concept, LO-bound check, difficulty, and correct answer.
   - The server derives `is_correct` and writes through the service role.
   - Direct authenticated inserts for `chapter_id = 'ch-19'` are denied by RLS.

3. **Chapter 19 flashcard evidence is server-authoritative**
   - The browser sends only the item ID, source, and user study signal.
   - The server resolves the canonical Chapter 19 flashcard→concept mapping.
   - The server derives correctness from the canonical `got_it` / `needs_practice` signal.
   - Chapter 19 still has no scenario/application inventory; that source is rejected rather than invented.
   - Direct authenticated Chapter 19 activity-evidence inserts are denied.

4. **Initial Chapter 19 quiz evidence is immutable to students after insert**
   - Existing student update/delete policies now reject `quiz_id = 'quiz-19'`.
   - Service-role remediation/reassessment workflows remain unaffected.
   - This pass intentionally does not change the existing initial quiz submission UI contract.

5. **Durable timestamps feed instructor mastery recency**
   - Instructor activity reads now include `answered_at`.
   - Chapter 19 mastery uses the persisted evidence timestamp rather than substituting the page-render time.

6. **Production remediation-cycle creation now uses combined evidence**
   - For Chapter 19 only, the server-side detection orchestrator loads persisted assessment attempts, durable micro-check evidence, and durable flashcard evidence.
   - Canonical mappings are resolved in code; persisted concept IDs are not trusted for detection.
   - Combined evidence is fed into the established detection engine before remediation cycles are created.
   - Other chapters retain their existing provider behavior.

## Contracts preserved

- 1 hardened lesson shell
- 60 flashcards
- 15 assessment questions
- 14 micro-check questions
- 35 reassessment questions
- 7 canonical concept families
- 80% ordinary/compliance recovery
- 100% urgent practical-safety recovery
- immutable first-attempt history
- same-school instructor/school-admin authorization
- 20/10/40/15/15 shared grade weights
- no fabricated Chapter 19 scenario/application evidence

C19-H1 does not authorize a merge. Exact-head Engineering Verification and Vercel must pass before the hardening branch can be presented for merge authorization.
