import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { campusAudiences } from "@/features/public-content/mock/content";

export const metadata = {
  title: "Campus Hiring & Fresher Opportunities | Grow Biz",
  description: "Campus hiring, internships, fresher roles and institute partnerships through Grow Biz.",
};

const workflow = ["Partner requirement", "Student/institute coordination", "Role/opportunity publishing", "Screening/shortlisting", "Interview/drive coordination", "Hiring/placement tracking"];
const faqs = [
  ["Does Grow Biz guarantee campus placement?", "No. Grow Biz supports access, coordination and readiness, but employers make all hiring decisions."],
  ["Can institutes partner for placement drives?", "Yes. Institutes can contact Grow Biz for placement drives, internship opportunities and employer connections."],
  ["Can employers hire freshers through Grow Biz?", "Yes. Employers can request campus hiring support or publish relevant fresher opportunities."],
];

export default function CampusPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>Campus &amp; early careers</Kicker>
          <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">From Campus to Career</h1>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-mist">Help students access early-career opportunities while helping institutes and employers connect through structured campus hiring and placement initiatives.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/jobs?experience=fresher">Explore Opportunities</PrimaryButton>
            <SecondaryButton href="/contact">Partner With Grow Biz</SecondaryButton>
          </div>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            {campusAudiences.map((item) => (
              <article key={item.title} className="rounded-card border border-line p-6">
                <h2 className="font-display text-[20px] font-semibold text-ink">{item.title}</h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-mist">{item.text}</p>
                <div className="mt-5"><SecondaryButton href={item.cta.href}>{item.cta.label}</SecondaryButton></div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <Kicker>Campus hiring workflow</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[30px]">A structured pathway for students, institutes and employers</h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {workflow.map((step, index) => (
              <li key={step} className="rounded-card border border-line bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum-600 font-display text-[13px] font-semibold text-white">{index + 1}</span>
                <p className="mt-4 text-[14px] font-medium leading-snug text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Kicker>Campus FAQ</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Common campus questions</h2>
          </div>
          <div className="divide-y divide-line border-t border-line">
            {faqs.map(([q, a]) => <details key={q} className="py-5"><summary className="cursor-pointer font-medium text-ink">{q}</summary><p className="mt-2 text-[14.5px] leading-relaxed text-mist">{a}</p></details>)}
          </div>
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="rounded-card bg-plum-600 p-8 text-white md:p-12">
          <h2 className="font-display text-[24px] font-bold">Build a campus hiring pathway with Grow Biz.</h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/contact" className="bg-white !text-plum-700 hover:bg-white/90">Start a Partnership</PrimaryButton>
            <SecondaryButton href="/jobs?experience=fresher" className="!border-white/40 !text-white hover:!bg-white/10">Search Fresher Jobs</SecondaryButton>
          </div>
        </Container>
      </section>
    </>
  );
}
