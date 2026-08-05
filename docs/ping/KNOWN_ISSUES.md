# Known Issues — Persistent Engineering Issues and Workarounds

**Version:** 1.0  
**Created:** 2026-07-29  
**Last Updated:** 2026-07-29  
**Purpose:** Maintain a living document of unresolved problems, technical debt, environment limitations, recurring failures, and workarounds. This document is read during every session bootstrap.

---

## How to Use This Document

- **Read this document during every session bootstrap** (Phase 2, Step 2.4 of [BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md)).
- **Update this document when:**
  - A new issue is discovered
  - An issue status changes
  - A workaround is found
  - An issue is resolved
- **Do not delete resolved issues immediately** — mark them as "Resolved" and keep them for historical reference. Archive after 90 days.

---

## Issue Status Definitions

| Status | Description |
|--------|-------------|
| **Open** | Issue is active and unresolved |
| **In Progress** | Work is underway to resolve the issue |
| **Blocked** | Issue cannot be resolved due to external dependency |
| **Resolved** | Issue has been fixed and verified |
| **Archived** | Issue was resolved > 90 days ago and moved to archive |

---

## Issue Priority Definitions

| Priority | Description | Response Time |
|----------|-------------|---------------|
| **Critical** | Blocks all work or causes data loss | Immediate |
| **High** | Blocks specific features or causes significant degradation | Within 24 hours |
| **Medium** | Causes minor degradation or inconvenience | Within 1 week |
| **Low** | Cosmetic or minor inconvenience | Within 1 month |

---

## Active Issues

### ISSUE-001: Build Fails Due to Missing PDF Export Dependencies

- **ID:** ISSUE-001
- **Title:** Build fails due to missing `jspdf` and `jspdf-autotable` modules
- **Description:** The build fails with module not found errors for `jspdf` and `jspdf-autotable` in `src/lib/attendance/export-pdf.ts`. These dependencies are referenced in the code but not installed.
- **Priority:** High
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - Build error: `Module not found: Can't resolve 'jspdf'`
  - Build error: `Module not found: Can't resolve 'jspdf-autotable'`
  - Affects: `src/lib/attendance/export-pdf.ts`
  - Last verified: 2026-07-26
- **Workaround:** None — build is broken
- **Permanent Fix:** Install missing dependencies: `npm install jspdf jspdf-autotable`
- **Resolution:** (Not yet resolved)

---

### ISSUE-002: Lint Fails with 62 Errors and 60 Warnings

- **ID:** ISSUE-002
- **Title:** Lint fails with 62 errors and 60 warnings
- **Description:** ESLint reports 62 errors and 60 warnings. Most errors are `require()` imports in utility scripts instead of ES6 imports.
- **Priority:** Medium
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - 62 errors (mostly `require()` imports)
  - 60 warnings
  - Affects: Utility scripts in `scripts/` directory
  - Last verified: 2026-07-26
- **Workaround:** None — lint is broken
- **Permanent Fix:** Convert `require()` imports to ES6 imports in utility scripts
- **Resolution:** (Not yet resolved)

---

### ISSUE-003: TypeScript Fails Due to Missing PDF Export Dependencies

- **ID:** ISSUE-003
- **Title:** TypeScript compilation fails due to missing `jspdf` and `jspdf-autotable` modules
- **Description:** TypeScript compilation fails with the same missing module errors as the build (ISSUE-001).
- **Priority:** High
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - Same root cause as ISSUE-001
  - Last verified: 2026-07-26
- **Workaround:** None — TypeScript compilation is broken
- **Permanent Fix:** Install missing dependencies (same as ISSUE-001)
- **Resolution:** (Not yet resolved)

---

### ISSUE-004: No Automated Tests Found

- **ID:** ISSUE-004
- **Title:** No automated tests found (no Jest, Vitest, or Testing Library)
- **Description:** No test framework is installed. No unit tests, integration tests, or component tests exist. Playwright tests exist but are not configured to run.
- **Priority:** High
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - No Jest, Vitest, or Testing Library dependencies
  - Playwright tests exist but not configured
  - Last verified: 2026-07-26
- **Workaround:** Manual testing only
- **Permanent Fix:** Install and configure Vitest or Jest, write unit tests for critical paths
- **Resolution:** (Not yet resolved)

---

### ISSUE-005: Docker Desktop Not Running

- **ID:** ISSUE-005
- **Title:** Docker Desktop is installed but engine is not running
- **Description:** Docker Desktop is installed but the Docker engine is not running. This blocks `supabase db diff` and other Docker-dependent operations.
- **Priority:** Medium
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Gabriel
- **Notes:**
  - Docker Desktop installed
  - Docker engine not running
  - Blocks: `supabase db diff`, local Supabase development
  - Last verified: 2026-07-26
- **Workaround:** Use hosted Supabase instead of local development
- **Permanent Fix:** Start Docker Desktop before running Docker-dependent commands
- **Resolution:** (Not yet resolved)

---

### ISSUE-006: Vercel CLI Not Installed

- **ID:** ISSUE-006
- **Title:** Vercel CLI is not installed
- **Description:** Vercel CLI is not installed, preventing deployment verification and local Vercel development.
- **Priority:** Low
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - Vercel CLI not installed
  - Blocks: Deployment verification, local Vercel development
  - Last verified: 2026-07-26
