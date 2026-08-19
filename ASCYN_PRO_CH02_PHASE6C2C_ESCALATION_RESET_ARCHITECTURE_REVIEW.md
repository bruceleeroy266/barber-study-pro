# ASCYN PRO — Phase 6C-2c: Instructor Escalation & Sustained-Performance Reset Architecture Review

**Document Status:** ARCHITECTURE REVIEW — READ-ONLY
**Phase:** 6C-2c — Instructor Escalation & Sustained-Performance Reset
**Chapter:** Chapter 2 (Life Skills for Barbers) — Reference Implementation
**Date:** 2026-08-19
**Review Basis:** Phase 6C-1 Remediation Cycle Policy (Approved), Phase 6C-2a/2b Persistence Architecture (Committed)
**Scope:** Architecture review ONLY. No migrations, no runtime code, no UI, no commits.

---

## Executive Summary

This document presents the complete persistence and runtime architecture for Phase 6C-2c: Instructor Escalation and Sustained-Performance Reset. The design satisfies all binding requirements from the Phase 6C-1 policy while integrating cleanly with the existing Phase 6C-2a/2b persistence layer.

**Key Architectural Decisions:**

1. **Escalation Ownership Model:** Instructor escalations use an explicit ownership state machine with immutable audit events. Once an instructor takes ownership, automation cannot silently clear or overwrite the escalation.

2. **Sustained-Performance Reset:** A deterministic state machine tracks `currently_performing_well` continuity with explicit evidence requirements. The reset is idempotent, auditable, and preserves instructor-owned interventions.

3. **Chapter-Agnostic Design:** All persistence uses text-based concept/chapter identifiers with canonical mapping resolution at the application layer, consistent with Phase 6C-2b.

4. **Reuse of Existing Structures:** The design leverages `remediation_cycles`, `remediation_cycle_events`, and `reassessment_question_history` without duplicating state.

---

## 1. Instructor Escalation Architecture

### 1.1 Trigger Condition

**Exact Trigger:** An instructor escalation is created when a student completes their **second unsuccessful remediation cycle** for the same concept.

**Unsuccessful Cycle Definition (from Phase 6C-1 §3.5):**
- Reassessment failed (2+ misses), OR
- Reassessment passed but weakness re-emerges in subsequent detection within the 30-day window

**Counting Logic:**
```
unsuccessful_cycles = COUNT(remediation_cycles)
  WHERE user_id = :student
    AND concept_id = :concept
    AND outcome = 'unsuccessful'
    AND evaluated_at >= (NOW() - INTERVAL '30 days')
```

**Trigger Condition:**
```
IF unsuccessful_cycles >= 2
   AND NOT EXISTS (
     SELECT 1 FROM instructor_escalations
     WHERE user_id = :student
       AND concept_id = :concept
       AND status IN ('pending', 'acknowledged', 'in_progress')
   )
THEN
   CREATE instructor_escalation
```

### 1.2 Escalation Lifecycle / State Machine

```
┌─────────────┐     ┌───────────────┐     ┌─────────────┐     ┌─────────────┐
│   pending   │────→│ acknowledged  │────→│ in_progress │────→│  resolved   │
│  (created)  │     │ (instructor   │     │ (instructor │     │ (instructor │
│             │     │  viewed)      │     │  acting)    │     │  action     │
└─────────────┘     └───────────────┘     └─────────────┘     │  complete)  │
                                                              └─────────────┘
                                                                     ↑
┌─────────────┐     ┌───────────────┐                                │
│  expired    │←────│  auto_cleared │←───────────────────────────────┘
│  (30 days   │     │  (sustained   │     (only if NOT instructor-owned)
│   no ack)   │     │   performance │
└─────────────┘     │   reset)      │
                    └───────────────┘
```

**State Definitions:**

| State | Description | Who Can Transition | Automation Allowed |
|-------|-------------|-------------------|-------------------|
| `pending` | Escalation created, awaiting instructor review | System (create), Instructor (acknowledge) | Yes — create only |
| `acknowledged` | Instructor has viewed the escalation | Instructor | No — instructor only |
| `in_progress` | Instructor is actively working with student | Instructor | No — instructor only |
| `resolved` | Instructor has completed intervention | Instructor | No — instructor only |
| `auto_cleared` | Sustained-performance reset cleared non-owned escalation | System | Yes — only if never acknowledged |
| `expired` | 30 days passed without acknowledgment | System | Yes — housekeeping |

**Critical Rule:** Once an escalation reaches `acknowledged`, `in_progress`, or `resolved`, it is **instructor-owned**. Automation must not silently clear, overwrite, or modify instructor-owned escalations.

### 1.3 Ownership Semantics

