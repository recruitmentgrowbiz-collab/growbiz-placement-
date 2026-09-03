import Link from "next/link";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { getCareerResources, getFeaturedCareerResources } from "@/features/public-content/services/resources";

export const metadata = {
  title: "Career Resources | Grow Biz Jobs",
  description: "Practical guidance for resumes, interviews, skills, workplace readiness and career growth.",
};

const categories = ["All", "Resume", "Interview", "Salary", "Skills", "Workplace"];

export default async function CareerResourcesPage() {
  const [resources, featured] = await Promise.all([getCareerResources(), getFeaturedCareerResources()]);

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <Kicker>Career Resources</Kicker>
          <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">Career Resources</h1>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-mist">Practical guidance for resumes, interviews, skills, workplace readiness and career growth.</p>
        </Container>
      </section>
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Kicker>Featured resources</Kicker>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featured.map((resource) => (
              <article key={resource.id} className="rounded-card border border-line p-6">
                <p className="text-[12.5px] font-medium text-plum-600">{resource.category}</p>
                <h2 className="mt-2 font-display text-[22px] font-semibold text-ink">{resource.title}</h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-mist">{resource.excerpt}</p>
                <p className="mt-4 text-[12.5px] text-mist">{resource.readTime}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <Kicker>Categories</Kicker>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => <span key={category} className="rounded-pill border border-line bg-white px-3 py-2 text-[13.5px] text-ink/80">{category}</span>)}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <article key={resource.id} className="rounded-card border border-line bg-white p-5">
                <p className="text-[12.5px] font-medium text-plum-600">{resource.category}</p>
                <h2 className="mt-2 font-display text-[17px] font-semibold text-ink">{resource.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">{resource.excerpt}</p>
                <p className="mt-4 text-[12.5px] text-mist">{resource.readTime}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-16 md:py-20">
        <Container className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line bg-plum-50/60 p-7">
            <h2 className="font-display text-[22px] font-bold text-ink">Career Plus</h2>
            <p className="mt-2 text-[14.5px] text-mist">Optional resume, interview and career-readiness support. It does not influence employer hiring decisions.</p>
            <div className="mt-5"><SecondaryButton href="/career-plus">Learn More</SecondaryButton></div>
          </div>
          <div className="rounded-card border border-line p-7">
            <h2 className="font-display text-[22px] font-bold text-ink">Ready to apply?</h2>
            <p className="mt-2 text-[14.5px] text-mist">Search current opportunities and apply free.</p>
            <div className="mt-5"><PrimaryButton href="/jobs">Search Jobs</PrimaryButton></div>
          </div>
        </Container>
      </section>
    </>
  );
}