- **Workaround:** Deploy via Vercel web interface or GitHub integration
- **Permanent Fix:** Install Vercel CLI: `npm install -g vercel`
- **Resolution:** (Not yet resolved)

---

### ISSUE-007: GitHub CLI Not Installed

- **ID:** ISSUE-007
- **Title:** GitHub CLI (`gh`) is not installed
- **Description:** GitHub CLI is not installed, preventing GitHub operations from the command line.
- **Priority:** Low
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - GitHub CLI not installed
  - Blocks: GitHub operations from command line
  - Last verified: 2026-07-26
- **Workaround:** Use GitHub web interface or Git commands
- **Permanent Fix:** Install GitHub CLI: `winget install GitHub.cli`
- **Resolution:** (Not yet resolved)

---

### ISSUE-008: No CI/CD Pipeline Configured

- **ID:** ISSUE-008
- **Title:** No CI/CD pipeline configured (no GitHub Actions)
- **Description:** No GitHub Actions or other CI/CD pipelines are configured. This means no automated testing, building, or deployment on commit.
- **Priority:** Medium
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - No `.github/workflows/` directory
  - No automated testing, building, or deployment
  - Last verified: 2026-07-26
- **Workaround:** Manual testing and deployment
- **Permanent Fix:** Create GitHub Actions workflow for build, lint, TypeScript, and test verification
- **Resolution:** (Not yet resolved)

---

### ISSUE-009: No Email Service Configured

- **ID:** ISSUE-009
- **Title:** No email service configured (no Resend, SendGrid, or SMTP)
- **Description:** No email service is configured. This blocks password reset emails, notification emails, and other email-dependent features.
- **Priority:** Medium
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - No Resend, SendGrid, or SMTP configuration found
  - Blocks: Password reset emails, notification emails
  - Last verified: 2026-07-26
- **Workaround:** None — email features are non-functional
- **Permanent Fix:** Configure Resend or SendGrid, add environment variables
- **Resolution:** (Not yet resolved)

---

### ISSUE-010: Chapters 16–21 Not Integrated into Next.js App

- **ID:** ISSUE-010
- **Title:** Chapters 16–21 exist as HTML files but are not integrated into Next.js app
- **Description:** Chapters 16–21 exist as standalone HTML files in the repository root (`chapter-16.html` through `chapter-21.html`) with flashcards and quizzes, but they are not integrated into the Next.js app.
- **Priority:** High
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - HTML files exist in repository root
  - Not integrated into Next.js app
  - Blocks: Complete curriculum availability
  - Last verified: 2026-07-26
- **Workaround:** None — chapters 16–21 are not accessible in the app
- **Permanent Fix:** Convert HTML files to TypeScript content files and integrate into Next.js app
- **Resolution:** (Not yet resolved)

---

### ISSUE-011: Chapter 6 Flashcards Missing

- **ID:** ISSUE-011
- **Title:** Chapter 6 flashcards are missing
- **Description:** Chapter 6 has a lesson and quiz, but flashcards are missing.
- **Priority:** Medium
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - Chapter 6 lesson and quiz present
  - Chapter 6 flashcards missing
  - Last verified: 2026-07-26
- **Workaround:** None — Chapter 6 flashcards are not available
- **Permanent Fix:** Create Chapter 6 flashcards
- **Resolution:** (Not yet resolved)

---

### ISSUE-012: No Analytics Configured

- **ID:** ISSUE-012
- **Title:** No analytics configured (no Vercel Analytics or Speed Insights)
- **Description:** No analytics are configured. This prevents tracking user behavior, performance metrics, and other analytics data.
- **Priority:** Low
- **Status:** Open
- **Date Opened:** 2026-07-26
- **Related Project:** ASCYN PRO
- **Owner:** Ping
- **Notes:**
  - No Vercel Analytics or Speed Insights found
  - Last verified: 2026-07-26
- **Workaround:** None — analytics are not available
- **Permanent Fix:** Install and configure Vercel Analytics and Speed Insights
- **Resolution:** (Not yet resolved)

---

## Resolved Issues

*(No resolved issues yet)*

---

## Archived Issues

*(No archived issues yet)*

---

## Issue Template

Use this template when adding new issues:

```markdown
### ISSUE-XXX: [Title]

- **ID:** ISSUE-XXX
- **Title:** [Short title]
- **Description:** [Detailed description of the issue]
- **Priority:** [Critical / High / Medium / Low]
- **Status:** [Open / In Progress / Blocked / Resolved / Archived]
- **Date Opened:** [YYYY-MM-DD]
- **Related Project:** [Project name]
- **Owner:** [Person responsible]
- **Notes:**
  - [Additional context]
  - [Error messages]
  - [Affected files]
  - [Last verified date]
- **Workaround:** [Temporary solution, if any]
- **Permanent Fix:** [Long-term solution]
- **Resolution:** [How the issue was resolved, or "Not yet resolved"]
```

---

## Cross-References

- **[BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md)** — Mandatory startup procedure (reads this document)
- **[STARTUP_CHECKLIST.md](STARTUP_CHECKLIST.md)** — Concise startup checklist (references this document)
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state (may reference open issues)
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — Evidence standards for issue verification

---

*This document is a living document. Update it whenever issues are discovered, resolved, or change status.*