**Ownership Acquisition:**
- An instructor takes ownership by transitioning the escalation from `pending` to `acknowledged`
- Ownership is recorded with `acknowledged_by` (instructor user ID) and `acknowledged_at`
- Ownership is **per-escalation**, not per-concept or per-student

**Ownership Protection:**
- `acknowledged_by IS NOT NULL` indicates instructor ownership
- Automated processes must check `acknowledged_by IS NULL` before any modification
- The `auto_cleared` transition is only permitted when `acknowledged_by IS NULL`

**Ownership Release:**
- Instructors may release ownership by transitioning back to `pending` (rare)
- Ownership is implicitly released when escalation reaches `resolved` or `expired`

### 1.4 Timestamps and Audit Requirements

**Immutable Audit Events:**
All escalation state transitions must be recorded in `instructor_escalation_events` (immutable audit ledger):

| Event Type | Required Data |
|------------|---------------|
| `created` | `triggering_cycle_ids`, `unsuccessful_cycle_count`, `detection_evidence_snapshot` |
| `acknowledged` | `acknowledged_by`, `acknowledged_at`, `instructor_notes` (optional) |
| `in_progress` | `started_by`, `started_at`, `intervention_plan` (optional) |
| `resolved` | `resolved_by`, `resolved_at`, `resolution_summary`, `follow_up_required` |
| `auto_cleared` | `reset_id`, `cleared_at`, `evidence_snapshot` |
| `expired` | `expired_at`, `days_pending` |

**Timestamps:**
- `created_at` — when escalation was created (immutable)
- `acknowledged_at` — when instructor first acknowledged (NULL until acknowledged)
- `updated_at` — last modification (mutable, for optimistic concurrency)

### 1.5 Duplicate-Escalation Prevention

**Unique Constraint:**
```sql
CREATE UNIQUE INDEX idx_instructor_escalations_active_unique
ON instructor_escalations(user_id, concept_id)
WHERE status IN ('pending', 'acknowledged', 'in_progress');
```

**Behavior:**
- Only one active escalation per student/concept
- If an escalation is `resolved` or `auto_cleared`, a new escalation may be created for the same concept if conditions recur
- `expired` escalations do not block new escalations

### 1.6 Concurrency Behavior

**Race Condition: Multiple Cycles Completing Simultaneously**

Scenario: Two remediation cycles for the same concept complete unsuccessfully at nearly the same time.

**Solution:**
1. Use `INSERT ... ON CONFLICT (user_id, concept_id) WHERE status IN (...) DO NOTHING`
2. If conflict occurs, the existing escalation is returned (idempotent)
3. The second cycle's evidence is appended to the existing escalation's `triggering_cycle_ids` array

**Race Condition: Instructor Acknowledging While System Auto-Clearing**

Scenario: Sustained-performance reset attempts to auto-clear while instructor is acknowledging.

**Solution:**
1. Use `SELECT ... FOR UPDATE` on the escalation row
2. Check `acknowledged_by IS NULL` before allowing auto-clear
3. If instructor acknowledged during the transaction, abort auto-clear
4. Record the conflict in `instructor_escalation_events` with type `auto_clear_aborted`

### 1.7 RLS / Security Behavior

**Policies:**

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| Student (own) | ✅ Own escalations | ❌ | ❌ | ❌ |
| Instructor (same school) | ✅ Students in school | ❌ | ✅ Own acknowledged | ❌ |
| School Admin | ✅ Students in school | ❌ | ✅ Any in school | ❌ |
| Platform Super Admin | ✅ All | ✅ | ✅ | ❌ |

**Key Security Rules:**
- Students can see their own escalations (transparency)
- Only instructors/admins can acknowledge or modify escalations
- No one can delete escalations (audit preservation)
- System (service role) can create and auto-clear (with ownership check)

### 1.8 What Automation May and May Not Change

**Automation MAY:**
- Create new escalations (when trigger condition met)
- Auto-clear `pending` escalations via sustained-performance reset (only if `acknowledged_by IS NULL`)
- Mark escalations as `expired` after 30 days without acknowledgment

**Automation MAY NOT:**
- Modify `acknowledged`, `in_progress`, or `resolved` escalations
- Clear or overwrite instructor notes/actions
- Change `acknowledged_by`, `acknowledged_at`, or any instructor-provided data
- Force-transition an instructor-owned escalation to any state

---

## 2. Sustained-Performance Reset Architecture

### 2.1 Deterministic Reset State Machine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUSTAINED-PERFORMANCE RESET STATE MACHINE            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  not_tracking    │  ← Initial state: concept not in currently_performing_well
│  (or ineligible) │
└────────┬─────────┘
         │ Detection engine reports currently_performing_well
         ▼
