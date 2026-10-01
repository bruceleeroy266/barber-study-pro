-- H&A production hardening: attendance correction grants
-- The table already has same-school RLS policies. These grants allow the
-- authenticated client to exercise the existing SELECT/INSERT policies while
-- keeping correction rows non-editable from application clients.
grant select, insert on public.attendance_corrections to authenticated;
revoke update, delete on public.attendance_corrections from authenticated;
