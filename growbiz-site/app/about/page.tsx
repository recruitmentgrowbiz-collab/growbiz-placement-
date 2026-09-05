import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";

export const metadata = {
  title: "About Grow Biz Recruitment & Placement",
  description:
    "Grow Biz Recruitment & Placement combines recruitment expertise, technology and a growing talent network to make hiring more efficient, transparent and measurable.",
};

const why = [
  "Recruitment + technology in one operating model",
  "Flexible self-service and managed hiring",
  "Structured screening and candidate experience",
  "AI-assisted workflows with human accountability",
  "Strong focus on measurable hiring outcomes",
  "Part of the wider Grow Biz ecosystem",
];

const audiences = [
  { title: "Employers", need: "Quality hires with less effort", message: "Hire better talent faster with flexible self-service and managed recruitment." },
  { title: "Jobseekers", need: "Credible jobs and career progress", message: "Find opportunities, build your profile and move your career forward." },
  { title: "Students / Freshers", need: "First career opportunity", message: "From campus to career with internships, jobs and practical career support." },
  { title: "Institutes", need: "Placement outcomes", message: "Structured employer access and placement pipelines for students." },
  { title: "Recruiters / Partners", need: "Efficient sourcing", message: "One talent platform with structured jobs, candidates and workflows." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>About Grow Biz</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              Connecting Talent With Opportunity.
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-mist">
              Grow Biz Recruitment &amp; Placement helps companies build stronger teams and helps
              people discover meaningful career opportunities. We combine recruitment expertise,
              technology, automation and a growing talent network to make hiring more efficient,
              transparent and measurable.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-mist">
              We serve companies across IT and non-IT hiring, sales and marketing recruitment,
              fresher placement, bulk hiring, executive search, staffing, campus recruitment and
              RPO. Through Grow Biz Jobs, employers can also post jobs, access talent and manage
              hiring through flexible memberships.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Kicker>Why Grow Biz</Kicker>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {why.map((item) => (
              <div key={item} className="rounded-card border border-line p-5 text-[14.5px] leading-relaxed text-ink/85">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <Kicker>Who we serve</Kicker>
          <h2 className="mt-4 font-display text-[26px] font-bold text-ink">Five audiences, one platform</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-card border border-line bg-white p-5">
                <p className="font-display text-[16px] font-semibold text-ink">{a.title}</p>
                <p className="mt-1 text-[12.5px] font-medium text-plum-500">{a.need}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">{a.message}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="flex flex-col items-start gap-6 rounded-card bg-plum-600 p-10 text-white md:flex-row md:items-center md:justify-between md:p-14">
          <h2 className="max-w-md text-balance font-display text-[24px] font-bold leading-tight">
            Whichever side of hiring you're on, we'd like to help.
          </h2>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/employers" className="bg-white !text-plum-700 hover:bg-white/90">
              Hire Talent
            </PrimaryButton>
            <SecondaryButton href="/jobs" className="!border-white/40 !text-white hover:!bg-white/10">
              Search Jobs
            </SecondaryButton>
          </div>
        </Container>
      </section>
    </>
  );
}
