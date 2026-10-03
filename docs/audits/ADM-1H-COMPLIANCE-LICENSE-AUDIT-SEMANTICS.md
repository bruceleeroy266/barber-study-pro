# ADM-1H — Compliance / License / Audit-Center Semantics Audit

## Scope
Audit the ASCYN PRO compliance surfaces for semantic accuracy: school-configured program requirements, completion counts, readiness/grade evidence, internal audit terminology, and any wording that could be mistaken for an official licensing or state-board determination.

## Findings and repairs

1. **Unsupported licensing / board-eligibility claims**
   - The product labeled internal ASCYN calculations as “Board Eligibility,” “Eligible for Board,” “License Requirements,” and “All state board requirements met.”
   - ASCYN PRO does not independently verify every jurisdiction's licensing rules in these calculations.
   - User-facing language now says **Tracked Requirements**, **Program Requirement Tracking**, or **Requirements Check**, with an explicit notice that the result is internal and does not determine licensing/state-board eligibility.

2. **Invented assessment/practical defaults**
   - When a program did not configure assessment/practical counts, the compliance fallback invented 5 required assessments and 10 required practicals.
   - Default assessment/practical completion counts are now 0 (not applicable) unless a school-configured program supplies values.
   - Program-specific values still flow from the resolved program record.

3. **Zero-requirement math**
   - Graduation-readiness math could evaluate 0/0 for assessment/practical requirements and produce NaN.
   - Zero-count requirements now resolve to a completed/not-applicable ratio and never divide by zero.
   - Compliance widgets also avoid dividing by zero in progress bars.

4. **Completion count vs pass-rate semantics**
   - “Completed assessments” previously meant only passed assessments.
   - Completion now means recorded assessment events; pass rate remains a separate metric.
   - Required assessment/practical counts must be met in addition to any configured pass-rate threshold.
   - A single passing assessment can no longer satisfy a configured multi-assessment requirement.

5. **Evidence-aware readiness and grade semantics**
   - Compliance now reuses the canonical student-learning metrics and grade-performance logic from ADM-1D/ADM-1F.
   - No readiness evidence no longer creates a low-readiness alert.
   - A real graded 0% remains grade evidence and can trigger a low-grade alert.
   - Reports distinguish No Attendance Data, No Data, No Grade, No Assessments, and Not Required from measured zero values.

6. **Instructor compliance dashboard parity**
   - Instructor requirement tracking now resolves required hours, assessments, and practicals per student rather than hours alone.
   - Missing-assessment/practical cards use completion counts rather than pass-rate proxies.
   - No-evidence readiness is excluded from low-readiness counts.
   - The default hours fallback is the canonical 1200-hour baseline, not a separate 1500-hour fallback.

## Boundary
- This work does not certify state-law accuracy or create jurisdiction-specific licensing logic.
- It makes ASCYN PRO accurately describe what it actually knows: school-configured program requirements plus internal ASCYN academic/readiness thresholds.
- Permission/RLS and cross-school isolation remain ADM-1J.
- Historical analytics remain ADM-1I.

## Certification
ADM-1H can close only when the exact PR head passes Engineering Verification and Vercel on the unchanged head, followed by exact-main production verification after merge.
