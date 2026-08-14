# Integration Requirements

**Document:** Integration Architecture Requirements  
**Last Updated:** 2026-08-14  
**Status:** RESEARCH ONLY — NOT AUTHORIZED FOR IMPLEMENTATION

---

## Purpose

Define the requirements for integrating ASCYN PRO with external systems used by schools.

---

## Strategic Context

ASCYN PRO is investigating a "complement, not replace" positioning strategy (see [Decision DEC-2026-08-14-005](../decision-log/decisions.md)). This requires understanding what integrations schools would need.

---

## Current State

**Status:** MISSING — No external integrations exist.

---

## Potential Integration Targets

### Student Information Systems (SIS)

| System | Integration Type | Priority | Notes |
|--------|-----------------|----------|-------|
| Generic CSV import | File-based | High | Minimum viable integration |
| Generic API | REST API | Medium | Requires standard API design |
| Specific SIS platforms | Native integration | Low | Requires partnership |

### Learning Management Systems (LMS)

| System | Integration Type | Priority | Notes |
|--------|-----------------|----------|-------|
| Pivot Point | Data sync | Medium | If complement positioning validated |
| Milady | Data sync | Medium | If complement positioning validated |
| Generic LTI | LTI standard | Medium | Standard LMS integration protocol |

### Communication Platforms

| System | Integration Type | Priority | Notes |
|--------|-----------------|----------|-------|
| Email (Resend) | Transactional email | High | Already configured but not integrated |
| SMS | Text notifications | Medium | For intervention alerts |
| Push notifications | Mobile notifications | Low | Requires mobile app |

### Analytics / Reporting

| System | Integration Type | Priority | Notes |
|--------|-----------------|----------|-------|
| State reporting | Compliance data export | Medium | For school state reporting |
| Accreditation reporting | Compliance data export | Low | For school accreditation |

---

## Integration Architecture Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| API layer | RESTful API for external access | High |
| Authentication | OAuth 2.0 / API keys for external systems | High |
| Data mapping | Map ASCYN PRO data model to external formats | Medium |
| Webhook support | Real-time event notifications | Medium |
| Batch import/export | CSV/JSON batch operations | High |
| Rate limiting | Protect API from abuse | Medium |

---

## ASCYN PRO Implication

Integration capabilities are essential for the "complement" positioning strategy. Without them, schools would need to manually transfer data between systems, creating friction.

**However:** Integration architecture is a significant investment. Validation of the complement hypothesis should precede implementation.

---

## Reverification

Reassess after NABBA validation and complement positioning validation.

---

*Last Updated: 2026-08-14*
