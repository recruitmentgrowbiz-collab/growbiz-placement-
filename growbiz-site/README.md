# Grow Biz Jobs — Phase 1-3 MVP

Public website + candidate portal + employer portal + admin moderation + recruiter workspace for
**Grow Biz Recruitment & Placement**, built from `Website & Job Portal Developer Master Brief v1.0`
and the supporting operating docs (Branding, Website Content & Page Copy, Finance & Pricing).

Real backend: **Supabase (Postgres + Auth + Storage)**, per the brief's tech recommendation.

## What's built

**Public site** — homepage, job search/detail, employer landing, all 11 recruitment services,
pricing, about, campus, career resources, FAQ, contact, and company profile pages
(`/companies/[id]`). Job listings blend real employer-posted jobs (from the database) with
illustrative demo jobs, so the site never looks empty on a fresh install. JobPosting structured
data (schema.org) on every job detail page for search visibility. Dynamic `sitemap.xml` and
`robots.txt`.

**Auth** — candidate signup, employer signup (creates a company + free-plan membership together),
unified login that routes by role, session-aware header with a notification bell, protected
routes via middleware.

**Candidate portal** (`/candidate/dashboard`) — editable profile, resume upload to private
storage, live profile-completeness score, applications list with status, saved jobs.

**Employer portal** (`/employer/dashboard`) — company profile (with logo upload) + verification
status + verification document upload, job posting (enforces the plan's active-jobs limit),
applicant pipeline with stage changes, interview scheduling, internal notes on applicants,
pause/republish/close controls, candidate database search (verification-gated, unlock-quota
tracked, resume access gated by real unlock records — see Security below), self-serve plan
switching with real PayU checkout.

**Admin** (`/admin`) — employer verification queue (approve/reject/needs review, with submitted
documents visible before deciding), job moderation, user role management (`/admin/users`,
promote to recruiter/admin from the UI), analytics dashboard (`/admin/analytics`, live counts +
managed-recruitment fee totals), and a manual maintenance runner for job/membership expiry.

**Recruiter workspace** (`/recruiter`) — cross-company requisition list (every job on the
platform, not just one employer's), applicant pipeline per job with the same interview
scheduling and internal notes as the employer side, and placement tracking with fee calculation
(annual CTC × fee % → amount) and fee-status updates (pending/invoiced/paid).

**Notifications** — database triggers log four event types (new applicant, application stage
change, verification decision, placement recorded) to an in-app `notifications` table (bell icon
in the header), plus real email (Resend) and SMS (Twilio) dispatch for the same events. Both
external channels are strictly best-effort — a missing API key, disabled preference, or send
failure never breaks the action that triggered it; in-app is the only channel that's guaranteed.
Users control email/SMS independently at `/settings`, along with a phone number.

**Payments** — real PayU checkout for paid plan upgrades (Starter/Growth/Pro) and Career Plus.
PayU works differently from most JS-modal payment gateways: it's redirect-based — the browser
navigates away to PayU's hosted payment page, then PayU redirects back to a success or failure
callback URL with its own SHA-512 response hash. That hash is what actually confirms a payment
happened; nothing is trusted just because the browser landed back on a "success" URL, since
someone could POST directly at that URL without ever paying. The hash logic itself
(`lib/payu.ts`) is built from PayU's documented field sequence as an explicit array-join rather
than a hand-counted pipe-delimited string, specifically because a single miscounted separator
would make every payment silently unverifiable. Verification is idempotent — PayU can redirect
to the success callback more than once for the same transaction without double-extending a
membership. The Free plan switches instantly since there's nothing to charge.

**Account data rights** — self-service data export (`/settings`, downloads a JSON file of
everything tied to your account) and self-service account deletion (cascades through every
table via `on delete cascade` back to `auth.users`; the deletion request itself is recorded in
`account_deletion_requests` first, deliberately without a foreign key, so the audit trail
survives the user it's about).

**Job and membership expiry** — `jobs.expires_at` and `memberships.ends_at` existed from the
start but nothing ever enforced either. Fixed with: a defensive RLS policy so expired jobs
disappear from public search immediately (not just after a batch job runs), an
`expire_stale_jobs()` function for the status-column cleanup, a `downgrade_expired_memberships()`
function that resets lapsed paid plans to free-tier limits, and job-posting/candidate-unlock
checks that compute *effective* entitlements rather than trusting a possibly-stale stored limit.
Three ways to run the cleanup functions: the manual "Run now" button on `/admin/analytics`
(always available, zero config), `pg_cron` if your Supabase plan supports it, or the
`/api/cron/maintenance` endpoint for any external scheduler (Vercel Cron config included).

**Rate limiting** — a database-level primitive (`check_rate_limit()`), not an external
service, so it works identically regardless of which code path triggers an action. Signup:
5/hour per IP. Login: 8 attempts per 15 minutes per email (protects one account from credential
stuffing even across many IPs). Job applications: 20/hour per candidate, enforced by a database
trigger so it holds even though applications currently insert from the client. Job posting:
10/hour per user, independent of — and in addition to — the plan's monthly entitlement. Candidate
unlocks: 20/minute per user, closing the "a monthly quota isn't a rate limit" gap (previously
nothing stopped burning through a whole month's allowance in seconds).

**Pagination** — `/jobs` and the employer candidate search previously loaded every matching
row in one query, with search filtering only what was already loaded client-side (meaning a
search could silently miss real matches once there was more data than fit in memory). Both now
query and filter server-side: `/jobs` uses real page-based pagination (24/page) with search
terms hitting the trigram-indexed columns directly; candidate search uses a "Load more" pattern
since it needs to preserve unlock state across loads. Demo job listings only appear on the
default, unfiltered first page of `/jobs` — once you search, filter, or page forward, only real
results show.

**Notification delivery tracking** — every email/SMS attempt now writes a row to
`notification_deliveries` (sent, failed, or skipped — and why), instead of just logging failures
to the server console where nobody would ever see them. Two webhooks correlate real outcomes back
to those rows: Resend confirms delivered/bounced/complained, Twilio confirms delivered/failed via
a status callback URL set automatically on every SMS send. `/admin/notifications` shows the last
100 attempts with status and error detail — "sent" is now a checkable claim, not an assumption.

**Phone/OTP login and signup** (candidates only, per design) — a candidate can either verify a
phone number in `/settings` to use it for logging in later (`shouldCreateUser: false`, so an
unrecognized number fails cleanly rather than silently creating an account), or create a brand
new account with just a phone number and no email at all, from a toggle on
`/candidate/signup` (`shouldCreateUser: true`). The signup path applies the same lesson learned
from the email-signup session-propagation bug: the post-verification database write (creating
the candidate profile) happens via a *separate* API request after `verifyOtp()`'s session has
fully committed, rather than continuing inline in the same call — the exact same-request timing
issue that broke employer signup earlier this session was avoided here by construction, not
discovered by re-debugging it. Also guards against a phone number already belonging to an
employer/recruiter/admin account, so signup can't silently attach a candidate profile to the
wrong account type.

**Contact form and job reports now actually work** — both were previously UI-only: the
contact form had no `name` attributes on any input (so even a naive wire-up attempt would have
silently failed), and "Report this job" was a static button with no handler at all, despite the
`reports` table and its RLS existing since early in this session. Fixed the RLS policy too — it
required `reporter_id = auth.uid()`, which fails for an anonymous submitter even with a null
reporter_id, since `NULL = NULL` isn't true in Postgres. The contact form now works for anyone,
logged in or not (rate-limited by IP); job reports require an account (rate-limited per user) and
show up in `/admin/jobs` with full detail and a resolve action — previously only a count banner
existed, even though the underlying `resolveReport` action had been sitting unused.

**Company logos now display** on job cards and public company profile pages — the upload has
worked since a much earlier round, but nothing ever rendered the result. Falls back to a building
icon automatically for companies (and all demo listings) without one.

**Career Plus payments** — the optional candidate premium tier (₹1,999/year) had a full
marketing page and price shown on `/pricing` and `/career-resources` since early in this
session, but no way to actually buy it — only employer plan upgrades were ever wired to a
payment gateway. Reuses the exact same trust pattern as employer plans (redirect to PayU →
hash-verified confirmation → entitlement change) rather than a separate, less-trusted flow.
Required extending the `payments` table itself, which was built employer-only
from the start (`company_id` was `not null`) — now supports either a company or a candidate
owner, enforced by a check constraint. Also caught and fixed two RLS policies
(`payments_select`/`payments_update`) that would have silently blocked candidates from ever
seeing or completing their own payment, since they only ever checked company membership.
Expiry (1 year) is handled by the same maintenance runner as job/membership expiry — one manual
button and one cron path, not a fourth separate mechanism.

**Password reset** — this was completely missing until now; anyone who forgot their password
had no way to recover their account. `/forgot-password` sends a reset link (same
non-enumeration handling as signup — a nonexistent email gets the same "check your email"
message as a real one, so the response never confirms which emails have accounts).
`/reset-password` is where that link lands; Supabase's client automatically establishes a
temporary recovery session from the URL, and the page explicitly waits to confirm that session
exists before enabling the form, rather than letting someone submit against no session at all.

**AI features (Phase 4)** — job description assist for employers ("Improve with AI" on the job
posting form), applicant fit summaries for employers/recruiters, and resume feedback for
candidates (gated behind Career Plus — this is the benefit that's been advertised on the pricing
page since early in this session with nothing behind it until now). Every AI output is
explicitly a suggestion the person reviews and can edit — nothing is auto-applied or auto-saved,
and applicant summaries deliberately produce a short qualitative note rather than a score,
per your brief's own AI guardrails ("assistive only," "never auto-reject based on an opaque AI
score"). Every generation is logged to `ai_generations` with input and output stored separately,
satisfying the "log model-assisted actions" guardrail. Fails gracefully with a clear message if
`OPENAI_API_KEY` isn't configured — the rest of the app is unaffected either way.

**Dedicated search (Phase 5)** — optional Meilisearch integration for job search, chosen over
Algolia/Typesense specifically because it's open-source and self-hostable if you outgrow a free
cloud tier. Deliberately additive: only takes over for free-text search queries (where
typo-tolerance and relevance ranking actually add value over the existing Postgres trigram
search), and falls back to Postgres automatically — tested by pointing at an unreachable host
and confirming `/jobs?q=...` still returns results rather than an error. Jobs are indexed on
publish and removed from the index on pause/close/moderation, so a job you can no longer see in
the app never lingers as a stale, unclickable search result.

## Security highlights

Full Postgres Row Level Security throughout. Employer A cannot query Employer B's jobs,
applicants or notes at the database level — not just hidden in the UI (`0002_rls.sql`).
Recruiters get scoped cross-company access via a separate policy set, not by being added as a
member of every company.

Candidate resume/salary access follows *applying is consent, browsing isn't*: an employer can see
a candidate's full profile (including resume) only if that candidate applied to one of their
jobs, or if the employer unlocked them through search — never just by being a verified employer.
Search results show teaser fields only (headline, location, skills) via a `search_candidates()`
function. Enforced at both the table level (`0007_candidate_visibility.sql`) and the storage
level (`0006_tighten_resume_access.sql`).

Admin analytics is a database function that checks admin status itself
(`get_admin_analytics()`), not a plain view — a plain view granted broadly would let any
logged-in candidate query revenue figures directly through the client SDK.

Payment confirmation requires a verified HMAC signature server-side; the webhook uses a
service-role client (`lib/supabase/admin.ts`) specifically because it has no user session to
rely on. The Resend and Twilio delivery webhooks use the same pattern — Resend's Svix-format
signature and Twilio's own HMAC scheme are both verified before any database write happens.

## What's NOT built yet

- PayU subscription/auto-renewal (this implements one-time payments per upgrade, not recurring
  billing)
- Your actual approved logo (a placeholder mark is used throughout — `components/Logo.tsx`)

## Setup

### 1. Create a Supabase project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → New Project.

### 2. Run the migrations

In your project's SQL Editor, run these 22 files in order — one at a time, confirming each
succeeds before the next:

1. `0001_schema.sql` — core tables
2. `0002_rls.sql` — row level security
3. `0003_recruiter_workspace.sql` — interviews, placements, notifications, recruiter access
4. `0004_notification_triggers.sql` — auto-notify on key events
5. `0005_payments.sql` — payment order tracking
6. `0006_tighten_resume_access.sql` — resume file access, storage-level
7. `0007_candidate_visibility.sql` — candidate table access, table-level
8. `0008_fix_new_user_trigger.sql` — fixes a signup-breaking bug in the new-user trigger
9. `0009_notification_preferences.sql` — phone numbers, preferences, admin role management
10. `0010_logos_interviews_analytics.sql` — company logo storage, admin analytics function
11. `0011_expiry_and_deletion.sql` — membership/job expiry enforcement, account deletion
12. `0012_indexes.sql` — performance indexes
13. `0013_data_integrity.sql` — CHECK constraints
14. `0014_verification_documents.sql` — verification document uploads, recruiter notes access
15. `0015_rate_limiting.sql` — rate limiting primitive + application-insert trigger
16. `0016_candidate_search_pagination.sql` — adds limit/offset to search_candidates()
17. `0017_notification_delivery_tracking.sql` — delivery log table
18. `0018_anonymous_reports.sql` — allows anonymous contact-form/report submissions
19. `0019_career_plus_payments.sql` — candidate payments (Career Plus), extends payments table + analytics
20. `0020_company_visibility_on_jobs.sql` — fixes company names being hidden on unverified employers' public job listings
21. `0021_ai_features.sql` — AI generation audit log (Phase 4)
22. `0022_switch_to_payu.sql` — renames payments columns from Razorpay-specific to provider-generic

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your project's URL + anon/publishable key from Settings → API in your Supabase dashboard.

### 4. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 5. Create your first admin or recruiter user

New signups default to the `candidate` or `employer` role. Admin (`/admin`) and recruiter
(`/recruiter`) accounts aren't self-service by design — sign up normally, then in the Supabase
SQL Editor run:

```sql
update public.profiles set role = 'admin' where id = 'the-user-uuid-from-auth.users';
-- or role = 'recruiter'
```

Once you have one admin, you can promote everyone else from `/admin/users` instead of SQL.

### 6. Turn off email confirmation (for local testing)

By default, Supabase requires email confirmation before login, and their shared free email
service has a very low send limit. For local testing: Authentication → Providers → Email → turn
off "Confirm email" → **Save**. (Double-check it actually saved — this setting not saving is a
common gotcha.) Configure a real SMTP provider before going live.

### 7. (Optional) Connect PayU for real plan payments

Without this, the Free plan still switches instantly, but paid plans (Starter/Growth/Pro) and
Career Plus won't have anything to check out with.

1. Create a [PayU](https://payu.in) account. Their test/UAT environment (`test.payu.in`) works
   without full business KYC — that's what this integration uses by default.
2. Find your **Merchant Key** and **Salt** (PayU's dashboard, not "API Key" — different naming
   from most other gateways) and add them as `PAYU_MERCHANT_KEY` and `PAYU_SALT` in `.env.local`.
3. Leave `PAYU_ENV=test` for testing — this uses `test.payu.in` with PayU's test cards, no real
   money moves. Only change to `PAYU_ENV=production` once you're ready to go live with
   `secure.payu.in` and your real merchant credentials.
4. Get your Supabase service_role key (Settings → API) and add it as `SUPABASE_SERVICE_ROLE_KEY`
   — server-only, never expose this to the browser. Needed by the success/failure callback
   routes to write to the database without a user session.
5. Unlike some gateways, PayU's success/failure callbacks (`/api/payu/success`,
   `/api/payu/failure`) work fine on `localhost` for testing — PayU redirects the *user's own
   browser* there after payment, not a separate server-to-server call, so no public URL or
   tunnel is needed to test the full flow locally.

### 8. (Optional) Connect Resend for real emails

Without this, notifications stay in-app only (the bell icon).

1. Create a [Resend](https://resend.com) account and verify a sending domain.
2. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to `.env.local`.
3. Also needs `SUPABASE_SERVICE_ROLE_KEY` (step 7) to look up recipient email addresses.
4. (Optional, for real delivery/bounce tracking) Resend dashboard → Webhooks → add one pointing
   to `https://your-domain.com/api/webhooks/resend`, subscribe to `email.sent`, `email.delivered`,
   `email.bounced`, and `email.complained`, then add its signing secret as
   `RESEND_WEBHOOK_SECRET`. Without this, sends still work — `/admin/notifications` just won't
   move past "sent" to "delivered"/"bounced".

### 9. (Optional) Connect Twilio for real SMS

Without this, the SMS toggle in `/settings` just won't do anything.

1. Create a [Twilio](https://twilio.com) account and get a phone number.
2. Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` to `.env.local`.
3. Users need a phone number saved in `/settings` with SMS notifications turned on — both are
   off by default.
4. Delivery/failure tracking works automatically once `NEXT_PUBLIC_APP_URL` is set correctly —
   no separate Twilio dashboard webhook setup needed, the status callback URL is sent with every
   message.

### 10. (Optional) Enable phone login for candidates

Without this, the "Phone code" tab on the login page will show errors when used — password
login is unaffected either way.

1. In Supabase: Authentication → Providers → Phone → enable it.
2. Choose an SMS provider for Supabase to send OTPs through (Twilio is the natural choice since
   you likely already have an account from step 9) and enter those credentials here — this is a
   separate configuration from your app's own `TWILIO_*` env vars, since Supabase Auth sends
   OTPs directly, not through your app's code.
3. No code/env changes needed beyond this — candidates verify their number at `/settings`, then
   the "Phone code" login tab works.

### 11. (Optional) Automate job/membership expiry

Without this, expiry still works — the "Run now" button on `/admin/analytics` handles it
manually, with zero config.

**For scheduled automation, pick one:**

- **pg_cron** (if your Supabase plan supports it): Database → Extensions → enable "pg_cron", then
  in the SQL Editor:
  ```sql
  select cron.schedule('expire-stale-jobs', '0 2 * * *', 'select public.expire_stale_jobs()');
  select cron.schedule('downgrade-expired-memberships', '0 3 * * *', 'select public.downgrade_expired_memberships()');
  select cron.schedule('expire-career-plus', '0 4 * * *', 'select public.expire_career_plus()');
  ```
- **Any external scheduler** (works regardless of Supabase plan): add a random string as
  `CRON_SECRET` in `.env.local` and your hosting provider's environment variables. On Vercel,
  `vercel.json` in the repo root wires this up automatically. Anywhere else, point a scheduler
  (cron-job.org, GitHub Actions, etc.) at
  `https://your-domain.com/api/cron/maintenance?secret=YOUR_CRON_SECRET` once a day.

### 12. (Optional) Connect OpenAI for AI features

Without this, "Improve with AI," "AI fit summary," and resume feedback show a clear
"not configured" message — nothing else in the app is affected.

1. Create an [OpenAI](https://platform.openai.com) account and generate an API key.
2. Add `OPENAI_API_KEY` to `.env.local`.
3. That's it — no other setup. Uses `gpt-4o-mini`; change the model in `lib/ai.ts` if you want a
   different one.

### 13. (Optional) Connect Meilisearch for dedicated job search

Without this, job search still works — it just uses PostgreSQL's trigram search (see
`0012_indexes.sql`) instead of a dedicated search engine. Only worth setting up once you have
enough real job postings that typo-tolerance and relevance ranking start to matter.

1. Create a free instance at [cloud.meilisearch.com](https://cloud.meilisearch.com), or self-host.
2. Add `MEILISEARCH_HOST` and `MEILISEARCH_API_KEY` (an admin/write key) to `.env.local`.
3. **Required one-time step** — create the index and mark which fields can be filtered/sorted,
   or filtered searches will fail:
   ```bash
   curl -X POST 'YOUR_MEILISEARCH_HOST/indexes' \
     -H 'Authorization: Bearer YOUR_API_KEY' \
     -H 'Content-Type: application/json' \
     --data '{"uid": "jobs", "primaryKey": "id"}'

   curl -X PATCH 'YOUR_MEILISEARCH_HOST/indexes/jobs/settings/filterable-attributes' \
     -H 'Authorization: Bearer YOUR_API_KEY' \
     -H 'Content-Type: application/json' \
     --data '["mode", "fresher_eligible", "status"]'
   ```
4. Jobs index automatically going forward as they're published, paused, closed, or moderated —
   nothing already-posted backfills into the index until it's next updated. To backfill existing
   jobs, re-save each one, or write a one-off script that loops through published jobs and calls
   `indexJob()` from `lib/search/meilisearch.ts`.

## Deploying

Standard Next.js 14 App Router project — deploy to Vercel, Netlify, or any Node host. Set the
same environment variables in your hosting provider's dashboard.

```bash
npm run build
npm run start
```

## Project structure

```
app/
  page.tsx                       Homepage
  jobs/                          Public job search + detail (DB + demo jobs merged)
  companies/[id]/                Public company profile pages
  employers/ recruitment-services/ pricing/ about/ campus/ career-resources/ faq/ contact/
  privacy/ terms/ report/        Legal and trust pages
  signup/ login/ candidate/signup/ employer/signup/ settings/
  candidate/dashboard/           Candidate portal
  employer/dashboard/            Employer portal (jobs, candidates, plan, company)
  admin/                         Verification, moderation, users, analytics
  recruiter/                     Cross-company requisitions + placement tracking
  api/payu/                      Checkout initiation, success/failure callbacks (hash-verified)
  api/notify/                    New-applicant email/SMS trigger (client-side apply flow)
  api/webhooks/resend/           Email delivery/bounce confirmation
  api/webhooks/twilio/           SMS delivery/failure confirmation
  api/ai/                        Job description assist, resume feedback, applicant summaries
  api/auth/complete-phone-signup/ Post-verification setup for phone-first candidate signup
  api/account/export/            Data export endpoint
  api/cron/maintenance/          External-scheduler-compatible expiry endpoint
components/                      UI primitives, forms, dashboard widgets
lib/data.ts                      Demo/illustrative content (jobs, services, pricing, FAQs)
lib/seo.ts                       JobPosting structured data builder
lib/email.ts, sms.ts             Resend/Twilio dispatch (fail-safe, preference-aware)
lib/payu.ts                      Hash generation + verification, plan pricing/entitlements
lib/rate-limit.ts                Rate limiting helper (IP resolution + RPC wrapper)
lib/ai.ts                        OpenAI wrapper (Phase 4 — job description, resume feedback, fit summaries)
lib/search/meilisearch.ts        Optional dedicated search (Phase 5), falls back to Postgres
lib/supabase/
  client.ts, server.ts            Supabase client factories (browser / server)
  admin.ts                        Service-role client (webhooks, data export lookups only)
  types.ts                        TypeScript types matching the DB schema
  queries.ts, mappers.ts          Public-page data fetching + display mapping
  actions.ts                      Auth server actions
  employer-actions.ts             Job posting, pipeline, candidates, plan, company actions
  admin-actions.ts                Verification, moderation, roles, maintenance actions
  recruiter-actions.ts            Cross-company pipeline + placement actions
  notes-actions.ts                Shared application-notes actions (employer + recruiter)
  notification-actions.ts         Preferences, account deletion
middleware.ts                     Session refresh + protects dashboard/settings routes
supabase/migrations/              22 files, run in order — see Setup step 2
vercel.json                       Optional: wires up daily maintenance cron on Vercel
```

## Next steps

1. Add PayU Subscriptions/recurring billing instead of one-time payments per upgrade
2. Swap the placeholder logo mark (`components/Logo.tsx`) for your approved asset
3. True one-click email unsubscribe (current "manage preferences" link requires being logged in;
   a signed-token link would remove that requirement)
