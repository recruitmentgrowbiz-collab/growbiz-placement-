import { ShieldAlert } from "lucide-react";
import { ReportForm } from "@/components/ReportForm";
import { Container, Kicker } from "@/components/ui";

export const metadata = {
  title: "Job Safety & Reporting | Grow Biz Jobs",
  description: "Report suspicious jobs, payment requests, fake employers or misleading job information on Grow Biz Jobs.",
};

const signs = ["Asking candidates to pay to apply", "Requesting money to secure an interview", "Misleading employer identity", "Suspicious external links", "Requests for inappropriate personal or financial information"];

export default function ReportPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>Trust &amp; safety</Kicker>
          <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">Report a Suspicious Job or Employer</h1>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-mist">Help us review suspicious jobs, payment requests, fake employers, misleading information or abusive behavior.</p>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <ShieldAlert size={28} className="text-plum-600" />
            <h2 className="mt-4 font-display text-[24px] font-bold text-ink">Common warning signs</h2>
            <div className="mt-5 grid gap-3">
              {signs.map((sign) => <div key={sign} className="rounded-card border border-line p-4 text-[14.5px] text-mist">{sign}</div>)}
            </div>
          </div>
          <ReportForm />
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="rounded-card border border-line bg-plum-50/60 p-7">
          <h2 className="font-display text-[22px] font-bold text-ink">Candidate safety reminders</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-mist">Applying to jobs should not require payment. Grow Biz does not guarantee placement, and hiring decisions are made by employers.</p>
        </Container>
      </section>
    </>
  );
}
