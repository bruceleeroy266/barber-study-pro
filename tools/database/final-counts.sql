SELECT 'auth.users' as table_name, count(*) as count FROM auth.users
UNION ALL
SELECT 'profiles', count(*) FROM public.profiles
UNION ALL
SELECT 'schools', count(*) FROM public.schools;
