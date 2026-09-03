-- ============================================================================
-- Grow Biz Jobs — Fix New User Trigger
-- The original handle_new_user() in 0001_schema.sql cast to the bare type
-- name `user_role` without schema-qualifying it. That resolved fine when
-- tested ad-hoc in the SQL Editor (whose session search_path includes
-- public by default), but failed when the trigger actually fired from the
-- auth system's own execution context — causing every signup to fail with
-- Supabase's generic "Database error saving new user".
-- Fix: fully qualify the type and pin the function's search_path explicitly,
-- rather than relying on whatever search_path the caller happens to have.
-- Run this AFTER 0001-0007.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'candidate'::public.user_role),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;
