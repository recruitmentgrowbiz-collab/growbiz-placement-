"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { PhoneSignupForm } from "@/components/PhoneSignupForm";
import { signUpCandidate, type ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export default function CandidateSignupPage() {
  const [state, formAction] = useFormState(signUpCandidate, initialState);
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <Kicker>Candidate account</Kicker>
        <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Create your free profile</h1>
        <p className="mt-2 text-[14.5px] text-mist">
          Applying to jobs is always free. Takes about a minute.
        </p>

        <div className="mt-6 inline-flex rounded-pill border border-line p-1">
          <button
            onClick={() => setMethod("email")}
            className={`rounded-pill px-4 py-1.5 text-[13.5px] font-medium ${
              method === "email" ? "bg-plum-600 text-white" : "text-ink/70"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setMethod("phone")}
            className={`rounded-pill px-4 py-1.5 text-[13.5px] font-medium ${
              method === "phone" ? "bg-plum-600 text-white" : "text-ink/70"
            }`}
          >
            Phone
          </button>
        </div>

        {method === "email" ? (
          <form action={formAction} className="mt-6 flex flex-col gap-4">
            <Field label="Full name" name="fullName" />
            <Field label="Email" name="email" type="email" />
            <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
            <FormError error={state.error} />
            <SubmitButton>Create free profile</SubmitButton>
          </form>
        ) : (
          <div className="mt-6">
            <PhoneSignupForm />
          </div>
        )}

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
