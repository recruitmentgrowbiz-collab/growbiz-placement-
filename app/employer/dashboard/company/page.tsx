import Link from "next/link";
import { EmployerCompanyForm } from "@/components/employer/EmployerCompanyForm";
import { getEmployerCompany } from "@/features/employer/services/workspace";

export const metadata = { title: "Company Profile | Grow Biz Jobs" };

export default async function CompanyProfilePage() {
  const company = await getEmployerCompany();
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Company Profile</h1><p className="mt-2 text-[14.5px] text-mist">Editable company information is separate from read-only verification status.</p><div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]"><EmployerCompanyForm company={company} /><aside className="space-y-4"><div className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Verification Status</h2><p className="mt-2 capitalize text-[14px] text-mist">{company.verificationStatus.replace("_", " ")}</p><p className="mt-2 text-[13px] text-mist">This status is read-only and will come from backend/admin review.</p></div><Link href={`/companies/${company.slug}`} className="block rounded-card border border-line bg-plum-50/60 p-5 font-medium text-plum-700">Preview Public Company Profile</Link></aside></div></div>;
}
