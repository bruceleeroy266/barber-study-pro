# G5-A — Existing Onboarding Capability Certification

## Purpose

Freeze the onboarding capabilities already present in production before Gate 5 self-service work begins. G5-A is certification-only. It does not redesign onboarding and does not authorize duplicate implementations of existing functionality.

## Certified Foundation

The following capabilities are part of the existing onboarding foundation and should be reused by later Gate 5 slices:

- pilot inquiry approval and school provisioning;
- school settings and active program provisioning;
- school-admin invitation and activation;
- instructor invitation and activation;
- student invitation and activation;
- invitation lifecycle tracking, including pending, accepted, expired, and revoked states;
- duplicate-email / duplicate-invitation protection;
- setup-link recovery;
- user creation and account enable/disable controls;
- student program enrollment;
- canonical student-to-instructor assignment;
- school configuration and program requirements;
- school-admin launch guide;
- end-to-end onboarding regression coverage.

## Frozen Architectural Rule

Gate 5 self-service work must orchestrate the existing user management, invitation, enrollment, assignment, school-configuration, and onboarding lifecycle paths. It must not create parallel onboarding tables, duplicate assignment models, duplicate enrollment logic, or separate invitation lifecycles without a separately certified migration need.

## Known Self-Service Gaps

These remain legitimate Gate 5 work and are not considered part of the frozen foundation:

- persistent onboarding progress/status;
- one school setup center;
- automatic launch-readiness resolver;
- plain-language blocker/action presentation;
- consolidated invitation-status presentation;
- bulk student onboarding / mass invitations if justified after guided-flow validation;
- bulk instructor assignment if justified;
- human usability certification with AV;
- fresh-school repeatability test.

## Certification Boundary

G5-A is GREEN only when:

1. the regression certification test passes;
2. Engineering Verification passes on the exact PR head;
3. the Vercel preview is READY on the same exact PR head;
4. the PR head remains unchanged before merge.

After merge, production main and production Vercel must be verified before G5-A is formally closed.
