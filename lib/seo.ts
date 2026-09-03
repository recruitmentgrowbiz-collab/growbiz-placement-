import type { Company } from "@/features/companies/types";
import type { Job } from "@/features/jobs/types";

function approximateDateFromRelative(posted: string): Date {
  const now = new Date();
  const dayMatch = posted.match(/(\d+)\s+days?\s+ago/);
  const weekMatch = posted.match(/(\d+)\s+weeks?\s+ago/);
  if (posted.toLowerCase() === "today") return now;
  if (dayMatch) return new Date(now.getTime() - Number(dayMatch[1]) * 86400000);
  if (weekMatch) return new Date(now.getTime() - Number(weekMatch[1]) * 7 * 86400000);
  return now;
}

const employmentTypeMap: Record<string, string> = {
  "Full-time": "FULL_TIME",
  Internship: "INTERN",
  Contract: "CONTRACTOR",
};

export function buildJobPostingSchema(job: Job, company?: Company | null) {
  if ((job.status ?? "published") !== "published") return null;
  const datePosted = approximateDateFromRelative(job.posted);
  const validThrough = job.expiresAt ? new Date(job.expiresAt) : new Date(datePosted.getTime() + 30 * 86400000);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: [job.about, ...job.responsibilities, ...job.mustHave].join(" "),
    datePosted: datePosted.toISOString().slice(0, 10),
    validThrough: validThrough.toISOString().slice(0, 10),
    employmentType: employmentTypeMap[job.type] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: company?.name ?? job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    directApply: true,
    identifier: {
      "@type": "PropertyValue",
      name: "Grow Biz Jobs",
      value: job.id,
    },
  };

  if (job.salary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: { "@type": "QuantitativeValue", value: job.salary, unitText: "YEAR" },
    };
  }

  return schema;
}
