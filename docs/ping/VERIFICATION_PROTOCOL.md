# Verification Protocol — Evidence Standards and Audit Procedures

**Purpose:** This file defines how Ping verifies claims, maintains evidence standards, and conducts audits. Follow this protocol to ensure all work is verifiable and traceable.

---

## Table of Contents

1. [Evidence Standards](#evidence-standards)
2. [Confidence Levels](#confidence-levels)
3. [Search Protocol](#search-protocol)
4. [Verification Procedures](#verification-procedures)
5. [Audit Procedures](#audit-procedures)
6. [Documentation Requirements](#documentation-requirements)
7. [Common Verification Scenarios](#common-verification-scenarios)

---

## Evidence Standards

### Core Principle

**Every significant conclusion must be evidence-backed.** Do not state "missing," "not found," "does not exist," or "works" without documenting where you searched and what you found.

### Evidence Citation Format

Every conclusion must include:

```markdown
**Conclusion:** [Statement]
**Confidence:** [High/Medium/Low]
**Evidence:**
- Location searched: [path]
- Search method: [command or procedure]
- Results: [what was found]
- Date verified: [YYYY-MM-DD]
**Alternative locations not yet searched:** [if any]
**Recommended next step:** [if confidence is Medium or Low]
```

### Example: Good Evidence Citation

```markdown
**Conclusion:** Chapter 16 premium content exists and is integrated
**Confidence:** High
**Evidence:**
- Location searched: `src/lib/chapter-16-premium.ts`
- Search method: `Get-ChildItem -Path "src\lib" -Filter "chapter-16*"`
- Results: Found `chapter-16-premium.ts`, `chapter-16-premium-flashcards.ts`, `chapter-16-premium-quiz.ts`
- Date verified: 2026-07-28
```

### Example: Bad Evidence Citation (DO NOT DO THIS)

```markdown
**Conclusion:** Chapter 16 is missing
**Confidence:** Medium
**Evidence:** I didn't see it
```

**Why this is bad:**
- No search locations documented
- No search method described
- No date verified
- Confidence is Medium but no next step provided

---

## Confidence Levels

### Level Definitions

| Level | Definition | When to Use | Required Action |
|-------|-----------|-------------|-----------------|
| **High** | Direct evidence found in primary location; verified within last 24 hours | File exists and was read; command executed successfully | None — conclusion is reliable |
| **Medium** | Indirect evidence or evidence found in secondary location; verified within last week | File exists but not read; inferred from related files | Provide recommended next step |
| **Low** | No direct evidence; based on historical documentation or assumption | Historical claim not yet verified; circumstantial evidence | Must verify before relying on conclusion |

### Confidence Level Examples

**High Confidence:**
- "Build passes" — Ran `npm run build`, exit code 0
- "Chapter 4 premium content exists" — Read `src/lib/chapter-4-premium.ts`
- "Supabase project linked" — Ran `supabase link`, saw project ref

**Medium Confidence:**
- "Chapter 16 content exists" — Found HTML files in repository root, but not verified if integrated
- "Database schema is current" — Migrations exist, but Docker blocked so can't run `supabase db diff`
- "Tests exist" — Found test files, but not run

**Low Confidence:**
- "Pilot program is active" — Historical PDF claims it, but can't verify without Docker
- "Production deployment works" — No Vercel CLI, can't verify
- "Email delivery works" — No email provider configured, can't test

---

## Search Protocol

### Mandatory Search Order

Before concluding any asset is "not located," search in this exact order and document each step:

| Step | Location | Search Method | Documentation Required |
|------|----------|-------------|----------------------|
| 1 | Primary Repository | `Get-ChildItem -Recurse` with filters | List of files found matching criteria |
| 2 | OpenClaw Workspace | `Get-ChildItem -Recurse` with filters | List of files found matching criteria |
| 3 | Documentation Directories | `docs/`, `documentation/`, `*.md` pattern | List of markdown files found |
| 4 | Report Directories | `reports/`, `QA Reports/`, `*-report*.md`, `*-audit*.md` | List of report files found |
| 5 | Educational Content | `content-library/`, `src/lib/`, `src/content/`, `chapter-*` pattern | List of content files found |
| 6 | Migration Directories | `supabase/migrations/`, `sql/`, `database/` | List of SQL files found |
| 7 | Configuration | `package.json`, `tsconfig.json`, `next.config.*`, `tailwind.config.*`, `eslint.config.*`, `vercel.json`, `.env*` | List of config files found |
| 8 | Archived Folders | `archive/`, `archived/`, `backup/`, `old/`, `*-v2/`, `*-old/` | List of archived directories found |
| 9 | Git History | `git log --all --full-history -- "**/filename"` | Git log results |
| 10 | Git Branches | `git branch -a` and `git tag` | List of branches and tags |

### Search Documentation Template

```markdown
## Search for [Asset Name]

**Date:** YYYY-MM-DD
**Searcher:** Ping

### Search Steps

1. **Primary Repository**
   - Command: `Get-ChildItem -Path "C:\Users\gabeb\Projects\barber-study-pro" -Recurse -Filter "*asset-name*"`
   - Results: [List files found or "No files found"]

2. **OpenClaw Workspace**
   - Command: `Get-ChildItem -Path "C:\Users\gabeb\.openclaw\workspace" -Recurse -Filter "*asset-name*"`
   - Results: [List files found or "No files found"]

3. **Documentation Directories**
   - Command: `Get-ChildItem -Path "docs" -Recurse -Filter "*.md"`
   - Results: [List files found or "No files found"]

[Continue for all 10 steps...]

### Conclusion

**Status:** [Found/Not Found/Partially Found]
**Confidence:** [High/Medium/Low]
**Evidence:** [Summary of what was found where]
**Recommended Next Step:** [If confidence is Medium or Low]
```

---

## Verification Procedures

### Procedure: Verifying Build Status

**Steps:**

1. **Run Build Command**
   ```powershell
   cd C:\Users\gabeb\Projects\barber-study-pro
   npm run build
   ```

2. **Record Results**
   - Exit code (0 = success, non-zero = failure)
   - Error messages (if any)
   - Pages generated
   - Build time

3. **Document**
   ```markdown
   **Build Status:** ✅ PASSING / ❌ FAILING
   **Confidence:** High
   **Evidence:**
   - Command: `npm run build`
   - Exit code: 0
   - Pages generated: 31
   - Date verified: 2026-07-28
   ```

**Success Criteria:**
- Exit code 0
- No error messages
- All pages generated

---

### Procedure: Verifying Lint Status

**Steps:**

1. **Run Lint Command**
   ```powershell
   npm run lint
   ```

2. **Record Results**
   - Exit code
   - Error count
   - Warning count
   - Specific errors/warnings

3. **Document**
   ```markdown
   **Lint Status:** ✅ PASSING / ❌ FAILING
   **Confidence:** High
   **Evidence:**
   - Command: `npm run lint`
   - Exit code: 1
   - Errors: 21
   - Warnings: 10
   - Date verified: 2026-07-28
   ```

**Success Criteria:**
- Exit code 0
- 0 errors
- 0 warnings (or documented exceptions)

---

### Procedure: Verifying TypeScript Status

**Steps:**

1. **Run TypeScript Check**
   ```powershell
   npx tsc --noEmit
   ```

2. **Record Results**
   - Exit code
   - Error messages (if any)

3. **Document**
   ```markdown
   **TypeScript Status:** ✅ PASSING / ❌ FAILING
   **Confidence:** High
   **Evidence:**
   - Command: `npx tsc --noEmit`
   - Exit code: 0
   - Date verified: 2026-07-28
   ```

**Success Criteria:**
- Exit code 0
- No type errors

---

### Procedure: Verifying File Existence

**Steps:**

1. **Search for File**
   ```powershell
   Get-ChildItem -Path "C:\Users\gabeb\Projects\barber-study-pro" -Recurse -Filter "filename"
   ```

2. **Record Results**
   - Files found (with paths)
   - File sizes
   - Last modified dates

3. **Document**
   ```markdown
   **File Status:** ✅ FOUND / ❌ NOT FOUND
   **Confidence:** High
   **Evidence:**
   - Command: `Get-ChildItem -Recurse -Filter "filename"`
   - Results: Found at `path/to/file`
   - Size: 1234 bytes
   - Last modified: 2026-07-28
   - Date verified: 2026-07-28
   ```

**Success Criteria:**
- File found in expected location
- File is readable

---

### Procedure: Verifying Command Availability

**Steps:**

1. **Run Version Command**
   ```powershell
   command --version
   ```

2. **Record Results**
   - Version number (if found)
   - Error message (if not found)

3. **Document**
   ```markdown
   **Command Status:** ✅ AVAILABLE / ❌ NOT AVAILABLE
   **Confidence:** High
   **Evidence:**
   - Command: `command --version`
   - Result: v1.2.3 / "command not found"
   - Date verified: 2026-07-28
   ```

**Success Criteria:**
- Command executes without error
- Version number returned

---

### Procedure: Verifying Database Schema

**Steps:**

1. **Check Docker Status**
   ```powershell
   docker --version
   docker ps
   ```

2. **Check Supabase Status**
   ```powershell
   supabase status
   ```

3. **Run Schema Diff** (if Docker running)
   ```powershell
   supabase db diff
   ```

4. **Record Results**
   - Docker status
   - Supabase connection status
   - Schema differences (if any)

5. **Document**
   ```markdown
   **Database Schema Status:** ✅ SYNCED / ⚠️ PARTIAL / ❌ BLOCKED
   **Confidence:** High/Medium/Low
   **Evidence:**
   - Docker: Running / Not running
   - Supabase: Connected / Not connected
   - Schema diff: No differences / Differences found / Cannot run
   - Date verified: 2026-07-28
   ```

**Success Criteria:**
- Docker running
- Supabase connected
- No schema differences

---

## Audit Procedures

### Procedure: Conducting a Repository Audit

**Steps:**

1. **Define Audit Scope**
   - What are you auditing? (Files, features, security, etc.)
   - What questions need answers?

2. **Create Audit Checklist**
   - List all items to verify
   - Define success criteria for each

3. **Execute Audit**
   - Follow search protocol
   - Document all findings
   - Record evidence for each item

4. **Analyze Results**
   - Identify gaps
   - Identify issues
   - Prioritize findings

5. **Document Audit**
   ```markdown
   # Audit Report: [Title]

   **Date:** YYYY-MM-DD
   **Auditor:** Ping
   **Scope:** [What was audited]

   ## Executive Summary
   [High-level findings]

   ## Methodology
   [How the audit was conducted]

   ## Findings
   [Detailed findings with evidence]

   ## Recommendations
   [Prioritized recommendations]

   ## Appendix
   [Raw data, search results, evidence]
   ```

**Success Criteria:**
- [ ] All checklist items verified
- [ ] Evidence documented for each finding
- [ ] Confidence levels assigned
- [ ] Recommendations prioritized

---

### Procedure: Conducting a Security Audit

**Steps:**

1. **Identify Security Areas**
   - Authentication
   - Authorization
   - Data protection
   - Input validation
   - Error handling
   - Logging

2. **Review Each Area**
   - Read relevant code
   - Identify vulnerabilities
   - Document findings

3. **Test Security Controls**
   - Test auth flows
   - Test permission checks
   - Test input validation
   - Test error handling

4. **Document Findings**
   ```markdown
   ## Security Finding: [Title]

   **Severity:** Critical/High/Medium/Low
   **Area:** Authentication/Authorization/Data Protection/etc.
   **Status:** Open/Fixed/Mitigated

   ### Description
   [What the vulnerability is]

   ### Evidence
   [Code snippets, test results, etc.]

   ### Impact
   [What could happen if exploited]

   ### Recommendation
   [How to fix]

   ### References
   [CWE, OWASP, etc.]
   ```

**Success Criteria:**
- [ ] All security areas reviewed
- [ ] Vulnerabilities documented with evidence
- [ ] Severity assigned to each finding
- [ ] Recommendations provided

---

## Documentation Requirements

### Required Documentation for All Work

| Work Type | Required Documentation |
|-----------|----------------------|
| **Code changes** | What changed, why, how to verify |
| **Bug fixes** | Root cause, fix description, verification steps |
| **New features** | Requirements, architecture, usage examples |
| **Content creation** | Learning objectives, content outline, sources |
| **Database changes** | Schema changes, migration rationale, rollback plan |
| **Configuration changes** | What changed, why, impact, rollback plan |
| **Decisions** | Context, options, decision, rationale, consequences |

### Documentation Standards

1. **Be specific** — Don't say "updated the code," say "added rate limiting to login endpoint"
2. **Include evidence** — Don't say "it works," say "verified with `npm run build`, exit code 0"
3. **Explain why** — Don't just document what, document why
4. **Link related docs** — Cross-reference related documentation
5. **Date everything** — Always include verification dates

---

## Common Verification Scenarios

### Scenario 1: Verifying a Feature Works

**Claim:** "Password reset feature works"

**Verification Steps:**
1. Read password reset code
2. Run build and lint
3. Test password reset flow manually
4. Verify email sent (if email configured)
5. Verify password updated in database

**Documentation:**
```markdown
**Claim:** Password reset feature works
**Confidence:** High
**Evidence:**
- Code reviewed: `src/app/(auth)/reset-password/page.tsx`
- Build: `npm run build` exit code 0
- Manual test: Submitted reset form, received email, reset password
- Database: Verified password hash updated
- Date verified: 2026-07-28
```

---

### Scenario 2: Verifying Content Exists

**Claim:** "Chapter 16 premium content exists"

**Verification Steps:**
1. Search for chapter 16 files
2. Read file contents
3. Verify integration in `chapter-content.ts`
4. Test rendering in browser

**Documentation:**
```markdown
**Claim:** Chapter 16 premium content exists and is integrated
**Confidence:** High
**Evidence:**
- Files found: `chapter-16-premium.ts`, `chapter-16-premium-flashcards.ts`, `chapter-16-premium-quiz.ts`
- Content reviewed: All files contain valid TypeScript content
- Integration verified: `chapter-content.ts` includes chapter 16 imports and mappings
- Rendering verified: Chapter 16 displays correctly in browser
- Date verified: 2026-07-28
```

---

### Scenario 3: Verifying a Bug Is Fixed

**Claim:** "Redirect loop bug is fixed"

**Verification Steps:**
1. Reproduce original bug
2. Verify bug no longer occurs
3. Test edge cases
4. Check for regressions

**Documentation:**
```markdown
**Claim:** Redirect loop bug is fixed
**Confidence:** High
**Evidence:**
- Original bug: Pending user caused infinite redirect loop
- Fix applied: Modified `src/middleware.ts` to skip approval checks on auth routes
- Verification: Tested pending user login, no redirect loop
- Edge cases: Tested disabled user, approved user, unauthenticated user
- Regressions: None found
- Date verified: 2026-07-28
```

---

### Scenario 4: Verifying Deployment Readiness

**Claim:** "Application is ready for production deployment"

**Verification Steps:**
1. Verify build passes
2. Verify lint passes
3. Verify TypeScript passes
4. Verify all tests pass
5. Verify environment variables configured
6. Verify database schema synced
7. Verify all routes work
8. Verify auth flows work
9. Verify security controls active

**Documentation:**
```markdown
**Claim:** Application is ready for production deployment
**Confidence:** Medium
**Evidence:**
- Build: `npm run build` exit code 0 ✅
- Lint: `npm run lint` exit code 1 ❌ (21 errors)
- TypeScript: `npx tsc --noEmit` exit code 0 ✅
- Tests: Not run ⚠️
- Environment: `.env.production` exists ✅
- Database: Docker blocked, cannot verify ⚠️
- Routes: 31 routes generated ✅
- Auth: Code reviewed, not tested in production ⚠️
- Security: RBAC implemented, rate limiting missing ⚠️
- Date verified: 2026-07-28

**Conclusion:** NOT ready for production. Lint must pass, tests must run, database must be verified.
```

---

## Verification Checklist

Use this checklist before making any significant claim:

- [ ] I have searched all relevant locations
- [ ] I have documented my search method
- [ ] I have recorded what I found (or didn't find)
- [ ] I have assigned a confidence level
- [ ] I have included the verification date
- [ ] I have provided next steps if confidence is Medium or Low
- [ ] I have cross-referenced related documentation
- [ ] I have verified my evidence is current (within 24 hours for High confidence)

---

## Cross-References

- **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — Step-by-step procedures for common work
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current verified state with evidence
- **[QUALITY_STANDARDS.md](QUALITY_STANDARDS.md)** — Quality criteria for all work
- **[DECISION_FRAMEWORK.md](DECISION_FRAMEWORK.md)** — How to make decisions based on evidence

---

*Verification is not optional. Every claim must be evidence-backed. Every search must be documented. Every conclusion must have a confidence level. This is how we build trust through competence.*
