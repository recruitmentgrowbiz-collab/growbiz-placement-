"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { signUpCandidate, type ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export default function CandidateSignupPage() {
  const [state, formAction] = useFormState(signUpCandidate, initialState);

  if (state.success) {
    return (
      <section className="py-16 md:py-24">
        <Container className="max-w-md">
          <Kicker>Verify account</Kicker>
          <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Check your email</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-mist">
            We sent a verification link to {state.email}. Verify your email to continue setting up your Grow Biz account.
          </p>
          <div className="mt-7">
            <Link href="/login" className="gb-button gb-button--primary inline-flex min-h-11 items-center justify-center rounded-control bg-plum-600 px-5 py-3 text-[15px] font-semibold text-white">Back to login</Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <Kicker>Candidate account</Kicker>
        <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Create your free profile</h1>
        <p className="mt-2 text-[14.5px] text-mist">
          Applying to jobs is always free. Takes about a minute.
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <Field label="Full name" name="fullName" />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" type="tel" required={false} />
          <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
          <Field label="Confirm password" name="confirmPassword" type="password" />
          <FormError error={state.error} />
          <SubmitButton>Create free profile</SubmitButton>
        </form>

        <p className="mt-6 text-[13.5px] text-mist">
          Hiring instead?{" "}
          <Link href="/employer/signup" className="font-medium text-plum-600 hover:text-plum-700">
            Create an employer account
          </Link>
        </p>
        <p className="mt-2 text-[13.5px] text-mist">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-plum-600 hover:text-plum-700">
            Log in
          </Link>
        </p>
      </Container>
    </section>
  );
}
