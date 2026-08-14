# Current Product Position

**Document:** Current Product Position  
**Last Updated:** 2026-08-14  
**Status:** ACTIVE

---

## Product Identity

**Name:** ASCYN PRO  
**Tagline:** Elevate. Learn. Succeed.  
**Type:** AI-powered professional licensing education platform  
**Current Focus:** Barbering  
**Vision:** Expand to cosmetology, esthetics, nail technology, instructor education, and other licensed professions

---

## Mission

Improve understanding and first-time licensing exam pass rates while keeping education affordable, accessible, and engaging.

**Core Principle:** AI should improve education, not replace educators.

---

## Current Capabilities

### Student Learning Platform

| Feature | Status | Notes |
|---------|--------|-------|
| Chapter-based curriculum (1-21) | ✅ Complete | Chapters 1-21 integrated |
| Interactive flashcards | ✅ Complete | Ch 6 uses enhanced fallback |
| Chapter quizzes | ✅ Complete | Passing scores, retest logic |
| Missed questions bank | ✅ Complete | Tracks incorrect answers |
| Progress tracking | ✅ Complete | Chapter progress, quiz history |
| Board readiness engine | ✅ Complete | Estimates exam readiness |
| AI tutor / remediation | ✅ Complete | AI-powered assistance |

### Instructor Platform

| Feature | Status | Notes |
|---------|--------|-------|
| Student roster | ✅ Complete | Search, filter, at-risk flags |
| Student detail views | ✅ Complete | Progress, flashcards, quiz average |
| Weak-area analytics | ✅ Complete | Chapter-level weak areas |
| Instructor notes | ✅ Complete | Add/view notes (persistence pending) |
| School analytics | ✅ Complete | At-risk students, class trends |
| Attendance tracking | ✅ Complete | Clock-in/out |
| Gradebook | ✅ Complete | Assessment tracking |

### Admin Platform

| Feature | Status | Notes |
|---------|--------|-------|
| School settings | ✅ Complete | Phase 10 Sprint 1 (uncommitted) |
| User management | ⚠️ Partial | Basic stats only |
| School management | ⚠️ Partial | Basic stats only |
| Content management | ❌ Missing | No CMS |

---

## Market Position

### Target Market

- Small barber schools (10-50 students)
- New schools without curriculum
- Schools unhappy with Pivot Point pricing
- State-specific exam prep needs

### Pricing Strategy (Proposed)

| Tier | Price | Target |
|------|-------|--------|
| Free | $0 | 1 chapter + sample exam (lead gen) |
| Student | $19.99 | Individual students |
| School | $999/year | Unlimited students |
| Enterprise | $2,999/year | White-label |

---

## Competitive Position

### What ASCYN PRO Is NOT

- Not just "exam prep aligned to licensing examination" (Milady does this)
- Not just "student performance analytics" (Pivot Point does this)
- Not just "detect → alert → intervene" (CourseKey does this)

### What ASCYN PRO Aims to Be

**Working Description:**

> ASCYN PRO helps schools identify learning gaps, target remediation, monitor progress, and intervene earlier as students prepare for licensure.

**Strategic Hypothesis (Not Yet Validated):**

Instructor-centered workflow:
```
Learning Gap → Instructor Action → Targeted Remediation → Follow-Up → Evidence of Improvement
```

---

## Current Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| No email service | No automated notifications | Manual communication |
| No CI/CD | Manual deployment | Careful verification |
| No persistent instructor notes | Feature incomplete | Database table needed |
| Admin portal incomplete | Limited school management | Phase 10 in progress |
| Chapter 6 flashcards fallback | Incomplete curriculum | Premium content needed |

---

## Production Status

| Metric | Value | Date |
|--------|-------|------|
| Production URL | https://ascynpro.com | 2026-08-03 |
| Pilot Status | Active | 2026-08-03 |
| PAT Tests | 41/41 passed | 2026-08-03 |
| Build | Passing | 2026-08-05 |
| Tests | 385/385 passing | 2026-08-05 |

---

*Last Updated: 2026-08-14*
