import { Container, Kicker } from "@/components/ui";

export const metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "1. Information we collect",
    body: `From candidates: profile details, resume/CV, work experience, education, skills, salary
expectations, and application history. From employers: business and company details, job
postings, and hiring activity. From everyone: account credentials, and standard usage data
(pages visited, device/browser type) collected automatically.`,
  },
  {
    title: "2. How we use your information",
    body: `To operate the job marketplace — matching candidates with jobs, enabling employers to
review applicants, sending account and application-related notifications, and improving the
platform. We do not sell personal data to third parties.`,
  },
  {
    title: "3. Sharing of information",
    body: `Candidate profile information is shared with an employer only when you apply to their
job, or when a verified employer unlocks your profile through candidate search (if you've
enabled discoverability). We use service providers for hosting, authentication and storage
(currently Supabase) and, where applicable, payment processing — these providers act under
their own data protection terms.`,
  },
  {
    title: "4. Data retention",
    body: `We retain account and application data for as long as your account is active, or as
needed to comply with legal obligations. Retention periods for specific data categories are
still being finalized with legal counsel.`,
  },
  {
    title: "5. Your rights",
    body: `You can request a copy of your data or request account deletion at any time from your
dashboard settings or by contacting us. Employers can update or remove company data through the
employer dashboard.`,
  },
  {
    title: "6. Cookies",
    body: `We use essential cookies to keep you signed in and remember your session. We do not
currently use third-party advertising cookies.`,
  },
  {
    title: "7. Children's privacy",
    body: `Grow Biz Jobs is intended for users who are at least 18 years old or the legal working
age in their jurisdiction, whichever is higher.`,
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this policy as the platform evolves. Material changes will be
communicated before they take effect.`,
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-14 md:py-16">
      <Container className="max-w-2xl">
        <Kicker>Legal</Kicker>
        <h1 className="mt-4 font-display text-[30px] font-bold text-ink">Privacy Policy</h1>

        <div className="mt-4 rounded-card border border-gold-500/30 bg-gold-500/10 p-4 text-[13.5px] leading-relaxed text-ink/80">
          <strong>Draft — pending legal review.</strong> This page outlines our intended privacy
          practices in plain language. It is not final legal text and should be reviewed by
          qualified counsel before this platform goes live, per your own launch checklist.
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
          Questions about your data? Contact us at{" "}
          <a href="mailto:info@thegrowbiz.online" className="font-medium text-plum-600">
            info@thegrowbiz.online
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
