-- ============================================================================
-- Grow Biz Jobs — Membership Expiry, Job Expiry, Account Deletion
-- Three real backend gaps closed here:
--   1. memberships.ends_at existed but nothing ever checked it, and Razorpay
--      payments never even set it — paid entitlements never actually expired.
--   2. jobs.expires_at existed but nothing transitioned status to 'expired'
--      or hid stale listings from public search.
--   3. No self-service account deletion despite the brief requiring one
--      (Section 18: "Account data rights").
-- Run this AFTER 0001-0010.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Membership validity check — used by entitlement checks before trusting
-- a membership's limits. An expired/inactive membership is treated as if it
-- doesn't exist (callers fall back to free-tier defaults), not as an error.
-- ---------------------------------------------------------------------------
create or replace function public.membership_is_active(m public.memberships)
returns boolean
language sql
immutable
as $$
  select m.status = 'active' and (m.ends_at is null or m.ends_at > now());
$$;

-- Batch downgrade — sets expired paid memberships back to free-tier limits.
-- Safe to run repeatedly (idempotent); schedule via pg_cron if available
-- (see README), or call manually from an admin action.
create or replace function public.downgrade_expired_memberships()
returns integer
language plpgsql
security definer
as $$
declare
  affected integer;
begin
  update public.memberships
  set plan = 'free',
      active_jobs_limit = 1,
      candidate_unlocks_limit = 10,
      status = 'active'
  where status = 'active'
    and ends_at is not null
    and ends_at <= now()
    and plan <> 'free';

  get diagnostics affected = row_count;
  return affected;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Job expiry — both a status-transition function AND a defensive query-
-- level filter, so expired listings disappear from public search immediately
-- even if the batch function hasn't run yet (e.g. no cron configured).
-- ---------------------------------------------------------------------------
create or replace function public.expire_stale_jobs()
returns integer
language plpgsql
security definer
as $$
declare
  affected integer;
begin
  update public.jobs
  set status = 'expired'
  where status = 'published'
    and expires_at is not null
    and expires_at < current_date;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

drop policy "jobs_select" on public.jobs;

create policy "jobs_select" on public.jobs
  for select using (
    (status = 'published' and (expires_at is null or expires_at >= current_date))
    or public.is_company_member(company_id)
    or public.is_admin()
    or public.is_recruiter()
  );

-- ---------------------------------------------------------------------------
-- 3. Account deletion — self-service. auth.users cascades through profiles
-- -> candidates/company_users/etc via existing FK "on delete cascade", so
-- deleting the auth user is sufficient; this just records why/when for audit
-- purposes before the app calls the admin API to actually delete.
-- ---------------------------------------------------------------------------
create table public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  -- Deliberately no FK to profiles/auth.users: this is an audit record that
  -- should survive the user's deletion, not cascade away with them.
  user_id uuid not null,
  reason text,
  requested_at timestamptz not null default now()
);

alter table public.account_deletion_requests enable row level security;

create policy "deletion_requests_insert_self" on public.account_deletion_requests
  for insert with check (user_id = auth.uid());

create policy "deletion_requests_select_admin" on public.account_deletion_requests
  for select using (public.is_admin());
