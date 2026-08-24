# Production Authentication Release Gate

ASCYN PRO releases must fail closed unless both production account-integrity and production authentication smoke checks pass.

## Required sequence

1. CODE TESTS
2. SECURITY TESTS
3. BUILD
4. DEPLOY
5. PRODUCTION BROWSER MATRIX
6. PRODUCTION ACCOUNT-INTEGRITY GATE
7. PRODUCTION AUTHENTICATION SMOKE GATE
8. FINAL RELEASE GO

## Account-integrity gate

Verify designated production accounts before release approval:

- Gabriel: `ascynproofficial@gmail.com` (`admin`, no school binding)
- Patty: `patty.pineda.drl@gmail.com` (`student`, RISE school)
- Malenny: `malennysaenz@gmail.com` (`student`, RISE school)
- Tessa: `tessamyers2911@gmail.com` (`instructor`, RISE school)

Checks:

- auth user exists
- profile exists
- email confirmed
- not banned
- not disabled
- expected role
- expected approval status
- expected tenant relationship

## Authentication smoke gate

Use dedicated non-human smoke accounts only:

- `smoke-student@ascynpro.test`
- `smoke-instructor@ascynpro.test`
- `smoke-admin@ascynpro.test`
- `smoke-school-admin@ascynpro.test`

Rules:

- credentials are never embedded in source or UI
- credentials live only in protected secret storage
- accounts are least-privilege and identifiable as automation
- rotate or revoke after exposure or incident response

## Cleanup safeguard rule

Any cleanup or remediation flow must provide:

- explicit selection criteria
- dry-run preview
- exact affected-account list
- protected designated-account exclusions
- before/after verification
- audit trail
- rollback instructions
- explicit confirmation before destructive action
