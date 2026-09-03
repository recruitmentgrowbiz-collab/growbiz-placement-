import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <section className="bg-paper py-10 md:py-12">
      <Container>
        <div className="h-3 w-24 animate-pulse rounded bg-plum-100" />
        <div className="mt-3 h-8 w-80 max-w-full animate-pulse rounded bg-plum-100" />
        <div className="mt-6 h-32 animate-pulse rounded-card border border-line bg-white sm:h-16" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[270px_1fr]">
          <div className="hidden h-96 animate-pulse rounded-card border border-line bg-white lg:block" />
          <div className="grid gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-card border border-line bg-white" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
