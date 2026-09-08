import { Suspense } from "react";
import { notFound } from "next/navigation";
import { seoMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { JobsBrowser } from "@/components/jobs/JobsBrowser";
import { getAllJobs, getJobs } from "@/features/jobs/services/jobs";
import { getFilterOptions, parseJobsQuery } from "@/features/jobs/utils/filters";

type Props = { searchParams: Record<string, string | string[] | undefined> };

export async function generateMetadata({ searchParams }: Props) {
  await validResults(searchParams);
  const filtered = Object.keys(searchParams).some(key => key !== "page");
  const query = parseJobsQuery(searchParams);
  const page = query.page ?? 1;
  const copy = publicSeo["/jobs"];
  return seoMetadata(!filtered && page > 1 ? `/jobs?page=${page}` : "/jobs",
    page > 1 && !filtered ? `Jobs in India - Page ${page} | Grow Biz Jobs` : copy.title,
    page > 1 && !filtered ? `Page ${page} of jobs in India. Search by skill, experience and work mode. Applications are free.` : copy.description, !filtered);
}

async function validResults(searchParams: Props["searchParams"]) {
  if (searchParams.page !== undefined && (typeof searchParams.page !== "string" || !/^[1-9]\d*$/.test(searchParams.page) || !Number.isSafeInteger(Number(searchParams.page)))) notFound();
  const query = parseJobsQuery(searchParams);
  const result = await getJobs(query);
  if ((query.page ?? 1) > result.totalPages) notFound();
  return { query, result };
}

export default async function JobsPage({ searchParams }: Props) {
  const [{ query, result }, filterOptions] = await Promise.all([validResults(searchParams), getAllJobs().then(getFilterOptions)]);
  return <Suspense fallback={null}><JobsBrowser result={result} query={query} filterOptions={filterOptions} /></Suspense>;
}
