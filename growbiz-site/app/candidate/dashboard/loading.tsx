import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="h-3 w-32 animate-pulse rounded bg-plum-100" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-plum-100" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-8">
            <div className="h-64 animate-pulse rounded-card border border-line bg-plum-50/60" />
            <div className="h-40 animate-pulse rounded-card border border-line bg-plum-50/60" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-24 animate-pulse rounded-card border border-line bg-plum-50/60" />
            <div className="h-32 animate-pulse rounded-card border border-line bg-plum-50/60" />
          </div>
        </div>
      </Container>
    </section>
  );
}
