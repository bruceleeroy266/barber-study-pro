-- Delete profiles that don't have matching auth users
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Return count
SELECT 'Remaining profiles' as action, count(*) as count FROM public.profiles;
