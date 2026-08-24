# Production Authentication Release Gate

ASCYN PRO releases must fail closed unless all production authentication gates pass.

## Required sequence

1. CODE TESTS
2. SECURITY TESTS
3. BUILD
4. DEPLOY
5. PRODUCTION BROWSER MATRIX
6. PRODUCTION ACCOUNT-INTEGRITY GATE
7. PRODUCTION AUTHENTICATION SMOKE GATE
8. PRODUCTION AUTHENTICATION LIFECYCLE GATE
9. FINAL RELEASE GO

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

## Authentication lifecycle gate

**MANDATORY:** Verify complete user lifecycle for all smoke roles before release GO.

### Required Lifecycle Stages

For each smoke role (`student`, `instructor`, `school_admin`, `admin`):

#### 1. LOGIN
- email + password → session established → correct role dashboard

#### 2. REFRESH
- authenticated page refresh → session remains valid

#### 3. PROTECTED ROUTE
- authenticated user → authorized protected route succeeds

#### 4. CROSS-ROLE ACCESS
- user attempts another role's protected area → denied/rerouted appropriately

#### 5. LOGOUT
- logout → session invalidated → auth cookies/session cleared appropriately

#### 6. POST-LOGOUT
- direct navigation to protected route → denied

#### 7. LOGIN AGAIN
- same legitimate account → fresh authentication succeeds → correct dashboard

#### 8. INVITATION/SETUP
- invitation → verification → authenticated setup session → create password → correct dashboard

#### 9. PASSWORD RECOVERY
- Forgot Password → recovery email → verification → authenticated recovery session → create new password → correct destination

### Failure Policy

**FAIL CLOSED:** If any mandatory authentication lifecycle gate fails, the release MUST NOT receive GO.

No error state may accidentally grant access. Invalid or expired links with NO valid authenticated session must continue to fail closed.

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
