import { publicSeo } from "@/features/public-content/seo-content";
import { getAllJobs } from "@/features/jobs/services/jobs";
import { getCompanyStaticParams, getCompanyBySlug } from "@/features/companies/services/companies";
import { isActiveJob } from "@/features/jobs/utils/lifecycle";
import { SITE_URL, pendingPolicyRoutes } from "@/lib/seo";

export const sitemapSegments = ["jobs", "companies", "content"] as const;
const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
export async function segmentUrls(segment: typeof sitemapSegments[number]) {
  if (segment === "content") return Object.keys(publicSeo).filter(path => !pendingPolicyRoutes.includes(path));
  if (segment === "jobs") return (await getAllJobs()).filter(job => !job.isDemo && isActiveJob(job)).map(job => `/jobs/${job.id}`);
  const companies = await Promise.all((await getCompanyStaticParams()).map(({ id }) => getCompanyBySlug(id)));
  return companies.filter(company => company && !company.isDemo).map(company => `/companies/${company!.slug}`);
}
export function xmlResponse(body: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>${body}`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
export function sitemapIndex() {
  return xmlResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapSegments.map(segment => `<sitemap><loc>${SITE_URL}/sitemaps/${segment}.xml</loc></sitemap>`).join("")}</sitemapindex>`);
}
export async function segmentSitemap(segment: typeof sitemapSegments[number]) {
  const urls = [...new Set(await segmentUrls(segment))];
  return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${xmlEscape(SITE_URL + path)}</loc></url>`).join("")}</urlset>`);
}
