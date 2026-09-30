# C19-H2 — Shared Remediation RPC Security Hardening

C19-H2 closes a platform-level security gap discovered after the C19-H1 production database verification.

## Problem

Several shared remediation/reassessment PostgreSQL functions are `SECURITY DEFINER` functions.

PostgreSQL grants function execution to `PUBLIC` by default unless explicitly revoked. In the production Supabase project, this left sensitive remediation RPC entry points executable through PostgREST by `anon` and `authenticated` roles even though ASCYN PRO already invokes them from trusted server-side routes using the service-role key.

The affected server-only RPCs include:

- `create_remediation_cycle_with_assignments`
- `get_active_remediation_cycle_id`
- `consume_reservation_and_create_attempt`
- `record_question_attempt`
- `check_and_record_pool_exhaustion`
- `get_attempted_question_ids`
- `has_attempted_question`
- `evaluate_remediation_cycle`
- `validate_evaluation_evidence`
- `create_instructor_escalation`

## H2 repair

The new migration revokes `EXECUTE` from:

- `PUBLIC`
- `anon`
- `authenticated`

and explicitly grants execution to:

- `service_role`

The server factories used by detection, reassessment exclusion/history, and remediation evaluation now also fail closed if `SUPABASE_SERVICE_ROLE_KEY` is missing rather than silently falling back to the anon key.

## Preserved behavior

H2 does not change:

- Chapter 19 lesson, flashcard, assessment, micro-check, or reassessment inventory;
- Chapter 19 concept architecture;
- Chapter 19 80% ordinary/compliance recovery;
- Chapter 19 100% urgent practical-safety recovery;
- same-school authorization;
- immutable evidence rules;
- reassessment exclusion/replay behavior;
- 20/10/40/15/15 grading;
- lack of fabricated scenario/application evidence.

## Deployment rule

This migration must not be applied to production until the exact H2 branch passes Engineering Verification and Vercel and receives explicit merge/deployment authorization.

After production deployment, verification must prove:

1. `anon` cannot execute the protected RPCs;
2. `authenticated` cannot execute the protected RPCs;
3. `service_role` can execute the protected RPCs;
4. server-side detection/reassessment/evaluation paths still function;
5. the Supabase security advisor no longer reports those protected functions as anonymously/authenticated executable.

Broader Supabase security warnings not caused by Chapter 19 remain separate platform-hardening work.
