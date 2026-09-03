import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsBrowser } from "@/components/jobs/JobsBrowser";
import { getAllJobs, getJobs } from "@/features/jobs/services/jobs";
import { getFilterOptions, parseJobsQuery } from "@/features/jobs/utils/filters";

export const metadata: Metadata = {
  title: "Jobs | Search Latest Openings - Grow Biz Jobs",
  description: "Search job opportunities by role, skill, location, experience and work mode.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = parseJobsQuery(searchParams);
  const [result, filterOptions] = await Promise.all([
    getJobs(query),
    getAllJobs().then(getFilterOptions),
  ]);

  return (
    <Suspense fallback={null}>
      <JobsBrowser result={result} query={query} filterOptions={filterOptions} />
    </Suspense>
  );
}
