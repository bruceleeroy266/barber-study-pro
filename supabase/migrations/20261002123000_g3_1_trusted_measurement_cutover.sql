-- G3-1 — Trusted Measurement Cutover
--
-- PO-1B is now the authoritative study-duration runtime. The legacy
-- record_study_activity(integer,text) RPC wrote directly to the same
-- study_activity_days rollup without the PO-1B meaningful-learning contract.
-- Close that client mutation lane so only the authoritative PO-1B RPC chain
-- can increase trusted study totals.

revoke execute on function public.record_study_activity(integer, text) from authenticated;
revoke execute on function public.record_study_activity(integer, text) from anon;
revoke execute on function public.record_study_activity(integer, text) from public;

comment on function public.record_study_activity(integer, text) is
  'DEPRECATED: legacy study-time writer. Client execution revoked by G3-1; trusted study totals must flow through PO-1B session telemetry.';

-- Preserve the authoritative PO-1B mutation lane.
grant execute on function public.begin_study_session(text, text) to authenticated;
grant execute on function public.record_learning_activity(uuid, text, timestamptz) to authenticated;
grant execute on function public.end_study_session(uuid, text) to authenticated;
grant execute on function public.link_study_quiz_attempt(uuid, uuid) to authenticated;
