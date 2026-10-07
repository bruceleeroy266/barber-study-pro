# ASCYN PRO Product Boundary Contract

**Project:** ASCYN PRO  
**Contract:** SMART → ASCYN PRO Product Boundary  
**Status:** LOCKED ARCHITECTURE CONTRACT  
**Applies to:** All current and future Gates, workstreams, feature proposals, schema changes, dashboards, integrations, and pilot requests  
**Change policy:** This contract may be changed only by an explicit architecture decision. No Gate may silently expand ASCYN into a prohibited product category.

## 1. Product identity

ASCYN PRO is the instructional intelligence and learning-performance platform for career education.

ASCYN may collect, derive, display, or consume administrative information only when that information is necessary to:
- support teaching and learning;
- measure student performance;
- identify academic or attendance-related learning risk;
- recommend instructor action;
- support exam readiness;
- support school-level instructional decision-making;
- operate ASCYN safely and reliably.

ASCYN is not intended to become the institutional system of record for finance, federal financial aid, accounting, accreditation reporting, official transcripts, admissions CRM, or physical timekeeping hardware.

## 2. Mandatory classification model

Every material feature proposal MUST be classified before implementation as exactly one of:

### COMPETE
ASCYN should deliberately build differentiated capability and aim to outperform administrative systems in instructional value.

### COEXIST
ASCYN may provide its own scoped capability because it is operationally necessary, but it must not expand into a broad replacement for the institution's existing system.

### INTEGRATE
ASCYN needs the data or workflow, but the authoritative source may be an external SIS or school system. ASCYN must prefer import/synchronization/normalization over duplicate institutional ownership when practical.

### DO NOT BUILD
The capability is outside ASCYN's product boundary. It may not be added to a Gate merely because a school requests it or a competitor provides it.

## 3. Locked feature classification

### COMPETE
ASCYN owns and should aggressively improve:
- curriculum delivery;
- Chapters 1–21 learning architecture;
- flashcards;
- micro-checks;
- formative assessment;
- summative assessment;
- targeted reassessment;
- competency/mastery modeling;
- Teaching & Learning System (TLS);
- evidence → status → recommended-action logic;
- weak-concept detection;
- remediation;
- instructor diagnostics;
- student learning dashboards;
- school instructional-health dashboards;
- learning-risk detection;
- exam-readiness measurement;
- Exam Ready simulator;
- licensing-exam preparation;
- practice feedback;
- learning analytics;
- 30/60/90 pilot measurement;
- instructor intervention tools;
- printable instructional/remediation resources;
- ASCYN-specific auditability;
- Platform Admin Support Mode for ASCYN workflows.

### COEXIST
ASCYN may maintain tightly scoped versions of:
- instructor ↔ student learning communication;
- school bulletins;
- ASCYN account/user administration;
- ASCYN role and permission management;
- attendance/hour corrections when ASCYN is the originating attendance source;
- basic roster maintenance when no integration exists;
- lightweight school operational configuration required to run ASCYN.

COEXIST features MUST remain subordinate to ASCYN's learning mission and MUST NOT grow into a general-purpose SIS, CRM, communications suite, or ERP.

### INTEGRATE
ASCYN should architect these as externally sourceable institutional data:
- student identity;
- enrollment status;
- school roster;
- instructor assignments;
- program;
- start date;
- graduation target;
- contract/program hours;
- attended hours;
- scheduled hours;
- transfer hours;
- leave-of-absence status;
- institutional student status;
- official institutional grade where required;
- official completion/graduation state.

ASCYN MAY provide native entry for these fields when no external system is connected.

When an approved external SIS is connected, its designated authoritative institutional fields should be normalized through an ASCYN Institutional Data Layer rather than independently recreated.

### DO NOT BUILD
Without an explicit amendment to this contract, ASCYN must not build:
- tuition accounting;
- accounts receivable;
- payment processing as a school ledger;
- student financial ledgers;
- financial-aid packaging;
- Title IV administration;
- R2T4 calculations;
- 90/10 calculations;
- 1098-T workflows;
- earned/unearned tuition calculations;
- institutional accounting;
- payroll;
- official transcripts as system of record;
- admissions CRM;
- prospect/recruiter CRM;
- accreditation annual reporting engines;
- IPEDS reporting;
- NACCAS reporting;
- ABHES reporting;
- COE reporting;
- physical fingerprint time clocks;
- key-fob time clocks;
- dedicated time-clock hardware;
- general-purpose school ERP functionality.

## 4. Data ownership boundary

### ASCYN-owned learning evidence
ASCYN is authoritative for:
- lesson completion evidence;
- flashcard evidence;
- micro-check evidence;
- assessment evidence;
- reassessment evidence;
- competency/mastery evidence;
- remediation state;
- exam-readiness evidence;
- learning-status calculations;
- recommended instructor actions;
- ASCYN pilot measurement;
- ASCYN audit events.

### Institutional context
The following may originate in ASCYN or an external SIS:
- identity;
- enrollment;
- program;
- instructor assignment;
- clock hours;
- attendance;
- transfer hours;
- LOA;
- graduation target;
- institutional status.

ASCYN may use institutional context as evidence, but must not confuse imported administrative data with ASCYN-generated learning evidence.

## 5. Hours & Attendance boundary

ASCYN Hours & Attendance remains a supported capability.

It is NOT the strategic product center.

Rules:
1. ASCYN H&A may operate standalone.
2. ASCYN must preserve corrections, provenance, authorization, and auditability.
3. When a school designates an external SIS as authoritative for clock hours/attendance, ASCYN should consume that source rather than require duplicate entry.
4. H&A may feed learning-risk/status logic.
5. H&A work must not expand into physical time-clock hardware, payroll, financial aid, or institutional accounting.
6. Imported attendance must remain distinguishable from ASCYN-originated attendance.

