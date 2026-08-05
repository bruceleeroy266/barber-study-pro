# Engineering Tools

This directory contains utilities created during engineering verification, production investigation, authentication debugging, certification, and CI implementation.

## Purpose

These tools were built to diagnose, verify, and repair issues during development and production incident response. They are preserved for future maintenance and troubleshooting but are **not part of the production application**.

## Folder Structure

```
tools/
├── auth/                    # Authentication debugging and repair utilities
│   ├── check-*.js           # Environment and configuration checkers
│   ├── comprehensive-auth-audit.js
│   ├── create-test-accounts.js
│   ├── deep-auth-tests.js
│   ├── fix-*.js             # Account repair scripts
│   ├── restore-admin.js
│   ├── search-admins.js
│   ├── test-*.js            # Auth flow test scripts
│   └── trace-*.js           # Login/session tracing scripts
│
├── database/                # Database inspection, repair, and migration utilities
│   ├── check-*.sql          # Inspection queries
│   ├── clean-*.sql          # Data cleanup scripts
│   ├── cleanup-*.js         # Orphan/user cleanup scripts
│   ├── create-*.sql         # User/profile creation scripts
│   ├── delete-users.sql
│   ├── update-profiles.sql
│   └── verify-*.sql         # Verification queries
│
├── investigation/           # Production investigation and analysis tools
│   ├── data-flow-audit.js
│   ├── final-verification.js
│   ├── visual-certification.js
│   └── visual-certification-full.js
│
├── verification/            # Production smoke tests and verification
│   ├── production-smoke-test.js
│   └── smoke-test-production.js
│
└── scripts/                 # TypeScript/ESM investigation scripts
    ├── auth/                # Auth-specific investigation scripts
    ├── database/            # Database backup and discovery scripts
    ├── investigation/       # Hanging request, deployment check scripts
    └── verification/        # Production smoke test (TypeScript)
```

## Naming Conventions

- `check-*` — Read-only inspection/diagnostic scripts
- `create-*` — One-time account or data creation scripts
- `fix-*` — One-time repair scripts
- `test-*` — Test/verification scripts
- `trace-*` — Request/session tracing scripts
- `verify-*` — Verification scripts
- `cleanup-*` / `clean-*` — Data cleanup scripts
- `*.sql` — Direct database queries (run via Supabase SQL editor or `psql`)
- `*.js` — Node.js scripts (run via `node tools/<category>/<script>.js`)
- `*.ts` / `*.mjs` — TypeScript/ESM scripts (run via `npx tsx` or `node`)

## Production vs Investigation

| Category | Production Utility? | Notes |
|----------|-------------------|-------|
| `tools/verification/` | Yes | Smoke tests can be run against production after deployments |
| `tools/auth/check-*` | Yes | Environment/config checkers are safe for ongoing diagnostics |
| `tools/auth/fix-*` | No | One-time repair scripts — do not re-run without understanding context |
| `tools/auth/trace-*` | No | Debugging scripts for specific incident investigation |
| `tools/database/` | Caution | SQL scripts modify data — always review before running |
| `tools/investigation/` | No | Tied to specific investigation phases |
| `tools/scripts/` | Mixed | See individual script headers for context |

## Maintenance Guidance

1. **Do not delete these tools** without confirming they are no longer needed for incident response.
2. **Do not run database scripts** (`tools/database/`) against production without reviewing the SQL first.
3. **Do not commit credentials** — these scripts may reference environment variables; ensure `.env` files are never committed.
4. If a tool becomes a permanent operational need, promote it to `scripts/` (tracked) with proper error handling and documentation.
5. If a tool is confirmed obsolete, remove it in a dedicated cleanup commit with a clear message.

## Safety

- Most `.js` scripts require environment variables (Supabase URL, service key) to function.
- SQL scripts should be run in the Supabase SQL editor with appropriate caution.
- None of these tools are imported by the Next.js application — they are standalone utilities.

## Required Environment Variables

The following environment variables are required for various tools in this directory. **Never commit these values to the repository.**

### Supabase Configuration

| Variable | Description | Used By |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `tools/auth/create-test-accounts.js`, `tools/auth/fix-instructor-password.js` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin access) | `tools/auth/create-test-accounts.js`, `tools/auth/fix-instructor-password.js`, `tools/scripts/auth/login-failure-investigation.js` |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL | `tools/scripts/auth/login-failure-investigation.js` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anonymous key | `tools/scripts/auth/login-failure-investigation.js` |

### Database Configuration

| Variable | Description | Used By |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `tools/auth/restore-admin.js` |

### Admin Credentials

| Variable | Description | Used By |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Administrator email address | `tools/auth/restore-admin.js`, `tools/scripts/auth/login-failure-investigation.js` |
| `ADMIN_PASSWORD` | Administrator password | `tools/scripts/auth/login-failure-investigation.js` |
| `ADMIN_USER_ID` | UUID of admin user | `tools/auth/restore-admin.js` |
| `ADMIN_ENCRYPTED_PASSWORD` | Bcrypt hash of admin password | `tools/auth/restore-admin.js` |

### Production URLs

| Variable | Description | Used By |
|----------|-------------|---------|
| `PROD_URL` | Production deployment URL | `tools/scripts/auth/login-failure-investigation.js` |

### Setting Environment Variables

**PowerShell:**
```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
$env:DATABASE_URL="postgresql://postgres:password@host:port/database"
$env:ADMIN_EMAIL="admin@example.com"
```

**Bash:**
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export DATABASE_URL="postgresql://postgres:password@host:port/database"
export ADMIN_EMAIL="admin@example.com"
```

**Using .env.local (for scripts that support it):**
```bash
# Create .env.local in the repository root
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@host:port/database
ADMIN_EMAIL=admin@example.com
```
