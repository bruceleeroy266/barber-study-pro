


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."current_user_role"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  return (select role from public.profiles where id = auth.uid() limit 1);
end;
$$;


ALTER FUNCTION "public"."current_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_school_id"() RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  return (select school_id from public.profiles where id = auth.uid() limit 1);
end;
$$;


ALTER FUNCTION "public"."current_user_school_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  allowed_role text;
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'student');

  -- Self-registration may only produce student, apprentice, or instructor.
  -- All self-registered accounts require admin approval before login.
  if requested_role in ('student', 'apprentice', 'instructor') then
    allowed_role := requested_role;
  else
    allowed_role := 'student';
  end if;

  insert into public.profiles (
    id, email, full_name, role, approval_status, is_disabled, created_at, updated_at
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    allowed_role,
    'pending',
    false,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(profiles.role, excluded.role),
    updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_platform_super_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'platform_super_admin'
  );
end;
$$;


ALTER FUNCTION "public"."is_platform_super_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_school_admin"("target_school_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = target_school_id
      and role in ('admin', 'school_admin')
  );
end;
$$;


ALTER FUNCTION "public"."is_school_admin"("target_school_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_school_staff"("target_school_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = target_school_id
      and role in ('instructor', 'admin', 'school_admin')
  );
end;
$$;


ALTER FUNCTION "public"."is_school_staff"("target_school_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_school_id"("target_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  return (select school_id from public.profiles where id = target_user_id limit 1);
end;
$$;


ALTER FUNCTION "public"."user_school_id"("target_user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."schools" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "contact_email" "text",
    "subscription_status" "text" DEFAULT 'trial'::"text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "slug" "text",
    "city" "text",
    "state" "text",
    "postal_code" "text",
    "contact_phone" "text",
    "website" "text",
    "timezone" "text" DEFAULT 'America/Chicago'::"text",
    "subscription_expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "schools_subscription_status_check" CHECK (("subscription_status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'trial'::"text"])))
);

ALTER TABLE ONLY "public"."schools" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."schools" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."active_schools" AS
 SELECT "id",
    "name",
    "address",
    "contact_email",
    "subscription_status",
    "created_by",
    "created_at",
    "updated_at",
    "slug",
    "city",
    "state",
    "postal_code",
    "contact_phone",
    "website",
    "timezone",
    "subscription_expires_at",
    "is_active",
    "deleted_at"
   FROM "public"."schools"
  WHERE (("deleted_at" IS NULL) AND ("is_active" = true));


ALTER VIEW "public"."active_schools" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessment_rubrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "assessment_type" "text" NOT NULL,
    "criteria" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "assessment_rubrics_assessment_type_check" CHECK (("assessment_type" = ANY (ARRAY['HAIRCUT'::"text", 'COLOR'::"text", 'CHEMICAL'::"text", 'SANITATION'::"text", 'CONSULTATION'::"text"])))
);


ALTER TABLE "public"."assessment_rubrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "assessment_type" "text" NOT NULL,
    "score" numeric(8,2),
    "scoring_type" "text" NOT NULL,
    "qualitative_result" "text",
    "feedback" "text",
    "assessment_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "evaluator_id" "uuid" NOT NULL,
    "evaluator_name" "text" NOT NULL,
    "rubric_id" "uuid",
    "is_passed" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "assessments_assessment_type_check" CHECK (("assessment_type" = ANY (ARRAY['HAIRCUT'::"text", 'COLOR'::"text", 'CHEMICAL'::"text", 'SANITATION'::"text", 'CONSULTATION'::"text"]))),
    CONSTRAINT "assessments_qualitative_result_check" CHECK (("qualitative_result" = ANY (ARRAY['PASS'::"text", 'NEEDS_IMPROVEMENT'::"text", 'FAIL'::"text"]))),
    CONSTRAINT "assessments_score_check" CHECK (("score" >= (0)::numeric)),
    CONSTRAINT "assessments_scoring_type_check" CHECK (("scoring_type" = ANY (ARRAY['NUMERIC'::"text", 'QUALITATIVE'::"text"])))
);


ALTER TABLE "public"."assessments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance_audit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "record_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "changed_fields" "jsonb" DEFAULT '{}'::"jsonb",
    "user_id" "uuid" NOT NULL,
    "user_name" "text" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "attendance_audit_log_action_check" CHECK (("action" = ANY (ARRAY['create'::"text", 'update'::"text", 'correct'::"text"])))
);


ALTER TABLE "public"."attendance_audit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance_corrections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "attendance_record_id" "uuid" NOT NULL,
    "original_status" "text" NOT NULL,
    "new_status" "text" NOT NULL,
    "reason" "text" NOT NULL,
    "corrected_by" "uuid" NOT NULL,
    "corrected_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_by" "uuid",
    "approved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "attendance_corrections_new_status_check" CHECK (("new_status" = ANY (ARRAY['Present'::"text", 'Absent'::"text", 'Tardy'::"text", 'Excused'::"text", 'Clocked In'::"text", 'Clocked Out'::"text"]))),
    CONSTRAINT "attendance_corrections_original_status_check" CHECK (("original_status" = ANY (ARRAY['Present'::"text", 'Absent'::"text", 'Tardy'::"text", 'Excused'::"text", 'Clocked In'::"text", 'Clocked Out'::"text"])))
);


ALTER TABLE "public"."attendance_corrections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "instructor_id" "uuid" NOT NULL,
    "instructor_name" "text" NOT NULL,
    "date" "date" NOT NULL,
    "note" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."attendance_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "status" "text" NOT NULL,
    "clocked_in_at" timestamp with time zone,
    "clocked_out_at" timestamp with time zone,
    "minutes_present" integer,
    "note" "text",
    "verified_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "attendance_records_minutes_present_check" CHECK (("minutes_present" >= 0)),
    CONSTRAINT "attendance_records_status_check" CHECK (("status" = ANY (ARRAY['Present'::"text", 'Absent'::"text", 'Tardy'::"text", 'Excused'::"text", 'Clocked In'::"text", 'Clocked Out'::"text"])))
);


ALTER TABLE "public"."attendance_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."background_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "job_type" "text" NOT NULL,
    "payload" "jsonb" DEFAULT '{}'::"jsonb",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "scheduled_at" timestamp with time zone DEFAULT "now"(),
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "last_error" "text",
    "result" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "background_jobs_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'running'::"text", 'completed'::"text", 'failed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."background_jobs" OWNER TO "postgres";


