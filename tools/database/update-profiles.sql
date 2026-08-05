-- Update schooladmin profile
UPDATE public.profiles 
SET role = 'school_admin', 
    school_id = '12b09747-7391-4811-bc22-db7eebbb12c1',
    approval_status = 'approved',
    updated_at = now()
WHERE id = '686451ff-0914-472e-882c-24a00538d397';

-- Update instructor profile
UPDATE public.profiles 
SET role = 'instructor', 
    school_id = '12b09747-7391-4811-bc22-db7eebbb12c1',
    approval_status = 'approved',
    updated_at = now()
WHERE id = '1ef4c92f-34af-48ac-98c9-1a7dd49739c0';

-- Update student profile
UPDATE public.profiles 
SET role = 'student', 
    school_id = '12b09747-7391-4811-bc22-db7eebbb12c1',
    approval_status = 'approved',
    updated_at = now()
WHERE id = '4736432d-bfd0-4c52-b7cf-afda56af4fb6';

-- Return all profiles
SELECT id, email, full_name, role, school_id, approval_status FROM public.profiles ORDER BY email;
