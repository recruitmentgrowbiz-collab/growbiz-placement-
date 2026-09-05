import Link from "next/link";
import { Users, Building2 } from "lucide-react";
import { Container, Kicker } from "@/components/ui";

export const metadata = { title: "Create your account" };

export default function SignupChoicePage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-xl">
        <Kicker>Get started</Kicker>
        <h1 className="mt-4 font-display text-[30px] font-bold text-ink">
          What brings you to Grow Biz?
        </h1>
        <p className="mt-2 text-[15px] text-mist">
          Choose the account type that fits — you can always add a company or a candidate
          profile later.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/candidate/signup"
            className="group rounded-card border border-line p-6 transition-colors hover:border-plum-400"
          >
            <Users size={22} className="text-plum-600" />
            <p className="mt-4 font-display text-[17px] font-semibold text-ink group-hover:text-plum-600">
              I'm looking for a job
            </p>
            <p className="mt-1.5 text-[13.5px] text-mist">
              Create a free candidate profile and start applying.
            </p>
          </Link>

          <Link
            href="/employer/signup"
            className="group rounded-card border border-line p-6 transition-colors hover:border-plum-400"
          >
            <Building2 size={22} className="text-plum-600" />
            <p className="mt-4 font-display text-[17px] font-semibold text-ink group-hover:text-plum-600">
              I want to hire
            </p>
            <p className="mt-1.5 text-[13.5px] text-mist">
              Set up your employer account and post your first job.
            </p>
          </Link>
        </div>

        <p className="mt-8 text-[14px] text-mist">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-plum-600 hover:text-plum-700">
            Log in
          </Link>
        </p>
      </Container>
    </section>
  );
}
