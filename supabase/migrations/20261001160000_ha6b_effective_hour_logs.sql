-- ============================================================================
-- H&A-6B — Canonical Effective-Hours Resolver
--
-- Provides the single production read contract for official student hours.
-- No UI changes. No learning/TLS changes.
-- ============================================================================

drop view if exists public.effective_hour_logs;

create view public.effective_hour_logs
with (security_invoker = true)
as
with chain_summary as (
  select
    a.hour_log_id,
    count(*)::integer as adjustment_count,
    min(a.adjustment_sequence) as min_sequence,
    max(a.adjustment_sequence) as max_sequence,
    bool_and(a.school_id = h.school_id) as school_matches,
    bool_and(a.student_id = h.user_id) as student_matches,
    bool_and(a.original_minutes = h.minutes) as original_minutes_match,
    bool_and(a.source_type = h.source_type) as source_type_matches,
    bool_and(a.source_attendance_id is not distinct from h.source_attendance_id) as attendance_source_matches
  from public.hour_adjustments a
  join public.hour_logs h on h.id = a.hour_log_id
  group by a.hour_log_id
),
link_summary as (
  select
    current_adjustment.hour_log_id,
    bool_and(
      (
        current_adjustment.adjustment_sequence = 1
        and current_adjustment.previous_adjustment_id is null
      )
      or
      (
        current_adjustment.adjustment_sequence > 1
        and previous_adjustment.id = current_adjustment.previous_adjustment_id
        and previous_adjustment.hour_log_id = current_adjustment.hour_log_id
        and previous_adjustment.adjustment_sequence = current_adjustment.adjustment_sequence - 1
        and previous_adjustment.new_effective_minutes = current_adjustment.previous_effective_minutes
      )
    ) as links_valid,
    bool_and(
      case
        when current_adjustment.adjustment_sequence = 1
          then current_adjustment.previous_effective_minutes = h.minutes
        else true
      end
    ) as first_value_matches
  from public.hour_adjustments current_adjustment
  join public.hour_logs h on h.id = current_adjustment.hour_log_id
  left join public.hour_adjustments previous_adjustment
    on previous_adjustment.id = current_adjustment.previous_adjustment_id
  group by current_adjustment.hour_log_id
),
latest_adjustment as (
  select distinct on (a.hour_log_id)
    a.hour_log_id,
    a.id as latest_adjustment_id,
    a.adjustment_sequence,
    a.new_effective_minutes,
    a.created_at as latest_adjustment_created_at
  from public.hour_adjustments a
  order by
    a.hour_log_id,
    a.adjustment_sequence desc,
    a.created_at desc,
    a.id desc
),
resolved as (
  select
    h.*,
    h.minutes as original_minutes,
    coalesce(c.adjustment_count, 0) as adjustment_count,
    l.latest_adjustment_id,
    l.latest_adjustment_created_at,
    case
      when h.status <> 'approved'
        and h.adjustment_version = 0
        and coalesce(c.adjustment_count, 0) = 0
        then 'not_approved'
      when h.status = 'approved'
        and h.adjustment_version = 0
        and coalesce(c.adjustment_count, 0) = 0
        then 'valid_unadjusted'
      when h.status = 'approved'
        and h.adjustment_version > 0
        and c.adjustment_count = h.adjustment_version
        and c.min_sequence = 1
        and c.max_sequence = h.adjustment_version
        and c.school_matches
        and c.student_matches
        and c.original_minutes_match
        and c.source_type_matches
        and c.attendance_source_matches
        and ls.links_valid
        and ls.first_value_matches
        and l.adjustment_sequence = h.adjustment_version
        then 'valid_adjusted'
      else 'invalid'
    end as integrity_status,
    case
      when h.status <> 'approved'
        and h.adjustment_version = 0
        and coalesce(c.adjustment_count, 0) = 0
        then 0
      when h.status = 'approved'
        and h.adjustment_version = 0
        and coalesce(c.adjustment_count, 0) = 0
        then h.minutes
      when h.status = 'approved'
        and h.adjustment_version > 0
        and c.adjustment_count = h.adjustment_version
        and c.min_sequence = 1
        and c.max_sequence = h.adjustment_version
        and c.school_matches
        and c.student_matches
        and c.original_minutes_match
        and c.source_type_matches
        and c.attendance_source_matches
        and ls.links_valid
        and ls.first_value_matches
        and l.adjustment_sequence = h.adjustment_version
        then l.new_effective_minutes
      else null
    end as effective_minutes
  from public.hour_logs h
  left join chain_summary c on c.hour_log_id = h.id
  left join link_summary ls on ls.hour_log_id = h.id
  left join latest_adjustment l on l.hour_log_id = h.id
)
select
  resolved.*,
  case
    when integrity_status = 'valid_adjusted' then true
    else false
  end as is_adjusted,
  case
    when effective_minutes is null then null
    else effective_minutes - original_minutes
  end as effective_delta_minutes
from resolved;

comment on view public.effective_hour_logs is
  'Canonical security-invoker read model for official hour values. Approved unadjusted rows use original minutes; valid adjusted rows use the final immutable adjustment; pending/rejected rows contribute 0; invalid chains return NULL effective_minutes and integrity_status=invalid so callers fail closed.';

revoke all on public.effective_hour_logs from public, anon, authenticated;
grant select on public.effective_hour_logs to authenticated;
grant select on public.effective_hour_logs to service_role;
