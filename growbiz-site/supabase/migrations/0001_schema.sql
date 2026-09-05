-- ============================================================================
-- Grow Biz Jobs — Core Schema (Phase 1 MVP)
-- Source: Website & Job Portal Developer Master Brief v1.0, Section 16 (Core Data Model)
-- Run this once in your Supabase project's SQL editor (or via `supabase db push`).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with auth.users. Holds role + status.
-- ---------------------------------------------------------------------------
create type user_role as enum ('candidate', 'employer', 'recruiter', 'admin');
create type user_status as enum ('active', 'suspended', 'pending');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'candidate',
  status user_status not null default 'active',
  full_name text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
-- The role is read from the signup metadata (see app/(auth)/*/actions.ts).
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'candidate'),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- candidates
-- ---------------------------------------------------------------------------
create table public.candidates (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  summary text,
  location text,
  skills text[] default '{}',
  salary_expectation text,
  resume_url text,
  resume_filename text,
  discoverable boolean not null default true,
  marketing_consent boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.candidate_experience (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(user_id) on delete cascade,
  company text not null,
  title text not null,
  start_date date,
  end_date date,
  summary text
);

create table public.candidate_education (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(user_id) on delete cascade,
  institution text not null,
  qualification text,
  field text,
  start_date date,
  end_date date
);

-- ---------------------------------------------------------------------------
-- companies + company_users (an employer account can have teammates)
-- ---------------------------------------------------------------------------
create type verification_status as enum ('pending', 'verified', 'rejected', 'needs_review');
create type company_role as enum ('owner', 'admin', 'recruiter', 'viewer');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  size text,
  locations text[] default '{}',
  description text,
  logo_url text,
  verification_status verification_status not null default 'pending',
  verification_notes text,
  created_at timestamptz not null default now()
);

create table public.company_users (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role company_role not null default 'owner',
  status text not null default 'active',
  primary key (company_id, user_id)
);

-- ---------------------------------------------------------------------------
-- jobs + screening_questions
-- ---------------------------------------------------------------------------
create type job_status as enum ('draft', 'published', 'paused', 'closed', 'expired');
create type work_mode as enum ('On-site', 'Hybrid', 'Remote');
create type job_type as enum ('Full-time', 'Internship', 'Contract');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  owner_id uuid not null references public.profiles(id),
  title text not null,
  description text not null,
  requirements text[] default '{}',
  salary_min integer,
  salary_max integer,
  location text,
  mode work_mode not null default 'On-site',
  type job_type not null default 'Full-time',
  experience_min integer default 0,
  fresher_eligible boolean not null default false,
  status job_status not null default 'draft',
  expires_at date,
  created_at timestamptz not null default now()
);

create table public.screening_questions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  question text not null,
  required boolean not null default true,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- applications + notes + saved jobs
-- ---------------------------------------------------------------------------
create type application_stage as enum ('applied', 'shortlisted', 'interview', 'offer', 'hired', 'rejected');

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(user_id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  stage application_stage not null default 'applied',
  answers jsonb default '{}',
  source text default 'grow_biz_jobs',
  created_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

create table public.application_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table public.saved_jobs (
  candidate_id uuid not null references public.candidates(user_id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (candidate_id, job_id)
);

-- ---------------------------------------------------------------------------
-- memberships (simplified entitlement model for Phase 1)
-- ---------------------------------------------------------------------------
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan text not null default 'free',
  billing text not null default 'trial',
  active_jobs_limit integer not null default 1,
  candidate_unlocks_limit integer not null default 10,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ends_at timestamptz
);

create table public.candidate_unlocks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  candidate_id uuid not null references public.candidates(user_id) on delete cascade,
  unlocked_by uuid not null references public.profiles(id),
  reason text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- activities (audit log) + reports (abuse / job safety)
-- ---------------------------------------------------------------------------
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id),
  target_type text not null,
  target_id uuid,
  category text not null,
  description text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Storage bucket for resumes (private — accessed via signed URLs only)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;
