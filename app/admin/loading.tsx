import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="h-3 w-20 animate-pulse rounded bg-plum-100" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-plum-100" />

        <div className="mt-8 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-card border border-line bg-plum-50/60" />
          ))}
        </div>
      </Container>
    </section>
  );
}
