import { Mail, Clock } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact Grow Biz",
  description: "Reach the Grow Biz team for hiring, job search, campus partnerships or to report a suspicious job.",
};

export default function ContactPage() {
  return (
    <section className="py-16 md:py-20">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Kicker>Contact</Kicker>
          <h1 className="mt-4 text-balance font-display text-[32px] font-bold leading-[1.12] text-ink md:text-[38px]">
            Let's talk hiring, careers or campus partnerships
          </h1>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-mist">
            Tell us what you need and we'll route it to the right team — employer success,
            candidate support, campus partnerships or platform safety.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-plum-600" />
              <div>
                <p className="text-[14.5px] font-medium text-ink">info@thegrowbiz.online</p>
                <p className="text-[13px] text-mist">General and employer enquiries</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-plum-600" />
              <div>
                <p className="text-[14.5px] font-medium text-ink">Same business-day response</p>
                <p className="text-[13px] text-mist">For employer verification and safety reports</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </Container>
    </section>
  );
}