┌──────────────────┐     ┌──────────────────┐
│  tracking_active │────→│  continuity_broken│  ← Transition out of
│  (clock running) │     │  (clock reset)    │    currently_performing_well
└────────┬─────────┘     └──────────────────┘
         │
         │ 30 days elapsed AND follow-up evidence exists
         ▼
┌──────────────────┐     ┌──────────────────┐
│  eligible_for    │────→│  reset_executed  │  ← Reset complete
│  reset           │     │  (immutable)     │
└──────────────────┘     └──────────────────┘
```

### 2.2 How the System Knows

| Question | Mechanism |
|----------|-----------|
| **When does the 30-day clock start?** | `sustained_performance_tracking.entered_cpw_at` — set when detection engine first reports `currently_performing_well` |
| **Is continuity maintained?** | `sustained_performance_tracking.last_verified_at` — updated on each detection run while state remains `currently_performing_well` |
| **Does qualifying follow-up evidence exist?** | `sustained_performance_tracking.follow_up_evidence_count` — incremented on each concept-mapped assessment during tracking period |
| **Did concept ever leave CPW?** | `sustained_performance_tracking.continuity_broken_at` — set if detection state transitions out of `currently_performing_well` |
| **When is reset eligible?** | `NOW() - entered_cpw_at >= 30 days` AND `follow_up_evidence_count >= 1` AND `continuity_broken_at IS NULL` |

### 2.3 Reset Eligibility Check (Deterministic)

```sql
-- Eligibility check function
CREATE OR REPLACE FUNCTION check_sustained_performance_reset_eligibility(
  p_user_id uuid,
  p_concept_id text
)
RETURNS TABLE (
  is_eligible boolean,
  entered_cpw_at timestamptz,
  days_in_cpw integer,
  follow_up_evidence_count integer,
  continuity_broken boolean,
  blocking_reason text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Eligible if: 30+ days, 1+ follow-up evidence, continuity maintained
    (NOW() - spt.entered_cpw_at >= INTERVAL '30 days'
     AND spt.follow_up_evidence_count >= 1
     AND spt.continuity_broken_at IS NULL) as is_eligible,
    spt.entered_cpw_at,
    EXTRACT(DAY FROM (NOW() - spt.entered_cpw_at))::integer as days_in_cpw,
    spt.follow_up_evidence_count,
    (spt.continuity_broken_at IS NOT NULL) as continuity_broken,
    CASE
      WHEN spt.continuity_broken_at IS NOT NULL THEN 'continuity_broken'
      WHEN NOW() - spt.entered_cpw_at < INTERVAL '30 days' THEN 'insufficient_days'
      WHEN spt.follow_up_evidence_count < 1 THEN 'no_follow_up_evidence'
      ELSE NULL
    END as blocking_reason
  FROM sustained_performance_tracking spt
  WHERE spt.user_id = p_user_id
    AND spt.concept_id = p_concept_id
    AND spt.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 2.4 Reset Execution and Idempotency

**Idempotency Mechanism:**
- `sustained_performance_resets` table has `UNIQUE (user_id, concept_id, entered_cpw_at)`
- Attempting to reset the same tracking period twice results in `ON CONFLICT DO NOTHING`
- The existing reset record is returned (idempotent)

**Execution Steps:**
1. Verify eligibility (30 days, follow-up evidence, continuity)
2. Begin transaction
3. `SELECT ... FOR UPDATE` on `sustained_performance_tracking` row
4. Re-verify eligibility (optimistic concurrency)
5. Insert into `sustained_performance_resets` (immutable)
6. Update `remediation_cycles` set `reset_by_sustained_performance = true` where applicable
7. Update `sustained_performance_tracking` set `is_active = false`, `reset_at = NOW()`
8. Check for non-owned instructor escalations and auto-clear if present
9. Commit transaction

### 2.5 Concurrent Reset Attempts

**Scenario:** Two processes attempt to reset the same tracking period simultaneously.

**Solution:**
1. `SELECT ... FOR UPDATE` on `sustained_performance_tracking` serializes access
2. Second process waits for first to commit
3. After first commits, second process sees `is_active = false` and returns existing reset
4. `UNIQUE` constraint on `sustained_performance_resets` provides final protection

### 2.6 Instructor-Owned vs Non-Owned Escalations

**During Reset Execution:**

```sql
-- Auto-clear non-owned escalations only
UPDATE instructor_escalations
SET
  status = 'auto_cleared',
  auto_cleared_at = NOW(),
  auto_cleared_by_reset_id = :reset_id,
  updated_at = NOW()
WHERE user_id = :student_id
  AND concept_id = :concept_id
  AND status = 'pending'  -- Only pending, not acknowledged/in_progress/resolved
  AND acknowledged_by IS NULL;  -- Extra safety: never touch instructor-owned
```

**Instructor-Owned Escalations:**
- `acknowledged`, `in_progress`, `resolved` escalations are **never** modified by reset
- Reset proceeds normally for counters and lockout
- Instructor retains full visibility and control of their escalation

---

## 3. Proposed Persistence Schema

### 3.1 Table: `instructor_escalations`

```sql
CREATE TABLE public.instructor_escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity (chapter-agnostic)
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id text NOT NULL,  -- e.g., 'C-2-01'
  chapter_id text NOT NULL,  -- e.g., 'ch-2'
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  -- Trigger context
  triggering_cycle_ids uuid[] NOT NULL,  -- Array of remediation_cycle IDs
  unsuccessful_cycle_count integer NOT NULL,

  -- Detection evidence snapshot at trigger time
  detection_evidence jsonb NOT NULL,  -- ConceptEvidence from Phase 6B-3

  -- State machine
  status text NOT NULL DEFAULT 'pending',

  -- Ownership (NULL = not owned by instructor)
  acknowledged_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  acknowledged_at timestamptz,

  -- Instructor actions
  instructor_notes text,
  intervention_plan text,
  resolution_summary text,
  follow_up_required boolean,

  -- Auto-clear tracking (for sustained-performance reset)
  auto_cleared_at timestamptz,
  auto_cleared_by_reset_id uuid REFERENCES sustained_performance_resets(id),

  -- Expiration
  expired_at timestamptz,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN (
    'pending', 'acknowledged', 'in_progress', 'resolved', 'auto_cleared', 'expired'
  )),
  CONSTRAINT valid_unsuccessful_count CHECK (unsuccessful_cycle_count >= 2),
  CONSTRAINT acknowledged_requires_ownership CHECK (
    (status = 'acknowledged' AND acknowledged_by IS NOT NULL AND acknowledged_at IS NOT NULL)
    OR (status != 'acknowledged')
  ),
  CONSTRAINT auto_cleared_requires_null_owner CHECK (
    (status = 'auto_cleared' AND acknowledged_by IS NULL)
    OR (status != 'auto_cleared')
  )
);

-- Indexes
CREATE INDEX idx_instructor_escalations_user_concept
  ON instructor_escalations(user_id, concept_id);
CREATE INDEX idx_instructor_escalations_school_status
  ON instructor_escalations(school_id, status) WHERE status IN ('pending', 'acknowledged', 'in_progress');
CREATE INDEX idx_instructor_escalations_acknowledged_by
  ON instructor_escalations(acknowledged_by) WHERE acknowledged_by IS NOT NULL;
CREATE INDEX idx_instructor_escalations_created_at
  ON instructor_escalations(created_at DESC);

-- Unique active escalation per user/concept
CREATE UNIQUE INDEX idx_instructor_escalations_active_unique
  ON instructor_escalations(user_id, concept_id)
  WHERE status IN ('pending', 'acknowledged', 'in_progress');
```

### 3.2 Table: `instructor_escalation_events` (Immutable Audit Ledger)

```sql
CREATE TABLE public.instructor_escalation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference
  escalation_id uuid NOT NULL REFERENCES instructor_escalations(id) ON DELETE CASCADE,

  -- Event classification
  event_type text NOT NULL,

  -- Event payload
  event_data jsonb NOT NULL DEFAULT '{}',

  -- Actor (NULL for system events)
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamp
  created_at timestamptz NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_event_type CHECK (event_type IN (
    'created', 'acknowledged', 'in_progress', 'resolved',
    'auto_cleared', 'auto_clear_aborted', 'expired', 'notes_updated'
  ))
);

-- Indexes
CREATE INDEX idx_instructor_escalation_events_escalation
  ON instructor_escalation_events(escalation_id);
CREATE INDEX idx_instructor_escalation_events_type
  ON instructor_escalation_events(event_type);
CREATE INDEX idx_instructor_escalation_events_created
  ON instructor_escalation_events(created_at DESC);

-- Immutability trigger
CREATE TRIGGER enforce_escalation_events_immutability
  BEFORE UPDATE OR DELETE ON instructor_escalation_events
  FOR EACH ROW EXECUTE FUNCTION prevent_escalation_event_modification();
```

### 3.3 Table: `sustained_performance_tracking`

```sql
CREATE TABLE public.sustained_performance_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity (chapter-agnostic)
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id text NOT NULL,
  chapter_id text NOT NULL,

  -- Tracking period
  entered_cpw_at timestamptz NOT NULL,  -- When concept entered currently_performing_well
  last_verified_at timestamptz NOT NULL,  -- Last detection run confirming CPW
  continuity_broken_at timestamptz,  -- When concept left CPW (NULL = still in CPW)

  -- Evidence tracking
  follow_up_evidence_count integer NOT NULL DEFAULT 0,  -- Concept-mapped assessments during period
  follow_up_evidence_ids uuid[] DEFAULT '{}',  -- quiz_attempt IDs providing evidence

  -- State
  is_active boolean NOT NULL DEFAULT true,  -- false after reset or continuity break

  -- Reset linkage (NULL until reset)
  reset_at timestamptz,
  reset_id uuid REFERENCES sustained_performance_resets(id),

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_follow_up_count CHECK (follow_up_evidence_count >= 0),
  CONSTRAINT continuity_broken_after_entry CHECK (
    continuity_broken_at IS NULL OR continuity_broken_at >= entered_cpw_at
  ),
  CONSTRAINT reset_after_entry CHECK (
    reset_at IS NULL OR reset_at >= entered_cpw_at
  )
);

-- Indexes
CREATE INDEX idx_sustained_performance_tracking_user_concept
  ON sustained_performance_tracking(user_id, concept_id);
CREATE INDEX idx_sustained_performance_tracking_active
  ON sustained_performance_tracking(is_active) WHERE is_active = true;
CREATE INDEX idx_sustained_performance_tracking_eligibility
  ON sustained_performance_tracking(entered_cpw_at)
  WHERE is_active = true AND continuity_broken_at IS NULL;

-- One active tracking period per user/concept
CREATE UNIQUE INDEX idx_sustained_performance_tracking_active_unique
  ON sustained_performance_tracking(user_id, concept_id)
  WHERE is_active = true;
```

### 3.4 Table: `sustained_performance_resets` (Immutable)

```sql
CREATE TABLE public.sustained_performance_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id text NOT NULL,
  chapter_id text NOT NULL,

  -- Tracking period reference
  tracking_id uuid NOT NULL REFERENCES sustained_performance_tracking(id),
  entered_cpw_at timestamptz NOT NULL,  -- Denormalized for uniqueness

  -- Evidence snapshot
  follow_up_evidence_count integer NOT NULL,
  follow_up_evidence_ids uuid[] NOT NULL,
  detection_evidence jsonb NOT NULL,  -- ConceptEvidence at reset time

  -- Before/after state
  previous_cycle_count integer NOT NULL,
  previous_unsuccessful_count integer NOT NULL,
  previous_lockout_active boolean NOT NULL,

  -- Escalation disposition
  escalation_auto_cleared boolean NOT NULL DEFAULT false,
  escalation_id uuid REFERENCES instructor_escalations(id),

  -- Execution metadata
  executed_at timestamptz NOT NULL DEFAULT NOW(),
  executed_by uuid REFERENCES auth.users(id),  -- NULL for system

  -- Constraints
  CONSTRAINT valid_previous_counts CHECK (
    previous_cycle_count >= 0 AND previous_unsuccessful_count >= 0
  )
);

-- Idempotency: one reset per tracking period
CREATE UNIQUE INDEX idx_sustained_performance_resets_tracking_unique
  ON sustained_performance_resets(tracking_id);

-- Also enforce uniqueness on (user_id, concept_id, entered_cpw_at) for extra safety
CREATE UNIQUE INDEX idx_sustained_performance_resets_period_unique
  ON sustained_performance_resets(user_id, concept_id, entered_cpw_at);

-- Indexes
CREATE INDEX idx_sustained_performance_resets_user_concept
  ON sustained_performance_resets(user_id, concept_id);
CREATE INDEX idx_sustained_performance_resets_executed_at
  ON sustained_performance_resets(executed_at DESC);

-- Immutability trigger
CREATE TRIGGER enforce_resets_immutability
  BEFORE UPDATE OR DELETE ON sustained_performance_resets
  FOR EACH ROW EXECUTE FUNCTION prevent_reset_modification();
```

### 3.5 Modifications to Existing Tables

**`remediation_cycles` — Add reset tracking:**
```sql
ALTER TABLE public.remediation_cycles
ADD COLUMN IF NOT EXISTS reset_by_sustained_performance boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sustained_performance_reset_id uuid REFERENCES sustained_performance_resets(id);

CREATE INDEX IF NOT EXISTS idx_remediation_cycles_reset
  ON remediation_cycles(reset_by_sustained_performance) WHERE reset_by_sustained_performance = true;
```

### 3.6 Helper Functions

```sql
-- Check if a concept is eligible for sustained-performance reset
CREATE OR REPLACE FUNCTION check_sustained_performance_reset_eligibility(
  p_user_id uuid,
  p_concept_id text
) RETURNS TABLE (...) AS $$ ... $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Execute sustained-performance reset (idempotent)
CREATE OR REPLACE FUNCTION execute_sustained_performance_reset(
  p_user_id uuid,
  p_concept_id text,
  p_executed_by uuid DEFAULT NULL
) RETURNS uuid AS $$ ... $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record detection state transition (called by application)
CREATE OR REPLACE FUNCTION record_detection_state_transition(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_new_state text,
  p_evidence jsonb,
  p_quiz_attempt_id uuid DEFAULT NULL
) RETURNS void AS $$ ... $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create instructor escalation (idempotent)
CREATE OR REPLACE FUNCTION create_instructor_escalation(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_school_id uuid,
  p_triggering_cycle_ids uuid[],
  p_unsuccessful_cycle_count integer,
  p_detection_evidence jsonb
) RETURNS uuid AS $$ ... $$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.7 RLS Policies

**`instructor_escalations`:**
```sql
-- Students: read own escalations
CREATE POLICY instructor_escalations_student_select ON instructor_escalations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Instructors: read escalations for students in same school
CREATE POLICY instructor_escalations_instructor_select ON instructor_escalations
  FOR SELECT TO authenticated
  USING (
    is_school_staff(current_user_school_id())
    AND current_user_school_id() = school_id
  );

-- Instructors: update escalations they have acknowledged
CREATE POLICY instructor_escalations_instructor_update ON instructor_escalations
  FOR UPDATE TO authenticated
  USING (
    is_school_staff(current_user_school_id())
    AND current_user_school_id() = school_id
    AND (acknowledged_by = auth.uid() OR acknowledged_by IS NULL)
  )
  WITH CHECK (
    is_school_staff(current_user_school_id())
    AND current_user_school_id() = school_id
  );

-- Platform super admin: full access
CREATE POLICY instructor_escalations_super_admin ON instructor_escalations
  FOR ALL TO authenticated
  USING (is_platform_super_admin())
  WITH CHECK (is_platform_super_admin());
```

**`sustained_performance_tracking` and `sustained_performance_resets`:**
```sql
-- Students: read own tracking/resets
-- Instructors: read tracking/resets for students in same school
-- Platform super admin: full access
-- System (service role): full access for automated processes
```

---

## 4. Chapter-Agnostic Requirement Verification

| Requirement | Implementation |
|-------------|----------------|
| No hard-coded Chapter 2 concept IDs | ✅ `concept_id` is `text`, not FK to chapter-specific table |
| No hard-coded Chapter 2 question IDs | ✅ No question IDs in persistence layer |
| No chapter-specific curriculum semantics | ✅ Detection state comes from application layer |
| Chapter-specific resolution via providers | ✅ Application uses `ICanonicalMappingProvider` |

**Verification:** The persistence layer stores `concept_id` and `chapter_id` as opaque text. All educational-semantic resolution (question→concept mapping, detection state determination) occurs in the application layer through canonical mapping providers, consistent with Phase 6C-2b.

---

## 5. Safety / Semantic Guardrails Verification

| Guardrail | Verification |
|-----------|--------------|
| Detection remains evidence, not diagnosis | ✅ Escalation message: "automated remediation has not resolved evidence of weakness" — never "student is deficient" |
| `currently_performing_well` determined by detection engine | ✅ Persistence layer stores state; detection engine (Phase 6B-3) determines it |
| Remediation completion alone cannot prove improved performance | ✅ Reset requires `follow_up_evidence_count >= 1` — actual assessment evidence |
| Inactivity cannot trigger sustained-performance reset | ✅ `follow_up_evidence_count >= 1` required; 30 days of no activity fails this check |
| Reset cannot erase instructor-owned intervention state | ✅ `auto_cleared` only when `acknowledged_by IS NULL`; instructor-owned escalations untouched |
| Failed reassessment and remediation cycles remain auditable | ✅ `remediation_cycles` and `remediation_cycle_events` immutable; reset only adds `reset_by_sustained_performance` flag |
| No historical records rewritten or fabricated | ✅ All audit tables immutable; reset creates new records, doesn't modify history |

---

## 6. Integration Review

### 6.1 Integration with Phase 6B-3 Concept Detection

**Flow:**
```
Phase 6B-3 Detection Engine
         │
         │ detectConceptState() returns 'currently_performing_well'
         ▼
Application Layer: record_detection_state_transition()
         │
         ├──► sustained_performance_tracking (insert/update)
         │
         └──► remediation_cycle_events (if cycle active)
```

**Key Integration Point:** The application layer must call `record_detection_state_transition()` after each detection run. This function:
1. Updates `sustained_performance_tracking` if state is `currently_performing_well`
2. Sets `continuity_broken_at` if state transitions out of `currently_performing_well`
3. Increments `follow_up_evidence_count` when a concept-mapped assessment occurs during tracking

### 6.2 Integration with `remediation_cycles`

**Escalation Trigger:**
```
remediation_cycles (outcome = 'unsuccessful')
         │
         │ COUNT unsuccessful cycles in rolling 30 days
         ▼
    IF count >= 2
         │
         ▼
create_instructor_escalation()
         │
         ├──► instructor_escalations (insert)
         └──► instructor_escalation_events (insert 'created')
```

**Reset Integration:**
```
execute_sustained_performance_reset()
         │
         ├──► sustained_performance_resets (insert)
         ├──► remediation_cycles (update reset flags)
         ├──► sustained_performance_tracking (update is_active = false)
         └──► instructor_escalations (auto-clear if non-owned)
```

### 6.3 Integration with `remediation_cycle_events`

**Events to Record:**
- `escalated` — when instructor escalation is created for a cycle
- `reset` — when sustained-performance reset clears cycle counters

### 6.4 Integration with `reassessment_question_history`

**No direct integration required.** The reassessment history is used by the exclusion engine (Phase 6C-2b) to prevent question reuse. Escalation and reset operate at the cycle/concept level, not the question level.

### 6.5 Integration with `quiz_attempts`

**Follow-Up Evidence Tracking:**
- When a `quiz_attempt` is completed with `target_concept_id` set (reassessment), the application layer checks if the concept is being tracked in `sustained_performance_tracking`
- If tracking is active and the attempt supports continued `currently_performing_well`, `follow_up_evidence_count` is incremented and the attempt ID is added to `follow_up_evidence_ids`

### 6.6 Integration with `selectAndReserveQuestion()` Flow

**No changes required.** The presentation-safe question selection flow (Phase 6C-2b) operates independently. Escalation and reset do not affect question selection eligibility.

**Future Consideration:** If a concept is under instructor escalation, the system may choose to prioritize or deprioritize reassessment questions. This is a policy decision, not an architectural requirement.

### 6.7 Architectural Dependencies and Blockers

| Dependency | Status | Blocker? |
|------------|--------|----------|
| Phase 6B-3 detection engine | ✅ Exists | No |
| `remediation_cycles` (6C-2a) | ✅ Committed | No |
| `reassessment_question_history` (6C-2b) | ✅ Committed | No |
| `selectAndReserveQuestion()` (6C-2b) | ✅ Committed | No |
| Detection state persistence | ⚠️ **Not implemented** | **Yes** |

**Blocker Identified:** The current system does not persist detection state history. `sustained_performance_tracking` requires knowing when a concept entered `currently_performing_well`. This requires:

1. **Application-layer change:** After each detection run, call `record_detection_state_transition()`
2. **New persistence:** `sustained_performance_tracking` table (proposed in this review)

**Resolution:** This is not a true blocker — it is the purpose of Phase 6C-2c. The architecture review proposes the necessary persistence.

---

## 7. Unresolved Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| **Escalation expiration** | A) 30 days auto-expire; B) Never expire; C) Configurable | **A** — 30 days aligns with rolling window; prevents stale escalations |
| **Instructor notification delivery** | A) In-app only; B) Email digest; C) Real-time push | **Deferred to UI phase** — architecture supports all |
| **Reset execution timing** | A) On-demand check; B) Scheduled job; C) Event-driven | **B** — Scheduled daily job checks eligibility; **C** for immediate feedback |
| **Multiple instructors** | A) First-come ownership; B) Shared ownership; C) Assignment | **A** — First to acknowledge owns; simple and clear |
| **Escalation after reset** | A) Allow immediate re-escalation; B) Cooldown period | **A** — If weakness recurs, escalation is appropriate |

---

## 8. Architectural Blockers

| Blocker | Severity | Resolution |
|---------|----------|------------|
| Detection state not persisted | **High** | Implement `sustained_performance_tracking` and application-layer integration |
| No scheduled job infrastructure | **Medium** | Use existing cron/scheduled function capability (Vercel Cron, Supabase Edge Functions, or external scheduler) |
| Instructor UI not implemented | **Low** | Architecture supports future UI; no blocker to persistence layer |

---

## 9. Recommended Implementation Sequence

```
Phase 6C-2c Implementation Sequence
====================================

Step 1: Persistence Foundation
├── Create sustained_performance_tracking table
├── Create sustained_performance_resets table
├── Create instructor_escalations table
├── Create instructor_escalation_events table
├── Add reset tracking columns to remediation_cycles
├── Create helper functions
└── Create RLS policies

Step 2: Application Layer — Detection Integration
├── Implement record_detection_state_transition()
├── Integrate with Phase 6B-3 detection engine
└── Add follow-up evidence tracking

Step 3: Application Layer — Escalation
├── Implement create_instructor_escalation()
├── Add unsuccessful cycle counting
└── Integrate with remediation cycle evaluation

Step 4: Application Layer — Reset
├── Implement check_sustained_performance_reset_eligibility()
├── Implement execute_sustained_performance_reset()
└── Add scheduled job for eligibility checking

Step 5: Testing
├── Unit tests for state machines
├── Integration tests for escalation flow
├── Integration tests for reset flow
└── Concurrency tests

Step 6: Documentation
├── API documentation
├── State machine diagrams
└── Runbook for operations
```

---

## 10. Schema Summary

| Table | Purpose | Mutability | Key Constraint |
|-------|---------|------------|----------------|
| `instructor_escalations` | Track instructor review escalations | Mutable (state machine) | One active per user/concept |
| `instructor_escalation_events` | Audit escalation lifecycle | **Immutable** | Append-only |
| `sustained_performance_tracking` | Track CPW continuity | Mutable | One active per user/concept |
| `sustained_performance_resets` | Record reset events | **Immutable** | One per tracking period |
| `remediation_cycles` (modified) | Add reset linkage | Mutable | New columns only |

---

## HARD STOP

**Phase 6C-2c architecture review is complete. This document is review only.**

**No migrations. No runtime code. No UI. No commits. Awaiting human approval for implementation.**

---

## Appendix A: State Machine Diagrams

### A.1 Instructor Escalation State Machine

```
                    ┌─────────────┐
                    │   pending   │
                    │  (created)  │
                    └──────┬──────┘
                           │ instructor acknowledges
                           ▼
                    ┌─────────────┐
         ┌─────────│ acknowledged│
         │         └──────┬──────┘
         │                │ instructor starts work
         │                ▼
         │         ┌─────────────┐
         │         │ in_progress │
         │         └──────┬──────┘
         │                │ instructor resolves
         │                ▼
         │         ┌─────────────┐
         │         │  resolved   │
         │         └─────────────┘
         │
         │ system auto-clear (only if acknowledged_by IS NULL)
         ▼
┌─────────────────┐
│  auto_cleared   │
└─────────────────┘

         │ 30 days no acknowledgment
         ▼
┌─────────────────┐
│    expired      │
└─────────────────┘
```

### A.2 Sustained-Performance Reset State Machine

```
┌─────────────────┐
│  not_tracking   │◄────────────────────────────────────┐
│  (or ineligible)│                                     │
└────────┬────────┘                                     │
         │ detection: currently_performing_well         │
         ▼                                             │
┌─────────────────┐     transition out of CPW          │
│ tracking_active │────────────────────────────────────┤
│ (clock running) │     continuity_broken_at = NOW()   │
└────────┬────────┘                                     │
         │                                              │
         │ 30 days elapsed                              │
         │ AND follow_up_evidence_count >= 1            │
         │ AND continuity_broken_at IS NULL             │
         ▼                                              │
┌─────────────────┐                                     │
│ eligible_for    │─────────────────────────────────────┘
│ reset           │     reset executed (is_active = false)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ reset_executed  │
│ (immutable)     │
└─────────────────┘
```

---

## Appendix B: Function Signatures

```sql
-- Check reset eligibility
CREATE OR REPLACE FUNCTION check_sustained_performance_reset_eligibility(
  p_user_id uuid,
  p_concept_id text
) RETURNS TABLE (
  is_eligible boolean,
  entered_cpw_at timestamptz,
  days_in_cpw integer,
  follow_up_evidence_count integer,
  continuity_broken boolean,
  blocking_reason text
);

-- Execute reset (idempotent)
CREATE OR REPLACE FUNCTION execute_sustained_performance_reset(
  p_user_id uuid,
  p_concept_id text,
  p_executed_by uuid DEFAULT NULL
) RETURNS uuid;

-- Record detection state transition
CREATE OR REPLACE FUNCTION record_detection_state_transition(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_new_state text,
  p_evidence jsonb,
  p_quiz_attempt_id uuid DEFAULT NULL
) RETURNS void;

-- Create escalation (idempotent)
CREATE OR REPLACE FUNCTION create_instructor_escalation(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_school_id uuid,
  p_triggering_cycle_ids uuid[],
  p_unsuccessful_cycle_count integer,
  p_detection_evidence jsonb
) RETURNS uuid;
```

---

**Document End**
