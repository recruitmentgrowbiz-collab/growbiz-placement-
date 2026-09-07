import { Container, Kicker } from "@/components/ui";
import { VerificationControls } from "@/components/admin/AdminControls";
import { SignedFileLink } from "@/components/ResumeLink";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  verified: "bg-green-50 text-green-700",
  pending: "bg-gold-500/10 text-gold-600",
  needs_review: "bg-orange-50 text-orange-700",
  rejected: "bg-red-50 text-red-700",
};

export default async function AdminVerificationPage() {
  const supabase = createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: allDocs } = await supabase
    .from("company_verification_documents")
    .select("company_id, document_type, file_path, file_name")
    .order("created_at", { ascending: false });

  const docsByCompany = (allDocs ?? []).reduce<Record<string, typeof allDocs>>((map, d) => {
    (map[d.company_id] ??= []).push(d);
    return map;
  }, {});

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Admin</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Employer verification</h1>
        <p className="mt-2 text-[14px] text-mist">
          Companies get full candidate-database access only once verified here.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {companies && companies.length > 0 ? (
            companies.map((c) => {
              const docs = docsByCompany[c.id] ?? [];
              return (
                <div key={c.id} className="rounded-card border border-line p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <p className="font-medium text-ink">{c.name}</p>
                        <span
                          className={`rounded-pill px-2.5 py-0.5 text-[12px] font-medium capitalize ${
                            statusStyles[c.verification_status] ?? ""
                          }`}
                        >
                          {c.verification_status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-mist">
                        {c.industry || "Industry not set"} · {c.website || "No website"}
                      </p>
                    </div>
                    <VerificationControls companyId={c.id} />
                  </div>

                  <div className="mt-3.5 border-t border-line pt-3.5">
                    <p className="text-[12px] font-medium text-mist">
                      Submitted documents ({docs.length})
                    </p>
                    {docs.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                        {docs.map((d, i) => (
                          <SignedFileLink
                            key={i}
                            path={d.file_path}
                            bucket="verification-documents"
                            label={d.document_type}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-[13px] text-mist">None submitted yet.</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              No employer accounts yet.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