COMMENT ON TABLE "public"."background_jobs" IS 'Registry of scheduled and executed background jobs.';



CREATE TABLE IF NOT EXISTS "public"."backup_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "last_backup_at" timestamp with time zone,
    "status" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "backup_location" "text",
    "restore_ready" boolean DEFAULT false NOT NULL,
    "notes" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    CONSTRAINT "backup_status_status_check" CHECK (("status" = ANY (ARRAY['unknown'::"text", 'ok'::"text", 'warning'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."backup_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."backup_status" IS 'Operational backup/recovery status record.';



CREATE TABLE IF NOT EXISTS "public"."beta_agreements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "tester_name" "text" NOT NULL,
    "tester_email" "text" NOT NULL,
    "agreement_version" "text" DEFAULT 'v1.0'::"text" NOT NULL,
    "accepted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."beta_agreements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."beta_feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "checklist_item_id" "text",
    "category" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "beta_feedback_category_check" CHECK (("category" = ANY (ARRAY['bug'::"text", 'feature'::"text", 'ux'::"text", 'content'::"text", 'other'::"text"]))),
    CONSTRAINT "beta_feedback_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"])))
);


ALTER TABLE "public"."beta_feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "program_id" "uuid" NOT NULL,
    "start_date" "date" DEFAULT CURRENT_DATE,
    "expected_end_date" "date",
    "status" "text" DEFAULT 'active'::"text",
    "notes" "text",
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "enrollments_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'completed'::"text", 'withdrawn'::"text", 'on_hold'::"text"])))
);


ALTER TABLE "public"."enrollments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feature_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "enabled" boolean DEFAULT false NOT NULL,
    "school_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."feature_flags" OWNER TO "postgres";


COMMENT ON TABLE "public"."feature_flags" IS 'Global and per-school feature toggles.';



CREATE TABLE IF NOT EXISTS "public"."grade_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "course_id" "uuid",
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "weight" numeric(5,4) DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "grade_categories_type_check" CHECK (("type" = ANY (ARRAY['WRITTEN_EXAM'::"text", 'PRACTICAL_EXAM'::"text", 'QUIZ'::"text", 'HOMEWORK'::"text", 'PARTICIPATION'::"text", 'ATTENDANCE'::"text"]))),
    CONSTRAINT "grade_categories_weight_check" CHECK ((("weight" >= (0)::numeric) AND ("weight" <= (1)::numeric)))
);


ALTER TABLE "public"."grade_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."grades" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "category_type" "text" NOT NULL,
    "score" numeric(8,2) NOT NULL,
    "max_score" numeric(8,2) NOT NULL,
    "percentage" numeric(5,2) NOT NULL,
    "weight" numeric(5,4) DEFAULT 0 NOT NULL,
    "date_entered" "date" DEFAULT CURRENT_DATE NOT NULL,
    "date_modified" timestamp with time zone,
    "instructor_id" "uuid" NOT NULL,
    "instructor_name" "text" NOT NULL,
    "notes" "text",
    "is_excused" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "grades_category_type_check" CHECK (("category_type" = ANY (ARRAY['WRITTEN_EXAM'::"text", 'PRACTICAL_EXAM'::"text", 'QUIZ'::"text", 'HOMEWORK'::"text", 'PARTICIPATION'::"text", 'ATTENDANCE'::"text"]))),
    CONSTRAINT "grades_max_score_check" CHECK (("max_score" > (0)::numeric)),
    CONSTRAINT "grades_percentage_check" CHECK ((("percentage" >= (0)::numeric) AND ("percentage" <= (100)::numeric))),
    CONSTRAINT "grades_score_check" CHECK (("score" >= (0)::numeric)),
    CONSTRAINT "grades_weight_check" CHECK ((("weight" >= (0)::numeric) AND ("weight" <= (1)::numeric)))
);


ALTER TABLE "public"."grades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hour_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "category" "text" NOT NULL,
    "minutes" integer NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "notes" "text",
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "hour_logs_category_check" CHECK (("category" = ANY (ARRAY['Theory'::"text", 'Practical'::"text", 'Clinic'::"text", 'Sanitation'::"text", 'Makeup Hours'::"text", 'Other'::"text"]))),
    CONSTRAINT "hour_logs_minutes_check" CHECK (("minutes" > 0)),
    CONSTRAINT "hour_logs_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."hour_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instructor_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "instructor_id" "uuid" NOT NULL,
    "instructor_name" "text" NOT NULL,
    "note_type" "text" NOT NULL,
    "note_text" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "instructor_notes_note_type_check" CHECK (("note_type" = ANY (ARRAY['coaching'::"text", 'remediation'::"text", 'readiness'::"text", 'general'::"text"])))
);


ALTER TABLE "public"."instructor_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instructors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "school_id" "uuid" NOT NULL,
    "license_number" "text",
    "bio" "text",
    "hire_date" "date",
    "specialization" "text",
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."instructors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."maintenance_mode" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "message" "text" DEFAULT 'ASCYN PRO is undergoing scheduled maintenance. Please check back soon.'::"text" NOT NULL,
    "allowed_roles" "text"[] DEFAULT ARRAY['platform_super_admin'::"text"] NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."maintenance_mode" OWNER TO "postgres";


COMMENT ON TABLE "public"."maintenance_mode" IS 'Single-row maintenance mode configuration.';



CREATE TABLE IF NOT EXISTS "public"."missed_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "question_id" "text" NOT NULL,
    "quiz_id" "text" NOT NULL,
    "question_text" "text" NOT NULL,
    "correct_answer" "text" NOT NULL,
    "student_answer" "text" NOT NULL,
    "explanation" "text",
    "chapter_id" "text",
    "chapter_number" integer,
    "category" "text",
    "times_missed" integer DEFAULT 1 NOT NULL,
    "missed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "retaken_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."missed_questions" OWNER TO "postgres";


COMMENT ON TABLE "public"."missed_questions" IS 'Records of quiz questions a student answered incorrectly, used for review and retest.';



