import Link from "next/link";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { getCareerResources } from "@/features/public-content/services/resources";
import { pageMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { CareerResourcesClient } from "./components/CareerResourcesClient";
import { HeroMedia } from "@/components/HeroMedia";

export const metadata = pageMetadata("/career-resources");

export default async function CareerResourcesPage() {
  const resources = await getCareerResources();
  const copy = publicSeo["/career-resources"];

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Career Resources", path: "/career-resources" }])) }} />
    <section className="border-b border-line bg-plum-50/60">
      <Container className="grid gap-10 py-9 md:py-12 lg:grid-cols-[1fr_0.86fr] lg:items-center">
        <div>
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-mist"><Link href="/" className="inline-flex min-h-11 items-center hover:text-plum-700">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">Career Resources</span></nav>
          <Kicker>Career Resources</Kicker>
          <h1 className="mt-4 max-w-3xl font-display text-[32px] font-bold leading-tight text-ink md:text-[42px]">{copy.h1}</h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-mist">{copy.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><PrimaryButton href="#resources">Explore Guides</PrimaryButton><SecondaryButton href="/jobs">Search Jobs</SecondaryButton></div>
        </div>
        <HeroMedia variant="career" />
      </Container>
    </section>

    <CareerResourcesClient resources={resources} />

    <section className="bg-plum-50/60 py-10 md:py-14 border-t border-line">
      <Container>
        <div className="rounded-[12px] border border-line bg-white p-6 md:p-8">
          <h2 className="font-display text-[24px] font-semibold text-ink md:text-[30px]">Ready to Put This Into Practice?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">Job applications on Grow Biz Jobs are free. Career Plus is optional preparation support and does not influence employer hiring decisions or guarantee placement.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><PrimaryButton href="/jobs">Search Jobs</PrimaryButton><SecondaryButton href="/career-plus">Explore Optional Career Plus</SecondaryButton></div>
          <Link href="/report" className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-plum-600 underline underline-offset-4 hover:text-plum-700">Report Suspicious Jobs</Link>
        </div>
      </Container>
    </section>
  </>;
}
