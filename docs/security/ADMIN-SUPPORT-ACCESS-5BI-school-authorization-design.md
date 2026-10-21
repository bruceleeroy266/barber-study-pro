# ADMIN-SUPPORT-ACCESS-5BI — School-controlled Support Mode authorization design

Status: DESIGN ONLY. No schema/UI/API enforcement is implemented by this document. Production release remains blocked.

## Policy and principals
- Fail closed. Support is disabled by default per school.
- Only a currently approved and enabled school_owner or a designated school_admin with explicit `manage_support_authorization` permission may grant or revoke support. School membership, role, authorization status and user identity must be checked server-side. Never allow a platform administrator to self-grant on the school's behalf.
- School grants are scoped by school ID, category, start/end dates, authorizing principal and policy version. Routine technical support and read-only diagnosis are distinguished from narrow corrective actions.
- School consent does not supersede least privilege, tenant RLS, the real-actor audit requirement, or legal and contractual privacy obligations.
- Authorization expires automatically; revoke immediately from school's UI. Reauthorization requires a new grant. Expiring or revoking a grant invalidates any active support sessions for that school and blocks privileged actions via DB checks, not just the UI or cookie.
- No unreviewed emergency override. Break-glass, if introduced, requires distinct governance, notification, duration, monitoring and security approval.

## Proposed durable records
1. `school_support_grants`: id, school_id, authorized_by, scope (enumerated), starts_at, expires_at, revoked_at, revoked_by, policy_version, consent_basis, created_at, immutable receipt or attestation digest. No writable grants for platform admins.
2. `support_access_sessions` add grant_id, school_id, started_at, ended_at, ended_reason and actor/target fields already present; persist actor identity and avoid relying on cookies as authority.
3. `school_support_action_approvals`: id, school_id, student_id, action_type, allowed fields, original values fingerprint, proposed values, reason, requested_by, approved_by, approved_at, expires_at, used_at, execution_id, status. Approval actor must be distinct from the support operator; optionally require a second school approver for grading/hour corrections.
4. Immutable `support_access_events`: grant/revoke, session start/stop, denied attempts, actions, authorization reference, before/after values or immutable digests, true actor, subject school, timestamp and outcomes; confidential details protected from unrelated users.

## Authorization flow
1. School grants routine support for a bounded scope (prefer up to 90 days for pilot) through authenticated Settings > Support Access. Render current status, access history, expiration and Revoke.
2. At support-session start: validate platform admin, staff target, school grant, allowed scope, and requested duration; bind DB session to exact grant and target.
3. On every support-context resolution and every database write: revalidate actor, target, school, grant (active/unrevoked/unexpired), session and scope against DB. Authoritative checks inside SECURITY DEFINER RPC or RLS for sensitive writes, including service-role-mediated actions.
4. Sensitive grade, official attendance, approved hour, or academic-history corrections require an unexpired one-time action approval covering exact student/record/field change. Consume the approval atomically with the mutation and record the true actor and before/after evidence. No invisible overwrites or deletion of academic history.
5. On revoke: atomically mark grant revoked, end linked sessions, invalidate pending action approvals, and notify school contact. A stale browser cookie grants nothing. In-flight writes must recheck in the same transaction to prevent time-of-check/time-of-use races.

## UX
School Settings > Support Access: Off / Active through [date]; explanation of routine scope; authorizer/date; view session and audit log; enable with explicit confirmation; revoke with immediate confirmation. Sensitive changes prompt an approval workflow with student, exact change, rationale, expiration and approve/deny, including notification.
Platform Support Access: require eligible school grant, show limited scope, expiration, active target and reason; deny unconsented schools without silent override. No school-selected staff password access.

## Adversarial acceptance tests
- School A authorization never unlocks School B; nonauthorized school has no effective support context.
- Platform administrator cannot grant/revoke consent by impersonating a school operator; malformed/synthetic grant fails.
- Revocation and expiry deny fresh and stale-cookie sessions and every protected RPC, including attempts racing revocation.
- Disabled school admins or expired authorizations cannot grant support.
- Sensitive actions without exact, unconsumed, school-approved authorization deny without mutation.
- Wrong student/school/action/old-value fingerprint, revoked or replayed approval denies.
- Real actor and approval identity persisted; failures cannot silently bypass critical audit policy.
- Test with authenticated school A/B fixture, API, browser UI, direct RPC, and service-role pathways.

## Release gates
Implementation requires new schema and RLS policies, server actions, UI, API and end-to-end tests. Independently assess contract and regulatory obligations (e.g. FERPA roles/legitimate educational interest where applicable). Do not represent onboarding invitation or broad pilot consent as approval for official record changes. Require independent security review on exact release SHA, disposable migration+restore drill, and owner signoff before deployment.
