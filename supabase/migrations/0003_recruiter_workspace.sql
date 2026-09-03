-- ============================================================================
-- Grow Biz Jobs — Recruiter Workspace (Phase 3)
-- Adds: interviews, placements, notifications tables (Master Brief Section 16)
-- Grants the 'recruiter' role cross-company read/write needed to run managed
-- recruitment: requisitions, pipeline, interview coordination, placement tracking.
-- Run this AFTER 0001_schema.sql and 0002_rls.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- interviews — scheduling + feedback, separate from the application's stage
-- ---------------------------------------------------------------------------
create type interview_mode as enum ('phone', 'video', 'in_person');
create type interview_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  scheduled_at timestamptz,
  mode interview_mode not null default 'video',
  status interview_status not null default 'scheduled',
  feedback text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- placements — tracks managed recruitment outcomes + fee state
-- (this is what the recruiter workspace exists to produce)
-- ---------------------------------------------------------------------------
create type placement_fee_status as enum ('not_applicable', 'pending', 'invoiced', 'paid');

create table public.placements (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  candidate_id uuid not null references public.candidates(user_id),
  company_id uuid not null references public.companies(id),
  offered_at date,
  joining_date date,
  annual_ctc integer,
  fee_percent numeric(4,2),
  fee_amount integer,
  fee_status placement_fee_status not null default 'not_applicable',
  recorded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- notifications — in-app notification log (email/SMS dispatch is Phase 4)
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null default 'in_app',
  template text not null,
  payload jsonb default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper: is the current user a recruiter (or admin)?
-- ---------------------------------------------------------------------------
create function public.is_recruiter()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('recruiter', 'admin')
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- Extend existing tables: recruiters get cross-company read, and write access
-- scoped to the managed-recruitment workflow (jobs, applications, interviews).
-- Recruiters do NOT get company_users membership, so they never appear as
-- "the employer" — this keeps the client relationship visibly Grow Biz's.
-- ---------------------------------------------------------------------------
create policy "jobs_select_recruiter" on public.jobs
  for select using (public.is_recruiter());
create policy "jobs_update_recruiter" on public.jobs
  for update using (public.is_recruiter());

create policy "companies_select_recruiter" on public.companies
  for select using (public.is_recruiter());

create policy "applications_select_recruiter" on public.applications
  for select using (public.is_recruiter());
create policy "applications_update_recruiter" on public.applications
  for update using (public.is_recruiter());

create policy "candidates_select_recruiter" on public.candidates
  for select using (public.is_recruiter());

-- ---------------------------------------------------------------------------
-- RLS: interviews
-- ---------------------------------------------------------------------------
alter table public.interviews enable row level security;

create policy "interviews_select" on public.interviews
  for select using (
    public.is_recruiter()
    or exists (
      select 1 from public.applications a
      where a.id = application_id
      and (
        a.candidate_id = auth.uid()
        or exists (select 1 from public.jobs j where j.id = a.job_id and public.is_company_member(j.company_id))
      )
    )
  );

create policy "interviews_write" on public.interviews
  for all using (
    public.is_recruiter()
    or exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id and public.is_company_member(j.company_id)
    )
  );

-- ---------------------------------------------------------------------------
-- RLS: placements
-- ---------------------------------------------------------------------------
alter table public.placements enable row level security;

create policy "placements_select" on public.placements
  for select using (public.is_recruiter() or public.is_company_member(company_id));

create policy "placements_write_recruiter" on public.placements
  for all using (public.is_recruiter());

-- ---------------------------------------------------------------------------
-- RLS: notifications — strictly your own
-- ---------------------------------------------------------------------------
alter table public.notifications enable row level security;

create policy "notifications_owner" on public.notifications
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
