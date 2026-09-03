import { Container, PrimaryButton, SecondaryButton } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-paper py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl rounded-card border border-line bg-white p-8 text-center shadow-soft">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-plum-600">Page not found</p>
          <h1 className="mt-3 font-display text-[32px] font-bold leading-tight text-ink md:text-[42px]">This page is no longer available.</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-mist">
            The link may be old, the role may be closed, or the page may have moved.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/jobs" className="w-full sm:w-auto">Search Jobs</PrimaryButton>
            <SecondaryButton href="/" className="w-full sm:w-auto">Go Home</SecondaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
