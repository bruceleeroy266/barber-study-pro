# TLS-1C.3 — Audience Snapshot Bundle

TLS-1C.3 adds an integration-owned, read-only audience bundle on top of the certified TLS-1C.2 diagnostic mapper.

## Purpose

A single certified chapter diagnostic summary is evaluated into both supported public audiences:

- student
- instructor

Both snapshots must come from the same authoritative chapter score and the same already-certified diagnostic evidence.

## Invariants

- `chapterGrade.finalGrade` remains the only authoritative TLS score.
- student and instructor snapshots must report the same score, status, and recommended action for the same evidence.
- the student snapshot remains low-detail.
- instructor-only focus detail may not leak into the student snapshot.
- raw answers, question IDs, item IDs, concept evidence counters, and remediation internals are not exposed.
- safety/compliance state is accepted only when already resolved upstream.
- no chapter grades are recalculated.
- no database access or writes.
- no Supabase schema or RLS changes.
- no Chapter 1-21 changes.
- no UI wiring.
- no files under `src/lib/tls` are modified.

TLS-1C.3 remains inside the read-only integration phase and prepares a stable consumer-facing seam for a later authorized UI integration slice.
