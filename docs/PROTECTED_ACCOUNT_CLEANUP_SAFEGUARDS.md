# Protected Account Cleanup Safeguards

This repository now treats designated production accounts as protected assets during cleanup and remediation work.

## Protected designated accounts

- `ascynproofficial@gmail.com`
- `patty.pineda.drl@gmail.com`
- `malennysaenz@gmail.com`
- `tessamyers2911@gmail.com`
- `smoke-student@ascynpro.test`
- `smoke-instructor@ascynpro.test`
- `smoke-admin@ascynpro.test`
- `smoke-school-admin@ascynpro.test`

## Required cleanup workflow

1. Define explicit selection criteria.
2. Run a dry-run preview.
3. Review the exact affected-account list.
4. Confirm protected designated accounts are excluded.
5. Capture before/after verification evidence.
6. Write an audit trail.
7. Document rollback or recovery steps.
8. Require explicit confirmation before any destructive operation.

## Operational script

Use:

```powershell
node tools/scripts/database/protected-cleanup-preview.js
```

This script is read-only and returns a preview payload separating protected accounts from deletable candidates.
