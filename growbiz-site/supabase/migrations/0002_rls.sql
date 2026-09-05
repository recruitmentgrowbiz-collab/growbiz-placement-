-- ============================================================================
-- Grow Biz Jobs — Row Level Security
-- Enforces: "Employer A cannot access Employer B jobs, applicants, notes or
-- unlocked candidates" (Master Brief, Section 26 — QA & Acceptance Criteria)
-- Run this AFTER 0001_schema.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

create function public.is_company_member(target_company_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.company_users
    where company_id = target_company_id and user_id = auth.uid()
  );
$$ language sql security definer stable;

create function public.company_is_verified(target_company_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.companies
    where id = target_company_id and verification_status = 'verified'
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.candidates enable row level security;
alter table public.candidate_experience enable row level security;
alter table public.candidate_education enable row level security;
alter table public.companies enable row level security;
alter table public.company_users enable row level security;
alter table public.jobs enable row level security;
alter table public.screening_questions enable row level security;
alter table public.applications enable row level security;
alter table public.application_notes enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.memberships enable row level security;
alter table public.candidate_unlocks enable row level security;
alter table public.activities enable row level security;
alter table public.reports enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- candidates — owner has full access; verified employers can search
-- discoverable profiles; admin sees all.
-- ---------------------------------------------------------------------------
create policy "candidates_select" on public.candidates
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or (discoverable = true and exists (
      select 1 from public.company_users cu
      join public.companies c on c.id = cu.company_id
      where cu.user_id = auth.uid() and c.verification_status = 'verified'
    ))
  );
create policy "candidates_insert_own" on public.candidates
  for insert with check (user_id = auth.uid());
create policy "candidates_update_own" on public.candidates
  for update using (user_id = auth.uid());
create policy "candidates_delete_own" on public.candidates
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- candidate_experience / candidate_education — owner + admin only
-- ---------------------------------------------------------------------------
create policy "experience_owner" on public.candidate_experience
  for all using (candidate_id = auth.uid() or public.is_admin())
  with check (candidate_id = auth.uid());
create policy "education_owner" on public.candidate_education
  for all using (candidate_id = auth.uid() or public.is_admin())
  with check (candidate_id = auth.uid());

-- ---------------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------------
create policy "companies_select" on public.companies
  for select using (
    verification_status = 'verified'
    or public.is_company_member(id)
    or public.is_admin()
  );
create policy "companies_insert_authenticated" on public.companies
  for insert with check (auth.uid() is not null);
create policy "companies_update_members" on public.companies
  for update using (public.is_company_member(id) or public.is_admin());

-- ---------------------------------------------------------------------------
-- company_users
-- ---------------------------------------------------------------------------
create policy "company_users_select" on public.company_users
  for select using (
    user_id = auth.uid()
    or public.is_company_member(company_id)
    or public.is_admin()
  );
create policy "company_users_insert" on public.company_users
  for insert with check (
    user_id = auth.uid()
    or public.is_company_member(company_id)
    or public.is_admin()
  );
create policy "company_users_update" on public.company_users
  for update using (public.is_company_member(company_id) or public.is_admin());
create policy "company_users_delete" on public.company_users
  for delete using (public.is_company_member(company_id) or public.is_admin());

-- ---------------------------------------------------------------------------
-- jobs — public sees published only; company members see all their own
-- ---------------------------------------------------------------------------
create policy "jobs_select" on public.jobs
  for select using (
    status = 'published'
    or public.is_company_member(company_id)
    or public.is_admin()
  );
create policy "jobs_insert_members" on public.jobs
  for insert with check (public.is_company_member(company_id));
create policy "jobs_update_members" on public.jobs
  for update using (public.is_company_member(company_id) or public.is_admin());
create policy "jobs_delete_members" on public.jobs
  for delete using (public.is_company_member(company_id) or public.is_admin());

-- ---------------------------------------------------------------------------
-- screening_questions — follow parent job's visibility
-- ---------------------------------------------------------------------------
create policy "screening_questions_select" on public.screening_questions
  for select using (
    exists (
      select 1 from public.jobs j
      where j.id = job_id
      and (j.status = 'published' or public.is_company_member(j.company_id) or public.is_admin())
    )
  );
create policy "screening_questions_write" on public.screening_questions
  for all using (
    exists (
      select 1 from public.jobs j
      where j.id = job_id and (public.is_company_member(j.company_id) or public.is_admin())
    )
  );

-- ---------------------------------------------------------------------------
-- applications — candidate sees own; employer sees only their job's applicants
-- ---------------------------------------------------------------------------
create policy "applications_select" on public.applications
  for select using (
    candidate_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id)
    )
  );
create policy "applications_insert_own" on public.applications
  for insert with check (candidate_id = auth.uid());
create policy "applications_update" on public.applications
  for update using (
    public.is_admin()
    or exists (
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id)
    )
  );

-- ---------------------------------------------------------------------------
-- application_notes — internal to the hiring company only
-- ---------------------------------------------------------------------------
create policy "application_notes_rw" on public.application_notes
  for all using (
    public.is_admin()
    or exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id and public.is_company_member(j.company_id)
    )
  );

-- ---------------------------------------------------------------------------
-- saved_jobs — candidate's own list only
-- ---------------------------------------------------------------------------
create policy "saved_jobs_owner" on public.saved_jobs
  for all using (candidate_id = auth.uid())
  with check (candidate_id = auth.uid());

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------
create policy "memberships_select" on public.memberships
  for select using (public.is_company_member(company_id) or public.is_admin());
create policy "memberships_write" on public.memberships
  for all using (public.is_company_member(company_id) or public.is_admin());

-- ---------------------------------------------------------------------------
-- candidate_unlocks — company can log/view its own unlocks only
-- ---------------------------------------------------------------------------
create policy "unlocks_select" on public.candidate_unlocks
  for select using (public.is_company_member(company_id) or public.is_admin());
create policy "unlocks_insert" on public.candidate_unlocks
  for insert with check (public.is_company_member(company_id));

-- ---------------------------------------------------------------------------
-- activities — write your own actions; only admin can browse the log
-- ---------------------------------------------------------------------------
create policy "activities_insert_self" on public.activities
  for insert with check (actor_id = auth.uid());
create policy "activities_select_admin" on public.activities
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- reports — anyone can file; reporter + admin can view
-- ---------------------------------------------------------------------------
create policy "reports_insert" on public.reports
  for insert with check (reporter_id = auth.uid());
create policy "reports_select" on public.reports
  for select using (reporter_id = auth.uid() or public.is_admin());
create policy "reports_update_admin" on public.reports
  for update using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: resumes bucket — candidate can manage their own folder
-- (path convention: resumes/{user_id}/filename.pdf)
-- ---------------------------------------------------------------------------
create policy "resume_owner_all" on storage.objects
  for all using (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "resume_employer_read" on storage.objects
  for select using (
    bucket_id = 'resumes' and exists (
      select 1 from public.candidates c
      join public.company_users cu on cu.user_id = auth.uid()
      join public.companies co on co.id = cu.company_id
      where c.user_id::text = (storage.foldername(name))[1]
      and c.discoverable = true
      and co.verification_status = 'verified'
    )
  );
