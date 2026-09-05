-- ============================================================================
-- Grow Biz Jobs — Rate Limiting
-- Your brief's security section calls for this explicitly ("Rate limits...
-- job/report abuse flows") and nothing enforced it before now — signup,
-- job applications, job posting, and candidate unlocks had no protection
-- beyond Supabase Auth's own built-in email send limit.
--
-- Implemented as a database primitive rather than an external service
-- (Redis/Upstash) so it works identically regardless of which code path
-- triggers the action — a client-side insert, a server action, or anything
-- added later — without needing a new account/API key for this MVP.
-- Run this AFTER 0001-0014.
-- ============================================================================

create table public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  created_at timestamptz not null default now()
);

create index idx_rate_limit_events_identifier_created
  on public.rate_limit_events(identifier, created_at);

-- No RLS needed: this table is never queried directly by clients, only
-- through check_rate_limit() below (security definer, callable by anyone,
-- but the function only ever returns a boolean — never rows).

-- ---------------------------------------------------------------------------
-- Atomically checks whether `p_identifier` has stayed under `p_max_events`
-- within the last `p_window_seconds`, and records this attempt if so.
-- Returns true = allowed (and now recorded), false = over the limit.
-- Old events for the identifier are cleaned up lazily on each call, so no
-- separate cron job is needed to keep this table from growing unbounded.
-- ---------------------------------------------------------------------------
create or replace function public.check_rate_limit(
  p_identifier text,
  p_max_events integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  delete from public.rate_limit_events
  where identifier = p_identifier
    and created_at < now() - (p_window_seconds || ' seconds')::interval;

  select count(*) into v_count
  from public.rate_limit_events
  where identifier = p_identifier
    and created_at >= now() - (p_window_seconds || ' seconds')::interval;

  if v_count >= p_max_events then
    return false;
  end if;

  insert into public.rate_limit_events (identifier) values (p_identifier);
  return true;
end;
$$;

grant execute on function public.check_rate_limit to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Applications specifically get a trigger-level guard (not just an app-layer
-- check) so the limit holds regardless of which code path inserts a row —
-- currently the client-side apply flow in ApplyPanel.tsx, but this way it
-- can't be bypassed by anything added later either.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_application_rate_limit()
returns trigger
language plpgsql
security definer
as $$
begin
  if not public.check_rate_limit('apply:' || new.candidate_id::text, 20, 3600) then
    raise exception 'Too many applications submitted recently. Please try again later.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger enforce_application_rate_limit
  before insert on public.applications
  for each row execute procedure public.enforce_application_rate_limit();
