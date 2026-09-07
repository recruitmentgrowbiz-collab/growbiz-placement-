import Link from "next/link";
import { ShieldAlert, XCircle, IndianRupee, UserX } from "lucide-react";
import { Container, Kicker, PrimaryButton } from "@/components/ui";

export const metadata = { title: "Report a Job or Safety Concern" };

const warningSigns = [
  {
    icon: IndianRupee,
    title: "Requests for payment",
    text: "A real employer or Grow Biz will never ask you to pay for a job application, interview, or offer letter.",
  },
  {
    icon: XCircle,
    title: "Vague or unverifiable roles",
    text: "Be cautious of listings with no clear company name, no verification badge, or job descriptions that are all promises and no detail.",
  },
  {
    icon: UserX,
    title: "Pressure to act immediately",
    text: "Urgency tactics — 'pay registration today or lose the offer' — are a common red flag.",
  },
];

export default function ReportPage() {
  return (
    <section className="py-14 md:py-16">
      <Container className="max-w-2xl">
        <Kicker>Trust &amp; safety</Kicker>
        <h1 className="mt-4 font-display text-[30px] font-bold text-ink">
          Report a suspicious job or employer
        </h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-mist">
          Applying to jobs on Grow Biz Jobs is always free. If something on the platform looks
          off, tell us — every report goes to our trust &amp; safety queue for review.
        </p>

        <div className="mt-8 flex items-start gap-3 rounded-card border border-line bg-plum-50/60 p-5">
          <ShieldAlert size={22} className="mt-0.5 shrink-0 text-plum-600" />
          <p className="text-[14px] leading-relaxed text-ink/80">
            Grow Biz does not promise guaranteed placement, and never charges candidates to
            apply, interview, or accept an offer.
          </p>
        </div>

        <h2 className="mt-10 font-display text-[18px] font-semibold text-ink">
          Warning signs to watch for
        </h2>
        <div className="mt-5 flex flex-col gap-3">
          {warningSigns.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 rounded-card border border-line p-4">
              <Icon size={19} className="mt-0.5 shrink-0 text-plum-600" />
              <div>
                <p className="text-[14.5px] font-medium text-ink">{title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-mist">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-card border border-line p-6">
          <h2 className="font-display text-[17px] font-semibold text-ink">Ready to report?</h2>
          <p className="mt-2 text-[14px] text-mist">
            Use the contact form and select "Report a suspicious job or payment request" — our
            team reviews every report and can suspend listings or accounts that violate our
            terms.
          </p>
          <div className="mt-5">
            <PrimaryButton href="/contact">Report Now</PrimaryButton>
          </div>
        </div>

        <p className="mt-6 text-[13px] text-mist">
          You can also report a specific job directly from its listing page using the "Report
          this job" link.
        </p>
      </Container>
    </section>
  );
}
