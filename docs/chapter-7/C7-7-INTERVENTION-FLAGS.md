# C7-7 — Intervention Flags & Escalation Rules

## Scope

C7-7 implements the five intervention conditions required by the Chapters 7+ grading/mastery framework.

This phase is rules + tests only.

**No instructor UI is wired in C7-7.**

## Canonical flag types

1. **Persistent weakness**
   - Concept-level
   - Priority
   - Requires multiple observations, multiple unique items, and multiple evidence sources.
   - Does not trigger from insufficient evidence.

2. **Remediation failure**
   - Concept-level
   - Priority
   - Uses the latest completed formal reassessment cycle of at least five questions.
   - Triggers below 80%.
   - Clears after a later completed formal cycle reaches at least 80%.

3. **Repeated safety/procedure misses**
   - Concept-level, limited to `Chemical Safety, Labels & Interactions`
   - Urgent
   - Reviews recent application/scenario evidence.
   - Can trigger earlier than general weakness because repeated safety misses are higher priority.
   - Still requires repeated, unique hard observations rather than one isolated mistake.

4. **Declining mastery**
   - Concept-level
   - Priority
   - Requires three recent mastery snapshots spanning at least seven days.
   - Requires a sustained downward trend of at least 15 points with the latest mastery at or below 65%.
   - Does not trigger on small score noise.

5. **Completion/mastery mismatch**
   - Chapter-level
   - Advisory
   - Requires completion at or above 85%, mastery at or below 65%, at least eight evidence observations, and evidence across at least three concept families.
   - Prevents high completion alone from being mistaken for understanding.

## Trigger / clear hysteresis

Flags use different trigger and clear thresholds so they do not flicker around one cutoff.

### Persistent weakness
Trigger:
- mastery <= 60%
- confidence is not Insufficient Evidence
- >= 5 observations
- >= 4 unique items
- >= 2 evidence source types

Clear:
- mastery >= 75%
- confidence >= Developing

### Remediation failure
Trigger:
- latest completed formal reassessment has >= 5 questions
- score < 80%

Clear:
- a later completed formal reassessment reaches >= 80%

### Safety/procedure
Trigger:
- high-priority Chapter 7 chemical-safety evidence only
- application/scenario difficulty only
- >= 3 unique recent items
- >= 2 recent misses in the four-item review window

Clear:
- four consecutive correct qualifying safety observations

### Declining mastery
Trigger:
- >= 3 snapshots
- snapshot span >= 7 days
- monotonic decline across the evaluated three-snapshot window
- drop >= 15 points
- latest mastery <= 65%
- latest confidence is not Insufficient Evidence

Clear:
- mastery >= 75%, OR
- latest snapshot improves >= 10 points over the prior snapshot with confidence >= Developing

### Completion/mastery mismatch
Trigger:
- completion >= 85%
- overall mastery <= 65%
- >= 8 evidence observations
- >= 3 represented concept families

Clear:
- overall mastery >= 75%

## Safety-specific rule

Safety is intentionally stricter than ordinary concept weakness.

The safety flag does not wait for the general confidence algorithm to become Developing if there are already repeated, unique application/scenario misses in the dedicated Chapter 7 chemical-safety family.

This is not a single-miss alarm. Two misses must occur within a recent four-item hard-evidence window, with at least three unique qualifying items.

## Evidence integrity

C7-7:
- uses canonical concept-family mappings,
- never moves evidence between concepts,
- preserves first-attempt and reassessment history,
- evaluates the same evidence set deterministically,
- returns human-readable concept names and reasons for future instructor presentation,
- does not expose database row IDs in instructor-facing reasons,
- treats prior active flags as state only for hysteresis; the evidence itself remains authoritative.

## UI boundary

C7-7 does **not** render badges, alerts, cards, tables, or instructor notifications.

The next phase may consume these deterministic flag objects in instructor diagnostics only after C7-7 Engineering Verification and Vercel are GREEN.
