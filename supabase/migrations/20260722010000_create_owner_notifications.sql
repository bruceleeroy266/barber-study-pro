-- Forward migration: owner notification center (Phase 1)
-- Created: 2026-07-22 01:00 UTC
-- Purpose: Store owner notifications for pilot requests, contact submissions,
--          demo requests, and future business events. Designed to support
--          additional channels (push, SMS, Slack, etc.) without schema changes.

-- ============================================================================
-- 1. Owner notifications table
-- ============================================================================
create table if not exists public.owner_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),

  -- Optional link back to the source record (e.g., pilot_inquiries.id).
  source_type text,
  source_id uuid,

  -- Normalized payload for the notification. The application treats this as
  -- the canonical store for Phase 1/2 until dedicated per-event tables are
  -- needed.
  payload jsonb not null default '{}',

  -- Idempotency: duplicate submissions with the same hash do not trigger
  -- duplicate notification emails.
  dedup_hash text not null unique,

  -- Primary owner recipient. Defaults to gabriel@ascynpro.com in the app.
  recipient_email text not null,

  -- Email channel tracking.
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error text,
  email_sent_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.owner_notifications is
  'Unified owner-facing notification log. One row per notifyable business event.';

-- ============================================================================
-- 2. Indexes
-- ============================================================================
create index if not exists idx_owner_notifications_type_status
  on public.owner_notifications(type, status);

create index if not exists idx_owner_notifications_status_created
  on public.owner_notifications(status, created_at desc);

create index if not exists idx_owner_notifications_source
  on public.owner_notifications(source_type, source_id);

create index if not exists idx_owner_notifications_recipient
  on public.owner_notifications(recipient_email, status, created_at desc);

-- ============================================================================
-- 3. Row Level Security
-- ============================================================================
alter table public.owner_notifications enable row level security;

-- Service role is the only application role that writes here.
drop policy if exists "Service role can manage owner notifications"
  on public.owner_notifications;

create policy "Service role can manage owner notifications"
  on public.owner_notifications
  for all to service_role using (true) with check (true);

-- Platform admins and school admins can read notifications for the owner
-- dashboard (Phase 2). The check is intentionally broad here; row-level
-- filtering by school will be added in Phase 2 if needed.
drop policy if exists "Admins can read owner notifications"
  on public.owner_notifications;

create policy "Admins can read owner notifications"
  on public.owner_notifications
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.role = 'admin' or p.role = 'school_admin')
    )
  );

-- ============================================================================
-- 4. Grants
-- ============================================================================
grant select, insert, update, delete on public.owner_notifications to service_role;

-- Admins read through the RLS policy above; authenticated/anon have no access.
revoke all on public.owner_notifications from anon;
revoke all on public.owner_notifications from authenticated;
revoke all on public.owner_notifications from public;
