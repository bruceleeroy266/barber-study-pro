# Operating Procedures — Step-by-Step Work Guide

**Purpose:** This file provides step-by-step procedures for common work types on ASCYN PRO. Follow these procedures to ensure consistent, verifiable, high-quality work.

---

## Table of Contents

1. [Session Startup](#session-startup)
2. [Code Changes](#code-changes)
3. [Content Creation](#content-creation)
4. [Bug Fixes](#bug-fixes)
5. [Feature Implementation](#feature-implementation)
6. [Database Operations](#database-operations)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Deployment](#deployment)
10. [Session Handoff](#session-handoff)

---

## Session Startup

### Procedure: Starting a New Work Session

**Prerequisites:** None

**Steps:**

1. **Read Recovery Documentation**
   ```
   Read: docs/ping/RECOVERY.md
   Read: docs/ping/CURRENT_STATE.md
   ```

2. **Verify Environment**
   ```powershell
   cd C:\Users\gabeb\Projects\barber-study-pro
   git branch --show-current
   git status --short
   node --version
   npm --version
   ```

3. **Check Recent Memory**
   ```
   Read: C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD.md (latest)
   Read: C:\Users\gabeb\.openclaw\workspace\MEMORY.md
   ```

4. **Verify Build State**
   ```powershell
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

5. **Review Current Tasks**
   ```
   Read: C:\Users\gabeb\.openclaw\workspace\ROADMAP.md
   Read: docs/ping/CURRENT_STATE.md (Immediate Next Actions)
   ```

**Success Criteria:**
- [ ] Environment verified (Node, npm, Git)
- [ ] Build state confirmed (passing or known issues)
- [ ] Recent context recovered
- [ ] Current priorities understood

**Common Issues:**
- **Build fails:** Check if dependencies installed (`npm install`)
- **Wrong branch:** Check `git branch` and switch if needed
- **Uncommitted changes:** Review `git status` and decide whether to commit or stash

---

## Code Changes

### Procedure: Making Code Changes

**Prerequisites:** Session startup complete

**Steps:**

1. **Understand the Change**
   - Read the relevant code files
   - Understand the existing architecture
   - Identify all affected files

2. **Create a Plan**
   - List files to modify
   - Describe the change approach
   - Identify potential risks

3. **Make the Change**
   - Edit files using precise edits
   - Follow existing code style
   - Add TypeScript types where needed

4. **Verify the Change**
   ```powershell
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

5. **Test the Change**
   - Run relevant tests
   - Test manually in browser (if applicable)
   - Verify no regressions

6. **Document the Change**
   - Update relevant documentation
   - Add comments for complex logic
   - Update CURRENT_STATE.md if status changes

**Success Criteria:**
- [ ] Build passes
- [ ] Lint passes (or known issues documented)
- [ ] TypeScript passes
- [ ] No regressions
- [ ] Documentation updated

**Common Issues:**
- **Build fails after change:** Check for missing imports, type errors
- **Lint fails:** Fix lint errors or add to ignore list with justification
- **Tests fail:** Fix the code or update the test

---

## Content Creation

### Procedure: Creating Chapter Content

**Prerequisites:** Understand the chapter topic and learning objectives

**Steps:**

1. **Research the Topic**
   - Review state board requirements
   - Identify key concepts and terms
   - Plan learning objectives

2. **Create Lesson Content**
   - Write original content (no copying from textbooks)
   - Use content block components
   - Include interactive elements

3. **Create Flashcards**
   - Identify key terms and concepts
   - Write clear questions and answers
   - Follow existing flashcard format

4. **Create Quiz Questions**
   - Write multiple-choice questions
   - Include explanations for answers
   - Cover all learning objectives

5. **Create Content Files**
   ```
   src/lib/chapter-N-premium.ts
   src/lib/chapter-N-premium-flashcards.ts
   src/lib/chapter-N-premium-quiz.ts
   ```

6. **Integrate into Registry**
   - Update `src/lib/chapter-content.ts`
   - Add imports and mappings

7. **Verify Integration**
   ```powershell
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

8. **Test Rendering**
   - Start dev server
   - Navigate to chapter
   - Verify all content renders correctly

**Success Criteria:**
- [ ] All content is original
- [ ] Build passes
- [ ] Lint passes
- [ ] TypeScript passes
- [ ] Content renders correctly
- [ ] All learning objectives covered

**Common Issues:**
- **Content not rendering:** Check `chapter-content.ts` registry
- **Type errors:** Verify content block types match
- **Missing imports:** Add imports to `chapter-content.ts`

---

## Bug Fixes

### Procedure: Fixing a Bug

**Prerequisites:** Bug reported or discovered

**Steps:**

1. **Reproduce the Bug**
   - Follow steps to reproduce
   - Document exact behavior
   - Capture error messages

2. **Identify Root Cause**
   - Read relevant code
   - Trace data flow
   - Identify the exact line causing the issue

3. **Plan the Fix**
   - Describe the fix approach
   - Identify affected files
   - Consider side effects

4. **Implement the Fix**
   - Make minimal changes
   - Follow existing code style
   - Add comments if needed

5. **Verify the Fix**
   ```powershell
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

6. **Test the Fix**
   - Reproduce original steps
   - Verify bug is fixed
   - Test edge cases
   - Check for regressions

7. **Document the Fix**
   - Update issue tracker (if applicable)
   - Document root cause and fix
   - Update CURRENT_STATE.md if status changes

**Success Criteria:**
- [ ] Bug reproduced before fix
- [ ] Root cause identified
- [ ] Fix implemented
- [ ] Build passes
- [ ] Bug verified fixed
- [ ] No regressions

**Common Issues:**
- **Can't reproduce:** Ask for more details or environment info
- **Fix causes regression:** Revert and try different approach
- **Root cause unclear:** Add logging or use debugger

---

## Feature Implementation

### Procedure: Implementing a New Feature

**Prerequisites:** Feature requirements understood

**Steps:**

1. **Plan the Feature**
   - Define requirements
   - Design architecture
   - Identify affected files
   - Plan database changes (if needed)

2. **Create Database Changes** (if needed)
   - Write migration file
   - Test migration locally
   - Update RLS policies

3. **Implement Backend** (if needed)
   - Create API routes
   - Add server-side logic
   - Implement auth checks

4. **Implement Frontend**
   - Create components
   - Add pages/routes
   - Implement state management

5. **Integrate**
   - Connect frontend to backend
   - Add error handling
   - Implement loading states

6. **Verify**
   ```powershell
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

7. **Test**
   - Write tests
   - Test manually
   - Verify all requirements met

8. **Document**
   - Update documentation
   - Add usage examples
   - Update CURRENT_STATE.md

**Success Criteria:**
- [ ] All requirements implemented
- [ ] Build passes
- [ ] Lint passes
- [ ] TypeScript passes
- [ ] Tests pass
- [ ] Documentation complete

---

## Database Operations

### Procedure: Working with Supabase

**Prerequisites:** Supabase CLI installed, Docker Desktop running (for local operations)

**Steps:**

1. **Check Supabase Status**
   ```powershell
   supabase status
   ```

2. **Link to Project** (if not linked)
   ```powershell
   supabase link --project-ref hgyznydxepjsvbjsirpv
   ```

3. **Create Migration**
   ```powershell
   supabase migration new migration_name
   ```

4. **Edit Migration**
   - Write SQL in `supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql`
   - Include RLS policies
   - Add comments

5. **Test Migration** (requires Docker)
   ```powershell
   supabase db diff
   supabase db reset
   ```

6. **Push Migration**
   ```powershell
   supabase db push
   ```

7. **Verify**
   - Check Supabase dashboard
   - Verify tables created
   - Test RLS policies

**Success Criteria:**
- [ ] Migration file created
- [ ] SQL is valid
- [ ] RLS policies included
- [ ] Migration tested (if Docker available)
- [ ] Migration pushed (if ready)

**Common Issues:**
- **Docker not running:** Start Docker Desktop
- **Migration fails:** Check SQL syntax, RLS policies
- **Permission denied:** Check service role key

---

## Testing

### Procedure: Running Tests

**Prerequisites:** Tests written, dependencies installed

**Steps:**

1. **Run Build Verification**
   ```powershell
   npm run build
   ```

2. **Run Lint**
   ```powershell
   npm run lint
   ```

3. **Run TypeScript Check**
   ```powershell
   npx tsc --noEmit
   ```

4. **Run Playwright Tests** (if configured)
   ```powershell
   npx playwright test
   ```

5. **Run Specific Test File**
   ```powershell
   npx playwright test tests/e2e/auth/student-auth.spec.ts
   ```

6. **Run Tests in UI Mode**
   ```powershell
   npx playwright test --ui
   ```

7. **Generate Test Report**
   ```powershell
   npx playwright show-report
   ```

**Success Criteria:**
- [ ] Build passes
- [ ] Lint passes
- [ ] TypeScript passes
- [ ] All tests pass
- [ ] No regressions

**Common Issues:**
- **Tests fail:** Check test selectors, timing issues
- **Playwright not found:** Install with `npm install -D @playwright/test`
- **Browser not installed:** Run `npx playwright install`

---

## Documentation

### Procedure: Updating Documentation

**Prerequisites:** Documentation change needed

**Steps:**

1. **Identify Files to Update**
   - Which docs are affected?
   - What information changed?

2. **Update Content**
   - Use clear, concise language
   - Include evidence for claims
   - Add cross-references

3. **Verify Accuracy**
   - Check facts against code
   - Verify commands work
   - Test procedures

4. **Update Related Files**
   - Update cross-references
   - Update index files
   - Update status files

5. **Commit Changes**
   ```powershell
   git add docs/
   git commit -m "docs: update [description]"
   ```

**Success Criteria:**
- [ ] Documentation accurate
- [ ] Cross-references updated
- [ ] Evidence included for claims
- [ ] No broken links

---

## Deployment

### Procedure: Deploying to Production

**Prerequisites:** Vercel CLI installed, project linked

**Steps:**

1. **Verify Build**
   ```powershell
   npm run build
   ```

2. **Run Tests**
   ```powershell
   npm run lint
   npx tsc --noEmit
   npx playwright test
   ```

3. **Check Environment Variables**
   - Verify `.env.production` configured
   - Verify Supabase keys correct
   - Verify all required vars present

4. **Deploy**
   ```powershell
   vercel --prod
   ```

5. **Verify Deployment**
   - Check deployment URL
   - Test all routes
   - Test auth flows
   - Verify database connections

6. **Monitor**
   - Check Vercel dashboard
   - Monitor error logs
   - Verify analytics

**Success Criteria:**
- [ ] Build passes
- [ ] All tests pass
- [ ] Deployment successful
- [ ] All routes verified
- [ ] Auth flows verified
- [ ] No errors in logs

**Common Issues:**
- **Build fails on Vercel:** Check environment variables, Node version
- **Routes 404:** Check `next.config.ts`, verify routes exist
- **Auth fails:** Check Supabase URL and keys

---

## Session Handoff

### Procedure: Ending a Work Session

**Prerequisites:** Work session complete or interrupted

**Steps:**

1. **Save Current State**
   - Commit or stash changes
   - Document current branch
   - Note any uncommitted work

2. **Update Documentation**
   - Update CURRENT_STATE.md
   - Update memory files
   - Document decisions made

3. **Create Handoff Notes**
   - What was accomplished?
   - What is in progress?
   - What are the next steps?
   - Any blockers or issues?

4. **Update Memory**
   ```
   Write: C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD-HHmm.md
   ```

5. **Verify Clean State**
   ```powershell
   git status
   npm run build
   ```

**Success Criteria:**
- [ ] All changes committed or stashed
- [ ] Documentation updated
- [ ] Memory files updated
- [ ] Handoff notes created
- [ ] Build state verified

**Handoff Notes Template:**
```markdown
## Session Handoff — YYYY-MM-DD HH:mm

### Accomplished
- [List completed tasks]

### In Progress
- [List incomplete tasks with status]

### Next Steps
- [List prioritized next actions]

### Blockers
- [List any blockers or issues]

### Notes
- [Any additional context]
```

---

## Cross-References

- **[RECOVERY.md](RECOVERY.md)** — Session startup procedures
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — Evidence and verification standards
- **[QUALITY_STANDARDS.md](QUALITY_STANDARDS.md)** — Quality criteria for all work
- **[SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)** — Interruption and handoff procedures

---

*Follow these procedures to ensure consistent, verifiable, high-quality work. When in doubt, verify with evidence and document your reasoning.*
