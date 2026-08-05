# Environment Reference — Tools, Paths, and Infrastructure

**Purpose:** This file provides quick reference for tools, paths, versions, and infrastructure details. Use this as a lookup when you need specific environment information.

---

## Table of Contents

1. [File Paths](#file-paths)
2. [Tool Versions](#tool-versions)
3. [Commands](#commands)
4. [Environment Variables](#environment-variables)
5. [Infrastructure](#infrastructure)
6. [Credentials](#credentials)
7. [Known Limitations](#known-limitations)

---

## File Paths

### Repository Paths

| Path | Purpose |
|------|---------|
| `C:\Users\gabeb\Projects\barber-study-pro` | Primary repository root |
| `C:\Users\gabeb\Projects\barber-study-pro\src` | Source code |
| `C:\Users\gabeb\Projects\barber-study-pro\src\app` | Next.js App Router pages |
| `C:\Users\gabeb\Projects\barber-study-pro\src\components` | React components |
| `C:\Users\gabeb\Projects\barber-study-pro\src\lib` | Utility libraries and content |
| `C:\Users\gabeb\Projects\barber-study-pro\src\types` | TypeScript type definitions |
| `C:\Users\gabeb\Projects\barber-study-pro\supabase` | Supabase configuration and migrations |
| `C:\Users\gabeb\Projects\barber-study-pro\supabase\migrations` | Database migrations |
| `C:\Users\gabeb\Projects\barber-study-pro\public` | Static assets |
| `C:\Users\gabeb\Projects\barber-study-pro\docs` | Documentation |
| `C:\Users\gabeb\Projects\barber-study-pro\docs\ping` | Ping Operating System docs |
| `C:\Users\gabeb\Projects\barber-study-pro\docs\project-brain` | Project brain docs |
| `C:\Users\gabeb\Projects\barber-study-pro\tests` | Test files |

### OpenClaw Workspace Paths

| Path | Purpose |
|------|---------|
| `C:\Users\gabeb\.openclaw\workspace` | OpenClaw workspace root |
| `C:\Users\gabeb\.openclaw\workspace\MEMORY.md` | Long-term memory |
| `C:\Users\gabeb\.openclaw\workspace\STATUS.md` | Current status |
| `C:\Users\gabeb\.openclaw\workspace\ROADMAP.md` | Project roadmap |
| `C:\Users\gabeb\.openclaw\workspace\WORKSPACE_MAP.md` | Workspace map |
| `C:\Users\gabeb\.openclaw\workspace\PROJECT_ASSETS.md` | Asset registry |
| `C:\Users\gabeb\.openclaw\workspace\memory` | Daily/session memory files |
| `C:\Users\gabeb\.openclaw\workspace\AGENTS.md` | Agent configuration |
| `C:\Users\gabeb\.openclaw\workspace\SOUL.md` | Ping's personality |
| `C:\Users\gabeb\.openclaw\workspace\USER.md` | Gabriel's profile |

### Configuration Paths

| Path | Purpose |
|------|---------|
| `C:\Users\gabeb\Projects\barber-study-pro\package.json` | npm configuration |
| `C:\Users\gabeb\Projects\barber-study-pro\tsconfig.json` | TypeScript configuration |
| `C:\Users\gabeb\Projects\barber-study-pro\next.config.ts` | Next.js configuration |
| `C:\Users\gabeb\Projects\barber-study-pro\tailwind.config.ts` | Tailwind configuration |
| `C:\Users\gabeb\Projects\barber-study-pro\eslint.config.mjs` | ESLint configuration |
| `C:\Users\gabeb\Projects\barber-study-pro\playwright.config.ts` | Playwright configuration |
| `C:\Users\gabeb\Projects\barber-study-pro\.env.local` | Local environment variables |
| `C:\Users\gabeb\Projects\barber-study-pro\.env.production` | Production environment variables |
| `C:\Users\gabeb\.openclaw\openclaw.json` | OpenClaw configuration |

---

## Tool Versions

### Required Tools

| Tool | Version | Status | Verification Command |
|------|---------|--------|---------------------|
| **Node.js** | 24.18.0 | ✅ Installed | `node --version` |
| **npm** | 11.16.0 | ✅ Installed | `npm --version` |
| **Git** | 2.54.0 | ✅ Installed | `git --version` |
| **Supabase CLI** | 2.109.1 | ✅ Installed | `supabase --version` |
| **OpenClaw** | 2026.7.1-2 | ✅ Installed | `openclaw --version` |
| **Docker** | 29.5.3 | ⚠️ Installed, engine not running | `docker --version` |

### Optional Tools

| Tool | Version | Status | Verification Command |
|------|---------|--------|---------------------|
| **Vercel CLI** | — | ❌ Not installed | `vercel --version` |
| **GitHub CLI** | — | ❌ Not installed | `gh --version` |
| **pnpm** | — | ❌ Not installed | `pnpm --version` |
| **yarn** | — | ❌ Not installed | `yarn --version` |

### Package Versions

| Package | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 16.2.6 | Framework |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.x | Language |
| **Tailwind CSS** | 4.x | Styling |
| **Lucide React** | Latest | Icons |
| **@supabase/supabase-js** | Latest | Supabase client |
| **@supabase/ssr** | Latest | Supabase SSR |
| **Playwright** | Latest | Testing |

---

## Commands

### Development Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run dev` | Start development server | Local development |
| `npm run build` | Build for production | Before deployment, verification |
| `npm run lint` | Run ESLint | Code quality verification |
| `npx tsc --noEmit` | TypeScript type check | Type safety verification |
| `npm install` | Install dependencies | After pulling changes, adding packages |

### Git Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `git status` | Check working tree status | Before committing, after changes |
| `git branch --show-current` | Show current branch | Session startup |
| `git branch -a` | List all branches | Finding branches |
| `git log --oneline -10` | Show recent commits | Understanding history |
| `git diff` | Show unstaged changes | Reviewing changes |
| `git add .` | Stage all changes | Before committing |
| `git commit -m "message"` | Commit changes | Saving work |
| `git push` | Push to remote | Sharing work |
| `git pull` | Pull from remote | Getting latest |
| `git stash` | Stash changes | Temporary storage |
| `git stash pop` | Restore stashed changes | Resuming work |

### Supabase Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `supabase --version` | Check CLI version | Environment verification |
| `supabase status` | Check local Supabase status | Local development |
| `supabase link --project-ref <ref>` | Link to project | Initial setup |
| `supabase db diff` | Show schema differences | Schema verification |
| `supabase db push` | Push migrations to remote | Deploying migrations |
| `supabase db reset` | Reset local database | Local development |
| `supabase migration new <name>` | Create new migration | Schema changes |
| `supabase projects list` | List all projects | Finding projects |

### Testing Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npx playwright test` | Run all tests | Testing |
| `npx playwright test --ui` | Run tests in UI mode | Debugging tests |
| `npx playwright test <file>` | Run specific test file | Testing specific feature |
| `npx playwright show-report` | Show test report | After test run |
| `npx playwright install` | Install browsers | Initial setup |

### OpenClaw Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `openclaw --version` | Check OpenClaw version | Environment verification |
| `openclaw status` | Check OpenClaw status | Troubleshooting |
| `openclaw gateway status` | Check Gateway status | Troubleshooting |
| `openclaw devices list` | List paired devices | Device management |
| `openclaw devices approve <id>` | Approve device | Device pairing |

---

## Environment Variables

### Required Variables

| Variable | Purpose | Location | Example |
|----------|---------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `.env.local`, `.env.production` | `https://hgyznydxepjsvbjsirpv.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `.env.local`, `.env.production` | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `.env.local`, `.env.production` | `eyJhbGc...` |

### Optional Variables

| Variable | Purpose | Location | Example |
|----------|---------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site URL for redirects | `.env.production` | `https://ascynpro.com` |
| `RESEND_API_KEY` | Resend email API key | `.env.production` | `re_...` |
| `SENDGRID_API_KEY` | SendGrid API key | `.env.production` | `SG....` |

### Environment Variable Security

**Rules:**
1. **Never commit** `.env.local` or `.env.production` to Git
2. **Never expose** `SUPABASE_SERVICE_ROLE_KEY` to client-side code
3. **Always use** `NEXT_PUBLIC_` prefix for client-side variables
4. **Rotate keys** if accidentally exposed
5. **Use different keys** for development and production

---

## Infrastructure

### Supabase

| Field | Value |
|-------|-------|
| **Project Name** | `ascyn-pro` |
| **Project Ref** | `hgyznydxepjsvbjsirpv` |
| **Region** | West US (Oregon) |
| **Org ID** | `jxclbwknnlkeontyeizw` |
| **Database URL** | `https://hgyznydxepjsvbjsirpv.supabase.co` |
| **Dashboard** | `https://supabase.com/dashboard/project/hgyznydxepjsvbjsirpv` |

### Other Supabase Projects

| Project | Ref | Purpose |
|---------|-----|---------|
| `Ok Roll` | `ztziyivjfcbsxbyyphdj` | Separate project |
| `153 cuts` | `ytjqgxhcwnksnufvcxip` | Separate project |

### GitHub

| Field | Value |
|-------|-------|
| **Repository** | `barber-study-pro` |
| **Owner** | `bruceleeroy266` |
| **Remote URL** | `https://github.com/bruceleeroy266/barber-study-pro.git` |
| **Default Branch** | `main` |
| **Current Branch** | `feature/browser-automation` |

### Vercel

| Field | Value |
|-------|-------|
| **Status** | ❌ Not configured |
| **CLI** | ❌ Not installed |
| **Project** | Unknown |
| **Domain** | `ascynpro.com` (not verified) |

---

## Credentials

### Stored Credentials

| Credential | Location | Access |
|------------|----------|--------|
| **Supabase Anon Key** | `.env.local`, `.env.production` | Client-side |
| **Supabase Service Role Key** | `.env.local`, `.env.production` | Server-side only |
| **GitHub Credentials** | Git credential manager | Git operations |
| **OpenClaw Token** | `~/.openclaw/openclaw.json` | OpenClaw operations |

### Credential Security

**Rules:**
1. **Never commit** credentials to Git
2. **Never expose** service role key to client
3. **Rotate keys** if exposed
4. **Use environment variables** for all secrets
5. **Limit access** to minimum necessary

### Credential Rotation Procedure

**If credentials are exposed:**

1. **Immediately rotate** the exposed credential
2. **Update** all `.env` files
3. **Verify** no unauthorized access
4. **Document** the incident
5. **Review** security practices

---

## Known Limitations

### Current Limitations

| Limitation | Impact | Workaround | Status |
|------------|--------|------------|--------|
| **Docker Desktop not running** | Cannot run `supabase db diff` | Start Docker Desktop | ⚠️ Blocked |
| **Vercel CLI not installed** | Cannot verify deployments | Install Vercel CLI | ❌ Open |
| **GitHub CLI not installed** | Cannot use `gh` commands | Install GitHub CLI | ❌ Open |
| **No email provider** | Cannot send transactional email | Configure email provider | ❌ Open |
| **No CI/CD** | No automated testing/deployment | Set up GitHub Actions | ❌ Open |
| **No test execution** | Cannot verify tests pass | Run Playwright tests | ⚠️ Open |
| **Lint failing** | Code quality gate failing | Fix lint errors | ❌ Open |

### Workarounds

**Docker Desktop not running:**
- Use Supabase web dashboard for schema inspection
- Ask Gabriel to start Docker Desktop
- Use `supabase db push` with caution (test locally first)

**Vercel CLI not installed:**
- Use Vercel web dashboard for deployment
- Install Vercel CLI: `npm install -g vercel`

**GitHub CLI not installed:**
- Use Git commands directly
- Use GitHub web interface
- Install GitHub CLI: `winget install GitHub.cli`

**No email provider:**
- Use Supabase Auth email templates (limited)
- Configure Resend, SendGrid, or AWS SES
- Test email delivery manually

**No CI/CD:**
- Run tests manually before committing
- Use pre-commit hooks
- Set up GitHub Actions

---

## Quick Reference Card

### Session Startup

```powershell
cd C:\Users\gabeb\Projects\barber-study-pro
git branch --show-current
git status
node --version
npm --version
```

### Verification

```powershell
npm run build
npm run lint
npx tsc --noEmit
```

### Supabase

```powershell
supabase status
supabase db diff
supabase db push
```

### Git Workflow

```powershell
git add .
git commit -m "type: description"
git push
```

### Testing

```powershell
npx playwright test
npx playwright test --ui
npx playwright show-report
```

---

## Cross-References

- **[RECOVERY.md](RECOVERY.md)** — Session startup procedures
- **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — Step-by-step work procedures
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — Evidence and verification standards

---

*Keep this reference up to date. When tools, versions, or infrastructure change, update this file immediately.*
