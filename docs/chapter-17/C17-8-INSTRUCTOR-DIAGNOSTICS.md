# C17-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration

C17-8 connects Chapter 17’s certified evidence chain to the protected instructor/student detail route.

## Authorization boundary

The existing protected route remains fail-closed:

- viewer must satisfy the centralized instructor/admin authorization helper;
- student lookup is restricted to the viewer’s `school_id`;
- the target profile must be a student or apprentice;
- ordinary students cannot access the instructor route.

C17-8 does not weaken or duplicate this authorization model.

## Evidence sources

Chapter 17 instructor diagnostics now consume:

- immutable Chapter 17 micro-check first attempts;
- the initial `quiz-17` assessment evidence;
- durable flashcard evidence;
- durable scenario/application evidence;
- formal `r17-*` reassessment evidence.

This means the same durable activity evidence used by the shared grading system also participates in concept-level diagnostic visibility.

## Staff-visible diagnostics

Authorized same-school instructors and school administrators can now see:

- live Chapter 17 academic grade;
- overall concept mastery;
- mastery confidence;
- completion shown separately from grade;
- micro-check percentage;
- chapter-assessment percentage;
- remediation status;
- latest reassessment and recovery result;
- strongest concepts;
- weakest concepts;
- concept-level observation count;
- preserved initial misses;
- reassessment-correct count;
- latest evidence timestamp;
- chemical-safety intervention state;
- urgent five-question / 100% safety-recovery requirement when active.

## Chemical-safety visibility

The C17-6 four-hazard safety model remains authoritative:

1. chemical incompatibility;
2. scalp compromise / burning;
3. overprocessing control;
4. unsafe service sequencing.

A current safety-sensitive miss can require instructor review. Multi-hazard urgent escalation is displayed directly to staff with its formal reassessment requirement.

## Privacy boundary

The Chapter 17 panel renders summary diagnostics only.

It does not render:

- `answers_json`;
- `question_id`;
- `item_id`;
- internal `studentId`;
- raw answer selections.

Raw records may be processed server-side to calculate the summary, but they are not exposed in the rendered diagnostic panel.

## Shared grading

The live instructor grade remains the shared Chapter 17 contract:

- micro-check 20%;
- flashcard 10%;
- chapter assessment 40%;
- scenario/application 15%;
- remediation/reassessment 15%.

No Chapter 17-specific grade formula is introduced.

## Certification gate

C17-8 is GREEN only when:

1. preserved initial misses remain visible after successful reassessment;
2. durable scenario and flashcard evidence participates in concept diagnostics;
3. urgent chemical-safety state reaches staff visibility;
4. the live 20/10/40/15/15 grade is produced from durable evidence;
5. instructor/school-admin authorization and same-school lookup are proven;
6. the rendered Chapter 17 panel contains no raw answer payloads or internal IDs;
7. exact-head Engineering Verification passes;
8. matching exact-head Vercel succeeds.
