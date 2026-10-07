# PB-1 — Existing Scope Boundary Certification

**Project:** ASCYN PRO  
**Workstream:** Product Boundary Governance  
**Slice:** PB-1 — Existing Scope Boundary Certification  
**Status:** CERTIFICATION / GOVERNANCE — NO PRODUCT RUNTIME OR SCHEMA CHANGE  
**Authority:** `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md`

## 1. Purpose

PB-1 certifies the existing ASCYN PRO workstreams against the locked product-boundary model:

- COMPETE
- COEXIST
- INTEGRATE
- DO NOT BUILD

The purpose is to identify current drift before future Gates expand scope and to establish explicit guardrails around the parts of ASCYN that naturally overlap with student-information systems.

## 2. Production baseline

The Product Boundary Contract is present on production `main` and the corresponding production Vercel deployment for commit `5de2768783094b1026ab6f91c0f5a2cc503edcee` reached READY.

PB-1 changes governance documentation only.

## 3. Existing-workstream classification

### COMPETE — GREEN
These are core ASCYN product territory:
- curriculum delivery and Chapters 1–21;
- TLS;
- competency/mastery modeling;
- diagnostics;
- targeted remediation and reassessment;
- instructor action clarity;
- student learning dashboards;
- school instructional-health views;
- Exam Ready;
- licensing-exam preparation/readiness;
- learning analytics;
- 30/60/90 pilot measurement;
- ASCYN instructional intervention tooling.

### COEXIST — GREEN
These are allowed when tightly scoped to ASCYN operations:
- instructor/student learning communication;
- school bulletins;
- ASCYN account/user administration;
- ASCYN role/permission administration;
- Platform Admin Support Mode;
- lightweight school operational configuration.

### INTEGRATE — GREEN WITH GUARDRAILS
These may be ASCYN-native when no external source exists, but must be externally sourceable:
- enrollment status;
- school roster;
- instructor assignment;
- program/start/graduation context;
- attended/scheduled/transfer hours;
- institutional status;
- official institutional grade/completion state where required.

### DO NOT BUILD — NO CURRENT VIOLATION FOUND
No active certified workstream was found implementing:
- financial aid / Title IV;
- tuition accounting / ledgers;
- payroll;
- official transcript system-of-record;
- admissions CRM;
- IPEDS/NACCAS/ABHES/COE filing engines;
- physical fingerprint/key-fob time clocks;
- general-purpose school ERP functionality.

## 4. Guarded integration zones

### H&A — GUARDED INTEGRATION ZONE
**Current verdict:** YELLOW / controlled.

ASCYN currently owns enough attendance/hour functionality to operate standalone and to provide instructional risk context.

Allowed:
- attendance/hour capture;
- effective-hour calculations;
- corrections/provenance;
- staff authorization;
- reporting needed for ASCYN instructional use.

Boundary:
- external SIS may become authoritative;
- imported and ASCYN-originated evidence must remain distinguishable;
- no payroll, Title IV attendance calculations, physical clock hardware, or regulatory filing expansion.

### Onboarding — GUARDED INTEGRATION ZONE
**Current verdict:** YELLOW / controlled.

ASCYN currently supports school creation, invitations, enrollment, assignment, and account setup because those are required to run the platform.

Boundary:
- ASCYN account activation is ours;
- institutional enrollment/roster/status should become integration-friendly;
- no admissions CRM or recruiter pipeline;
- no uncontrolled expansion into mass SIS administration.

The prior Gate 5 decision to defer bulk onboarding remains consistent with this boundary.

### Admin Reporting — GUARDED INTEGRATION ZONE
**Current verdict:** YELLOW / controlled.

Allowed:
- learning progress;
- mastery/readiness;
- instructor intervention;
- attendance + learning risk;
- pilot outcomes;
- ASCYN evidence integrity.

Boundary:
- no tuition/accounting;
- no financial-aid reporting;
- no federal/accreditor filing;
- no admissions pipeline management.

