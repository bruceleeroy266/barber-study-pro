# C15-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration

C15-8 exposes Chapter 15 learning diagnostics to authorized school staff through the existing instructor student-detail route.

## Authorization and privacy

The page remains server-side protected:

- the current user must have instructor-portal authorization
- the requested learner must belong to the same school as the authorized viewer
- only student/apprentice roles are eligible
- unauthorized viewers are redirected or receive no student record
- the Chapter 15 panel does not render raw answer payloads, question IDs, or internal student IDs

School administrators use the same authorized student-detail route and therefore see the same academic calculations as instructors without a separate weaker access path.

## Visible Chapter 15 signals

Authorized staff can now see:

- live Chapter 15 grade
- overall mastery and confidence
- completion percentage kept separate from grade
- micro-check percentage
- chapter-assessment percentage
- strongest concepts
- weakest concepts
- per-concept mastery
- preserved initial misses
- reassessment-correct count
- latest evidence date
- current safety/scope intervention
- targeted-remediation status
- latest reassessment result or in-progress state

## Evidence model

Diagnostics combine:

- immutable Chapter 15 micro-check evidence
- initial 72-question assessment evidence
- fresh `r15-*` reassessment evidence

The live grade additionally consumes the registered Chapter 15 flashcard and scenario/application evidence inventories, retaining the shared 20/10/40/15/15 grade contract.

Recovery does not erase the original diagnostic history: initial misses stay visible after successful reassessment.

## Certified inventories

C15-8 does not modify:

- 54 lesson sections
- 90 flashcards
- 72 assessment questions
- 14 micro-check questions
- 35 reassessment questions
- seven canonical concept families

## Certification gate

C15-8 is GREEN only after authorization/privacy tests, diagnostic recovery tests, live grade tests, full Engineering Verification, and the exact-head Vercel preview all pass.
