# C18-9 — Final End-to-End Certification

C18-9 is the adversarial final certification layer for Chapter 18 — Haircoloring and Lightening.

## Certified chain under audit

- one durable lesson runtime shell with ten canonical lesson mappings
- 50 source-hardened flashcards
- 15 source-hardened assessment questions
- 14 immutable micro-check questions, exactly two per canonical concept family
- combined-evidence gap detection
- four-category haircolor/lightener safety classification
- targeted remediation
- 35 fresh reassessment questions, exactly five per canonical concept family
- 80% ordinary recovery and 100% urgent safety recovery
- preserved initial misses and append-only reassessment evidence
- authorized instructor / school-admin diagnostics
- shared live 20/10/40/15/15 grading contract

## Final invariants

C18-9 must prove all of the following without weakening prior certified behavior:

1. The seven canonical concept families remain stable.
2. Every concept has lesson, flashcard, assessment, micro-check, remediation, and reassessment coverage.
3. Assessment, micro-check, and reassessment namespaces remain separate.
4. Reassessment never erases or rewrites original diagnostic evidence.
5. Ordinary remediation requires a five-question reassessment with 80% passing.
6. Urgent multi-hazard safety recovery requires 5/5 = 100%.
7. Instructor and school-admin diagnostics stay behind the existing role and same-school authorization boundary.
8. Diagnostic UI does not expose raw answer payloads, student IDs, question IDs, item IDs, or remediation-cycle IDs.
9. Shared grading weights remain 20/10/40/15/15.

## Scenario/application evidence constraint

Chapter 18 currently has no genuine durable scenario/application inventory in the certified runtime.

C18-9 therefore requires:

- the 15% scenario/application weight to remain unchanged;
- scenario/application evidence to remain absent rather than fabricated;
- the shared live grade to remain explicitly provisional until a real durable Chapter 18 scenario source exists.

This is a deliberate integrity requirement, not a waiver of the shared grading architecture.

## Certification gate

C18-9 is GREEN only when the exact final head passes:

- Engineering Verification;
- all test/build jobs within that workflow;
- Vercel preview/deployment status.

No merge is authorized by this certification.
