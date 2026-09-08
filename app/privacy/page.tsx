import { pageMetadata } from "@/lib/seo";
import { Container, Kicker } from "@/components/ui";
import { legalShells } from "@/features/public-content/mock/content";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return <LegalShell title="Privacy Policy" sections={legalShells.privacy} />;
}

function LegalShell({ title, sections }: { title: string; sections: string[] }) {
  return (
    <section className="py-14 md:py-16">
      <Container className="max-w-2xl">
        <Kicker>Legal</Kicker>
        <h1 className="mt-4 font-display text-[30px] font-bold text-ink">{title}</h1>
        <p className="mt-3 rounded-card border border-line bg-plum-50/60 p-4 text-[13.5px] leading-relaxed text-mist">Last updated: pending legal review. This page is a frontend placeholder for approved policy content.</p>
        <div className="mt-8 divide-y divide-line border-t border-line">
          {sections.map((section) => (
            <section key={section} className="py-6">
              <h2 className="font-display text-[17px] font-semibold text-ink">{section}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mist">Approved legal text for this section will be added before launch.</p>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
