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
- render or alter student/instructor UI in TLS-1C.1
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
