# ASCYN PRO Project Constitution

**Version:** 2.0  
**Effective Date:** 2026-07-03  
**Owner:** Gabriel (Gabe) — Founder & CEO, ASCYN PRO  
**Authors:** Gabe + Ping (AI Operations Partner)  

---

## 1. Purpose

This document is the single source of truth for how ASCYN PRO is built, organized, and released. It exists so the team stops drifting between folders, branches, and environments, and works like a real product team.

---

## 2. Official Repository & Branch

| Item | Value |
|------|-------|
| **GitHub Repository** | `https://github.com/bruceleeroy266/barber-study-pro` |
| **Active Branch** | `workstation-transfer-safety` |
| **Remote** | `origin` → `git@github.com:bruceleeroy266/barber-study-pro.git` |
| **Latest Verified Commit** | `f618e2b fix: prevent failed quiz attempts from completing chapter progress` |

**Rule:** `origin/workstation-transfer-safety` is the single source of truth. No local folder, archive, or stale workspace state may be treated as authoritative unless it has been reset to this branch first.

---

## 3. Official Development Folders

### 3.1 Active Source

| Environment | Path | Purpose |
|-------------|------|---------|
| **Windows (Gabe's desktop)** | `C:\Users\gabeb\OneDrive\Desktop\Work Folder\barber-study-pro-v2` | Official local working copy |
| **WSL** | `/mnt/c/Users/gabeb/OneDrive/Desktop/Work Folder/barber-study-pro-v2` | Linux tooling path for the same folder |
| **OpenClaw workspace** | `/home/openclaw/.openclaw/workspace/ascyn-pro-audit` | Ping's synced workspace mirror |

The OpenClaw workspace root (`ascyn-pro-audit`) is the Git repository root. The Next.js application itself lives in the `barber-study-pro-v2/` subdirectory inside that root.

### 3.2 Archive / Reference Only

The following folders are **read-only reference** and must never be used as active source:

| Folder | Status | Why |
|--------|--------|-----|
| `BarberStudyPro-Master` | Archive | Superseded by v2 architecture |
| `BarberStudyPro-Archive V1` | Archive | Legacy v1 codebase |
| `ascyn-pro-audit/barber-study-guide-website/` | Reference | Older single-page guide site |
| `ascyn-pro-audit/barber-study-pro-v2/` legacy HTML | Reference | Static prototype chapters 1–21; curriculum reference only |
| `ascyn-pro-audit/migrated-content/` | Reference | Extracted legacy content for gap analysis |
| Any other old workspace copies | Archive | Risk of stale state |

### 3.3 Active Code Locations

| Layer | Path |
|-------|------|
| Next.js application | `ascyn-pro-audit/barber-study-pro-v2/src/` |
| Static assets | `ascyn-pro-audit/barber-study-pro-v2/public/` |
| Database migrations | `ascyn-pro-audit/supabase/migrations/` |
| Documentation | `ascyn-pro-audit/*.md` (repo root) |

---

## 4. Git Workflow

### 4.1 Before Any Work

1. `git fetch origin`
2. `git checkout workstation-transfer-safety`
3. `git reset --hard origin/workstation-transfer-safety`
4. `git status`
5. `git log --oneline --decorate -5`
6. Verify HEAD equals `origin/workstation-transfer-safety`
7. `npm run build` (verify passing before changes)

### 4.2 Commit Rules

- Use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation only
  - `refactor:` code change that neither fixes a bug nor adds a feature
  - `test:` adding or correcting tests
  - `chore:` tooling, config, dependencies
- Keep commits focused and atomic.
- Do not commit unrelated changes together.
- Do not commit secrets, `.env` files, or API keys.

### 4.3 Patch Files

**No patch files unless explicitly requested.** Patches create drift and bypass normal review. If a patch is requested, the resulting change must still be committed through Git with a normal commit message.

### 4.4 Pushing to GitHub

- Never push without Gabe's approval.
- Before pushing, verify:
  - Branch is on `workstation-transfer-safety`
  - `npm run build` passes
  - `npx tsc --noEmit` passes
  - No secrets in diff
- After pushing, verify the remote branch reflects the intended commit.

---

## 5. Vercel Deployment Workflow

| Item | Rule |
|------|------|
| **Production deploys** | Require Gabe's explicit approval |
| **Preview deploys** | Allowed from `workstation-transfer-safety` for testing |
| **Pre-deploy checks** | `npm run build` and `npx tsc --noEmit` must pass |
| **Environment variables** | Managed in Vercel dashboard; never committed to repo |
| **Domain** | TBD — confirm with Gabe before public launch |

---

## 6. Supabase Environment Rules

| Item | Rule |
|------|------|
| **Production project** | Only Gabe provisions and manages production Supabase project |
| **Local / preview** | May use demo mode (`NEXT_PUBLIC_DEMO_MODE`) when Supabase is unconfigured |
| **Required env vars** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Migrations** | Stored in `supabase/migrations/`; apply in order; never edit applied migrations |
| **RLS policies** | Required for all production tables; reviewed before any schema change |
| **Secrets** | Never commit service-role keys, anon keys, or database passwords |

---

## 7. Code Quality Standards

| Check | Minimum Standard |
|-------|------------------|
| `npm run build` | Must pass before commit |
| `npx tsc --noEmit` | Must pass for code changes |
| ESLint | Target zero new warnings/errors; legacy issues are cleaned incrementally |
| No `any` types | New code must use proper types; legacy `any` is refactored incrementally |
| Accessibility | Follow semantic HTML, ARIA labels, keyboard navigation |
| Mobile | All new UI must be tested at 375 px width |

---

## 8. Roles & Responsibilities

| Role | Who | Authority | Responsibilities |
|------|-----|-----------|------------------|
| **Product Owner** | Gabe | Final say on product, business, design, spending, and deployment decisions | Defines priorities, approves releases, tests features, owns business/legal context |
| **Planning & Architecture** | ChatGPT | Strategic and technical planning, UX, QA design, architecture proposals | Creates specs, analyzes curriculum, designs user flows, reviews code patterns |
| **Implementation & Verification** | Ping / OpenClaw | Executes code changes, refactors, build verification, Git reports, local validation | Writes code, runs builds, manages Git state, reports status, flags blockers |

### Decision-Making Protocol

1. Ping proposes; ChatGPT plans; Gabe decides.
2. No spending, production deploys, or irreversible actions without Gabe's approval.
3. If Ping identifies a poor decision, he respectfully challenges it with reasoning and a better alternative. Once Gabe decides, Ping fully supports it.
4. Disagreements are resolved by Gabe; the written constitution is updated if the decision changes ongoing practice.

---

## 9. Communication Rules

- Report status **before** coding.
- Report blockers immediately.
- Use concise, honest updates. No sugarcoating.
- Document important decisions in markdown files or commit messages.
- When nothing needs to be said, respond with `NO_REPLY`.

---

## 10. Amendments

This constitution is amended by mutual agreement and committed with a `docs:` commit. Gabe has final authority on all amendments.

---

**Adopted:** 2026-07-03  
**Next review:** After NABBA 2026 (September 20, 2026) or upon major workflow change
