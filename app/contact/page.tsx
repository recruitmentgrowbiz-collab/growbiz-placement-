import { ContactForm } from "@/components/ContactForm";
import { Container, Kicker } from "@/components/ui";
import { contactTypes } from "@/features/public-content/mock/content";

export const metadata = {
  title: "Contact Grow Biz Recruitment & Placement",
  description: "Contact Grow Biz for employer, candidate, campus, institute or general enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>Contact</Kicker>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">Let's route your enquiry to the right Grow Biz team.</h1>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-mist">Choose the closest enquiry type, then share a short message. Public email, phone and office details will be published after approval.</p>
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3">
            {contactTypes.map((type) => <div key={type.id} className="rounded-card border border-line p-5"><h2 className="font-display text-[17px] font-semibold text-ink">{type.label}</h2><p className="mt-2 text-[14px] text-mist">{type.description}</p></div>)}
            <a href="/report" className="rounded-card border border-line bg-plum-50/60 p-5"><h2 className="font-display text-[17px] font-semibold text-ink">Report / Safety</h2><p className="mt-2 text-[14px] text-mist">Suspicious jobs, payment requests or misleading information.</p></a>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
