# Session Management — Interruptions, Handoffs, and Context Recovery

**Purpose:** This file defines how to handle session interruptions, preserve context, and execute clean handoffs. Follow these procedures to ensure continuity across sessions.

---

## Table of Contents

1. [Session Lifecycle](#session-lifecycle)
2. [Interruption Handling](#interruption-handling)
3. [Context Preservation](#context-preservation)
4. [Handoff Procedures](#handoff-procedures)
5. [Recovery Procedures](#recovery-procedures)
6. [Memory Management](#memory-management)
7. [Common Scenarios](#common-scenarios)

---

## Session Lifecycle

### Session States

| State | Description | Duration |
|-------|-------------|----------|
| **Starting** | Session initialized, context loading | 1–2 minutes |
| **Active** | Work in progress | Minutes to hours |
| **Interrupted** | Session paused unexpectedly | Unknown |
| **Handoff** | Session ending cleanly | 5–10 minutes |
| **Complete** | Work finished, session closed | — |

### State Transitions

```
Starting → Active → Complete
           ↓
        Interrupted → Recovery → Active
           ↓
        Handoff → Complete
```

---

## Interruption Handling

### Types of Interruptions

| Type | Cause | Recovery Strategy |
|------|-------|-------------------|
| **Gateway restart** | OpenClaw Gateway restarts | Automatic recovery from transcript |
| **Auto-compaction** | Context window exceeded | Recover from memory files |
| **Network failure** | Internet connection lost | Reconnect and resume |
| **User interruption** | Gabriel stops the session | Clean handoff |
| **System crash** | Computer or application crash | Full recovery from files |
| **Token limit** | Context window full | Compact and continue |

### Interruption Response Procedure

**When an interruption occurs:**

1. **Assess the Interruption**
   - What type of interruption?
   - What work was in progress?
   - What state was the system in?

2. **Preserve Current State**
   - Save any uncommitted changes
   - Document current task
   - Note any blockers

3. **Create Recovery Point**
   - Write memory file with current state
   - Update CURRENT_STATE.md if needed
   - Document next steps

4. **Recover**
   - Read recovery documentation
   - Restore context
   - Resume work

### Auto-Compaction Recovery

**What happens:**
- OpenClaw compacts the conversation to fit context window
- Some conversation history is lost
- Session continues with reduced context

**Recovery procedure:**

1. **Read Recovery Documentation**
   ```
   Read: docs/ping/RECOVERY.md
   Read: docs/ping/CURRENT_STATE.md
   ```

2. **Check Recent Memory**
   ```
   Read: C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD.md (latest)
   ```

3. **Verify Current State**
   ```powershell
   cd C:\Users\gabeb\Projects\barber-study-pro
   git status
   git branch --show-current
   ```

4. **Resume Work**
   - Review last task in memory
   - Continue from documented state
   - Verify any uncommitted changes

### Gateway Restart Recovery

**What happens:**
- OpenClaw Gateway restarts
- Session is interrupted
- Transcript is preserved

**Recovery procedure:**

1. **Automatic Recovery**
   - OpenClaw attempts to recover from transcript
   - Session resumes with previous context

2. **Manual Recovery** (if automatic fails)
   - Read recovery documentation
   - Check memory files
   - Verify current state
   - Resume work

---

## Context Preservation

### What to Preserve

| Category | Items | Storage Location |
|----------|-------|------------------|
| **Current task** | What you're working on, why, approach | Memory file |
| **Progress** | What's done, what's in progress, what's next | Memory file |
| **State** | Git branch, uncommitted changes, build status | CURRENT_STATE.md |
| **Decisions** | Decisions made, rationale, alternatives | Memory file |
| **Blockers** | Issues preventing progress | Memory file |
| **Context** | Relevant code, docs, conversations | Memory file |

### Context Preservation Procedure

**Before any potential interruption:**

1. **Update Memory File**
   ```markdown
   # Session: YYYY-MM-DD HH:mm:ss CDT

   ## Current Task
   [What you're working on]

   ## Progress
   - [x] Completed item 1
   - [x] Completed item 2
   - [ ] In progress item 3
   - [ ] Not started item 4

   ## State
   - Branch: feature/browser-automation
   - Uncommitted changes: 5 files
   - Build: Passing
   - Lint: Failing (21 errors)

   ## Decisions Made
   - Decision 1: [Description and rationale]
   - Decision 2: [Description and rationale]

   ## Blockers
   - Blocker 1: [Description]
   - Blocker 2: [Description]

   ## Next Steps
   1. Next step 1
   2. Next step 2
   3. Next step 3

   ## Context
   [Any relevant code, docs, or conversation context]
   ```

2. **Update CURRENT_STATE.md** (if state changed)
   - Update build/lint/TypeScript status
   - Update known issues
   - Update next actions

3. **Commit or Stash Changes**
   ```powershell
   git add .
   git commit -m "wip: [description]"
   # OR
   git stash save "wip: [description]"
   ```

### Context Preservation Checklist

- [ ] Memory file updated with current task and progress
- [ ] CURRENT_STATE.md updated (if state changed)
- [ ] Uncommitted changes committed or stashed
- [ ] Decisions documented
- [ ] Blockers documented
- [ ] Next steps documented

---

## Handoff Procedures

### Clean Handoff Procedure

**When ending a session cleanly:**

1. **Complete Current Task** (if possible)
   - Finish what you're working on
   - Verify it works
   - Document it

2. **Preserve Context**
   - Follow context preservation procedure
   - Update all documentation

3. **Create Handoff Notes**
   ```markdown
   # Session Handoff — YYYY-MM-DD HH:mm

   ## Summary
   [Brief summary of what was accomplished]

   ## Accomplished
   - [x] Task 1: [Description]
   - [x] Task 2: [Description]
   - [x] Task 3: [Description]

   ## In Progress
   - [ ] Task 4: [Description] — [Status]
   - [ ] Task 5: [Description] — [Status]

   ## Next Steps
   1. [Priority 1] Next step 1
   2. [Priority 2] Next step 2
   3. [Priority 3] Next step 3

   ## Blockers
   - Blocker 1: [Description and impact]
   - Blocker 2: [Description and impact]

   ## Decisions Made
   - Decision 1: [Description and rationale]
   - Decision 2: [Description and rationale]

   ## State
   - Branch: [current branch]
   - Build: [status]
   - Lint: [status]
   - TypeScript: [status]
   - Tests: [status]

   ## Notes
   [Any additional context or important information]
   ```

4. **Update Memory Files**
   - Write session summary to `memory/YYYY-MM-DD-HHmm.md`
   - Update MEMORY.md with significant learnings

5. **Verify Clean State**
   ```powershell
   git status
   npm run build
   ```

### Handoff Checklist

- [ ] Current task completed or documented
- [ ] Context preserved (memory file, CURRENT_STATE.md)
- [ ] Handoff notes created
- [ ] Memory files updated
- [ ] Changes committed or stashed
- [ ] Build state verified
- [ ] Next steps documented

---

## Recovery Procedures

### Full Recovery Procedure

**When starting a new session after interruption:**

1. **Read Recovery Documentation**
   ```
   Read: docs/ping/RECOVERY.md
   Read: docs/ping/CURRENT_STATE.md
   ```

2. **Check Memory Files**
   ```
   Read: C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD.md (latest)
   Read: C:\Users\gabeb\.openclaw\workspace\MEMORY.md
   ```

3. **Verify Environment**
   ```powershell
   cd C:\Users\gabeb\Projects\barber-study-pro
   git branch --show-current
   git status
   node --version
   npm --version
   ```

4. **Verify Build State**
   ```powershell
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

5. **Review Handoff Notes** (if available)
   - Read latest handoff notes
   - Understand what was accomplished
   - Understand what's next

6. **Resume Work**
   - Review next steps
   - Prioritize tasks
   - Begin work

### Partial Recovery Procedure

**When recovering from auto-compaction:**

1. **Read Recovery Documentation**
   ```
   Read: docs/ping/RECOVERY.md
   Read: docs/ping/CURRENT_STATE.md
   ```

2. **Check Recent Memory**
   ```
   Read: C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD.md (latest)
   ```

3. **Verify Current State**
   ```powershell
   git status
   git branch --show-current
   ```

4. **Resume Work**
   - Review last task in memory
   - Continue from documented state

### Recovery Checklist

- [ ] Recovery documentation read
- [ ] Memory files checked
- [ ] Environment verified
- [ ] Build state verified
- [ ] Handoff notes reviewed (if available)
- [ ] Current task understood
- [ ] Next steps prioritized
- [ ] Ready to work

---

## Memory Management

### Memory File Structure

```
C:\Users\gabeb\.openclaw\workspace\
├── MEMORY.md                    # Long-term curated memory
├── memory/
│   ├── YYYY-MM-DD.md           # Daily memory (raw notes)
│   ├── YYYY-MM-DD-HHmm.md      # Session memory (specific session)
│   └── ...
```

### Memory File Types

| Type | Purpose | Update Frequency |
|------|---------|------------------|
| **MEMORY.md** | Long-term curated memory | Weekly or after significant events |
| **Daily memory** | Raw notes for the day | After each session |
| **Session memory** | Specific session notes | After each session |

### Memory Update Procedure

**After each session:**

1. **Create Session Memory File**
   ```
   Write: memory/YYYY-MM-DD-HHmm.md
   ```

2. **Include:**
   - Session date and time
   - What was accomplished
   - What is in progress
   - What are the next steps
   - Any decisions made
   - Any blockers encountered
   - Any important context

3. **Update Daily Memory** (if multiple sessions in one day)
   ```
   Append to: memory/YYYY-MM-DD.md
   ```

4. **Update MEMORY.md** (periodically)
   - Review recent daily/session memory files
   - Identify significant learnings
   - Fold into MEMORY.md
   - Remove outdated entries

### Memory Maintenance Schedule

| Frequency | Task |
|-----------|------|
| **After each session** | Create session memory file |
| **Daily** | Update daily memory file |
| **Weekly** | Review and fold into MEMORY.md |
| **Monthly** | Archive old memory files |
| **Quarterly** | Review and clean up MEMORY.md |

---

## Common Scenarios

### Scenario 1: Clean Session End

**Situation:** Work is complete, ending session normally

**Procedure:**
1. Complete current task
2. Verify build passes
3. Commit all changes
4. Create handoff notes
5. Update memory files
6. End session

---

### Scenario 2: Interrupted Mid-Task

**Situation:** Session interrupted while working on a task

**Procedure:**
1. Assess interruption type
2. Preserve current state (memory file, commit/stash)
3. Document current task and progress
4. Document next steps
5. Recover when possible

---

### Scenario 3: Auto-Compaction

**Situation:** Context window exceeded, auto-compaction occurs

**Procedure:**
1. Read recovery documentation
2. Check recent memory files
3. Verify current state
4. Resume from documented state

---

### Scenario 4: Multiple Sessions Same Day

**Situation:** Multiple work sessions in one day

**Procedure:**
1. Create session memory file for each session
2. Update daily memory file with all sessions
3. Create handoff notes between sessions
4. Verify clean state between sessions

---

### Scenario 5: Long Break Between Sessions

**Situation:** Days or weeks between sessions

**Procedure:**
1. Read all recovery documentation
2. Read all recent memory files
3. Read MEMORY.md
4. Verify environment and build state
5. Review handoff notes
6. Resume work

---

### Scenario 6: Blocked by External Dependency

**Situation:** Cannot proceed due to external blocker (e.g., Docker not running)

**Procedure:**
1. Document blocker in memory file
2. Document blocker in CURRENT_STATE.md
3. Identify alternative work
4. Create handoff notes with blocker details
5. Notify Gabriel if needed

---

## Session Management Checklist

### Starting a Session

- [ ] Read recovery documentation
- [ ] Check memory files
- [ ] Verify environment
- [ ] Verify build state
- [ ] Review handoff notes (if available)
- [ ] Understand current task
- [ ] Prioritize next steps

### During a Session

- [ ] Update memory file with progress
- [ ] Document decisions as they're made
- [ ] Commit changes regularly
- [ ] Update CURRENT_STATE.md if state changes

### Ending a Session

- [ ] Complete or document current task
- [ ] Preserve context (memory file, commit/stash)
- [ ] Create handoff notes
- [ ] Update memory files
- [ ] Verify clean state
- [ ] Document next steps

### Recovering from Interruption

- [ ] Read recovery documentation
- [ ] Check memory files
- [ ] Verify environment and build state
- [ ] Review handoff notes
- [ ] Resume from documented state

---

## Cross-References

- **[RECOVERY.md](RECOVERY.md)** — Session startup and context recovery
- **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — Step-by-step work procedures
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — Evidence and verification standards

---

*Good session management ensures continuity. Preserve context, document decisions, and create clean handoffs. Future you will thank present you.*
