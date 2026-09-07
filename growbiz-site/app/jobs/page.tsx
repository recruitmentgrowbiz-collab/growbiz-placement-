import { Suspense } from "react";
import { JobsBrowser } from "@/components/jobs/JobsBrowser";
import { getPublishedJobsPaginated } from "@/lib/supabase/queries";
import { mapDbJobToDisplayJob } from "@/lib/supabase/mappers";
import { jobs as demoJobs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string; location?: string; mode?: string; fresher?: string; page?: string };
}) {
  const modes = searchParams.mode ? searchParams.mode.split(",") : [];
  const page = Number(searchParams.page ?? "1") || 1;
  const hasActiveFilters = !!(searchParams.q || searchParams.location || modes.length || searchParams.fresher);

  const { jobs: dbJobs, totalCount, pageSize } = await getPublishedJobsPaginated({
    q: searchParams.q,
    location: searchParams.location,
    modes,
    fresherOnly: searchParams.fresher === "true",
    page,
  });

  const mapped = dbJobs.map((j) => mapDbJobToDisplayJob(j));

  // Demo listings only fill out the default, unfiltered first page — once
  // someone searches, filters, or pages forward, showing illustrative jobs
  // that don't match their query would just be confusing.
  const showDemoJobs = page === 1 && !hasActiveFilters;
  const jobs = showDemoJobs ? [...mapped, ...demoJobs] : mapped;
  const totalWithDemo = showDemoJobs ? totalCount + demoJobs.length : totalCount;

  return (
    <Suspense fallback={null}>
      <JobsBrowser jobs={jobs} totalCount={totalWithDemo} page={page} pageSize={pageSize} />
    </Suspense>
  );
}