COMMENT ON COLUMN "public"."missed_questions"."question_id" IS 'Application-side question identifier (e.g. qq-16-029). Not a foreign key because quizzes and questions live in application code.';



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "school_id" "uuid",
    "type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "priority" "text" DEFAULT 'medium'::"text" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "archived" boolean DEFAULT false NOT NULL,
    "action_url" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'urgent'::"text"]))),
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['system'::"text", 'security'::"text", 'compliance'::"text", 'attendance'::"text", 'grades'::"text", 'assessments'::"text", 'school_approval'::"text", 'account_approval'::"text", 'maintenance'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."notifications" IS 'Production notification store for all user roles.';



CREATE TABLE IF NOT EXISTS "public"."owner_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "status" "text" DEFAULT 'unread'::"text" NOT NULL,
    "source_type" "text",
    "source_id" "uuid",
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "dedup_hash" "text" NOT NULL,
    "recipient_email" "text" NOT NULL,
    "email_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "email_error" "text",
    "email_sent_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "owner_notifications_email_status_check" CHECK (("email_status" = ANY (ARRAY['pending'::"text", 'sent'::"text", 'failed'::"text"]))),
    CONSTRAINT "owner_notifications_status_check" CHECK (("status" = ANY (ARRAY['unread'::"text", 'read'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."owner_notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."owner_notifications" IS 'Unified owner-facing notification log. One row per notifyable business event.';



CREATE TABLE IF NOT EXISTS "public"."pilot_inquiries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "school_name" "text" NOT NULL,
    "contact_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "program_type" "text" NOT NULL,
    "cohort_size" "text",
    "message" "text",
    "utm_source" "text",
    "utm_medium" "text",
    "utm_campaign" "text",
    "utm_term" "text",
    "utm_content" "text",
    "status" "text" DEFAULT 'new'::"text",
    "start_date" "text",
    "ip_address" "text",
    "user_agent" "text",
    "is_test" boolean DEFAULT false,
    "notes" "text",
    CONSTRAINT "pilot_inquiries_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'contacted'::"text", 'approved'::"text", 'declined'::"text", 'spam'::"text"])))
);


ALTER TABLE "public"."pilot_inquiries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text" DEFAULT ''::"text" NOT NULL,
    "role" "text" DEFAULT 'student'::"text",
    "school_id" "uuid",
    "barber_shop_name" "text",
    "mentor_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "approval_status" "text" DEFAULT 'pending'::"text",
    "is_disabled" boolean DEFAULT false,
    "approved_by" "uuid",
    "approved_at" timestamp with time zone,
    "requires_password_change" boolean DEFAULT false,
    CONSTRAINT "profiles_approval_status_check" CHECK (("approval_status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['student'::"text", 'apprentice'::"text", 'instructor'::"text", 'admin'::"text", 'school_admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'User profiles. Backfilled 2026-07-27 for users missing profiles.';



CREATE TABLE IF NOT EXISTS "public"."programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "required_hours" integer DEFAULT 1500 NOT NULL,
    "required_assessments" integer DEFAULT 0 NOT NULL,
    "required_practicals" integer DEFAULT 0 NOT NULL,
    "duration_weeks" integer,
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "programs_required_assessments_check" CHECK (("required_assessments" >= 0)),
    CONSTRAINT "programs_required_hours_check" CHECK (("required_hours" >= 0)),
    CONSTRAINT "programs_required_practicals_check" CHECK (("required_practicals" >= 0))
);


ALTER TABLE "public"."programs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "quiz_id" "text" NOT NULL,
    "score" integer DEFAULT 0 NOT NULL,
    "total_questions" integer DEFAULT 0 NOT NULL,
    "percentage" integer DEFAULT 0 NOT NULL,
    "answers_json" "jsonb" DEFAULT '{}'::"jsonb",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "quiz_attempts_percentage_check" CHECK ((("percentage" >= 0) AND ("percentage" <= 100)))
);


ALTER TABLE "public"."quiz_attempts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."school_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" NOT NULL,
    "settings" "jsonb" DEFAULT '{}'::"jsonb",
    "name" "text",
    "logo_url" "text",
    "favicon_url" "text",
    "brand_colors" "jsonb" DEFAULT '{"accent": "#3B82F6", "primary": "#D4AF37", "secondary": "#1F2937"}'::"jsonb",
    "contact_email" "text",
    "contact_phone" "text",
    "address" "text",
    "city" "text",
    "state" "text",
    "postal_code" "text",
    "website" "text",
    "timezone" "text" DEFAULT 'America/Chicago'::"text",
    "attendance_defaults" "jsonb" DEFAULT '{"autoExcuseLimit": 3, "trackClockEvents": true, "tardyThresholdMinutes": 10, "targetAttendancePercentage": 80}'::"jsonb",
    "hours_defaults" "jsonb" DEFAULT '{"categories": ["Theory", "Practical", "Clinic", "Sanitation", "Other"], "requiredHours": 1500, "requireInstructorApproval": true}'::"jsonb",
    "gradebook_defaults" "jsonb" DEFAULT '{"gradingScale": "percentage", "passingPercentage": 70}'::"jsonb",
    "assessment_defaults" "jsonb" DEFAULT '{"allowedTypes": ["HAIRCUT", "COLOR", "CHEMICAL", "SANITATION", "CONSULTATION"], "defaultRubricId": null, "passingPercentage": 70}'::"jsonb",
    "messaging_preferences" "jsonb" DEFAULT '{"autoReplyEnabled": false, "requireModeration": false, "allowStudentToStudent": false}'::"jsonb",
    "notification_preferences" "jsonb" DEFAULT '[{"type": "attendance_alert", "enabled": true, "priority": "high"}, {"type": "attendance_risk", "enabled": true, "priority": "high"}, {"type": "board_readiness", "enabled": true, "priority": "medium"}, {"type": "missing_hours", "enabled": true, "priority": "medium"}, {"type": "upcoming_exam", "enabled": true, "priority": "low"}]'::"jsonb",
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."school_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "user_id" "uuid",
    "email" "text",
    "role" "text",
    "school_id" "uuid",
    "resource" "text",
    "resource_id" "text",
    "action" "text",
    "result" "text" NOT NULL,
    "reason" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "user_agent" "text",
    "ip_address" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "security_logs_result_check" CHECK (("result" = ANY (ARRAY['allowed'::"text", 'denied'::"text", 'blocked'::"text", 'success'::"text", 'failure'::"text"])))
);


ALTER TABLE "public"."security_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "chapter_id" "text" NOT NULL,
    "flashcards_completed" boolean DEFAULT false,
    "quiz_completed" boolean DEFAULT false,
    "best_quiz_score" integer,
    "last_studied_at" timestamp with time zone,
    "progress_percentage" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "student_progress_best_quiz_score_check" CHECK ((("best_quiz_score" >= 0) AND ("best_quiz_score" <= 100))),
    CONSTRAINT "student_progress_percentage_check" CHECK ((("progress_percentage" >= 0) AND ("progress_percentage" <= 100)))
);


ALTER TABLE "public"."student_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "school_id" "uuid" NOT NULL,
    "student_number" "text",
    "enrollment_date" "date" DEFAULT CURRENT_DATE,
    "expected_graduation_date" "date",
    "total_hours_completed" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "students_total_hours_completed_check" CHECK (("total_hours_completed" >= 0))
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_management_audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "actor_id" "uuid",
    "actor_email" "text",
    "actor_role" "text",
    "target_user_id" "uuid",
    "target_user_email" "text",
    "action" "text" NOT NULL,
    "old_values" "jsonb" DEFAULT '{}'::"jsonb",
    "new_values" "jsonb" DEFAULT '{}'::"jsonb",
    "school_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_management_audit_logs" OWNER TO "postgres";


ALTER TABLE ONLY "public"."assessment_rubrics"
    ADD CONSTRAINT "assessment_rubrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance_audit_log"
    ADD CONSTRAINT "attendance_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance_corrections"
    ADD CONSTRAINT "attendance_corrections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance_notes"
    ADD CONSTRAINT "attendance_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance_records"
    ADD CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."background_jobs"
    ADD CONSTRAINT "background_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."backup_status"
    ADD CONSTRAINT "backup_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."beta_agreements"
    ADD CONSTRAINT "beta_agreements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."beta_agreements"
    ADD CONSTRAINT "beta_agreements_user_version_unique" UNIQUE ("user_id", "agreement_version");



ALTER TABLE ONLY "public"."beta_feedback"
    ADD CONSTRAINT "beta_feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_student_id_program_id_key" UNIQUE ("student_id", "program_id");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_key_school_id_key" UNIQUE ("key", "school_id");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."grade_categories"
    ADD CONSTRAINT "grade_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hour_logs"
    ADD CONSTRAINT "hour_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instructor_notes"
    ADD CONSTRAINT "instructor_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_profile_id_school_id_key" UNIQUE ("profile_id", "school_id");



ALTER TABLE ONLY "public"."maintenance_mode"
    ADD CONSTRAINT "maintenance_mode_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."missed_questions"
    ADD CONSTRAINT "missed_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."missed_questions"
    ADD CONSTRAINT "missed_questions_user_id_question_id_key" UNIQUE ("user_id", "question_id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."owner_notifications"
    ADD CONSTRAINT "owner_notifications_dedup_hash_key" UNIQUE ("dedup_hash");



ALTER TABLE ONLY "public"."owner_notifications"
    ADD CONSTRAINT "owner_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pilot_inquiries"
    ADD CONSTRAINT "pilot_inquiries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_unique" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_school_id_name_key" UNIQUE ("school_id", "name");



ALTER TABLE ONLY "public"."quiz_attempts"
    ADD CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."school_settings"
    ADD CONSTRAINT "school_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."school_settings"
    ADD CONSTRAINT "school_settings_school_id_key" UNIQUE ("school_id");



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_user_id_chapter_id_key" UNIQUE ("user_id", "chapter_id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_profile_id_school_id_key" UNIQUE ("profile_id", "school_id");



ALTER TABLE ONLY "public"."user_management_audit_logs"
    ADD CONSTRAINT "user_management_audit_logs_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_assessment_rubrics_created_by" ON "public"."assessment_rubrics" USING "btree" ("created_by");



CREATE INDEX "idx_assessment_rubrics_school_id" ON "public"."assessment_rubrics" USING "btree" ("school_id");



CREATE INDEX "idx_assessment_rubrics_type" ON "public"."assessment_rubrics" USING "btree" ("assessment_type");



CREATE INDEX "idx_assessments_assessment_date" ON "public"."assessments" USING "btree" ("assessment_date" DESC);



CREATE INDEX "idx_assessments_school_id" ON "public"."assessments" USING "btree" ("school_id");



CREATE INDEX "idx_assessments_student_id" ON "public"."assessments" USING "btree" ("student_id");



CREATE INDEX "idx_assessments_type" ON "public"."assessments" USING "btree" ("assessment_type");



CREATE INDEX "idx_attendance_audit_log_record_id" ON "public"."attendance_audit_log" USING "btree" ("record_id");



CREATE INDEX "idx_attendance_audit_log_school_id" ON "public"."attendance_audit_log" USING "btree" ("school_id");



CREATE INDEX "idx_attendance_audit_log_timestamp" ON "public"."attendance_audit_log" USING "btree" ("timestamp" DESC);



CREATE INDEX "idx_attendance_corrections_corrected_by" ON "public"."attendance_corrections" USING "btree" ("corrected_by");



CREATE INDEX "idx_attendance_corrections_record_id" ON "public"."attendance_corrections" USING "btree" ("attendance_record_id");



CREATE INDEX "idx_attendance_corrections_school_id" ON "public"."attendance_corrections" USING "btree" ("school_id");



CREATE INDEX "idx_attendance_notes_date" ON "public"."attendance_notes" USING "btree" ("date");



CREATE INDEX "idx_attendance_notes_school_id" ON "public"."attendance_notes" USING "btree" ("school_id");



CREATE INDEX "idx_attendance_notes_student_id" ON "public"."attendance_notes" USING "btree" ("student_id");



CREATE INDEX "idx_attendance_records_date" ON "public"."attendance_records" USING "btree" ("date" DESC);



CREATE INDEX "idx_attendance_records_school_id" ON "public"."attendance_records" USING "btree" ("school_id");



CREATE INDEX "idx_attendance_records_status" ON "public"."attendance_records" USING "btree" ("status");



CREATE INDEX "idx_attendance_records_user_id" ON "public"."attendance_records" USING "btree" ("user_id");



CREATE INDEX "idx_background_jobs_scheduled_at" ON "public"."background_jobs" USING "btree" ("scheduled_at");



CREATE INDEX "idx_background_jobs_status" ON "public"."background_jobs" USING "btree" ("status");



CREATE INDEX "idx_beta_agreements_user_id" ON "public"."beta_agreements" USING "btree" ("user_id");



CREATE INDEX "idx_beta_agreements_version_accepted" ON "public"."beta_agreements" USING "btree" ("agreement_version", "accepted_at" DESC);



CREATE INDEX "idx_beta_feedback_category_severity" ON "public"."beta_feedback" USING "btree" ("category", "severity");



CREATE INDEX "idx_beta_feedback_user_id" ON "public"."beta_feedback" USING "btree" ("user_id");



CREATE INDEX "idx_enrollments_program_id" ON "public"."enrollments" USING "btree" ("program_id");



CREATE INDEX "idx_enrollments_status" ON "public"."enrollments" USING "btree" ("status");



CREATE INDEX "idx_enrollments_student_id" ON "public"."enrollments" USING "btree" ("student_id");



CREATE INDEX "idx_feature_flags_key" ON "public"."feature_flags" USING "btree" ("key");



CREATE INDEX "idx_feature_flags_school_id" ON "public"."feature_flags" USING "btree" ("school_id");



CREATE INDEX "idx_grade_categories_is_active" ON "public"."grade_categories" USING "btree" ("is_active");



CREATE INDEX "idx_grade_categories_school_id" ON "public"."grade_categories" USING "btree" ("school_id");



CREATE INDEX "idx_grade_categories_type" ON "public"."grade_categories" USING "btree" ("type");



CREATE INDEX "idx_grades_category_id" ON "public"."grades" USING "btree" ("category_id");



CREATE INDEX "idx_grades_date_entered" ON "public"."grades" USING "btree" ("date_entered" DESC);



CREATE INDEX "idx_grades_school_id" ON "public"."grades" USING "btree" ("school_id");



CREATE INDEX "idx_grades_student_id" ON "public"."grades" USING "btree" ("student_id");



CREATE INDEX "idx_hour_logs_date" ON "public"."hour_logs" USING "btree" ("date" DESC);



CREATE INDEX "idx_hour_logs_school_id" ON "public"."hour_logs" USING "btree" ("school_id");



CREATE INDEX "idx_hour_logs_status" ON "public"."hour_logs" USING "btree" ("status");



CREATE INDEX "idx_hour_logs_user_id" ON "public"."hour_logs" USING "btree" ("user_id");



CREATE INDEX "idx_instructor_notes_created_at" ON "public"."instructor_notes" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_instructor_notes_instructor_id" ON "public"."instructor_notes" USING "btree" ("instructor_id");



CREATE INDEX "idx_instructor_notes_school_id" ON "public"."instructor_notes" USING "btree" ("school_id");



CREATE INDEX "idx_instructor_notes_student_id" ON "public"."instructor_notes" USING "btree" ("student_id");



CREATE INDEX "idx_instructors_profile_id" ON "public"."instructors" USING "btree" ("profile_id");



CREATE INDEX "idx_instructors_school_id" ON "public"."instructors" USING "btree" ("school_id");



CREATE INDEX "idx_missed_questions_chapter_number" ON "public"."missed_questions" USING "btree" ("chapter_number");



CREATE INDEX "idx_missed_questions_user_id" ON "public"."missed_questions" USING "btree" ("user_id");



CREATE INDEX "idx_missed_questions_user_question" ON "public"."missed_questions" USING "btree" ("user_id", "question_id");



CREATE INDEX "idx_notifications_archived" ON "public"."notifications" USING "btree" ("archived");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_notifications_read" ON "public"."notifications" USING "btree" ("read");



CREATE INDEX "idx_notifications_school_id" ON "public"."notifications" USING "btree" ("school_id");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_owner_notifications_recipient" ON "public"."owner_notifications" USING "btree" ("recipient_email", "status", "created_at" DESC);



CREATE INDEX "idx_owner_notifications_source" ON "public"."owner_notifications" USING "btree" ("source_type", "source_id");



CREATE INDEX "idx_owner_notifications_status_created" ON "public"."owner_notifications" USING "btree" ("status", "created_at" DESC);



CREATE INDEX "idx_owner_notifications_type_status" ON "public"."owner_notifications" USING "btree" ("type", "status");



CREATE INDEX "idx_pilot_inquiries_created_at" ON "public"."pilot_inquiries" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_pilot_inquiries_email" ON "public"."pilot_inquiries" USING "btree" ("email");



CREATE INDEX "idx_pilot_inquiries_status" ON "public"."pilot_inquiries" USING "btree" ("status");



CREATE INDEX "idx_profiles_approval_status" ON "public"."profiles" USING "btree" ("approval_status");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_is_disabled" ON "public"."profiles" USING "btree" ("is_disabled");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_profiles_school_id" ON "public"."profiles" USING "btree" ("school_id");



CREATE INDEX "idx_profiles_school_role" ON "public"."profiles" USING "btree" ("school_id", "role");



CREATE INDEX "idx_programs_school_active" ON "public"."programs" USING "btree" ("school_id", "is_active") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_programs_school_id" ON "public"."programs" USING "btree" ("school_id");



CREATE INDEX "idx_quiz_attempts_completed_at" ON "public"."quiz_attempts" USING "btree" ("completed_at" DESC);



CREATE INDEX "idx_quiz_attempts_quiz_id" ON "public"."quiz_attempts" USING "btree" ("quiz_id");



CREATE INDEX "idx_quiz_attempts_user_completed" ON "public"."quiz_attempts" USING "btree" ("user_id", "completed_at" DESC);



CREATE INDEX "idx_quiz_attempts_user_id" ON "public"."quiz_attempts" USING "btree" ("user_id");



CREATE INDEX "idx_school_settings_school_id" ON "public"."school_settings" USING "btree" ("school_id");



CREATE INDEX "idx_school_settings_updated_by" ON "public"."school_settings" USING "btree" ("updated_by");



CREATE INDEX "idx_schools_created_by" ON "public"."schools" USING "btree" ("created_by");



CREATE INDEX "idx_schools_is_active" ON "public"."schools" USING "btree" ("is_active") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_schools_slug" ON "public"."schools" USING "btree" ("slug");



CREATE INDEX "idx_schools_subscription_status" ON "public"."schools" USING "btree" ("subscription_status");



CREATE INDEX "idx_security_logs_created_at" ON "public"."security_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_security_logs_school_id" ON "public"."security_logs" USING "btree" ("school_id");



CREATE INDEX "idx_security_logs_type" ON "public"."security_logs" USING "btree" ("type");



CREATE INDEX "idx_security_logs_user_id" ON "public"."security_logs" USING "btree" ("user_id");



CREATE INDEX "idx_student_progress_chapter_id" ON "public"."student_progress" USING "btree" ("chapter_id");



CREATE INDEX "idx_student_progress_user_chapter" ON "public"."student_progress" USING "btree" ("user_id", "chapter_id");



CREATE INDEX "idx_student_progress_user_id" ON "public"."student_progress" USING "btree" ("user_id");



CREATE INDEX "idx_students_profile_id" ON "public"."students" USING "btree" ("profile_id");



CREATE INDEX "idx_students_school_id" ON "public"."students" USING "btree" ("school_id");



CREATE INDEX "idx_students_student_number" ON "public"."students" USING "btree" ("student_number");



CREATE INDEX "idx_user_mgmt_audit_actor_id" ON "public"."user_management_audit_logs" USING "btree" ("actor_id");



CREATE INDEX "idx_user_mgmt_audit_created_at" ON "public"."user_management_audit_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_user_mgmt_audit_school_id" ON "public"."user_management_audit_logs" USING "btree" ("school_id");



CREATE INDEX "idx_user_mgmt_audit_target_user_id" ON "public"."user_management_audit_logs" USING "btree" ("target_user_id");



CREATE OR REPLACE TRIGGER "trg_missed_questions_updated_at" BEFORE UPDATE ON "public"."missed_questions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_assessment_rubrics_updated_at" BEFORE UPDATE ON "public"."assessment_rubrics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_assessments_updated_at" BEFORE UPDATE ON "public"."assessments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_attendance_corrections_updated_at" BEFORE UPDATE ON "public"."attendance_corrections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_attendance_notes_updated_at" BEFORE UPDATE ON "public"."attendance_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_attendance_records_updated_at" BEFORE UPDATE ON "public"."attendance_records" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_enrollments_updated_at" BEFORE UPDATE ON "public"."enrollments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_grade_categories_updated_at" BEFORE UPDATE ON "public"."grade_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_grades_updated_at" BEFORE UPDATE ON "public"."grades" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_hour_logs_updated_at" BEFORE UPDATE ON "public"."hour_logs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_instructor_notes_updated_at" BEFORE UPDATE ON "public"."instructor_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_instructors_updated_at" BEFORE UPDATE ON "public"."instructors" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_programs_updated_at" BEFORE UPDATE ON "public"."programs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_quiz_attempts_updated_at" BEFORE UPDATE ON "public"."quiz_attempts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_school_settings_updated_at" BEFORE UPDATE ON "public"."school_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_schools_updated_at" BEFORE UPDATE ON "public"."schools" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_student_progress_updated_at" BEFORE UPDATE ON "public"."student_progress" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_students_updated_at" BEFORE UPDATE ON "public"."students" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."assessment_rubrics"
    ADD CONSTRAINT "assessment_rubrics_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessment_rubrics"
    ADD CONSTRAINT "assessment_rubrics_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "public"."assessment_rubrics"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_audit_log"
    ADD CONSTRAINT "attendance_audit_log_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."attendance_records"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_audit_log"
    ADD CONSTRAINT "attendance_audit_log_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."attendance_audit_log"
    ADD CONSTRAINT "attendance_audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_corrections"
    ADD CONSTRAINT "attendance_corrections_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."attendance_corrections"
    ADD CONSTRAINT "attendance_corrections_attendance_record_id_fkey" FOREIGN KEY ("attendance_record_id") REFERENCES "public"."attendance_records"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_corrections"
    ADD CONSTRAINT "attendance_corrections_corrected_by_fkey" FOREIGN KEY ("corrected_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_corrections"
    ADD CONSTRAINT "attendance_corrections_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_notes"
    ADD CONSTRAINT "attendance_notes_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_notes"
    ADD CONSTRAINT "attendance_notes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_notes"
    ADD CONSTRAINT "attendance_notes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_records"
    ADD CONSTRAINT "attendance_records_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_records"
    ADD CONSTRAINT "attendance_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_records"
    ADD CONSTRAINT "attendance_records_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."backup_status"
    ADD CONSTRAINT "backup_status_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."beta_agreements"
    ADD CONSTRAINT "beta_agreements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."beta_feedback"
    ADD CONSTRAINT "beta_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grade_categories"
    ADD CONSTRAINT "grade_categories_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."programs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."grade_categories"
    ADD CONSTRAINT "grade_categories_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."grade_categories"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hour_logs"
    ADD CONSTRAINT "hour_logs_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."hour_logs"
    ADD CONSTRAINT "hour_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hour_logs"
    ADD CONSTRAINT "hour_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instructor_notes"
    ADD CONSTRAINT "instructor_notes_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instructor_notes"
    ADD CONSTRAINT "instructor_notes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instructor_notes"
    ADD CONSTRAINT "instructor_notes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."maintenance_mode"
    ADD CONSTRAINT "maintenance_mode_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."missed_questions"
    ADD CONSTRAINT "missed_questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_attempts"
    ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."school_settings"
    ADD CONSTRAINT "school_settings_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."school_settings"
    ADD CONSTRAINT "school_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_management_audit_logs"
    ADD CONSTRAINT "user_management_audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_management_audit_logs"
    ADD CONSTRAINT "user_management_audit_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_management_audit_logs"
    ADD CONSTRAINT "user_management_audit_logs_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



CREATE POLICY "Active schools are viewable by anon and authenticated" ON "public"."schools" FOR SELECT TO "authenticated", "anon" USING ((("is_active" = true) AND ("deleted_at" IS NULL)));



CREATE POLICY "Admins can delete pilot inquiries" ON "public"."pilot_inquiries" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can manage enrollments" ON "public"."enrollments" USING ((EXISTS ( SELECT 1
   FROM ("public"."students" "s"
     JOIN "public"."profiles" "p" ON (("p"."school_id" = "s"."school_id")))
  WHERE (("s"."id" = "enrollments"."student_id") AND ("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can manage instructors" ON "public"."instructors" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text") AND ("p"."school_id" = "instructors"."school_id")))));



CREATE POLICY "Admins can manage school programs" ON "public"."programs" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text") AND ("p"."school_id" = "programs"."school_id")))));



CREATE POLICY "Admins can manage students" ON "public"."students" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text") AND ("p"."school_id" = "students"."school_id")))));



CREATE POLICY "Admins can read owner notifications" ON "public"."owner_notifications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND (("p"."role" = 'admin'::"text") OR ("p"."role" = 'school_admin'::"text"))))));



CREATE POLICY "Admins can read pilot inquiries" ON "public"."pilot_inquiries" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND (("profiles"."role" = 'admin'::"text") OR ("profiles"."role" = 'school_admin'::"text"))))));



CREATE POLICY "Admins can update pilot inquiries" ON "public"."pilot_inquiries" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND (("profiles"."role" = 'admin'::"text") OR ("profiles"."role" = 'school_admin'::"text"))))));



