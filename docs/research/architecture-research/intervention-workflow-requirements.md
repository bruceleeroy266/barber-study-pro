# Intervention Workflow Requirements

**Document:** Intervention Workflow Architecture Requirements  
**Last Updated:** 2026-08-14  
**Status:** RESEARCH ONLY — NOT AUTHORIZED FOR IMPLEMENTATION

---

## Purpose

Define the requirements for an instructor-centered intervention workflow system.

---

## Strategic Hypothesis Context

ASCYN PRO is investigating an instructor-centered workflow:

```
Learning Gap → Instructor Action → Targeted Remediation → Follow-Up → Evidence of Improvement
```

This document defines what architecture would be needed to support that workflow.

---

## Current State

**Status:** PARTIAL — Basic at-risk flags and instructor notes exist.

The current system has:
- Student roster with at-risk flags
- Instructor notes
- Weak-area analytics
- Missed question bank

The current system lacks:
- Formal intervention workflow
- Intervention assignment tracking
- Intervention outcome measurement
- Follow-up scheduling
- Evidence-of-improvement documentation

---

## Future Requirements (Hypothetical)

### Workflow Stages

| Stage | Description | Current Support |
|-------|-------------|-----------------|
| **Detect** | Identify learning gap | ✅ Partial (weak-area analytics) |
| **Alert** | Notify instructor | ❌ Missing |
| **Assign** | Instructor assigns targeted remediation | ❌ Missing |
| **Track** | Monitor student completion of remediation | ❌ Missing |
| **Verify** | Retest to verify improvement | ❌ Missing |
| **Document** | Record evidence of improvement | ❌ Missing |

### Data Model Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Intervention entity | Store intervention records | High |
| Intervention type taxonomy | Categorize intervention types | Medium |
| Assignment tracking | Link intervention to student and competency | High |
| Outcome tracking | Record pre/post intervention performance | High |
| Follow-up scheduling | Schedule and track follow-up activities | Medium |
| Evidence documentation | Store evidence of improvement | High |

### Notification Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Instructor alert | Notify instructor of at-risk student | High |
| Student notification | Notify student of assigned remediation | Medium |
| Follow-up reminder | Remind instructor of pending follow-ups | Medium |
| Escalation | Escalate if intervention not completed | Low |

---

## Competitive Context

CourseKey already provides retention risk and intervention workflows. ASCYN PRO's differentiation would be:
- Intervention within licensure exam preparation context
- Competency-linked remediation (not just attendance/engagement)
- Evidence-of-improvement documentation for school compliance

**This is a hypothesis — not yet validated.**

---

## ASCYN PRO Implication

This workflow is the core of ASCYN PRO's potential differentiation. Implementation would require:
- Significant database schema changes
- New UI components for intervention management
- Notification system
- Reporting/analytics for intervention outcomes

**See [Decision DEC-2026-08-14-002](../decision-log/decisions.md) — no major pre-NABBA architecture.**

---

## Reverification

Reassess after NABBA validation.

---

*Last Updated: 2026-08-14*
