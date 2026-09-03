import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Layers3, SearchCheck, UsersRound } from "lucide-react";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { getRecruitmentServices } from "@/features/recruitment/services/recruitment-services";

export const metadata = {
  title: "Recruitment Services, Staffing & RPO - Grow Biz",
  description:
    "Managed recruitment services for corporate hiring, IT and non-IT roles, bulk hiring, campus recruitment, staffing, executive search and RPO.",
};

const groups = [
  { title: "Core Recruitment", slugs: ["corporate-recruitment", "it-non-it-recruitment", "experienced-professional-placement"], icon: SearchCheck },
  { title: "Specialized Hiring", slugs: ["sales-marketing-hiring", "executive-search"], icon: Building2 },
  { title: "High-Volume & Staffing", slugs: ["bulk-hiring", "contract-temporary-staffing"], icon: UsersRound },
  { title: "Campus & Early Careers", slugs: ["fresher-graduate-placement", "internship-placement", "campus-recruitment"], icon: GraduationCap },
  { title: "Outsourced Recruitment", slugs: ["recruitment-process-outsourcing"], icon: Layers3 },
];

const process = ["Hiring Requirement", "Requirement Calibration", "Candidate Sourcing", "Screening", "Shortlist", "Interview Coordination", "Offer / Selection", "Joining Support"];

export default async function RecruitmentServicesPage() {
  const services = await getRecruitmentServices();
  const bySlug = new Map(services.map((service) => [service.slug, service]));

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Managed recruitment</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">Recruitment Support for Every Stage of Growth</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">Grow Biz supports organizations with sourcing, screening, shortlisting, interview coordination and recruitment operations across different hiring needs.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/contact">Share Hiring Requirement</PrimaryButton>
              <SecondaryButton href="/employers">Employer Platform</SecondaryButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Kicker>Service areas</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[30px]">Choose managed support by role, volume or recruitment model</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {groups.map(({ title, slugs, icon: Icon }) => (
              <nav key={title} aria-label={title} className="rounded-card border border-line p-5">
                <Icon size={20} className="text-plum-600" />
                <h3 className="mt-3 font-display text-[15.5px] font-semibold text-ink">{title}</h3>
                <div className="mt-4 flex flex-col gap-2">
                  {slugs.map((slug) => {
                    const service = bySlug.get(slug);
                    return service ? (
                      <Link key={slug} href={`#${slug}`} className="text-[13.5px] leading-snug text-mist hover:text-plum-700">
                        {service.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </nav>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/40 py-16 md:py-20">
        <Container>
          <div className="space-y-12">
            {groups.map(({ title, slugs }) => (
              <div key={title}>
                <h2 className="font-display text-[24px] font-bold text-ink">{title}</h2>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {slugs.map((slug) => {
                    const service = bySlug.get(slug);
                    if (!service) return null;
                    return (
                      <article key={service.slug} id={service.slug} className="scroll-mt-24 rounded-card border border-line bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-display text-[19px] font-semibold text-ink">{service.name}</h3>
                          <Link href="/contact" aria-label={`Share hiring requirement for ${service.name}`} className="shrink-0 text-plum-600 hover:text-plum-700">
                            <ArrowRight size={20} />
                          </Link>
                        </div>
                        <p className="mt-3 text-[14px] leading-relaxed text-mist"><span className="font-medium text-ink">Problem: </span>{service.problem}</p>
                        <p className="mt-3 text-[14px] leading-relaxed text-mist"><span className="font-medium text-ink">Approach: </span>{service.approach}</p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-[13px] font-medium text-ink">What Grow Biz handles</p>
                            <ul className="mt-2 space-y-1.5 text-[13.5px] leading-relaxed text-mist">
                              {service.handles.map((item) => <li key={item}>- {item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-ink">Ideal use case</p>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{service.useCase}</p>
                            {service.slug === "campus-recruitment" ? (
                              <Link href="/campus" className="mt-4 inline-flex min-h-10 items-center rounded-pill border border-plum-600 px-4 py-2 text-[13.5px] font-medium text-plum-600 hover:bg-plum-50">Explore Campus Hiring</Link>
                            ) : (
                              <Link href="/contact" className="mt-4 inline-flex min-h-10 items-center rounded-pill border border-plum-600 px-4 py-2 text-[13.5px] font-medium text-plum-600 hover:bg-plum-50">Share Hiring Requirement</Link>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container>
          <div className="max-w-2xl">
            <Kicker><span className="text-plum-200">Recruitment process</span></Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold md:text-[30px]">Need More Than a Job Post? Let Our Recruitment Team Run the Search.</h2>
          </div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <li key={step} className="rounded-card border border-white/15 p-4 text-[14px] text-white/80">
                <span className="block font-display text-[17px] font-semibold text-white">{index + 1}</span>
                <span className="mt-2 block">{step}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="hiring-requirement" className="py-16 md:py-20">
        <Container className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Kicker>Request frontend</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Share a hiring requirement</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">This frontend is ready for a future recruitment request backend. For now, it routes employers to the contact workflow.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/contact">Continue to Contact</PrimaryButton>
              <SecondaryButton href="/campus">Explore Campus Hiring</SecondaryButton>
            </div>
          </div>
          <div className="rounded-card border border-line bg-plum-50/60 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {["Company", "Contact person", "Business email", "Roles", "Number of hires", "Location", "Experience", "Timeline"].map((label) => (
                <label key={label} className="text-[13px] font-medium text-ink">
                  {label}
                  <input disabled className="mt-1 block min-h-11 w-full rounded-card border border-line bg-white px-3 text-[14px]" aria-label={label} />
                </label>
              ))}
              <label className="text-[13px] font-medium text-ink sm:col-span-2">
                Hiring requirement
                <textarea disabled rows={4} className="mt-1 block w-full rounded-card border border-line bg-white px-3 py-2 text-[14px]" aria-label="Hiring requirement" />
              </label>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
