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
