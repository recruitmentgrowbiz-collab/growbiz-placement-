"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { PhoneLoginForm } from "@/components/PhoneLoginForm";
import { signIn, type ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export default function LoginPage() {
  const [state, formAction] = useFormState(signIn, initialState);
  const [method, setMethod] = useState<"password" | "phone">("password");

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <Kicker>Welcome back</Kicker>
        <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Log in</h1>
        <p className="mt-2 text-[14.5px] text-mist">
          Candidates and employers both log in here — we'll route you to the right dashboard.
        </p>

        <div className="mt-6 inline-flex rounded-pill border border-line p-1">
          <button
            onClick={() => setMethod("password")}
            className={`rounded-pill px-4 py-1.5 text-[13.5px] font-medium ${
              method === "password" ? "bg-plum-600 text-white" : "text-ink/70"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setMethod("phone")}
            className={`rounded-pill px-4 py-1.5 text-[13.5px] font-medium ${
              method === "phone" ? "bg-plum-600 text-white" : "text-ink/70"
            }`}
          >
            Phone code
          </button>
        </div>

        {method === "password" ? (
          <form action={formAction} className="mt-6 flex flex-col gap-4">
            <Field label="Email" name="email" type="email" />
            <div>
              <Field label="Password" name="password" type="password" />
              <Link
                href="/forgot-password"
                className="mt-1.5 inline-block text-[13px] font-medium text-plum-600 hover:text-plum-700"
              >
                Forgot password?
              </Link>
            </div>
            <FormError error={state.error} />
            <SubmitButton>Log in</SubmitButton>
          </form>
        ) : (
          <div className="mt-6">
            <PhoneLoginForm />
          </div>
        )}

        <p className="mt-6 text-[13.5px] text-mist">
          New here?{" "}
          <Link href="/signup" className="font-medium text-plum-600 hover:text-plum-700">
            Create an account
          </Link>
        </p>
      </Container>
    </section>
  );
}
