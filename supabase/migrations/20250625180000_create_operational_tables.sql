-- ============================================================================
-- Migration: 20250625180000_create_operational_tables
-- Phase 13E.1A �?" Production Database Completion
-- Creates operational tables for attendance, grades, assessments, hours, and
-- instructor notes. Follows Phase 13B/13D security, indexing, and RLS patterns.
-- ============================================================================

-- ============================================================================
-- 1. ATTENDANCE RECORDS
-- ============================================================================

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  status text not null check (status in ('Present', 'Absent', 'Tardy', 'Excused', 'Clocked In', 'Clocked Out')),
  clocked_in_at timestamptz,
  clocked_out_at timestamptz,
  minutes_present integer check (minutes_present >= 0),
  note text,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 2. ATTENDANCE NOTES
-- ============================================================================

create table if not exists public.attendance_notes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  instructor_name text not null,
  date date not null,
  note text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 3. ATTENDANCE CORRECTIONS
-- ============================================================================

create table if not exists public.attendance_corrections (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  attendance_record_id uuid not null references public.attendance_records(id) on delete cascade,
  original_status text not null check (original_status in ('Present', 'Absent', 'Tardy', 'Excused', 'Clocked In', 'Clocked Out')),
  new_status text not null check (new_status in ('Present', 'Absent', 'Tardy', 'Excused', 'Clocked In', 'Clocked Out')),
  reason text not null,
  corrected_by uuid not null references public.profiles(id) on delete cascade,
  corrected_at timestamptz not null default now(),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 4. ATTENDANCE AUDIT LOG
-- ============================================================================

create table if not exists public.attendance_audit_log (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  record_id uuid not null references public.attendance_records(id) on delete cascade,
  action text not null check (action in ('create', 'update', 'correct')),
  changed_fields jsonb default '{}',
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  "timestamp" timestamptz not null default now(),
  reason text,
  created_at timestamptz default now()
);

-- ============================================================================
-- 5. GRADE CATEGORIES
-- ============================================================================

create table if not exists public.grade_categories (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  course_id uuid references public.programs(id) on delete set null,
  name text not null,
  type text not null check (type in ('WRITTEN_EXAM', 'PRACTICAL_EXAM', 'QUIZ', 'HOMEWORK', 'PARTICIPATION', 'ATTENDANCE')),
  weight numeric(5,4) not null default 0 check (weight >= 0 and weight <= 1),
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 6. GRADES
-- ============================================================================

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.grade_categories(id) on delete restrict,
  category_type text not null check (category_type in ('WRITTEN_EXAM', 'PRACTICAL_EXAM', 'QUIZ', 'HOMEWORK', 'PARTICIPATION', 'ATTENDANCE')),
  score numeric(8,2) not null check (score >= 0),
  max_score numeric(8,2) not null check (max_score > 0),
  percentage numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
  weight numeric(5,4) not null default 0 check (weight >= 0 and weight <= 1),
  date_entered date not null default current_date,
  date_modified timestamptz,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  instructor_name text not null,
  notes text,
  is_excused boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 7. ASSESSMENT RUBRICS
-- ============================================================================

create table if not exists public.assessment_rubrics (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('HAIRCUT', 'COLOR', 'CHEMICAL', 'SANITATION', 'CONSULTATION')),
  criteria jsonb not null default '[]',
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 8. ASSESSMENTS
-- ============================================================================

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('HAIRCUT', 'COLOR', 'CHEMICAL', 'SANITATION', 'CONSULTATION')),
  score numeric(8,2) check (score >= 0),
  scoring_type text not null check (scoring_type in ('NUMERIC', 'QUALITATIVE')),
  qualitative_result text check (qualitative_result in ('PASS', 'NEEDS_IMPROVEMENT', 'FAIL')),
  feedback text,
  assessment_date date not null default current_date,
  evaluator_id uuid not null references public.profiles(id) on delete cascade,
  evaluator_name text not null,
  rubric_id uuid references public.assessment_rubrics(id) on delete set null,
  is_passed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 9. HOUR LOGS
-- ============================================================================

create table if not exists public.hour_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  category text not null check (category in ('Theory', 'Practical', 'Clinic', 'Sanitation', 'Makeup Hours', 'Other')),
  minutes integer not null check (minutes > 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 10. INSTRUCTOR NOTES
-- ============================================================================

create table if not exists public.instructor_notes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  instructor_name text not null,
  note_type text not null check (note_type in ('coaching', 'remediation', 'readiness', 'general')),
  note_text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 11. INDEXES
-- ============================================================================

create index if not exists idx_attendance_records_school_id on public.attendance_records(school_id);
create index if not exists idx_attendance_records_user_id on public.attendance_records(user_id);
create index if not exists idx_attendance_records_date on public.attendance_records(date desc);
create index if not exists idx_attendance_records_status on public.attendance_records(status);

create index if not exists idx_attendance_notes_school_id on public.attendance_notes(school_id);
create index if not exists idx_attendance_notes_student_id on public.attendance_notes(student_id);
create index if not exists idx_attendance_notes_date on public.attendance_notes(date);

create index if not exists idx_attendance_corrections_school_id on public.attendance_corrections(school_id);
create index if not exists idx_attendance_corrections_record_id on public.attendance_corrections(attendance_record_id);
create index if not exists idx_attendance_corrections_corrected_by on public.attendance_corrections(corrected_by);

create index if not exists idx_attendance_audit_log_school_id on public.attendance_audit_log(school_id);
create index if not exists idx_attendance_audit_log_record_id on public.attendance_audit_log(record_id);
create index if not exists idx_attendance_audit_log_timestamp on public.attendance_audit_log("timestamp" desc);

create index if not exists idx_grade_categories_school_id on public.grade_categories(school_id);
create index if not exists idx_grade_categories_type on public.grade_categories(type);
create index if not exists idx_grade_categories_is_active on public.grade_categories(is_active);

create index if not exists idx_grades_school_id on public.grades(school_id);
create index if not exists idx_grades_student_id on public.grades(student_id);
create index if not exists idx_grades_category_id on public.grades(category_id);
create index if not exists idx_grades_date_entered on public.grades(date_entered desc);

create index if not exists idx_assessment_rubrics_school_id on public.assessment_rubrics(school_id);
create index if not exists idx_assessment_rubrics_type on public.assessment_rubrics(assessment_type);
create index if not exists idx_assessment_rubrics_created_by on public.assessment_rubrics(created_by);

create index if not exists idx_assessments_school_id on public.assessments(school_id);
create index if not exists idx_assessments_student_id on public.assessments(student_id);
create index if not exists idx_assessments_type on public.assessments(assessment_type);
create index if not exists idx_assessments_assessment_date on public.assessments(assessment_date desc);

create index if not exists idx_hour_logs_school_id on public.hour_logs(school_id);
create index if not exists idx_hour_logs_user_id on public.hour_logs(user_id);
create index if not exists idx_hour_logs_date on public.hour_logs(date desc);
create index if not exists idx_hour_logs_status on public.hour_logs(status);

create index if not exists idx_instructor_notes_school_id on public.instructor_notes(school_id);
create index if not exists idx_instructor_notes_student_id on public.instructor_notes(student_id);
create index if not exists idx_instructor_notes_instructor_id on public.instructor_notes(instructor_id);
create index if not exists idx_instructor_notes_created_at on public.instructor_notes(created_at desc);

-- ============================================================================
-- 12. ROW LEVEL SECURITY
-- ============================================================================

alter table public.attendance_records enable row level security;
alter table public.attendance_notes enable row level security;
alter table public.attendance_corrections enable row level security;
alter table public.attendance_audit_log enable row level security;
alter table public.grade_categories enable row level security;
alter table public.grades enable row level security;
alter table public.assessment_rubrics enable row level security;
alter table public.assessments enable row level security;
alter table public.hour_logs enable row level security;
alter table public.instructor_notes enable row level security;

-- Helper: is current user a platform super admin? (role does not exist in check
-- constraint yet, but reserved for future use.)
create or replace function public.is_platform_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'platform_super_admin'
  );
end;
$$ language plpgsql security definer;

-- Helper: current user's school_id.
create or replace function public.current_user_school_id()
returns uuid as $$
begin
  return (select school_id from public.profiles where id = auth.uid() limit 1);
end;
$$ language plpgsql security definer;

-- Helper: is current user an instructor or admin at the given school?
create or replace function public.is_school_staff(target_school_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = target_school_id
      and role in ('instructor', 'admin')
  );
end;
$$ language plpgsql security definer;

-- Helper: is current user an admin at the given school?
create or replace function public.is_school_admin(target_school_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = target_school_id
      and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- attendance_records RLS
-- ---------------------------------------------------------------------------
drop policy if exists "attendance_records_select" on public.attendance_records;
create policy attendance_records_select on public.attendance_records
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "attendance_records_insert" on public.attendance_records;
create policy attendance_records_insert on public.attendance_records
  for insert to authenticated
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "attendance_records_update" on public.attendance_records;
create policy attendance_records_update on public.attendance_records
  for update to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "attendance_records_delete" on public.attendance_records;
create policy attendance_records_delete on public.attendance_records
  for delete to authenticated
  using (
    public.is_school_admin(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- attendance_notes RLS
-- ---------------------------------------------------------------------------
drop policy if exists "attendance_notes_select" on public.attendance_notes;
create policy attendance_notes_select on public.attendance_notes
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "attendance_notes_all" on public.attendance_notes;
create policy attendance_notes_all on public.attendance_notes
  for all to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- attendance_corrections RLS
-- ---------------------------------------------------------------------------
drop policy if exists "attendance_corrections_select" on public.attendance_corrections;
create policy attendance_corrections_select on public.attendance_corrections
  for select to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "attendance_corrections_all" on public.attendance_corrections;
create policy attendance_corrections_all on public.attendance_corrections
  for all to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- attendance_audit_log RLS
-- ---------------------------------------------------------------------------
drop policy if exists "attendance_audit_log_select" on public.attendance_audit_log;
create policy attendance_audit_log_select on public.attendance_audit_log
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "attendance_audit_log_insert" on public.attendance_audit_log;
create policy attendance_audit_log_insert on public.attendance_audit_log
  for insert to authenticated
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- grade_categories RLS
-- ---------------------------------------------------------------------------
drop policy if exists "grade_categories_select" on public.grade_categories;
create policy grade_categories_select on public.grade_categories
  for select to authenticated
  using (
    school_id is null
    or school_id = public.current_user_school_id()
    or public.is_platform_super_admin()
  );

drop policy if exists "grade_categories_all" on public.grade_categories;
create policy grade_categories_all on public.grade_categories
  for all to authenticated
  using (
    public.is_school_admin(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_admin(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- grades RLS
-- ---------------------------------------------------------------------------
drop policy if exists "grades_select" on public.grades;
create policy grades_select on public.grades
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "grades_all" on public.grades;
create policy grades_all on public.grades
  for all to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- assessment_rubrics RLS
-- ---------------------------------------------------------------------------
drop policy if exists "assessment_rubrics_select" on public.assessment_rubrics;
create policy assessment_rubrics_select on public.assessment_rubrics
  for select to authenticated
  using (
    school_id is null
    or school_id = public.current_user_school_id()
    or public.is_platform_super_admin()
  );

drop policy if exists "assessment_rubrics_all" on public.assessment_rubrics;
create policy assessment_rubrics_all on public.assessment_rubrics
  for all to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- assessments RLS
-- ---------------------------------------------------------------------------
drop policy if exists "assessments_select" on public.assessments;
create policy assessments_select on public.assessments
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "assessments_all" on public.assessments;
create policy assessments_all on public.assessments
  for all to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- hour_logs RLS
-- ---------------------------------------------------------------------------
drop policy if exists "hour_logs_select" on public.hour_logs;
create policy hour_logs_select on public.hour_logs
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "hour_logs_insert" on public.hour_logs;
create policy hour_logs_insert on public.hour_logs
  for insert to authenticated
  with check (
    user_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "hour_logs_update" on public.hour_logs;
create policy hour_logs_update on public.hour_logs
  for update to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "hour_logs_delete" on public.hour_logs;
create policy hour_logs_delete on public.hour_logs
  for delete to authenticated
  using (
    public.is_school_admin(school_id)
    or public.is_platform_super_admin()
  );

-- ---------------------------------------------------------------------------
-- instructor_notes RLS
-- ---------------------------------------------------------------------------
drop policy if exists "instructor_notes_select" on public.instructor_notes;
create policy instructor_notes_select on public.instructor_notes
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

drop policy if exists "instructor_notes_all" on public.instructor_notes;
create policy instructor_notes_all on public.instructor_notes
  for all to authenticated
  using (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  )
  with check (
    public.is_school_staff(school_id)
    or public.is_platform_super_admin()
  );

-- ============================================================================
-- 13. TRIGGERS
-- ============================================================================

drop trigger if exists update_attendance_records_updated_at on public.attendance_records;
create trigger update_attendance_records_updated_at
  before update on public.attendance_records
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_attendance_notes_updated_at on public.attendance_notes;
create trigger update_attendance_notes_updated_at
  before update on public.attendance_notes
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_attendance_corrections_updated_at on public.attendance_corrections;
create trigger update_attendance_corrections_updated_at
  before update on public.attendance_corrections
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_grade_categories_updated_at on public.grade_categories;
create trigger update_grade_categories_updated_at
  before update on public.grade_categories
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_grades_updated_at on public.grades;
create trigger update_grades_updated_at
  before update on public.grades
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_assessment_rubrics_updated_at on public.assessment_rubrics;
create trigger update_assessment_rubrics_updated_at
  before update on public.assessment_rubrics
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_assessments_updated_at on public.assessments;
create trigger update_assessments_updated_at
  before update on public.assessments
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_hour_logs_updated_at on public.hour_logs;
create trigger update_hour_logs_updated_at
  before update on public.hour_logs
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_instructor_notes_updated_at on public.instructor_notes;
create trigger update_instructor_notes_updated_at
  before update on public.instructor_notes
  for each row execute function public.update_updated_at_column();
