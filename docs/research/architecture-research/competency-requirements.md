# Competency Requirements

**Document:** Competency Architecture Requirements  
**Last Updated:** 2026-08-14  
**Status:** RESEARCH ONLY — NOT AUTHORIZED FOR IMPLEMENTATION

---

## Purpose

Define the requirements for a competency taxonomy system that would enable ASCYN PRO to track student mastery at a granular level.

---

## Current State

**Status:** PARTIAL — Basic competency tracking exists but lacks formal taxonomy.

The current system has:
- Chapter-level content organization
- Quiz/question tagging by chapter
- Basic weak-area identification

The current system lacks:
- Formal competency taxonomy
- Granular skill/knowledge tracking
- Competency-to-question mapping
- Competency mastery thresholds
- Cross-chapter competency relationships

---

## Future Requirements (Hypothetical)

### Competency Taxonomy

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Hierarchical taxonomy | Domain → Competency → Sub-competency | High |
| Exam-domain mapping | Map competencies to licensing exam domains | High |
| Question tagging | Tag each question with relevant competencies | High |
| Mastery thresholds | Define what "mastered" means per competency | Medium |
| Prerequisite relationships | Define which competencies depend on others | Medium |

### Data Model Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Competency entity | Store competency definitions | High |
| Question-competency junction | Many-to-many relationship | High |
| Student-competency tracking | Track mastery level per student per competency | High |
| Competency history | Track changes in mastery over time | Medium |

### Analytics Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Competency heat map | Visual representation of class-wide competency gaps | Medium |
| Individual competency profile | Per-student competency breakdown | High |
| Competency trend analysis | Track improvement over time | Medium |
| Exam-domain readiness | Aggregate competency mastery to exam-domain level | High |

---

## ASCYN PRO Implication

A formal competency taxonomy would enable:
- More precise weak-area identification
- Targeted remediation assignment
- Better readiness calculations
- Instructor-level competency analytics

**However:** This is a significant architectural change. See [Decision DEC-2026-08-14-002](../decision-log/decisions.md) — no major pre-NABBA architecture.

---

## Dependencies

- Exam blueprint architecture (for domain mapping)
- Question tagging system
- Student progress tracking enhancements
- Instructor dashboard updates

---

## Reverification

Reassess after NABBA validation and post-NABBA architecture review.

---

*Last Updated: 2026-08-14*
