-- Clean up beta_agreements for deleted users
DELETE FROM public.beta_agreements 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Clean up notifications for deleted users (if table exists)
DELETE FROM public.notifications 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Clean up pilot_inquiries for deleted users (if table exists)
DELETE FROM public.pilot_inquiries 
WHERE email NOT IN (SELECT email FROM auth.users);

-- Return summary
SELECT 'Cleanup complete' as status;
