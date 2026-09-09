import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { HeroMedia } from "@/components/HeroMedia";

import { CampusAudienceSection } from "./components/CampusAudienceSection";
import { CampusWorkflow } from "./components/CampusWorkflow";
import { CampusCta } from "./components/CampusCta";

export const metadata = pageMetadata("/campus");

const faqs = [
  ["Does Grow Biz guarantee campus placement?", "No. Grow Biz supports access, coordination and readiness, but employers make all hiring decisions."],
  ["Can institutes partner for placement drives?", "Yes. Institutes can contact Grow Biz for placement drives, internship opportunities and employer connections."],
  ["Can employers hire freshers through Grow Biz?", "Yes. Employers can request campus hiring support or publish relevant fresher opportunities."],
];

export default function CampusPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div>
            <Kicker>Campus &amp; early careers</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">{publicSeo["/campus"].h1}</h1>
            <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-mist">{publicSeo["/campus"].description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/jobs?experience=fresher">Browse Fresher Jobs</PrimaryButton>
              <SecondaryButton href="/contact">Partner With Grow Biz</SecondaryButton>
            </div>
          </div>
          <HeroMedia variant="campus" />
        </Container>
      </section>

      <CampusAudienceSection />

      <CampusWorkflow />

      <section className="border-b border-line py-16 md:py-20 bg-white">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Kicker>Campus FAQ</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Common campus questions</h2>
          </div>
          <div className="divide-y divide-line border-t border-line">
            {faqs.map(([q, a]) => <details key={q} className="py-5 group"><summary className="cursor-pointer font-medium text-ink group-hover:text-plum-600 transition-colors">{q}</summary><p className="mt-2 text-[14.5px] leading-relaxed text-mist">{a}</p></details>)}
          </div>
        </Container>
      </section>

      <CampusCta />
    </>
  );
}
