"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { signUpEmployer, type ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export default function EmployerSignupPage() {
  const [state, formAction] = useFormState(signUpEmployer, initialState);

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <Kicker>Employer account</Kicker>
        <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Set up your employer account</h1>
        <p className="mt-2 text-[14.5px] text-mist">
          You'll be able to submit business verification and post your first job right after.
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <Field label="Your full name" name="fullName" />
          <Field label="Work email" name="email" type="email" />
          <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
          <Field label="Company name" name="companyName" />
          <Field label="Company website" name="website" required={false} placeholder="https://" />
          <FormError error={state.error} />
          <SubmitButton>Create employer account</SubmitButton>
        </form>

        <p className="mt-6 text-[13.5px] text-mist">
          Looking for a job instead?{" "}
          <Link href="/candidate/signup" className="font-medium text-plum-600 hover:text-plum-700">
            Create a candidate profile
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
