import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { Container, Kicker } from "@/components/ui";
import { faqs } from "@/lib/data";

export const metadata = pageMetadata("/faq");

const groups = [
  { title: "Candidates", questions: ["Is it free for candidates to apply?", "Do you guarantee jobs to candidates?"] },
  { title: "Employers", questions: ["Can companies hire directly from the platform?", "How are employers verified?", "Can we upgrade our employer plan later?"] },
  { title: "Recruitment Services", questions: ["Can Grow Biz handle recruitment for us?"] },
];

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>FAQ</Kicker>
          <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">{publicSeo["/faq"].h1}</h1>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">{publicSeo["/faq"].description}</p>
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="space-y-10">
          {groups.map((group) => (
            <section key={group.title} aria-labelledby={`${group.title.toLowerCase().replace(/ /g, "-")}-faq`}>
              <h2 id={`${group.title.toLowerCase().replace(/ /g, "-")}-faq`} className="font-display text-[22px] font-bold text-ink">{group.title}</h2>
              <div className="mt-4 divide-y divide-line border-t border-line">
                {group.questions.map((q) => {
                  const item = faqs.find((f) => f.q === q);
                  return item ? <details key={q} className="py-5"><summary className="cursor-pointer font-medium text-ink">{item.q}</summary><p className="mt-2 text-[14.5px] leading-relaxed text-mist">{item.a}</p></details> : null;
                })}
              </div>
            </section>
          ))}
          <section aria-labelledby="trust-safety-faq">
            <h2 id="trust-safety-faq" className="font-display text-[22px] font-bold text-ink">Trust &amp; Safety</h2>
            <div className="mt-4 divide-y divide-line border-t border-line">
              <details className="py-5"><summary className="cursor-pointer font-medium text-ink">How does candidate access work?</summary><p className="mt-2 text-[14.5px] leading-relaxed text-mist">Candidate access depends on employer verification, platform permissions, plan entitlement and candidate visibility settings.</p></details>
              <details className="py-5"><summary className="cursor-pointer font-medium text-ink">How do I report a suspicious job?</summary><p className="mt-2 text-[14.5px] leading-relaxed text-mist">Use the <Link href="/report" className="text-plum-600 underline">Report / Safety page</Link> or the report option on a job listing when something looks suspicious or misleading.</p></details>
            </div>
          </section>
        </Container>
      </section>
    </>
  );
}
