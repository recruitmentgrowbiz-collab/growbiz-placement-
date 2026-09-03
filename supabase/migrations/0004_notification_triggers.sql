-- ============================================================================
-- Grow Biz Jobs — Notification Triggers
-- Populates the `notifications` table automatically on the events that matter:
-- new applicant, application stage change, employer verification decision,
-- and placement recorded. This replaces manual notification-writing scattered
-- across every action file with one source of truth at the database layer.
-- Run this AFTER 0001, 0002, 0003.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- New applicant -> notify the job owner
-- ---------------------------------------------------------------------------
create function public.notify_new_application()
returns trigger as $$
begin
  insert into public.notifications (user_id, template, payload)
  select j.owner_id, 'new_applicant',
    jsonb_build_object('job_id', j.id, 'job_title', j.title, 'application_id', new.id)
  from public.jobs j
  where j.id = new.job_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_created
  after insert on public.applications
  for each row execute procedure public.notify_new_application();

-- ---------------------------------------------------------------------------
-- Application stage changes -> notify the candidate
-- ---------------------------------------------------------------------------
create function public.notify_stage_change()
returns trigger as $$
declare
  v_job_title text;
begin
  if new.stage is distinct from old.stage then
    select title into v_job_title from public.jobs where id = new.job_id;
    insert into public.notifications (user_id, template, payload)
    values (
      new.candidate_id,
      'application_stage_changed',
      jsonb_build_object('job_id', new.job_id, 'job_title', v_job_title, 'stage', new.stage)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_stage_changed
  after update on public.applications
  for each row execute procedure public.notify_stage_change();

-- ---------------------------------------------------------------------------
-- Verification decision -> notify the company owner
-- ---------------------------------------------------------------------------
create function public.notify_verification_decision()
returns trigger as $$
begin
  if new.verification_status is distinct from old.verification_status then
    insert into public.notifications (user_id, template, payload)
    select cu.user_id, 'verification_decision',
      jsonb_build_object('company_id', new.id, 'company_name', new.name, 'status', new.verification_status)
    from public.company_users cu
    where cu.company_id = new.id and cu.role = 'owner';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_company_verification_changed
  after update on public.companies
  for each row execute procedure public.notify_verification_decision();

-- ---------------------------------------------------------------------------
-- Placement recorded -> notify the candidate and the employer owner
-- ---------------------------------------------------------------------------
create function public.notify_placement()
returns trigger as $$
declare
  v_job_title text;
  v_company_name text;
begin
  select title into v_job_title from public.jobs where id = new.job_id;
  select name into v_company_name from public.companies where id = new.company_id;

  insert into public.notifications (user_id, template, payload)
  values (
    new.candidate_id,
    'placement_recorded',
    jsonb_build_object('job_title', v_job_title, 'company_name', v_company_name)
  );

  insert into public.notifications (user_id, template, payload)
  select cu.user_id, 'placement_recorded_employer',
    jsonb_build_object('job_title', v_job_title)
  from public.company_users cu
  where cu.company_id = new.company_id and cu.role = 'owner';

  return new;
end;
$$ language plpgsql security definer;

create trigger on_placement_created
  after insert on public.placements
  for each row execute procedure public.notify_placement();
