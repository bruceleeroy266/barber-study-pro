SELECT id, email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email NOT IN ('admin@ascyn-smoke.test', 'tessamyers2911@gmail.com', 'patty.pineda.drl@gmail.com')
ORDER BY email;
