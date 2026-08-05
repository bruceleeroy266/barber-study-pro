# Ping Operating System

**Version:** 1.1  
**Created:** 2026-07-28  
**Last Updated:** 2026-07-29  
**Purpose:** This directory contains the complete operating manual for Ping — Gabriel's AI development partner. It enables any new Ping session to recover full project context, understand the current state, plan work, verify results, and continue after interruptions without losing continuity.

---

## Startup Sequence (Mandatory)

**Every Ping session must begin with the following sequence before any engineering work:**

1. **[BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md)** — Read this first. This is the authoritative startup procedure that defines exactly what Ping must do before beginning any task. It covers identity recovery, repository recovery, environment verification, session recovery, task initialization, and success criteria.

2. **[STARTUP_CHECKLIST.md](STARTUP_CHECKLIST.md)** — Use this as a quick-reference checklist while executing the Bootstrap Protocol. Mark each item as complete only when verified. Do not skip steps.

3. **[KNOWN_ISSUES.md](KNOWN_ISSUES.md)** — Review this document during the bootstrap to understand persistent engineering issues, technical debt, environment limitations, recurring failures, and workarounds. Update it whenever issues are discovered, resolved, or change status.

4. **[BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md)** — After completing the Bootstrap Protocol and Startup Checklist, generate a Bootstrap Report using this template. Save it to `C:\Users\gabeb\.openclaw\workspace\memory\YYYY-MM-DD-HHmm-bootstrap.md`. Do not begin work until the report is complete and confidence is High or Medium.

**How These Documents Fit Together:**

- **BOOTSTRAP_PROTOCOL.md** is the detailed, authoritative procedure. It explains *what* to do and *why*.
- **STARTUP_CHECKLIST.md** is the concise, actionable checklist. It helps you track *what you've done* and *what remains*.
- **KNOWN_ISSUES.md** is the living document of unresolved problems. It informs *what might block you* and *what workarounds exist*.
- **BOOTSTRAP_REPORT_TEMPLATE.md** is the standardized report format. It provides *evidence that you're ready* to begin work.

**No exceptions.** Every Ping session must complete this startup sequence before beginning any engineering work.

---

## How to Use This Directory

**If you are a brand-new Ping session**, read these files in order:

1. **[BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md)** — Start here. This is the mandatory startup procedure.
2. **[STARTUP_CHECKLIST.md](STARTUP_CHECKLIST.md)** — Use this checklist while executing the Bootstrap Protocol.
3. **[KNOWN_ISSUES.md](KNOWN_ISSUES.md)** — Review known issues during the bootstrap.
4. **[BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md)** — Generate a Bootstrap Report after completing the bootstrap.
5. **[RECOVERY.md](RECOVERY.md)** — Detailed recovery procedures (referenced by Bootstrap Protocol).
6. **[PROJECT_UNDERSTANDING.md](PROJECT_UNDERSTANDING.md)** — What ASCYN PRO is, why it exists, and how it works.
7. **[CURRENT_STATE.md](CURRENT_STATE.md)** — Verified snapshot of the project as it exists right now.
8. **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — How to plan, execute, verify, and document work.
9. **[DECISION_FRAMEWORK.md](DECISION_FRAMEWORK.md)** — How to make decisions, when to ask Gabriel, and how to handle ambiguity.
10. **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — How to verify claims, run audits, and maintain evidence standards.
11. **[SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)** — How to handle interruptions, handoffs, and context recovery.
12. **[QUALITY_STANDARDS.md](QUALITY_STANDARDS.md)** — What "done" means and how to meet production standards.
13. **[ENVIRONMENT_REFERENCE.md](ENVIRONMENT_REFERENCE.md)** — Tools, paths, credentials, and infrastructure details.
14. **[GLOSSARY.md](GLOSSARY.md)** — Terms, abbreviations, and project-specific vocabulary.

---

## File Inventory

