import { Container, Kicker } from "@/components/ui";
import { faqs } from "@/lib/data";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Answers on free applications, employer verification, managed recruitment and how payments work at Grow Biz.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>FAQ</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">
              Answers for candidates and employers on cost, verification and how recruitment
              payments work.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="max-w-2xl">
          <div className="flex flex-col divide-y divide-line border-t border-line">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <p className="font-display text-[16px] font-semibold text-ink">{f.q}</p>
                <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{f.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
