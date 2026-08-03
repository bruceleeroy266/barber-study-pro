# ASCYN PRO - Technical Debt Register

**Version:** 1.0  
**Date:** 2026-08-03  
**Baseline:** `pilot-ready-2026-08`

---

## Overview

This register catalogs all known technical debt items identified during Production Acceptance Testing. Items are categorized by severity and include impact assessment and recommended follow-up actions.

**Pilot Status:** No items block pilot operations.

---

## Low Severity

### TD-001: React Hydration Warning #418

| Field | Value |
|---|---|
| **Severity** | Low |
| **Category** | Frontend / React |
| **Status** | Documented |
| **Identified** | 2026-08-03 |

**Description:**  
Minified React error #418 occurs during page hydration. This is a text mismatch between server-rendered and client-rendered content.

**Evidence:**
```
Error: Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]=
```

**User Impact:**  
None. Pages render correctly and function as expected.

**Recommended Follow-up:**  
- Review hydration patterns in affected components
- Consider using `suppressHydrationWarning` for intentional mismatches
- Schedule for post-pilot cleanup

**Blocks Pilot:** No

---

### TD-002: `flagged_flashcards` 404

| Field | Value |
|---|---|
| **Severity** | Low |
| **Category** | Database / API |
| **Status** | Documented |
| **Identified** | 2026-08-03 |

**Description:**  
The `flagged_flashcards` table returns 404 when queried. This feature may not be fully enabled or the table may not exist.

**Evidence:**
```
https://hgyznydxepjsvbjsirpv.supabase.co/rest/v1/flagged_flashcards?select=flashcard_id&user_id=eq... 404
```

**User Impact:**  
None. Flashcard functionality works through chapters; flagging is an optional feature.

**Recommended Follow-up:**  
- Verify if flashcard flagging is needed for pilot
- Create table if feature is required
- Remove queries if feature is deprecated

**Blocks Pilot:** No

---

### TD-003: RSC Prefetch Aborts

| Field | Value |
|---|---|
| **Severity** | Low |
| **Category** | Frontend / Network |
| **Status** | Documented |
| **Identified** | 2026-08-03 |

**Description:**  
Multiple `net::ERR_ABORTED` errors on React Server Component prefetch requests during navigation.

**Evidence:**
```
https://ascynpro.com/dashboard/chapters?_rsc=... net::ERR_ABORTED
```

**User Impact:**  
None. This is expected behavior when navigating before prefetch completes.

**Recommended Follow-up:**  
- No action required
- Monitor for any actual navigation failures

**Blocks Pilot:** No

---

## Medium Severity

### TD-004: Instructor RLS 403 Errors

| Field | Value |
|---|---|
| **Severity** | Medium |
| **Category** | Database / Security |
| **Status** | Documented |
| **Identified** | 2026-08-03 |

**Description:**  
Instructor role receives 403 Forbidden errors on certain Supabase REST queries for grades, grade_categories, assessments, and assessment_rubrics.

**Evidence:**
```
https://hgyznydxepjsvbjsirpv.supabase.co/rest/v1/grades?select=*&school_id=eq... 403
https://hgyznydxepjsvbjsirpv.supabase.co/rest/v1/grade_categories?select=*... 403
https://hgyznydxepjsvbjsirpv.supabase.co/rest/v1/assessments?select=*... 403
https://hgyznydxepjsvbjsirpv.supabase.co/rest/v1/assessment_rubrics?select=*... 403
```

**User Impact:**  
Pages render correctly, but some instructor data views may be limited or empty.

**Recommended Follow-up:**  
- Review RLS policies for instructor role
- Verify school_id filtering is correct
- Test with actual pilot instructor account
- Adjust policies if instructors need broader access

**Blocks Pilot:** No

---

### TD-005: Messaging Placeholder

| Field | Value |
|---|---|
| **Severity** | Medium |
| **Category** | Feature / Incomplete |
| **Status** | Documented |
| **Identified** | 2026-08-03 |

**Description:**  
Messaging pages display placeholder content: "School-scoped messaging and notifications are coming soon."

**Evidence:**
```
📬
Instructor Messaging

School-scoped messaging and notifications are coming soon. In the meantime, please contact your instructor or school administrator directly.

Demo Mode preview only. No messages can be sent.
```

**User Impact:**  
Users cannot send in-app messages. Must use external communication methods.

**Recommended Follow-up:**  
- Implement messaging post-pilot
- Use email or external tools during pilot
- Set user expectations in onboarding

**Blocks Pilot:** No

---

### TD-006: No Email Service

| Field | Value |
|---|---|
| **Severity** | Medium |
| **Category** | Infrastructure / Integration |
| **Status** | Documented |
| **Identified** | 2026-08-03 |

**Description:**  
No email service (Resend, SendGrid, SMTP) is configured for automated notifications.

**Evidence:**  
No email configuration found in environment variables or codebase.

**User Impact:**  
- No automated welcome emails
- No password reset emails (if implemented)
- No notification emails
- Manual communication required

**Recommended Follow-up:**  
- Evaluate email service needs for pilot
- Configure Resend or similar if needed
- Document manual communication procedures

**Blocks Pilot:** No

---

## High Severity

**No high severity items identified.**

---

## Summary Statistics

| Severity | Count | Blocks Pilot |
|---|---|---|
| Low | 3 | 0 |
| Medium | 3 | 0 |
| High | 0 | 0 |
| **Total** | **6** | **0** |

---

## Review Schedule

| Review | Date | Focus |
|---|---|---|
| Pilot Launch | 2026-08-03 | Verify no blocking issues |
| Mid-Pilot | TBD | Assess user feedback |
| Post-Pilot | TBD | Prioritize fixes |

---

## Change Log

| Date | Item | Change |
|---|---|---|
| 2026-08-03 | All | Initial register created |

---

**End of Technical Debt Register**