CREATE POLICY "Admins can update school settings" ON "public"."school_settings" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text") AND ("p"."school_id" = "school_settings"."school_id")))));



CREATE POLICY "Admins can view user management audit logs" ON "public"."user_management_audit_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND (("p"."role" = 'admin'::"text") OR (("p"."role" = 'school_admin'::"text") AND ("p"."school_id" = "user_management_audit_logs"."school_id")))))));



CREATE POLICY "Instructors can create schools" ON "public"."schools" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'instructor'::"text")))));



CREATE POLICY "Instructors can view own record" ON "public"."instructors" FOR SELECT USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Profiles: platform super admin full access" ON "public"."profiles" TO "authenticated" USING ("public"."is_platform_super_admin"()) WITH CHECK ("public"."is_platform_super_admin"());



CREATE POLICY "Profiles: school admins manage students" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("public"."is_school_admin"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "school_id") AND ("role" = ANY (ARRAY['student'::"text", 'apprentice'::"text"])))) WITH CHECK (("public"."is_school_admin"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "school_id") AND ("role" = ANY (ARRAY['student'::"text", 'apprentice'::"text"]))));



CREATE POLICY "Profiles: school staff read school" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("public"."is_school_staff"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "school_id")));



CREATE POLICY "Profiles: school staff read students" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("public"."is_school_staff"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "school_id") AND ("role" = ANY (ARRAY['student'::"text", 'apprentice'::"text"]))));



