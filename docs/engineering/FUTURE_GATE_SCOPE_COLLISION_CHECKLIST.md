# ASCYN PRO Future Gate Scope Collision Checklist

**Required for:** Every new Gate and every major feature slice before implementation.

This checklist enforces `ASCYN_PRODUCT_BOUNDARY_CONTRACT.md`.

## Required preflight

- [ ] User problem is stated in one sentence.
- [ ] Primary value is identified as instructional, operational, or institutional administration.
- [ ] Feature is classified: COMPETE / COEXIST / INTEGRATE / DO NOT BUILD.
- [ ] Authoritative data source is named for every new persisted field.
- [ ] Duplicate-SIS risk has been checked.
- [ ] Integration/import was considered before creating duplicate institutional ownership.
- [ ] Learning-evidence provenance remains separate from administrative data.
- [ ] TLS impact is documented.
- [ ] H&A impact is documented.
- [ ] Grade/official-record impact is documented.
- [ ] Communications impact is documented.
- [ ] Pilot-measurement impact is documented.
- [ ] Finance/Title IV/accounting exposure is absent or explicitly blocked.
- [ ] Accreditation/federal-reporting exposure is absent or explicitly blocked.
- [ ] Admissions-CRM expansion is absent or explicitly blocked.
- [ ] Physical time-clock/hardware expansion is absent or explicitly blocked.
- [ ] Product-boundary contract amendment is NOT required.

## Classification decision

### COMPETE
Proceed when the feature materially strengthens ASCYN's teaching, learning, diagnosis, remediation, instructor intelligence, or exam-readiness advantage.

### COEXIST
Proceed only with an explicit scope ceiling.

### INTEGRATE
Prefer adapters, imports, synchronization, provenance, and source precedence over duplicate institutional ownership.

### DO NOT BUILD
Stop. Do not implement inside the Gate. Open a separate architecture decision only if product leadership deliberately wants to amend the boundary contract.

## Gate readiness rule

A Gate is **NOT implementation-ready** if any checkbox above is unresolved.

A Gate is **BLOCKED** if:
- it falls in DO NOT BUILD;
- source of truth is ambiguous;
- imported institutional data could silently overwrite ASCYN learning evidence;
- the feature creates an unreviewed regulatory/compliance obligation;
- the feature materially turns ASCYN into a general SIS/ERP.

## Required contract statement in future Gate docs

Each future Gate contract should include:

> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **[COMPETE / COEXIST / INTEGRATE]**. No DO NOT BUILD capability is introduced.

