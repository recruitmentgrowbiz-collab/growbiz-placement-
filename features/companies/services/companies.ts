import { mockCompanies } from "@/features/companies/mock/companies";
import { mockJobs } from "@/features/jobs/mock/jobs";

export async function getCompanyBySlug(slug: string) {
  return mockCompanies.find((company) => company.slug === slug || company.id === slug) ?? null;
}

export async function getCompanyStaticParams() {
  return mockCompanies.map((company) => ({ id: company.slug }));
}

export async function getCompanySlugByName(name: string) {
  return mockCompanies.find((company) => company.name === name)?.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getJobsByCompany(companyId: string) {
  const company = mockCompanies.find((item) => item.id === companyId);
  if (!company) return [];
  return mockJobs.filter((job) => job.company === company.name && (job.status ?? "published") === "published");
}
