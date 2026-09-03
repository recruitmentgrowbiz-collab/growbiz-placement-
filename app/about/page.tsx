import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { aboutPrinciples, serviceScope } from "@/features/public-content/mock/content";

export const metadata = {
  title: "Grow Biz Recruitment & Placement | About",
  description: "Grow Biz connects talent with opportunity through recruitment expertise, technology and transparent hiring workflows.",
};

const audiences = ["Employers", "Candidates", "Students/Freshers", "Institutes", "Recruitment Partners"];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>Grow Biz Recruitment &amp; Placement</Kicker>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">Connecting Talent With Opportunity.</h1>
          <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-mist">Grow Biz Recruitment &amp; Placement helps companies build stronger teams and helps people discover meaningful career opportunities. We combine recruitment expertise, technology, automation and a growing talent network to make hiring more efficient, transparent and measurable.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/jobs">Find Jobs</PrimaryButton>
            <SecondaryButton href="/employers">Hire Talent</SecondaryButton>
          </div>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Kicker>Who we are</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Recruitment expertise plus hiring technology</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <p className="text-[15px] leading-relaxed text-mist">Employers can hire through self-service tools or work with Grow Biz recruiters for managed recruitment, staffing, campus hiring and RPO.</p>
            <p className="text-[15px] leading-relaxed text-mist">Candidates can search jobs, build profiles and access optional preparation support without paid services affecting employer decisions.</p>
          </div>
        </Container>
      </section>
      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <Kicker>Who we serve</Kicker>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {audiences.map((item) => <div key={item} className="rounded-card border border-line bg-white p-5 font-medium text-ink">{item}</div>)}
          </div>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Kicker>Service scope</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">One connected recruitment and jobs platform</h2>
            <div className="mt-7 flex flex-wrap gap-2">
              {serviceScope.map((item) => <span key={item} className="rounded-pill border border-line px-3 py-2 text-[13.5px] text-ink/80">{item}</span>)}
            </div>
          </div>
          <div>
            <Kicker>Trust principles</Kicker>
            <div className="mt-7 grid gap-3">
              {aboutPrinciples.map((item) => <div key={item} className="rounded-card border border-line p-4 text-[14.5px] text-mist">{item}</div>)}
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line p-7">
            <h2 className="font-display text-[22px] font-bold text-ink">For candidates</h2>
            <p className="mt-2 text-[14.5px] text-mist">Search jobs and build a stronger career profile.</p>
            <div className="mt-5"><PrimaryButton href="/jobs">Find Jobs</PrimaryButton></div>
          </div>
          <div className="rounded-card border border-line bg-plum-50/60 p-7">
            <h2 className="font-display text-[22px] font-bold text-ink">For employers</h2>
            <p className="mt-2 text-[14.5px] text-mist">Post roles or ask Grow Biz recruiters to support the search.</p>
            <div className="mt-5"><SecondaryButton href="/employers">Hire Talent</SecondaryButton></div>
          </div>
        </Container>
      </section>
    </>
  );
}