## 5. Current Gate 6 certification

**Classification:** COMPETE  
**Boundary verdict:** PASS.

Gate 6 pilot measurement uses ASCYN learning evidence, trusted study activity, Exam Ready, remediation, and intervention metrics.

It explicitly keeps H&A separate and does not create a second readiness formula.

No SIS drift requiring repair was found.

## 6. Current Gate 7 certification

**Classification:** COEXIST  
**Boundary verdict:** PASS.

Gate 7 is a reliability program for already-approved communication scope.

G7-3 through G7-5 hardened idempotency, unread convergence, archive behavior, and authorization races without expanding into:
- general-purpose collaboration;
- student social messaging;
- cross-school chat;
- external delivery;
- CRM.

Beginning with G7-6, every slice must include the Product Boundary PASS statement from the Future Gate Scope Collision Checklist.

## 7. Compliance / licensing boundary

**Classification:** INTEGRATE / guarded institutional context.  
**Risk:** ELEVATED.

ASCYN may display internal progress against school-configured requirements.

ASCYN must not claim authoritative state-board eligibility unless a separately approved, jurisdiction-specific legal/compliance architecture is created.

ASCYN must not generate accreditation or regulatory filing engines under the current contract.

Current production semantics already use internal requirement-tracking language rather than unsupported licensing determinations.

## 8. Stale PR reconciliation

### PR #287 — ADM-1H compliance/license semantics
**Disposition:** SUPERSEDED BY CURRENT MAIN; stale PR must not be merged.

Reason:
- the intended semantic repairs are already present on current `main`;
- current production uses Program Requirement Tracking / Tracked Requirements semantics;
- current main has advanced hundreds of commits beyond the PR baseline;
- merging the stale branch would risk reintroducing unrelated historical code.

Boundary outcome:
- preserve the current-main semantics;
- treat any future compliance/licensing expansion as INTEGRATE and guarded;
- no separate ADM-1H merge is authorized.

### PR #291 — Gate 4 Instructor Action Clarity
**Disposition:** VALID PRODUCT INTENT, STALE IMPLEMENTATION BASELINE; stale PR must not be merged as-is.

Reason:
- the Gate 4 concept is core COMPETE territory;
- the contract correctly favors evidence → status → action → follow-up;
- current main still contains a local `getBoardRisk()` interpretation path that warrants future reconciliation;
- the PR baseline predates major Gate 5, Gate 6, Gate 7, Product Boundary, H&A, onboarding, and communications work.

Boundary outcome:
- preserve the Gate 4 intent as future work;
- any restart must be rebuilt from current `main`;
- it must include the Product Boundary PASS statement;
- no stale-branch merge or broad dashboard rewrite is authorized.

## 9. Existing drift findings

No current DO NOT BUILD violation was found.

The actual product risks are future scope creep in:
1. H&A;
2. onboarding/roster;
3. admin reporting;
4. compliance/licensing semantics.

These are governance risks, not evidence that current production is already an SIS.

## 10. Required enforcement from PB-1 forward

Every future Gate/major feature slice must:
1. classify itself as COMPETE / COEXIST / INTEGRATE;
2. name authoritative data sources;
3. identify guarded-zone contact;
4. state whether any SIS duplication exists;
5. preserve learning-evidence provenance;
6. explicitly state that no DO NOT BUILD capability is introduced.

Required statement:

> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **[COMPETE / COEXIST / INTEGRATE]**. No DO NOT BUILD capability is introduced.

## 11. PB-1 certification decision

**PB-1: GREEN pending exact-head Engineering Verification + Vercel preview and merge to production main.**

Architectural findings:
- no present DO NOT BUILD violation;
- three guarded integration zones formally identified;
- Gate 6 remains COMPETE;
- Gate 7 remains COEXIST;
- PR #287 is superseded;
- PR #291 requires a current-main restart if resumed;
- G7-6 onward is explicitly subject to Product Boundary PASS enforcement.
