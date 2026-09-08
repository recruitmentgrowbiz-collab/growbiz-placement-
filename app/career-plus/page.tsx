import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { careerPlusBenefits } from "@/features/public-content/mock/content";

export const metadata = pageMetadata("/career-plus");

const notIncluded = [
  "It does not improve selection chances with employers.",
  "It does not guarantee placement or interviews.",
  "It is not required to apply for jobs.",
  "Employers do not make hiring decisions based on Career Plus.",
];

export default function CareerPlusPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>Optional candidate support</Kicker>
          <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">{publicSeo["/career-plus"].h1}</h1>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-mist">{publicSeo["/career-plus"].description}</p>
          <div className="mt-7"><PrimaryButton href="/contact">Enquire About Career Plus</PrimaryButton></div>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Kicker>What it is</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Preparation support for active jobseekers</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">Career Plus is separate from job applications and employer hiring workflows. Contact Grow Biz for availability and pricing.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {careerPlusBenefits.map((item) => <div key={item} className="rounded-card border border-line p-5 text-[14.5px] text-ink/80">{item}</div>)}
          </div>
        </Container>
      </section>
      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container>
          <Kicker><span className="text-plum-200">Important trust note</span></Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold md:text-[30px]">Career Plus does not influence employer hiring decisions.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {notIncluded.map((item) => <div key={item} className="rounded-card border border-white/15 p-4 text-[14.5px] text-white/75">{item}</div>)}
          </div>
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Kicker>Career Plus FAQ</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Clear boundaries</h2>
          </div>
          <div className="divide-y divide-line border-t border-line">
            <details className="py-5"><summary className="cursor-pointer font-medium text-ink">Is applying still free?</summary><p className="mt-2 text-[14.5px] text-mist">Yes. Candidates can search and apply for jobs without Career Plus.</p></details>
            <details className="py-5"><summary className="cursor-pointer font-medium text-ink">Does Career Plus guarantee placement?</summary><p className="mt-2 text-[14.5px] text-mist">No. Hiring decisions are made by employers.</p></details>
            <details className="py-5"><summary className="cursor-pointer font-medium text-ink">What is the price?</summary><p className="mt-2 text-[14.5px] text-mist">Contact Grow Biz to confirm available support, scope and pricing.</p></details>
          </div>
          <div className="lg:col-start-2 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/jobs">Search Jobs</PrimaryButton>
            <SecondaryButton href="/career-resources">Career Resources</SecondaryButton>
          </div>
        </Container>
      </section>
    </>
  );
}
