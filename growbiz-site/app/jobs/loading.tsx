import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <section className="py-14 md:py-16">
      <Container>
        <div className="h-3 w-24 animate-pulse rounded bg-plum-100" />
        <div className="mt-3 h-8 w-80 max-w-full animate-pulse rounded bg-plum-100" />
        <div className="mt-6 h-14 max-w-2xl animate-pulse rounded-card border border-line bg-plum-50/60" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-card border border-line bg-plum-50/60" />
          ))}
        </div>
      </Container>
    </section>
  );
}
