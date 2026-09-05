import type { Job } from "@/lib/data";

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

export function buildJobPostingSchema(job: Job) {
  const datePosted = approximateDateFromRelative(job.posted);
  const validThrough = new Date(datePosted.getTime() + 30 * 86400000);

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
      name: job.company,
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
