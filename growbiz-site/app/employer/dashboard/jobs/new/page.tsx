import { Container, Kicker } from "@/components/ui";
import { JobForm } from "@/components/employer/JobForm";

export default function NewJobPage() {
  return (
    <section className="py-10 md:py-14">
      <Container className="max-w-2xl">
        <Kicker>New job</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Post a job</h1>
        <p className="mt-2 text-[14px] text-mist">
          This publishes immediately on your plan's active-jobs entitlement.
        </p>
        <div className="mt-6">
          <JobForm />
        </div>
      </Container>
    </section>
  );
}
