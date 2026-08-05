# Startup Checklist — Mandatory Session Initialization

**Version:** 1.0  
**Created:** 2026-07-29  
**Purpose:** Concise, actionable checklist that Ping must complete before beginning any engineering work. This is the quick-reference version of [BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md).

---

## How to Use This Checklist

- Complete every item in order.
- Do not skip steps.
- If a step fails, follow the failure handling procedure in [BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md#bootstrap-failure-handling).
- Mark each item as complete only when verified.
- Generate a Bootstrap Report using [BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md) after completing this checklist.

---

## Phase 1: Identity Recovery

- [ ] **1.1** Confirm Ping identity (name, mission, flagship project)
- [ ] **1.2** Confirm engineering principles (from SOUL.md)
- [ ] **1.3** Identify operating mode (Development / Audit / Planning / Documentation / Recovery / Maintenance)

---

## Phase 2: Repository Recovery

- [ ] **2.1** Read [RECOVERY.md](RECOVERY.md)
- [ ] **2.2** Read [CURRENT_STATE.md](CURRENT_STATE.md)
- [ ] **2.3** Read [SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)
- [ ] **2.4** Read [KNOWN_ISSUES.md](KNOWN_ISSUES.md)
- [ ] **2.5** Read [PROJECT_UNDERSTANDING.md](PROJECT_UNDERSTANDING.md) (if needed)
- [ ] **2.6** Read recent memory files (latest session memory, latest daily memory, MEMORY.md)

---

## Phase 3: Environment Verification

- [ ] **3.1** Verify repository root (`cd C:\Users\gabeb\Projects\barber-study-pro`)
- [ ] **3.2** Verify Git status (`git branch --show-current`, `git status --short`)
- [ ] **3.3** Verify Node.js version (`node --version` — expect v24.x)
- [ ] **3.4** Verify npm version (`npm --version` — expect v11.x)
- [ ] **3.5** Verify build state (`npm run build`, `npm run lint`, `npx tsc --noEmit`)
- [ ] **3.6** Verify optional tools (Supabase CLI, Docker, Vercel CLI, GitHub CLI)

---

## Phase 4: Session Recovery

- [ ] **4.1** Detect unfinished work (uncommitted changes)
- [ ] **4.2** Detect checkpoints (handoff notes, checkpoint files)
- [ ] **4.3** Detect interrupted tasks (incomplete tasks in memory files)
- [ ] **4.4** Detect pending TODOs (CURRENT_STATE.md, KNOWN_ISSUES.md, ROADMAP.md, code comments)

---

## Phase 5: Task Initialization

- [ ] **5.1** Classify task type (Feature / Bug Fix / Refactor / Documentation / Content / Audit / Maintenance / Infrastructure / Planning / Research)
- [ ] **5.2** Estimate complexity (Trivial / Simple / Moderate / Complex / Very Complex)
- [ ] **5.3** Decide if task should be divided (by phase, component, deliverable, or risk)
- [ ] **5.4** Produce execution plan (steps, success criteria, risks, dependencies)

---

## Phase 6: Success Criteria

- [ ] **6.1** All Phase 1 items complete
- [ ] **6.2** All Phase 2 items complete
- [ ] **6.3** All Phase 3 items complete
- [ ] **6.4** All Phase 4 items complete
- [ ] **6.5** All Phase 5 items complete
- [ ] **6.6** Generate Bootstrap Report using [BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md)
- [ ] **6.7** Save Bootstrap Report to `C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD-HHmm-bootstrap.md`

---

## Ready State

**Ping is ready to begin work when:**

- ✅ All checklist items are marked complete
- ✅ Bootstrap Report has been generated and saved
- ✅ Confidence level is High or Medium (if Low, escalate to Gabriel)
- ✅ No blocking issues remain unresolved

**Ping is NOT ready to begin work when:**

- ❌ Any checklist item is incomplete
- ❌ Bootstrap Report has not been generated
- ❌ Confidence level is Low
- ❌ Blocking issues remain unresolved

---

## Quick Reference

| Phase | Purpose | Key Output |
|-------|---------|------------|
| **1. Identity Recovery** | Confirm who you are | Identity statement |
| **2. Repository Recovery** | Load project context | Documents read |
| **3. Environment Verification** | Verify tools and state | Environment status |
| **4. Session Recovery** | Detect unfinished work | Pending work identified |
| **5. Task Initialization** | Plan the work | Execution plan |
| **6. Success Criteria** | Verify readiness | Bootstrap Report |

---

## Cross-References

- **[BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md)** — Detailed startup procedure (authoritative version)
- **[BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md)** — Template for Bootstrap Report
- **[KNOWN_ISSUES.md](KNOWN_ISSUES.md)** — Known issues and workarounds
- **[RECOVERY.md](RECOVERY.md)** — Session bootstrap and context recovery
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state
- **[SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)** — Session management procedures

---

*This checklist is mandatory. Complete every item before beginning any engineering work.*
