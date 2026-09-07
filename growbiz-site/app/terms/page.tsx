import { Container, Kicker } from "@/components/ui";

export const metadata = { title: "Terms of Service" };

const sections = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using Grow Biz Jobs, you agree to these terms. If you don't
agree, please don't use the platform.`,
  },
  {
    title: "2. For candidates",
    body: `Creating a profile and applying to jobs is free and will always be free. We do not
guarantee job placement, interviews, or hiring outcomes — hiring decisions are made solely by
employers. Optional Career Plus services are for preparation and visibility support only, and
never influence an employer's hiring decision.`,
  },
  {
    title: "3. For employers",
    body: `Access to post jobs and search candidates requires a verified business account.
Membership plans are billed in advance (monthly or annually) and do not carry over unused
entitlements. Managed recruitment services are billed per the commercial terms agreed with our
recruitment team — currently a one-time success fee of 10% of annual CTC (12.5% for specialist
roles), invoiced after the candidate joins and payable within 15 days, unless otherwise agreed
in writing.`,
  },
  {
    title: "4. Prohibited conduct",
    body: `You may not post fraudulent job listings, request payment from candidates for job
access or interviews, scrape or bulk-export candidate data, or misuse the platform to harass or
discriminate against any user.`,
  },
  {
    title: "5. Account verification and suspension",
    body: `We may request additional information to verify an employer account and may suspend
accounts that violate these terms, post suspicious listings, or fail to maintain active
payment.`,
  },
  {
    title: "6. Intellectual property",
    body: `The Grow Biz name, logo, and platform design are owned by Grow Biz Recruitment &
Placement. Content you submit (job posts, resumes, company descriptions) remains yours — you
grant us a license to display it on the platform for its intended purpose.`,
  },
  {
    title: "7. Disclaimers",
    body: `The platform is provided "as is." We do our best to verify employers and moderate job
listings, but we cannot guarantee every listing is accurate, and we are not a party to any
employment relationship formed through the platform.`,
  },
  {
    title: "8. Changes to these terms",
    body: `We may update these terms as the platform evolves. Continued use after a change means
you accept the updated terms.`,
  },
];

export default function TermsPage() {
  return (
    <section className="py-14 md:py-16">
      <Container className="max-w-2xl">
        <Kicker>Legal</Kicker>
        <h1 className="mt-4 font-display text-[30px] font-bold text-ink">Terms of Service</h1>

        <div className="mt-4 rounded-card border border-gold-500/30 bg-gold-500/10 p-4 text-[13.5px] leading-relaxed text-ink/80">
          <strong>Draft — pending legal review.</strong> This reflects the commercial and
          platform terms described in your product brief, in plain language. It is not final
          legal text and should be reviewed by qualified counsel before launch.
        </div>

        <div className="mt-8 flex flex-col divide-y divide-line border-t border-line">
          {sections.map((s) => (
            <div key={s.title} className="py-6">
              <h2 className="font-display text-[16px] font-semibold text-ink">{s.title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[13.5px] text-mist">
          Questions? Contact us at{" "}
          <a href="mailto:info@thegrowbiz.online" className="font-medium text-plum-600">
            info@thegrowbiz.online
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
