# COM-1D.7 — Realtime Decision

Status: DEFERRED FOR PILOT

ASCYN PRO will not enable Supabase Realtime for production communications during the pilot.

## Decision

The production communications system remains request/refresh based for the pilot. Messaging and bulletins already satisfy the locked COM-1A communication contract without Realtime, and COM-1D.6 hardened unread state, archive behavior, loading states, duplicate-submit protection, and accessibility without introducing live subscriptions.

## Why Realtime is deferred

- It is not required by the locked pilot contract.
- The current server-action + RLS model is already production-authoritative.
- Realtime would add subscription lifecycle, reconnection, duplicate-event, stale-state, and authorization complexity immediately before final certification.
- The pilot benefits more from stability and observability than instant delivery.
- Realtime can be reconsidered later as an isolated enhancement after pilot evidence shows a real need.

## Guardrail

COM-1E certification must verify that no production communications code enables Supabase Realtime channels or subscriptions.

## Revisit trigger

Reconsider Realtime only if pilot evidence shows that manual refresh/request-driven updates materially impair instructor or student communication workflows.
