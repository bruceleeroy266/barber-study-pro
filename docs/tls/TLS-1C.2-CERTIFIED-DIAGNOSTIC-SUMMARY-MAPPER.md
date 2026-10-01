# TLS-1C.2 — Certified Diagnostic Summary Mapper

TLS-1C.2 connects the existing common instructor-diagnostic summary shape to the read-only TLS bridge.

Rules:
- `chapterGrade.finalGrade` remains the authoritative score.
- `overallMastery` is not treated as a replacement score.
- component percentages are not exported through TLS.
- concept diagnostics are copied into the integration bridge.
- safety/compliance state must be supplied from already-certified upstream logic.
- remediation state must be supplied explicitly; textual status strings are not parsed into control logic.
- no raw answer payloads are consumed.
- no chapter IDs are required.
- no database access or writes.
- no UI changes.
- no files under `src/lib/tls` are modified.

This remains a read-only integration slice.
