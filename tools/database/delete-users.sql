-- Delete non-preserved users from auth.users
DELETE FROM auth.users 
WHERE email NOT IN ('admin@ascyn-smoke.test', 'tessamyers2911@gmail.com', 'patty.pineda.drl@gmail.com');

-- Return count of deleted users
SELECT 'Deleted users' as action, count(*) as count FROM auth.users 
WHERE email NOT IN ('admin@ascyn-smoke.test', 'tessamyers2911@gmail.com', 'patty.pineda.drl@gmail.com');
