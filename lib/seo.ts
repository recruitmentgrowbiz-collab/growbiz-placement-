import type { Metadata } from "next";
import type { Company } from "@/features/companies/types";
import type { Job } from "@/features/jobs/types";
import { publicSeo } from "@/features/public-content/seo-content";
import { isActiveJob } from "@/features/jobs/utils/lifecycle";

export const SITE_URL = "https://jobs.thegrowbiz.online";
export const pendingPolicyRoutes = ["/privacy", "/terms", "/refund-policy", "/candidate-consent"];

export function seoMetadata(path: string, title: string, description: string, index = true): Metadata {
  return {
    title: { absolute: title }, description,
    alternates: { canonical: `${SITE_URL}${path}` },
    robots: { index, follow: true },
    openGraph: { title, description, url: `${SITE_URL}${path}`, siteName: "Grow Biz Jobs", locale: "en_IN", type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export function pageMetadata(path: keyof typeof publicSeo): Metadata {
  const page = publicSeo[path];
  return seoMetadata(path, page.title, page.description, !pendingPolicyRoutes.includes(path));
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: `${SITE_URL}${item.path}`,
    })),
  };
}

export const organizationSchema = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "Grow Biz Recruitment & Placement", url: SITE_URL,
};
export const websiteSchema = {
  "@context": "https://schema.org", "@type": "WebSite",
  name: "Grow Biz Jobs", url: SITE_URL, inLanguage: "en-IN",
};

const employmentTypes = { "Full-time": "FULL_TIME", Internship: "INTERN", Contract: "CONTRACTOR" };

export function buildJobPostingSchema(job: Job, company?: Company | null) {
  if (job.isDemo || !isActiveJob(job) || !job.publishedAt || !Number.isFinite(Date.parse(job.publishedAt))) return null;
  if (Date.parse(job.publishedAt) > Date.now() || !job.title || !job.about || !job.company) return null;
  if (job.expiresAt && Date.parse(job.expiresAt) < Date.parse(job.publishedAt)) return null;
  // Location and eligibility must come from the vacancy, not its display label.
  if (job.mode === "Remote" ? !job.applicantCountries?.length : !job.address?.country || !job.address?.locality) return null;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "JobPosting",
    title: job.title,
    description: [job.about, ...job.responsibilities, ...job.mustHave, ...job.niceToHave].join(" "),
    datePosted: job.publishedAt,
    ...(job.expiresAt ? { validThrough: job.expiresAt } : {}),
    employmentType: employmentTypes[job.type],
    hiringOrganization: { "@type": "Organization", name: company?.name ?? job.company },
    identifier: { "@type": "PropertyValue", name: "Grow Biz Jobs", value: job.id },
    url: `${SITE_URL}/jobs/${job.id}`,
  };
  if (job.mode === "Remote") {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = job.applicantCountries!.map(name => ({ "@type": "Country", name }));
  } else {
    schema.jobLocation = { "@type": "Place", address: {
      "@type": "PostalAddress", addressLocality: job.address!.locality,
      addressCountry: job.address!.country,
      ...(job.address!.region ? { addressRegion: job.address!.region } : {}),
    } };
  }
  const pay = job.salaryDetails;
  if (pay && job.salary && Number.isFinite(pay.min) && Number.isFinite(pay.max) && pay.min >= 0 && pay.max >= pay.min) {
    schema.baseSalary = { "@type": "MonetaryAmount", currency: pay.currency,
      value: { "@type": "QuantitativeValue", minValue: pay.min, maxValue: pay.max, unitText: pay.unit } };
  }
  return schema;
}
