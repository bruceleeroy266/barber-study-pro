-- Final counts
SELECT 'auth.users' as table_name, count(*) as count FROM auth.users
UNION ALL
SELECT 'profiles', count(*) FROM public.profiles
UNION ALL
SELECT 'schools', count(*) FROM public.schools;

-- Verify preserved accounts
SELECT 
    u.email,
    u.id as user_id,
    p.role,
    p.school_id,
    p.approval_status,
    s.name as school_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.schools s ON p.school_id = s.id
ORDER BY u.email;
