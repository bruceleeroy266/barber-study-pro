# Exam Ready question bank — isolated Phase 1 import

Source: private `bruceleeroy266/exam-ready` repository, `main` branch, retrieved October 17, 2026.

The `upstream/` directory contains the eight active aggregators and their local source/hardening dependencies, copied as source modules. The composed bank is exported by `index.ts` and is **not** connected to student-facing pages, existing ASCYN PRO chapter questions, or database tables.

Expected active count: **573** unique questions, as independently reconciled by Ping in EXAM-MERGE-AUDIT-2A. The previously reported 577 was an option-ID regex counting error.

Certification to run before integration:
- `npx vitest run src/lib/exam-ready-import/index.test.ts`
- `npm run typecheck`
- `npm run build`
- Original Exam Ready master-bank certification/adversarial checks should be adapted and run independently.
- Scan all ASCYN PRO existing question IDs and pass the complete set to `assertExamReadyBankIntegrity(existingIds)`. The collision helper is present, but this cross-namespace scan has **not yet been executed**.
- Independently check Milady citations and hardening override behavior.

No release, merge, migration, RLS change, or production deployment is authorized by this import. Await Ping's EXAM-MERGE-AUDIT-2B.

## Stage 3B certification additions

The source-bank validator now requires exactly four options. CI runs `upstream-certification.test.ts` in addition to the existing import tests. That test executes the byte-preserved upstream master-bank certification and difficulty review audit, plus a separate adapted copy of the factual-key-drift audit (source file paths and local imports adjusted to this repository). Difficulty heuristics remain review-only; blocking master-bank and key-drift findings fail CI.

`upstream/full-bank-adversarial-certification.ts` is preserved but **not executed** yet: it requires `@/lib/exam/simulator`, which is not present in ASCYN PRO. The simulator stage must implement/adapt that dependency, add the 1,000-build/110-100-10/domain-quota/scoring checks to CI, and obtain an independent Ping audit before student-facing release.

The Stage 3B tests and CI execution require independent verification; a committed workflow step alone does not establish that the run passed.
