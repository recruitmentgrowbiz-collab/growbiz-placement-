"use client";

import { Container } from "@/components/ui";

export default function JobsError({ reset }: { reset: () => void }) {
  return (
    <section className="bg-paper py-14">
      <Container>
        <div className="rounded-card border border-line bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-[24px] font-semibold text-ink">We couldn't load jobs right now.</h1>
          <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-mist">
            Please try again. Your filters and search can be adjusted after the page reloads.
          </p>
          <button onClick={reset} className="mt-5 min-h-11 rounded-pill bg-plum-600 px-5 text-[14.5px] font-medium text-white hover:bg-plum-700">
            Try Again
          </button>
        </div>
      </Container>
    </section>
  );
}
