import Link from "next/link";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";

export const metadata = {
  title: "Campus & Internship Partnerships",
  description:
    "Grow Biz partners with colleges, universities and training institutions for internships, fresher roles, placement drives and career-readiness support.",
};

const offers = [
  {
    title: "Campus placement partnership",
    institution: "More employer access and placement tracking",
    employer: "Access to an organized fresher pool",
  },
  {
    title: "Internship marketplace",
    institution: "Structured internships and employer exposure",
    employer: "Low-risk early talent pipeline",
  },
  {
    title: "Placement readiness program",
    institution: "Resume, interview and job-search training",
    employer: "Better-prepared candidates",
  },
  {
    title: "Virtual / physical hiring drive",
    institution: "Coordinated event and screening",
    employer: "High-volume fresher recruitment",
  },
  {
    title: "Campus ambassador program",
    institution: "Student engagement and job awareness",
    employer: "Low-cost candidate acquisition channel",
  },
];

const drive = [
  "Sign institution partnership after internal review.",
  "Collect eligible student data with clear consent and minimum necessary fields.",
  "Verify employer job criteria and communicate eligibility transparently.",
  "Open registrations, assessments and screening if required.",
  "Publish shortlist and schedule interviews.",
  "Track offers, joining and drop-offs.",
  "Issue an outcome report to the institution and employer.",
];

export default function CampusPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Campus &amp; internships</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              From Campus to Career
            </h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">
              We partner with colleges, universities and training institutions to connect students
              with internships, fresher roles, placement drives and career-readiness support.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryButton href="/contact">Partner With Us</PrimaryButton>
              <SecondaryButton href="/jobs?fresher=true">Explore Fresher Jobs</SecondaryButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Kicker>Partnership offers</Kicker>
          <div className="mt-8 flex flex-col divide-y divide-line border-t border-line">
            {offers.map((o) => (
              <div key={o.title} className="grid gap-3 py-6 sm:grid-cols-[1fr_1fr_1fr] sm:items-center">
                <p className="font-display text-[16px] font-semibold text-ink">{o.title}</p>
                <div>
                  <p className="text-[12px] font-medium text-mist">Institution value</p>
                  <p className="mt-1 text-[14px] text-ink/80">{o.institution}</p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-mist">Employer value</p>
                  <p className="mt-1 text-[14px] text-ink/80">{o.employer}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Kicker>Campus drive workflow</Kicker>
            <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight text-ink md:text-[30px]">
              A structured process from partnership to placement
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">
              Every drive follows the same transparent sequence, so institutions and employers
              always know what happens next.
            </p>
          </div>

          <ol className="flex flex-col gap-3">
            {drive.map((step, i) => (
              <li key={step} className="flex gap-3.5 rounded-card border border-line bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-600 font-display text-[13px] font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-[14.5px] leading-relaxed text-ink/85">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="flex flex-col items-start gap-6 rounded-card bg-plum-600 p-10 text-white md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <h2 className="max-w-md text-balance font-display text-[22px] font-bold leading-tight">
              Ready to build a placement pipeline for your students?
            </h2>
            <p className="mt-2 max-w-md text-[14.5px] text-white/75">
              Student premium career services stay optional and separate from access to genuine
              job opportunities.
            </p>
          </div>
          <Link href="/contact" className="rounded-pill bg-white px-5 py-3 text-[15px] font-medium text-plum-700 hover:bg-white/90">
            Start a Partnership
          </Link>
        </Container>
      </section>
    </>
  );
}