| File | Purpose | Audience |
|------|---------|----------|
| [BOOTSTRAP_PROTOCOL.md](BOOTSTRAP_PROTOCOL.md) | Mandatory startup procedure — identity, repository, environment, session, task initialization | All sessions (mandatory) |
| [STARTUP_CHECKLIST.md](STARTUP_CHECKLIST.md) | Concise startup checklist — quick-reference version of Bootstrap Protocol | All sessions (mandatory) |
| [KNOWN_ISSUES.md](KNOWN_ISSUES.md) | Known issues and workarounds — persistent engineering issues, technical debt, limitations | All sessions (mandatory) |
| [BOOTSTRAP_REPORT_TEMPLATE.md](BOOTSTRAP_REPORT_TEMPLATE.md) | Bootstrap Report template — standardized startup report format | All sessions (mandatory) |
| [RECOVERY.md](RECOVERY.md) | Session bootstrap — identity, memory, project recovery | New Ping sessions |
| [PROJECT_UNDERSTANDING.md](PROJECT_UNDERSTANDING.md) | Deep project knowledge — architecture, curriculum, business model | All sessions |
| [CURRENT_STATE.md](CURRENT_STATE.md) | Verified current state — build, lint, tests, curriculum, infrastructure | All sessions |
| [OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md) | Step-by-step procedures for common work types | All sessions |
| [DECISION_FRAMEWORK.md](DECISION_FRAMEWORK.md) | Decision-making authority, escalation paths, tradeoff analysis | All sessions |
| [VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md) | Evidence standards, audit procedures, confidence levels | All sessions |
| [SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md) | Interruption handling, context preservation, handoff procedures | All sessions |
| [QUALITY_STANDARDS.md](QUALITY_STANDARDS.md) | Production readiness criteria, testing standards, documentation requirements | All sessions |
| [ENVIRONMENT_REFERENCE.md](ENVIRONMENT_REFERENCE.md) | Paths, tools, versions, credentials, infrastructure | All sessions |
| [GLOSSARY.md](GLOSSARY.md) | Project-specific terms and definitions | All sessions |

---

## Relationship to Other Documentation

| Location | Relationship |
|----------|-------------|
| `docs/project-brain/` | Project-brain files contain **what** the project is. Ping OS contains **how Ping works** on the project. They complement each other. |
| `MEMORY.md` (OpenClaw workspace) | Long-term memory about Gabriel and the partnership. Ping OS is the operational manual. |
| `STATUS.md` (OpenClaw workspace) | Point-in-time status snapshot. Ping OS provides the procedures to update and maintain it. |
| `ROADMAP.md` (OpenClaw workspace) | Strategic plan. Ping OS provides the execution framework. |
| `WORKSPACE_MAP.md` (OpenClaw workspace) | Asset locations and search protocol. Ping OS references this for verification procedures. |
| `AGENTS.md` (OpenClaw workspace) | OpenClaw agent configuration. Ping OS is the ASCYN PRO-specific operational layer. |
| `SOUL.md` (OpenClaw workspace) | Ping's personality and values. Ping OS is the procedural implementation. |

---

## Maintenance Rules

1. **Update after every significant work session** — Especially `CURRENT_STATE.md`, `KNOWN_ISSUES.md`, and any procedure files affected by changes.
2. **Verify before claiming** — Every statement in these files must be evidence-backed per the [Verification Protocol](VERIFICATION_PROTOCOL.md).
3. **Cross-reference aggressively** — When one file references a concept explained in another, link to it.
4. **Keep it current** — Outdated documentation is worse than no documentation. If something changes, update the relevant file immediately.
5. **No placeholders** — Every file must contain production-quality content. If a section is unknown, mark it as "⚠️ Not yet verified" with a plan to verify it.

---

*This operating system is the foundation of the Ping-Gabriel partnership. It exists so that no matter when or how a session starts, Ping can pick up exactly where the last session left off — with full context, full evidence, and full capability.*
