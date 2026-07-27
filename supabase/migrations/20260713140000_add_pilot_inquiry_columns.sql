-- Migration: Add missing columns to pilot_inquiries for production persistence
-- The production pilot_inquiries table was created before these fields were
-- added to supabase-schema.sql. This migration brings it in line with the
-- expected schema used by src/app/api/email/route.ts.

alter table public.pilot_inquiries
  add column if not exists start_date text,
  add column if not exists ip_address text,
  add column if not exists user_agent text,
  add column if not exists is_test boolean default false,
  add column if not exists notes text;

-- Update the updated_at timestamp on modification (if not already present).
-- Note: supabase-schema.sql does not define an updated_at trigger for this
-- table, so we only add columns here.
