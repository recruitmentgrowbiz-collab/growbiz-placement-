import { redirect } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { CompanyForm } from "@/components/employer/CompanyForm";
import { VerificationDocuments } from "@/components/employer/VerificationDocuments";
import { createClient } from "@/lib/supabase/server";

export default async function CompanyProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: row } = await supabase
    .from("company_users")
    .select("companies(*)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const company = (row as any)?.companies;
  if (!company) redirect("/employer/dashboard");

  const { data: docs } = await supabase
    .from("company_verification_documents")
    .select("id, document_type, file_path, file_name, created_at")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return (
    <section className="py-10 md:py-14">
      <Container className="max-w-xl">
        <Kicker>Company profile</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Edit company details</h1>
        <p className="mt-2 text-[14px] text-mist">
          This information is shown on your public company profile once verified.
        </p>
        <div className="mt-6 flex flex-col gap-6">
          <CompanyForm company={company} />
          <VerificationDocuments companyId={company.id} initialDocs={docs ?? []} />
        </div>
      </Container>
    </section>
  );
}
