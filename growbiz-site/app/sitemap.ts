import type { MetadataRoute } from "next";
import { jobs as demoJobs } from "@/lib/data";
import { getPublishedJobs } from "@/lib/supabase/queries";

const BASE_URL = "https://jobs.thegrowbiz.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/jobs",
    "/employers",
    "/recruitment-services",
    "/pricing",
    "/about",
    "/campus",
    "/career-resources",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/report",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "/jobs" ? "hourly" : "weekly") as "hourly" | "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const demoJobPages = demoJobs.map((job) => ({
    url: `${BASE_URL}/jobs/${job.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  let dbJobPages: MetadataRoute.Sitemap = [];
  try {
    const dbJobs = await getPublishedJobs();
    dbJobPages = dbJobs.map((job) => ({
      url: `${BASE_URL}/jobs/${job.id}`,
      lastModified: new Date(job.created_at),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // No live Supabase connection yet — sitemap still works with demo jobs.
  }

  return [...staticPages, ...demoJobPages, ...dbJobPages];
}
