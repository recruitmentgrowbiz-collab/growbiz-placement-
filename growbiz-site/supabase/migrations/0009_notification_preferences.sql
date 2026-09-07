-- ============================================================================
-- Grow Biz Jobs — Notification Preferences & Phone Numbers
-- Adds what's needed for SMS dispatch and an unsubscribe/preferences UI:
-- a phone number on profiles, and a preferences table controlling whether
-- email/SMS actually get sent (in-app notifications always stay on — they're
-- free and are the reliable channel everything else is best-effort on top of).
-- Run this AFTER 0001-0008.
-- ============================================================================

alter table public.profiles add column phone text;

create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "notification_preferences_owner" on public.notification_preferences
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admins need to update any user's role from the admin console (previously
-- only possible by running SQL directly) — profiles only had a self-update
-- policy before this.
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());
