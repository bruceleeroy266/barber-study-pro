# TLS-1C — Read-Only Live Evidence Integration

TLS-1C is the first integration phase after the certified TLS-1B core runtime.

## Authorization boundary

TLS-1C may:
- read already-certified chapter diagnostic outputs
- translate those outputs into the certified TLS public request contract
- call the certified TLS public evaluator
- expose the resulting stable public snapshot to later integration slices

TLS-1C may not:
- modify anything under the certified TLS-1B core runtime to make integration easier
- recalculate chapter grades
- infer safety or compliance from raw answer payloads
- rewrite Chapter 1-21 content, grading, detection, remediation, or reassessment logic
- write to Supabase
- create new persistence tables
- change RLS
- render or alter student/instructor UI during the read-only integration slices
- expose raw answers, question IDs, item IDs, or internal TLS resolver state

## TLS-1C.1 — Diagnostic Bridge Contract

The first authorized integration slice is read-only.

It provides an integration-owned adapter outside the certified TLS core that accepts:
- authoritative chapter performance percentage
- existing confidence
- existing concept diagnostic summaries
- existing remediation-cycle state
- already-resolved safety/compliance state
- optional fresh independent post-recovery evidence

It then consumes only the certified TLS public boundary and returns the versioned public TLS snapshot.

A GREEN TLS-1C.1 means ASCYN PRO has a safe seam between existing chapter diagnostics and TLS without yet changing any live UI or persistence behavior.

## TLS-1C.2 — Certified Diagnostic Summary Mapper

TLS-1C.2 connects the common certified instructor-diagnostic summary shape to the TLS-1C.1 bridge.

It keeps `chapterGrade.finalGrade` as the only authoritative score and passes only already-certified concept, remediation, and safety/compliance state into TLS. It does not parse textual status strings into control logic or expose chapter grading components.

A GREEN TLS-1C.2 means certified chapter diagnostic summaries can be evaluated by TLS without adding a second scoring system or touching the certified chapter runtimes.

## TLS-1C.3 — Audience Snapshot Bundle

TLS-1C.3 evaluates one certified diagnostic summary into both supported public audiences through the TLS-1C.2 mapper.

The student and instructor snapshots must:
- use the same authoritative score
- resolve to the same status
- resolve to the same recommended action
- preserve the student low-detail boundary
- keep instructor-only focus detail out of the student snapshot

A GREEN TLS-1C.3 means later consumers can receive synchronized student/instructor TLS snapshots from one certified diagnostic source without UI wiring, persistence, or TLS-core changes.
