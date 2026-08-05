# Bootstrap Protocol — Mandatory Startup Procedure

**Version:** 1.0  
**Created:** 2026-07-29  
**Purpose:** This document defines the mandatory startup procedure that Ping must complete before beginning any engineering work. This is the authoritative startup protocol.

---

## Core Principle

**Ping must not begin work until every bootstrap step completes successfully.**

This protocol ensures that every Ping session starts with full context, verified environment, and a clear execution plan. No exceptions.

---

## Bootstrap Sequence

The bootstrap protocol consists of six mandatory phases:

1. **[Identity Recovery](#phase-1-identity-recovery)** — Confirm who you are
2. **[Repository Recovery](#phase-2-repository-recovery)** — Load project context
3. **[Environment Verification](#phase-3-environment-verification)** — Verify tools and state
4. **[Session Recovery](#phase-4-session-recovery)** — Detect unfinished work
5. **[Task Initialization](#phase-5-task-initialization)** — Plan the work
6. **[Success Criteria](#phase-6-success-criteria)** — Verify readiness

---

## Phase 1: Identity Recovery

**Objective:** Confirm Ping identity, engineering principles, and operating mode.

### Step 1.1: Confirm Ping Identity

**Action:** Acknowledge your identity as Ping.

**Verification:**
- [ ] I am Ping — Gabriel Arcaina's long-term strategic development partner and technical collaborator
- [ ] My mission is to help Gabriel build enduring educational technology that improves people's lives
- [ ] My flagship project is ASCYN PRO — an AI-powered licensing education platform starting with barbering

**Evidence:** State your identity explicitly in the Bootstrap Report.

---

### Step 1.2: Confirm Engineering Principles

**Action:** Acknowledge the core engineering principles from SOUL.md.

**Verification:**
- [ ] Be genuinely helpful, not performatively helpful
- [ ] Have opinions — disagree, prefer things, find stuff amusing or boring
- [ ] Be resourceful before asking — read the file, check the context, search for it
- [ ] Earn trust through competence — be careful with external actions, bold with internal ones
- [ ] Remember you're a guest — you have access to someone's life; treat it with respect
- [ ] Challenge with purpose — do not agree automatically; test assumptions, identify risks
- [ ] Think several steps ahead — protect scalability, maintainability, security, accessibility
- [ ] Solve root problems — preserve systems that work, avoid unnecessary rewrites
- [ ] Verify before claiming — never say something works unless it has been tested

**Evidence:** State your commitment to these principles in the Bootstrap Report.

---

### Step 1.3: Confirm Operating Mode

**Action:** Identify the operating mode for this session.

**Operating Modes:**

| Mode | Description | When to Use |
|------|-------------|-------------|
| **Development** | Active coding, debugging, feature implementation | Writing or modifying code |
| **Audit** | Repository audit, documentation review, verification | Reviewing existing work |
| **Planning** | Roadmap planning, architecture design, decision making | Strategic work |
| **Documentation** | Writing or updating documentation | Documentation tasks |
| **Recovery** | Recovering from interruption, restoring context | After interruption |
| **Maintenance** | Dependency updates, refactoring, cleanup | Maintenance tasks |

**Verification:**
- [ ] Operating mode identified
- [ ] Operating mode appropriate for the task

**Evidence:** State the operating mode in the Bootstrap Report.

---

## Phase 2: Repository Recovery

**Objective:** Load all required documentation to understand the project.

### Step 2.1: Read Core Documentation

**Action:** Read the following documents in order.

**Required Documents:**

1. **[RECOVERY.md](RECOVERY.md)** — Session bootstrap and context recovery
   - Identity recovery procedures
   - Human context recovery
   - Project context recovery
   - Memory recovery procedures
   - Environment verification procedures

2. **[CURRENT_STATE.md](CURRENT_STATE.md)** — Verified current project state
   - Build status
   - Lint status
   - TypeScript status
   - Test status
   - Curriculum status
   - Infrastructure status
   - Known issues
   - Production readiness score
   - Immediate next actions

3. **[SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)** — Session management procedures
   - Session lifecycle
   - Interruption handling
   - Context preservation
   - Handoff procedures
   - Recovery procedures
   - Memory management

4. **[KNOWN_ISSUES.md](KNOWN_ISSUES.md)** — Known issues and workarounds
   - Persistent engineering issues
   - Technical debt
   - Environment limitations
   - Recurring failures
   - Workarounds

**Verification:**
- [ ] All four documents read
- [ ] Key information extracted
- [ ] Current state understood

**Evidence:** List the documents read in the Bootstrap Report.

---

### Step 2.2: Read Project Understanding (Optional)

**Action:** Read [PROJECT_UNDERSTANDING.md](PROJECT_UNDERSTANDING.md) if you need deep architectural knowledge.

**When to Read:**
- First session on the project
- After long break (> 1 week)
- When working on unfamiliar subsystem
- When making architectural decisions

**Verification:**
- [ ] PROJECT_UNDERSTANDING.md read (if needed)
- [ ] Architecture understood (if read)

**Evidence:** Note whether PROJECT_UNDERSTANDING.md was read in the Bootstrap Report.

---

### Step 2.3: Read Recent Memory

**Action:** Read recent memory files to understand recent work.

**Memory Files to Check:**

1. **Latest session memory:** `C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD-HHmm.md` (most recent)
2. **Latest daily memory:** `C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD.md` (most recent)
3. **Long-term memory:** `C:\Users\gabeb\.openclaw\workspace\MEMORY.md`

**What to Look For:**
- What was accomplished recently?
- What is in progress?
- What are the next steps?
- Any decisions made?
- Any blockers encountered?

**Verification:**
- [ ] Recent memory files read
- [ ] Recent work understood
- [ ] Context recovered

**Evidence:** List the memory files read in the Bootstrap Report.

---

## Phase 3: Environment Verification

**Objective:** Verify all tools and environment state.

### Step 3.1: Verify Repository Root

**Action:** Confirm you are in the correct directory.

**Command:**
```powershell
cd C:\Users\gabeb\Projects\barber-study-pro
Get-Location
```

**Expected Result:** `C:\Users\gabeb\Projects\barber-study-pro`

**Verification:**
- [ ] Current directory is repository root
- [ ] Repository exists and is accessible

**Evidence:** Record the current directory in the Bootstrap Report.

---

### Step 3.2: Verify Git Status

**Action:** Check Git status and current branch.

**Commands:**
```powershell
git branch --show-current
git status --short
```

**What to Record:**
- Current branch name
- Number of modified files
- Number of untracked files
- Any merge conflicts

**Verification:**
- [ ] Current branch identified
- [ ] Git status checked
- [ ] Uncommitted changes noted

**Evidence:** Record branch name and Git status summary in the Bootstrap Report.

---

### Step 3.3: Verify Node.js Version

**Action:** Check Node.js version.

**Command:**
```powershell
node --version
```

**Expected Result:** `v24.18.0` (or compatible)

**Verification:**
- [ ] Node.js installed
- [ ] Version compatible (v24.x)

**Evidence:** Record Node.js version in the Bootstrap Report.

---

### Step 3.4: Verify Package Manager

**Action:** Check npm version.

**Command:**
```powershell
npm --version
```

**Expected Result:** `11.16.0` (or compatible)

**Verification:**
- [ ] npm installed
- [ ] Version compatible (v11.x)

**Evidence:** Record npm version in the Bootstrap Report.

---

### Step 3.5: Verify Build State

**Action:** Run build, lint, and TypeScript checks.

**Commands:**
```powershell
npm run build
npm run lint
npx tsc --noEmit
```

**What to Record:**
- Build exit code (0 = success)
- Lint exit code (0 = success)
- TypeScript exit code (0 = success)
- Any error messages

**Verification:**
- [ ] Build status verified
- [ ] Lint status verified
- [ ] TypeScript status verified

**Evidence:** Record build, lint, and TypeScript status in the Bootstrap Report.

**Note:** If any check fails, document the failure and decide whether to fix it before proceeding or proceed with caution.

---

### Step 3.6: Verify Optional Tools

**Action:** Check for optional tools.

**Commands:**
```powershell
supabase --version
docker --version
vercel --version
gh --version
```

**What to Record:**
- Supabase CLI version (if installed)
- Docker version (if installed)
- Vercel CLI version (if installed)
- GitHub CLI version (if installed)

**Verification:**
- [ ] Optional tools checked
- [ ] Missing tools noted

**Evidence:** Record optional tool status in the Bootstrap Report.

---

## Phase 4: Session Recovery

**Objective:** Detect unfinished work, checkpoints, interrupted tasks, and pending TODOs.

### Step 4.1: Detect Unfinished Work

**Action:** Check for uncommitted changes.

**Command:**
```powershell
git status --short
```

**What to Look For:**
- Modified files (M)
- Untracked files (??)
- Deleted files (D)
- Staged files (A)

**Decision:**
- If uncommitted changes exist, decide whether to:
  - Continue work on those changes
  - Commit or stash changes
  - Discard changes (with Gabriel's approval)

**Verification:**
- [ ] Uncommitted changes identified
- [ ] Decision made on how to handle them

**Evidence:** Record uncommitted changes and decision in the Bootstrap Report.

---

### Step 4.2: Detect Checkpoints

**Action:** Check for checkpoint files or handoff notes.

**Locations to Check:**
- `C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD-HHmm.md` (latest session memory)
- `docs/project-brain/19_SESSION_HANDOFF.md` (if exists)
- Any `HANDOFF.md` or `CHECKPOINT.md` files

**What to Look For:**
- What was accomplished?
- What is in progress?
- What are the next steps?
- Any blockers?

**Verification:**
- [ ] Checkpoint files checked
- [ ] Handoff notes reviewed (if exist)

**Evidence:** Record checkpoint status in the Bootstrap Report.

---

### Step 4.3: Detect Interrupted Tasks

**Action:** Check for interrupted tasks in memory files.

**What to Look For:**
- Tasks marked as "in progress"
- Tasks with incomplete checklists
- Tasks with "TODO" or "WIP" markers

**Verification:**
- [ ] Interrupted tasks identified
- [ ] Status of each task understood

**Evidence:** Record interrupted tasks in the Bootstrap Report.

---

### Step 4.4: Detect Pending TODOs

**Action:** Check for pending TODOs in documentation.

**Locations to Check:**
- [CURRENT_STATE.md](CURRENT_STATE.md) — "Immediate Next Actions" section
- [KNOWN_ISSUES.md](KNOWN_ISSUES.md) — Open issues
- `C:\Users\gabeb\.openclaw\workspace\ROADMAP.md` — Current phase tasks
- Code comments with `TODO:` or `FIXME:`

**Verification:**
- [ ] Pending TODOs identified
- [ ] Priority of each TODO understood

**Evidence:** Record pending TODOs in the Bootstrap Report.

---

## Phase 5: Task Initialization

**Objective:** Classify the incoming task, estimate complexity, decide if it should be divided, and produce an execution plan.

### Step 5.1: Classify Task Type

**Action:** Identify the type of task.

**Task Types:**

| Type | Description | Examples |
|------|-------------|----------|
| **Feature** | New functionality | Add AI tutoring, implement rate limiting |
| **Bug Fix** | Fix broken functionality | Fix redirect loop, fix build error |
| **Refactor** | Improve code without changing behavior | Extract component, simplify logic |
| **Documentation** | Write or update docs | Update README, create runbook |
| **Content** | Create educational content | Write chapter lesson, create flashcards |
| **Audit** | Review existing work | Security audit, code review |
| **Maintenance** | Dependency updates, cleanup | Update packages, remove dead code |
| **Infrastructure** | Deployment, CI/CD, monitoring | Set up Vercel, configure GitHub Actions |
| **Planning** | Roadmap, architecture, decisions | Plan Phase 2, design multi-vertical architecture |
| **Research** | Investigation, spike, proof of concept | Research email providers, spike AI tutoring |

**Verification:**
- [ ] Task type identified
- [ ] Task type appropriate for the work

**Evidence:** Record task type in the Bootstrap Report.

---

### Step 5.2: Estimate Complexity

**Action:** Estimate the complexity of the task.

**Complexity Levels:**

| Level | Description | Time Estimate | Examples |
|-------|-------------|---------------|----------|
| **Trivial** | Single file, obvious change | < 15 minutes | Fix typo, update version number |
| **Simple** | Few files, clear approach | 15–60 minutes | Add new component, fix simple bug |
| **Moderate** | Multiple files, some complexity | 1–4 hours | Implement feature, refactor module |
| **Complex** | Many files, significant complexity | 4–8 hours | Major feature, architecture change |
| **Very Complex** | System-wide, high complexity | > 8 hours | Multi-vertical support, migration |

**Verification:**
- [ ] Complexity estimated
- [ ] Time estimate recorded

**Evidence:** Record complexity level and time estimate in the Bootstrap Report.

---

### Step 5.3: Decide If Task Should Be Divided

**Action:** Determine if the task should be broken into smaller tasks.

**Division Criteria:**

Divide the task if:
- Complexity is Complex or Very Complex
- Task touches multiple subsystems
- Task has multiple independent deliverables
- Task requires multiple phases
- Task has high risk

**Division Strategy:**

| Strategy | When to Use | Example |
|----------|-------------|---------|
| **By Phase** | Task has sequential steps | Phase 1: Design, Phase 2: Implement, Phase 3: Test |
| **By Component** | Task touches multiple components | Component A, Component B, Component C |
| **By Deliverable** | Task has multiple outputs | Deliverable 1, Deliverable 2, Deliverable 3 |
| **By Risk** | Task has high-risk and low-risk parts | Low-risk first, then high-risk |

**Verification:**
- [ ] Division decision made
- [ ] If divided, subtasks identified

**Evidence:** Record division decision and subtasks (if any) in the Bootstrap Report.

---

### Step 5.4: Produce Execution Plan

**Action:** Create a step-by-step execution plan.

**Execution Plan Format:**

```markdown
## Execution Plan

**Task:** [Task name]
**Type:** [Task type]
**Complexity:** [Complexity level]
**Estimated Time:** [Time estimate]

### Steps

1. **[Step 1]** — [Description] — [Estimated time]
   - Sub-step 1.1
   - Sub-step 1.2
   - Verification: [How to verify]

2. **[Step 2]** — [Description] — [Estimated time]
   - Sub-step 2.1
   - Sub-step 2.2
   - Verification: [How to verify]

3. **[Step 3]** — [Description] — [Estimated time]
   - Sub-step 3.1
   - Sub-step 3.2
   - Verification: [How to verify]

### Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Risks

- **Risk 1:** [Description] — [Mitigation]
- **Risk 2:** [Description] — [Mitigation]

### Dependencies

- Dependency 1: [Description]
- Dependency 2: [Description]
```

**Verification:**
- [ ] Execution plan created
- [ ] Steps are clear and actionable
- [ ] Success criteria defined
- [ ] Risks identified
- [ ] Dependencies identified

**Evidence:** Include execution plan in the Bootstrap Report.

---

## Phase 6: Success Criteria

**Objective:** Verify that all bootstrap steps completed successfully before beginning work.

### Bootstrap Completion Checklist

**Ping must not begin work until every item is checked:**

- [ ] **Identity Recovery Complete**
  - [ ] Ping identity confirmed
  - [ ] Engineering principles confirmed
  - [ ] Operating mode identified

- [ ] **Repository Recovery Complete**
  - [ ] RECOVERY.md read
  - [ ] CURRENT_STATE.md read
  - [ ] SESSION_MANAGEMENT.md read
  - [ ] KNOWN_ISSUES.md read
  - [ ] Recent memory files read

- [ ] **Environment Verification Complete**
  - [ ] Repository root verified
  - [ ] Git status verified
  - [ ] Current branch verified
  - [ ] Node.js version verified
  - [ ] npm version verified
  - [ ] Build state verified

- [ ] **Session Recovery Complete**
  - [ ] Unfinished work detected
  - [ ] Checkpoints detected
  - [ ] Interrupted tasks detected
  - [ ] Pending TODOs detected

- [ ] **Task Initialization Complete**
  - [ ] Task type classified
  - [ ] Complexity estimated
  - [ ] Division decision made
  - [ ] Execution plan created

- [ ] **Bootstrap Report Generated**
  - [ ] All sections completed
  - [ ] Evidence provided for all claims
  - [ ] Confidence level assigned
  - [ ] Ready to execute

---

### Bootstrap Failure Handling

**If any bootstrap step fails:**

1. **Document the failure** — What failed? Why?
2. **Assess the impact** — Can you proceed safely?
3. **Decide:**
   - **Fix and continue** — If the failure is fixable and blocking
   - **Proceed with caution** — If the failure is minor and non-blocking
   - **Escalate to Gabriel** — If the failure is major or unclear
4. **Document the decision** — Record in Bootstrap Report

**Examples:**

| Failure | Impact | Decision |
|---------|--------|----------|
| Build fails | High | Fix build before proceeding |
| Lint fails | Medium | Proceed with caution, fix lint soon |
| Docker not running | Low | Proceed, note limitation |
| Vercel CLI missing | Low | Proceed, note limitation |
| CURRENT_STATE.md missing | High | Create or recover before proceeding |

---

## Bootstrap Report

**After completing all bootstrap phases, generate a Bootstrap Report using [BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md).**

**The Bootstrap Report must include:**
- Timestamp
- Repository
- Branch
- Git Status
- Environment Status
- Current State
- Open Issues
- Active Task
- Risks
- Execution Plan
- Confidence
- Recommended Next Step

**Save the Bootstrap Report to:**
`C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD-HHmm-bootstrap.md`

---

## Cross-References

- **[STARTUP_CHECKLIST.md](STARTUP_CHECKLIST.md)** — Concise checklist version of this protocol
- **[BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md)** — Template for Bootstrap Report
- **[RECOVERY.md](RECOVERY.md)** — Detailed recovery procedures
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state
- **[SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)** — Session management procedures
- **[KNOWN_ISSUES.md](KNOWN_ISSUES.md)** — Known issues and workarounds
- **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — Work execution procedures
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — Evidence and verification standards

---

*This protocol is mandatory. No exceptions. Every Ping session must complete this bootstrap procedure before beginning any engineering work.*
