-- ============================================================================
-- Grow Biz Jobs — Notification Delivery Tracking
-- Previously, lib/email.ts and lib/sms.ts fired sends and only logged
-- failures to the server console — nothing persisted whether a send
-- actually succeeded, let alone whether the message was ever delivered,
-- bounced, or failed downstream. This adds a delivery log that both the
-- send functions and the provider webhooks (Resend, Twilio) write to, so
-- "sent" becomes a real, checkable claim instead of an assumption.
-- Run this AFTER 0001-0016.
-- ============================================================================

create type delivery_channel as enum ('email', 'sms');
create type delivery_status as enum ('queued', 'sent', 'delivered', 'bounced', 'failed', 'skipped');

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  channel delivery_channel not null,
  recipient text,
  template text,
  provider_message_id text,
  status delivery_status not null default 'queued',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_notification_deliveries_provider_id on public.notification_deliveries(provider_message_id);
create index idx_notification_deliveries_user_id on public.notification_deliveries(user_id);
create index idx_notification_deliveries_status on public.notification_deliveries(status);

alter table public.notification_deliveries enable row level security;

-- Only admins browse the delivery log — this is an operational view, not
-- something a user needs to see about their own notifications.
create policy "notification_deliveries_admin_select" on public.notification_deliveries
  for select using (public.is_admin());
