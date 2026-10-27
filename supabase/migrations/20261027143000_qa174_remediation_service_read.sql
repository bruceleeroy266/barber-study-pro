-- QA-174: service-role readback for instructor-authorized Chapter 5 remediation.
-- RLS bypass does not supply base SQL privileges; avoid granting authenticated users.
grant select on table public.remediation_cycles to service_role;
grant select on table public.remediation_assignments to service_role;
