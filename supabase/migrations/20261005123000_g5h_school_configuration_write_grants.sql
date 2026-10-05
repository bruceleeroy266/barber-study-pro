-- G5-H: restore least-privilege DML grants required by the authenticated
-- School Configuration server action. Row Level Security remains the
-- authorization boundary for platform admins and school-attached admins.

GRANT UPDATE ON TABLE public.schools TO authenticated;
GRANT INSERT, UPDATE ON TABLE public.school_settings TO authenticated;