CREATE POLICY "Profiles: users insert own" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Profiles: users read own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Profiles: users update own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Programs are viewable by school members" ON "public"."programs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."school_id" = "programs"."school_id")))));



CREATE POLICY "Public can create pilot inquiries" ON "public"."pilot_inquiries" FOR INSERT WITH CHECK (true);



CREATE POLICY "School creators can update their school" ON "public"."schools" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "School members can read school settings" ON "public"."school_settings" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."school_id" = "school_settings"."school_id")))));



CREATE POLICY "School staff can view enrollments" ON "public"."enrollments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."students" "s"
     JOIN "public"."profiles" "p" ON (("p"."school_id" = "s"."school_id")))
  WHERE (("s"."id" = "enrollments"."student_id") AND ("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['instructor'::"text", 'admin'::"text"]))))));



CREATE POLICY "School staff can view instructors" ON "public"."instructors" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['instructor'::"text", 'admin'::"text"])) AND ("p"."school_id" = "instructors"."school_id")))));



CREATE POLICY "School staff can view students" ON "public"."students" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['instructor'::"text", 'admin'::"text"])) AND ("p"."school_id" = "students"."school_id")))));



CREATE POLICY "Service role can insert user management audit logs" ON "public"."user_management_audit_logs" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Service role can manage beta agreements" ON "public"."beta_agreements" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can manage beta feedback" ON "public"."beta_feedback" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can manage owner notifications" ON "public"."owner_notifications" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Students can view own enrollments" ON "public"."enrollments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."students" "s"
  WHERE (("s"."id" = "enrollments"."student_id") AND ("s"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Students can view own record" ON "public"."students" FOR SELECT USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can insert own beta agreements" ON "public"."beta_agreements" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert own beta feedback" ON "public"."beta_feedback" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can read own security logs" ON "public"."security_logs" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own beta agreements" ON "public"."beta_agreements" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own beta feedback" ON "public"."beta_feedback" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."assessment_rubrics" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "assessment_rubrics_all" ON "public"."assessment_rubrics" TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "assessment_rubrics_select" ON "public"."assessment_rubrics" FOR SELECT TO "authenticated" USING ((("school_id" IS NULL) OR ("school_id" = "public"."current_user_school_id"()) OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."assessments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "assessments_all" ON "public"."assessments" TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "assessments_select" ON "public"."assessments" FOR SELECT TO "authenticated" USING ((("student_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."attendance_audit_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "attendance_audit_log_insert" ON "public"."attendance_audit_log" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "attendance_audit_log_select" ON "public"."attendance_audit_log" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."attendance_corrections" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "attendance_corrections_all" ON "public"."attendance_corrections" TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "attendance_corrections_select" ON "public"."attendance_corrections" FOR SELECT TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."attendance_notes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "attendance_notes_all" ON "public"."attendance_notes" TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "attendance_notes_select" ON "public"."attendance_notes" FOR SELECT TO "authenticated" USING ((("student_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."attendance_records" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "attendance_records_delete" ON "public"."attendance_records" FOR DELETE TO "authenticated" USING (("public"."is_school_admin"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "attendance_records_insert" ON "public"."attendance_records" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "attendance_records_select" ON "public"."attendance_records" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "attendance_records_update" ON "public"."attendance_records" FOR UPDATE TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."background_jobs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "background_jobs_admin_all" ON "public"."background_jobs" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



ALTER TABLE "public"."backup_status" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "backup_status_admin_select" ON "public"."backup_status" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "backup_status_admin_write" ON "public"."backup_status" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



ALTER TABLE "public"."beta_agreements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."beta_feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enrollments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feature_flags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "feature_flags_admin_write" ON "public"."feature_flags" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "feature_flags_select" ON "public"."feature_flags" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."grade_categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "grade_categories_all" ON "public"."grade_categories" TO "authenticated" USING (("public"."is_school_admin"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_admin"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "grade_categories_select" ON "public"."grade_categories" FOR SELECT TO "authenticated" USING ((("school_id" IS NULL) OR ("school_id" = "public"."current_user_school_id"()) OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."grades" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "grades_all" ON "public"."grades" TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "grades_select" ON "public"."grades" FOR SELECT TO "authenticated" USING ((("student_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."hour_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "hour_logs_delete" ON "public"."hour_logs" FOR DELETE TO "authenticated" USING (("public"."is_school_admin"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "hour_logs_insert" ON "public"."hour_logs" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "hour_logs_select" ON "public"."hour_logs" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "hour_logs_update" ON "public"."hour_logs" FOR UPDATE TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."instructor_notes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "instructor_notes_all" ON "public"."instructor_notes" TO "authenticated" USING (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"())) WITH CHECK (("public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



CREATE POLICY "instructor_notes_select" ON "public"."instructor_notes" FOR SELECT TO "authenticated" USING ((("student_id" = "auth"."uid"()) OR "public"."is_school_staff"("school_id") OR "public"."is_platform_super_admin"()));



ALTER TABLE "public"."instructors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."maintenance_mode" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "maintenance_mode_admin_write" ON "public"."maintenance_mode" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "maintenance_mode_select" ON "public"."maintenance_mode" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."missed_questions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "missed_questions_delete" ON "public"."missed_questions" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "missed_questions_insert" ON "public"."missed_questions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "missed_questions_select" ON "public"."missed_questions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "missed_questions_staff_select" ON "public"."missed_questions" FOR SELECT TO "authenticated" USING (("public"."is_school_staff"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "public"."user_school_id"("user_id"))));



CREATE POLICY "missed_questions_super_admin" ON "public"."missed_questions" TO "authenticated" USING ("public"."is_platform_super_admin"()) WITH CHECK ("public"."is_platform_super_admin"());



CREATE POLICY "missed_questions_update" ON "public"."missed_questions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notifications_admin_all" ON "public"."notifications" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "notifications_user_select" ON "public"."notifications" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (("user_id" IS NULL) AND ("school_id" IN ( SELECT "profiles"."school_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))))));



ALTER TABLE "public"."owner_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pilot_inquiries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quiz_attempts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "quiz_attempts_delete" ON "public"."quiz_attempts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "quiz_attempts_insert" ON "public"."quiz_attempts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "quiz_attempts_select" ON "public"."quiz_attempts" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "quiz_attempts_staff_select" ON "public"."quiz_attempts" FOR SELECT TO "authenticated" USING (("public"."is_school_staff"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "public"."user_school_id"("user_id"))));



CREATE POLICY "quiz_attempts_super_admin" ON "public"."quiz_attempts" TO "authenticated" USING ("public"."is_platform_super_admin"()) WITH CHECK ("public"."is_platform_super_admin"());



CREATE POLICY "quiz_attempts_update" ON "public"."quiz_attempts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."school_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schools" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_progress" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "student_progress_delete" ON "public"."student_progress" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "student_progress_insert" ON "public"."student_progress" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "student_progress_select" ON "public"."student_progress" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "student_progress_staff_select" ON "public"."student_progress" FOR SELECT TO "authenticated" USING (("public"."is_school_staff"("public"."current_user_school_id"()) AND ("public"."current_user_school_id"() = "public"."user_school_id"("user_id"))));



CREATE POLICY "student_progress_super_admin" ON "public"."student_progress" TO "authenticated" USING ("public"."is_platform_super_admin"()) WITH CHECK ("public"."is_platform_super_admin"());



CREATE POLICY "student_progress_update" ON "public"."student_progress" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_management_audit_logs" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




























































































































































REVOKE ALL ON FUNCTION "public"."current_user_role"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_school_id"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_school_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_school_id"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_platform_super_admin"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_platform_super_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_platform_super_admin"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_school_admin"("target_school_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_school_admin"("target_school_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_school_admin"("target_school_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_school_staff"("target_school_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_school_staff"("target_school_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_school_staff"("target_school_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_updated_at_column"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."user_school_id"("target_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."user_school_id"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_school_id"("target_user_id" "uuid") TO "service_role";


















GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."schools" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."schools" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."schools" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."active_schools" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."active_schools" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."active_schools" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_rubrics" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_rubrics" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessment_rubrics" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessments" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessments" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."assessments" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_audit_log" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_audit_log" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_audit_log" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_corrections" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_corrections" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_corrections" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_notes" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_notes" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_notes" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_records" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_records" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."attendance_records" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."background_jobs" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."background_jobs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."background_jobs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."backup_status" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."backup_status" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."backup_status" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."beta_agreements" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."beta_agreements" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."beta_agreements" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."beta_feedback" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."beta_feedback" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."beta_feedback" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enrollments" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enrollments" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enrollments" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."feature_flags" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."feature_flags" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."feature_flags" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."grade_categories" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."grade_categories" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."grade_categories" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."grades" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."grades" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."grades" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hour_logs" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hour_logs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hour_logs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."instructor_notes" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."instructor_notes" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."instructor_notes" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."instructors" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."instructors" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."instructors" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."maintenance_mode" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."maintenance_mode" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."maintenance_mode" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."missed_questions" TO "anon";
GRANT ALL ON TABLE "public"."missed_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."missed_questions" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."notifications" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."notifications" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."owner_notifications" TO "service_role";



GRANT INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."pilot_inquiries" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."pilot_inquiries" TO "authenticated";
GRANT ALL ON TABLE "public"."pilot_inquiries" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."programs" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."programs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."programs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."quiz_attempts" TO "anon";
GRANT ALL ON TABLE "public"."quiz_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_attempts" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."school_settings" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."school_settings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."school_settings" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."security_logs" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."security_logs" TO "authenticated";
GRANT INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."security_logs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."student_progress" TO "anon";
GRANT ALL ON TABLE "public"."student_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."student_progress" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."students" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."students" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."students" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_management_audit_logs" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_management_audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."user_management_audit_logs" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT UPDATE ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT UPDATE ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT UPDATE ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";































