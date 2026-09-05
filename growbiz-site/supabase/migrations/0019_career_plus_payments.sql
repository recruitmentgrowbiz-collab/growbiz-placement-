-- ============================================================================
-- Grow Biz Jobs — Career Plus (Candidate Payments)
-- The payments table (0005) was built employer-only — company_id was
-- required, with no way to attribute a payment to a candidate. This meant
-- Career Plus had a full marketing page and price on /pricing and
-- /career-resources but no actual purchase flow, despite being a real part
-- of the commercial model. Extends the same verified-payment pattern
-- (order creation -> signature verification -> entitlement change) used for
-- employer plans, rather than building a parallel, less-trusted path.
-- Run this AFTER 0001-0018.
-- ============================================================================

alter table public.payments alter column company_id drop not null;
alter table public.payments add column candidate_id uuid references public.candidates(user_id) on delete cascade;

alter table public.payments
  add constraint payments_one_owner_check
  check (
    (company_id is not null and candidate_id is null)
    or (company_id is null and candidate_id is not null)
  );

alter table public.candidates add column career_plus_expires_at timestamptz;

-- ---------------------------------------------------------------------------
-- Candidates need to see their own payments (the existing payments_select
-- policy only ever checked company membership).
-- ---------------------------------------------------------------------------
drop policy "payments_select" on public.payments;

create policy "payments_select" on public.payments
  for select using (
    (company_id is not null and public.is_company_member(company_id))
    or (candidate_id is not null and candidate_id = auth.uid())
    or public.is_admin()
  );

drop policy "payments_insert" on public.payments;

create policy "payments_insert" on public.payments
  for insert with check (
    (company_id is not null and public.is_company_member(company_id))
    or (candidate_id is not null and candidate_id = auth.uid())
  );

drop policy "payments_update" on public.payments;

create policy "payments_update" on public.payments
  for update using (
    (company_id is not null and public.is_company_member(company_id))
    or (candidate_id is not null and candidate_id = auth.uid())
    or public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- Mirrors downgrade_expired_memberships() — same pattern, candidate side.
-- Wired into the same maintenance runner (manual button + pg_cron/API
-- fallback) rather than introducing a fourth way to run scheduled jobs.
-- ---------------------------------------------------------------------------
create or replace function public.expire_career_plus()
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  update public.candidates
  set career_plus_expires_at = null
  where career_plus_expires_at is not null
    and career_plus_expires_at < now();

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- get_admin_analytics() (0010) needs a new column for Career Plus
-- subscribers — Postgres requires dropping a function before changing its
-- RETURNS TABLE column set, CREATE OR REPLACE alone isn't enough for that.
-- ---------------------------------------------------------------------------
drop function public.get_admin_analytics();

create function public.get_admin_analytics()
returns table (
  total_candidates bigint,
  total_employers bigint,
  verified_employers bigint,
  active_jobs bigint,
  total_applications bigint,
  total_hires bigint,
  total_placements bigint,
  billed_fee_paise bigint,
  pending_fee_paise bigint,
  open_reports bigint,
  pending_verifications bigint,
  career_plus_active bigint
)
language sql
security definer
stable
as $$
  select
    (select count(*) from public.profiles where role = 'candidate'),
    (select count(*) from public.profiles where role = 'employer'),
    (select count(*) from public.companies where verification_status = 'verified'),
    (select count(*) from public.jobs where status = 'published'),
    (select count(*) from public.applications),
    (select count(*) from public.applications where stage = 'hired'),
    (select count(*) from public.placements),
    (select coalesce(sum(fee_amount), 0) from public.placements where fee_status in ('invoiced', 'paid')),
    (select coalesce(sum(fee_amount), 0) from public.placements where fee_status = 'pending'),
    (select count(*) from public.reports where status = 'open'),
    (select count(*) from public.companies where verification_status = 'pending'),
    (select count(*) from public.candidates where career_plus_expires_at > now())
  where public.is_admin();
$$;

grant execute on function public.get_admin_analytics to authenticated;
