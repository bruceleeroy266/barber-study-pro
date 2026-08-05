-- Create profile for schooladmin
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    school_id,
    approval_status,
    is_disabled,
    requires_password_change,
    created_at,
    updated_at
) VALUES (
    '686451ff-0914-472e-882c-24a00538d397',
    'schooladmin@ascyn-smoke.test',
    'School Administrator',
    'school_admin',
    '12b09747-7391-4811-bc22-db7eebbb12c1',
    'approved',
    false,
    false,
    now(),
    now()
);

-- Create profile for instructor
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    school_id,
    approval_status,
    is_disabled,
    requires_password_change,
    created_at,
    updated_at
) VALUES (
    '1ef4c92f-34af-48ac-98c9-1a7dd49739c0',
    'instructor@ascyn-smoke.test',
    'QA Instructor',
    'instructor',
    '12b09747-7391-4811-bc22-db7eebbb12c1',
    'approved',
    false,
    false,
    now(),
    now()
);

-- Create profile for student
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    school_id,
    approval_status,
    is_disabled,
    requires_password_change,
    created_at,
    updated_at
) VALUES (
    '4736432d-bfd0-4c52-b7cf-afda56af4fb6',
    'student@ascyn-smoke.test',
    'QA Student',
    'student',
    '12b09747-7391-4811-bc22-db7eebbb12c1',
    'approved',
    false,
    false,
    now(),
    now()
);

-- Return all profiles
SELECT id, email, full_name, role, school_id, approval_status FROM public.profiles;
