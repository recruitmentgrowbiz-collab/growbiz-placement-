-- ============================================================================
-- Grow Biz Jobs — Company Logos, Interview Scheduling, Analytics
-- Three independent additions:
--   1. Public storage bucket for company logos (0001 never created this —
--      companies.logo_url has existed since the start but nothing could
--      actually upload to it)
--   2. Lets employers (not just recruiters) schedule interviews
--   3. A read-only analytics view for the admin dashboard, built on the
--      activities/applications/jobs/companies data that already exists —
--      no new tracking infrastructure, just surfacing what's already logged
-- Run this AFTER 0001-0009.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Company logos — public bucket, owner-writable
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

create policy "company_logo_public_read" on storage.objects
  for select using (bucket_id = 'company-logos');

create policy "company_logo_owner_write" on storage.objects
  for all using (
    bucket_id = 'company-logos'
    and exists (
      select 1 from public.company_users cu
      where cu.user_id = auth.uid()
      and cu.company_id::text = (storage.foldername(name))[1]
    )
  );

-- ---------------------------------------------------------------------------
-- 2. Interview scheduling — extend write access to employer company members,
-- not just recruiters (0003's interviews_write already covers company
-- members via the applications->jobs join, so this just confirms/documents
-- that path rather than adding anything new).
-- ---------------------------------------------------------------------------
-- (No policy change needed — interviews_write from 0003 already checks
-- public.is_company_member(j.company_id), which covers employers.)

-- ---------------------------------------------------------------------------
-- 3. Admin analytics — a function, not a plain view. A view granted to
-- `authenticated` would let ANY logged-in user (including candidates) query
-- these numbers directly via the client SDK, since Postgres views don't
-- inherit RLS from their underlying tables by default. This function checks
-- is_admin() itself and returns nothing for anyone else — the security
-- boundary is in the database, not just in the admin page gating access to it.
-- ---------------------------------------------------------------------------
create or replace function public.get_admin_analytics()
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
  pending_verifications bigint
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
    (select count(*) from public.companies where verification_status = 'pending')
  where public.is_admin();
$$;

grant execute on function public.get_admin_analytics to authenticated;
