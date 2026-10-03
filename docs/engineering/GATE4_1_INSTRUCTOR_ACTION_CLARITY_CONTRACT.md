# G4-1 — Instructor Action Clarity Contract and Baseline Audit

**Gate:** ASCYN PRO Scale Readiness Gate 4 — Instructor Action Clarity  
**Status:** CONTRACT / BASELINE AUDIT  
**Base:** `main` at `e250b19f8d0f67f5b27e5076b9038e8c0cd4b898`  
**Scope:** Instructor-facing problem identification, evidence, recommended action, and follow-up only.

## 1. Gate 4 Goal

Instructors must be able to identify a meaningful student problem and know what to do next without contacting ASCYN PRO for basic interpretation.

Gate 4 is GREEN only when:

1. At-risk students and weak areas are easy to identify.
2. Each meaningful risk signal has a clear recommended action.
3. Instructor actions connect back to student evidence.
4. Follow-up results are visible.
5. Common instructor decisions do not require product-team intervention.

## 2. Scope Lock

Gate 4 does **not** authorize:
- new unrelated instructor features;
- new grading formulas;
- new readiness formulas;
- changes to certified TLS status thresholds;
- changes to chapter grading;
- changes to Hours & Attendance math;
- changes to Communications permissions;
- broad dashboard redesign.

Work is limited to making existing certified evidence and action logic coherent, visible, and traceable for instructors.

## 3. Existing Certified Foundation

The platform already contains the core pieces needed for Gate 4:

### TLS recommendation model
`src/lib/tls/presentation-model.ts`
- produces instructor-safe status labels;
- exposes a certified recommended action;
- exposes a primary focus;
- explains why the action is being recommended.

Examples include:
- require safety recovery before progression;
- require compliance recovery before progression;
- restart targeted remediation;
- complete/resume targeted remediation;
- intervene on the primary weak concept;
- collect fresh independent evidence;
- continue normal instruction.

### Certified diagnostic bridge
`src/lib/tls-integration/certified-diagnostic-summary-mapper.ts`
- maps certified chapter diagnostic evidence into TLS;
- uses `chapterGrade.finalGrade` as the authoritative score;
- does not invent a second score;
- preserves safety/compliance/remediation state supplied by certified evidence.

### Escalation lifecycle
`src/components/instructor/EscalationList.tsx`
- exposes pending / acknowledged / in-progress / resolved states;
- shows concept, chapter, evidence summary, unsuccessful cycle count, creation time, and acknowledgment state;
- provides a path to escalation details.

These are strong foundations and should be reused rather than replaced.

## 4. Baseline Audit Finding

Gate 4 is **YELLOW** at baseline.

The main problem is not absence of instructor information. The problem is **parallel interpretation paths**.

### Finding A — Live instructor dashboard uses multiple independent signals

`src/app/instructor/page.tsx` currently combines:
- canonical progress/readiness metrics;
- analytics weak areas;
- recency/activity signals;
- attendance concerns;
- gradebook information;
- escalation state.

These are individually useful, but they are not yet guaranteed to resolve through one instructor action contract.

### Finding B — Student detail retains separate board-risk logic

`src/app/instructor/student/[studentId]/page.tsx` contains a local `getBoardRisk()` calculation based on attempted chapter quiz scores and passing rates.

This creates a parallel interpretation path alongside:
- canonical readiness;
- TLS status;
- certified diagnostic summaries;
- remediation/escalation state.

Gate 4 should not add another formula. It should either:
1. explicitly classify this as a separate descriptive board-risk indicator with clear provenance, or
2. route the meaningful instructor decision through the certified action layer.

### Finding C — Certified TLS action output is not yet the universal live instructor decision surface

The certified TLS action model exists, but the live instructor experience is not yet consistently driven through that single recommendation path.

This is the primary Gate 4 integration gap.

## 5. Gate 4 Operating Contract

For each meaningful instructor-facing learning signal, the UI must answer four questions:

**What is happening?**  
A concise status/risk/attention signal.

**Why is ASCYN PRO showing it?**  
The relevant evidence or primary focus.

**What should the instructor do next?**  
A canonical recommended action.

**What happened after the action?**  
Visible follow-up state or fresh evidence.

A signal that cannot answer all four questions is not Gate-4-complete.

## 6. Canonical Decision Rule

Do not create a second instructor action engine.

For chapter learning status, the certified TLS public/integration path remains authoritative for:
- status;
- primary focus;
- recommended action;
- supporting explanation.

Operational domains such as attendance, hours, messaging, and administrative compliance may retain their own domain-specific actions, but their UI must clearly identify the evidence and the next step.

## 7. Required Work Slices

### G4-1 — Contract + baseline audit
This document. No production behavior change.

### G4-2 — Canonical Instructor Action Adapter
Create one instructor-facing adapter that turns certified learning evidence into a stable action-card/view-model contract.

Required fields:
- student identifier;
- chapter / context;
- status;
- primary focus;
- evidence summary;
- recommended action;
- supporting explanation;
- follow-up state when available;
- provenance/source identifier.

No new score or status math.

### G4-3 — Instructor Dashboard Action Clarity
Integrate the canonical adapter into the instructor landing experience so that the instructor can identify:
- who needs attention;
- the most important weak area;
- why;
- the next action.

Avoid duplicative or contradictory recommendations.

### G4-4 — Student Detail Evidence → Action → Follow-up
On the student detail route, make the relationship explicit:
`evidence → status → recommended action → remediation/escalation/fresh evidence`.

Existing chapter diagnostics and escalation state should be reused.

### G4-5 — Decision-Parity and Regression Certification
Tests must prove:
- instructor dashboard and student detail agree on the same certified learning action for the same evidence;
- safety precedence is preserved;
- compliance precedence is preserved;
- unresolved remediation is not shown as normal progression;
- insufficient evidence does not create a false risk;
- no-grade / no-evidence states remain honest;
- instructors cannot see students outside their authorized roster/school;
- existing grading, readiness, H&A, communications, and TLS core behavior remain unchanged.

### G4-6 — Production Certification
Run:
- Engineering Verification;
- exact-head tests;
- Vercel preview;
- instructor route smoke;
- representative Strong / Improving / Needs Attention / insufficient evidence scenarios;
- production verification after merge.

Only then may Gate 4 be certified GREEN.

## 8. Explicit Non-Goals

Do not:
- invent an instructor score;
- merge attendance risk into academic mastery;
- treat login recency as learning evidence;
- make a single wrong answer equal Needs Attention;
- hide insufficient evidence behind 0%;
- replace certified TLS with dashboard-specific thresholds;
- modify chapter formulas simply to make the dashboard easier to display.

## 9. Baseline Verdict

**Gate 4: YELLOW — foundation exists, integration is incomplete.**

The strongest path is not a rebuild. It is to connect the already-certified TLS, diagnostics, escalation, and instructor surfaces through one traceable instructor action contract.
