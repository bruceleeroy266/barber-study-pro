-- G6-A: student-level control for aggregate school/class metrics.
-- Individual learning records remain intact and visible. Existing learners
-- default to inclusion so current reporting is unchanged until an admin opts out.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS include_in_school_metrics boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.include_in_school_metrics IS
  'When false for a student/apprentice, exclude that learner from school/class aggregate metrics while preserving individual data.';
