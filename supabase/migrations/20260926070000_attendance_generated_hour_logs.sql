-- ============================================================================
-- Segment C — Attendance-generated Student Hours
-- Adds provenance and a database-level duplicate guard so one attendance
-- record can create at most one hour_logs row.
-- ============================================================================

alter table public.hour_logs
  add column if not exists source_type text not null default 'manual',
  add column if not exists source_attendance_id uuid references public.attendance_records(id) on delete restrict;

alter table public.hour_logs
  drop constraint if exists hour_logs_source_type_check;

alter table public.hour_logs
  add constraint hour_logs_source_type_check
  check (source_type in ('manual', 'attendance'));

create unique index if not exists uq_hour_logs_source_attendance
  on public.hour_logs(source_attendance_id)
  where source_attendance_id is not null;

create index if not exists idx_hour_logs_source_type
  on public.hour_logs(source_type);

comment on column public.hour_logs.source_type is
  'manual for instructor-entered hours; attendance for hours generated from a submitted attendance record.';

comment on column public.hour_logs.source_attendance_id is
  'Attendance record that generated this hour entry. Unique when present to prevent duplicate hour creation.';
