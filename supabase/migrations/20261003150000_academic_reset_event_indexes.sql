-- ============================================================================
-- Academic reset event index hardening
-- Covers foreign-key lookups and reset audit queries flagged by Supabase
-- Performance Advisor for academic_reset_events.
-- ============================================================================

create index if not exists idx_academic_reset_events_student_id
  on public.academic_reset_events(student_id);

create index if not exists idx_academic_reset_events_school_id
  on public.academic_reset_events(school_id);

create index if not exists idx_academic_reset_events_requested_by
  on public.academic_reset_events(requested_by);
