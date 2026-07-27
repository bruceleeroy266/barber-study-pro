-- ============================================================================
-- Migration: 20260715141000_convert_missed_questions_question_id_to_text
-- Purpose: Align missed_questions.question_id with application-side IDs.
--
-- The application generates quiz question IDs as strings such as qq-16-029.
-- The column was originally created as uuid, which causes runtime failures
-- like "invalid input syntax for type uuid: qq-16-029" when quiz answers are
-- recorded. This migration safely casts the column to text.
-- ============================================================================

begin;

alter table public.missed_questions
  alter column question_id type text using question_id::text;

-- The unique constraint on (user_id, question_id) and the supporting index
-- idx_missed_questions_user_question are automatically preserved and rebuilt
-- by PostgreSQL when the column type changes. No explicit drop/recreate is
-- required.

comment on column public.missed_questions.question_id is
  'Application-side question identifier (e.g. qq-16-029). Not a foreign key because quizzes and questions live in application code.';

commit;
