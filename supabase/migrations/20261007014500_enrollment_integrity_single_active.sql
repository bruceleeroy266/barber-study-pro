-- ENROLLMENT-INTEGRITY-1
-- Enforce one active enrollment per student across programs.
--
-- This is deliberately a partial unique index so historical withdrawn,
-- completed, or deleted enrollment rows remain intact.

do $$
begin
  if exists (
    select 1
    from public.enrollments
    where status = 'active'
      and is_active = true
      and deleted_at is null
    group by student_id
    having count(*) > 1
  ) then
    raise exception 'Cannot enable single-active-enrollment protection while duplicate active enrollments exist'
      using errcode = '23505';
  end if;
end;
$$;

create unique index if not exists enrollments_one_active_per_student_idx
  on public.enrollments(student_id)
  where status = 'active'
    and is_active = true
    and deleted_at is null;

comment on index public.enrollments_one_active_per_student_idx is
  'ENROLLMENT-INTEGRITY-1: prevents a student from having more than one active, non-deleted program enrollment at a time.';