## 6. Grade boundary

ASCYN owns learning-performance evidence.

An SIS may own the official institutional grade/transcript.

ASCYN must not weaken or discard its own canonical learning evidence merely to mirror an SIS grade.

Where both exist, the product must clearly distinguish:
- ASCYN learning performance/readiness; and
- official institutional academic record.

## 7. Communications boundary

ASCYN communications exist to support education, intervention, school operations required by ASCYN, and pilot support.

Communications must not expand into:
- social networking;
- general school CRM;
- unrestricted directory messaging;
- cross-school chat;
- full enterprise collaboration software.

Gate 7 remains a reliability program, not authorization for new communications scope.

## 8. Administrative reporting boundary

ASCYN SHOULD report:
- instructional health;
- learning progress;
- mastery;
- readiness;
- intervention need;
- instructor/student academic risk;
- attendance + learning risk;
- pilot outcomes;
- ASCYN usage/evidence integrity.

ASCYN MUST NOT turn the Admin Dashboard into:
- accounting;
- financial-aid reporting;
- federal compliance reporting;
- accreditation annual reporting;
- tuition management;
- admissions CRM.

## 9. Guarded integration zones

The following areas are explicitly tagged **GUARDED INTEGRATION ZONES** because ASCYN needs them operationally but they carry the highest risk of drifting into SIS/ERP scope.

### H&A — GUARDED INTEGRATION ZONE
Allowed:
- ASCYN-native attendance/hour capture when no external source exists;
- effective-hours calculations;
- corrections, provenance, authorization, and auditability;
- use of attendance/hour context in instructional risk and reporting.

Guardrail:
- prefer external institutional sources when designated authoritative;
- do not add physical time-clock hardware, payroll, financial-aid attendance logic, or regulatory attendance filing engines.

### Onboarding / roster / enrollment — GUARDED INTEGRATION ZONE
Allowed:
- ASCYN account activation;
- school/program association required to operate ASCYN;
- instructor/student assignment required for teaching permissions;
- manual fallback when no integration exists.

Guardrail:
- do not turn ASCYN into the authoritative admissions CRM or full student-information record;
- prefer synchronization/import for institutional enrollment, roster, and status data when a supported source exists;
- avoid duplicate institutional data entry without documented reason.

### Admin reporting — GUARDED INTEGRATION ZONE
Allowed:
- instructional health;
- mastery/readiness;
- intervention need;
- attendance + learning risk;
- pilot outcomes;
- ASCYN evidence integrity and operational support views.

Guardrail:
- do not expand into accounting, tuition, financial aid, payroll, accreditation filing, federal reporting, or admissions-pipeline management.

Every new slice touching one of these zones must explicitly state the authoritative data source and the scope ceiling.

## 10. Institutional Data Layer direction

Future integration architecture should target an ASCYN Institutional Data Layer rather than a one-off SMART dependency.

Conceptually:

External SIS / SMART / CSV / Manual ASCYN Entry  
→ Institutional Data Adapter  
→ Canonical ASCYN Institutional Context  
→ TLS / reporting / risk / instructor action

Requirements:
- connector-specific fields must not leak into TLS logic;
- provenance/source must be preserved;
- source precedence must be explicit;
- imported records must not silently overwrite ASCYN learning evidence;
- stale or conflicting external data must be detectable;
- manual fallback must remain possible for schools without integrations.

SMART, if integrated later, is Connector #1—not ASCYN's architecture.

## 11. Gate scope-collision rule

Before implementation begins, every future Gate or major feature slice MUST answer:

1. What user problem is being solved?
2. Is the value primarily instructional or administrative?
3. Which classification applies: COMPETE / COEXIST / INTEGRATE / DO NOT BUILD?
4. What system is authoritative for each data field?
5. Does this duplicate a school's likely SIS?
6. Could this be solved by consuming institutional data instead of owning it?
7. Does this create finance, accreditation, admissions, payroll, or hardware obligations?
8. Does this strengthen ASCYN's learning moat?
9. Does it alter TLS, H&A, grading, communications, or pilot evidence boundaries?
10. Does it require an amendment to this contract?

A Gate may not be marked implementation-ready until this collision check is complete.

## 12. Automatic stop conditions

Implementation MUST STOP for architecture review when a proposed feature:
- enters a DO NOT BUILD category;
- adds an authoritative institutional financial record;
- makes ASCYN responsible for federal/accreditor reporting correctness;
- introduces physical attendance hardware;
- turns imported SIS data into silent source-of-truth replacement;
- mixes administrative records into learning evidence without provenance;
- requires users to maintain the same institutional record in multiple systems without a documented reason;
- materially expands ASCYN from learning platform into general SIS/ERP territory.

## 13. Exception policy

A customer request, pilot request, competitor feature, or convenient engineering opportunity is not sufficient to override this contract.

An exception requires:
1. explicit product rationale;
2. classification change;
3. ownership/source-of-truth decision;
4. regulatory/compliance impact review;
5. migration/integration impact review;
6. written amendment to this contract;
7. separate implementation authorization.

## 14. Decision rule

When uncertain, prefer the option that keeps ASCYN closest to:

**learning evidence → learner status → instructor action → remediation → reassessment → exam readiness**

and furthest from:

**finance → accounting → compliance filing → admissions CRM → physical timekeeping → general SIS administration**

## 15. Contract certification

This contract is considered architecturally locked when:
- it exists on production main;
- future Gate contracts reference or comply with its collision-check rule;
- no active Gate knowingly implements a DO NOT BUILD capability;
- current H&A, grading, communications, admin, pilot measurement, TLS, and Exam Ready work remain compatible with the classifications above.

