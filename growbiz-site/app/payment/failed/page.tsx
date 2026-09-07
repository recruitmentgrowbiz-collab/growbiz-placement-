import Link from "next/link";
import { XCircle } from "lucide-react";
import { Container } from "@/components/ui";

export default function PaymentFailedPage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <div className="flex flex-col items-start rounded-card border border-red-200 bg-red-50/50 p-8">
          <XCircle size={32} className="text-red-600" />
          <p className="mt-4 font-display text-[18px] font-semibold text-ink">Payment didn't go through</p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-mist">
            No charge was made. This can happen if the payment was cancelled, declined, or timed
            out — you can try again whenever you're ready.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="/employer/dashboard/plan"
              className="rounded-pill bg-plum-600 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-plum-700"
            >
              Back to plans
            </Link>
            <Link
              href="/contact"
              className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80"
            >
              Contact support
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
