"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { BriefcaseBusiness, Check, LockKeyhole, Route, ShieldCheck, UserRound } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { PhoneLoginForm } from "@/components/PhoneLoginForm";
import { signIn, type ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export default function LoginPage() {
  const [state, formAction] = useFormState(signIn, initialState);
  const [method, setMethod] = useState<"password" | "phone">("password");

  return (
    <section className="relative overflow-hidden bg-plum-50/45 py-10 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="gb-auth-orb absolute left-[7%] top-14 h-28 w-28 rounded-full border border-plum-200 bg-white/45" />
        <div className="gb-auth-orb gb-auth-orb--slow absolute bottom-16 right-[9%] h-36 w-36 rounded-full border border-plum-200 bg-white/45" />
        <div className="gb-auth-line absolute left-[42%] top-24 h-px w-52 rotate-12 bg-gradient-to-r from-transparent via-plum-300 to-transparent" />
      </div>

      <Container className="relative grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-stretch">
        <aside className="overflow-hidden rounded-card bg-plum-900 p-7 text-white shadow-[0_30px_76px_-44px_rgba(15,23,42,0.72)] md:p-8">
          <Kicker><span className="text-plum-200">Grow Biz access</span></Kicker>
          <h1 className="mt-5 max-w-lg font-display text-[36px] font-bold leading-tight md:text-[48px]">Log in</h1>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/72">
            Candidates and employers both log in here. Grow Biz routes you to the right dashboard after sign in.
          </p>

          <div className="mt-8 rounded-card border border-white/10 bg-white/[0.045] p-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-card bg-white/[0.06] p-4">
                <BriefcaseBusiness size={22} className="text-plum-200" aria-hidden="true" />
                <p className="mt-3 font-display text-[16px] font-semibold">Employers</p>
                <p className="mt-1 text-[12.5px] text-white/58">Jobs & applicants</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-plum-600 shadow-[0_0_28px_rgba(201,13,255,0.34)]">
                <Route size={19} aria-hidden="true" />
              </div>
              <div className="rounded-card bg-white/[0.06] p-4">
                <UserRound size={22} className="text-plum-200" aria-hidden="true" />
                <p className="mt-3 font-display text-[16px] font-semibold">Candidates</p>
                <p className="mt-1 text-[12.5px] text-white/58">Jobs & profile</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2.5">
              {["Secure account access", "Role-based dashboard routing", "Password or verified phone login"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-card bg-white/[0.055] px-4 py-3 text-[13.5px] text-white/75">
                  <Check size={15} className="text-plum-200" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="rounded-card border border-line bg-white p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.46),0_1px_0_rgba(255,255,255,0.9)_inset] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Kicker>Welcome back</Kicker>
              <h2 className="mt-4 font-display text-[26px] font-bold text-ink">Access your workspace</h2>
            </div>
            <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-plum-50 text-plum-700 sm:flex">
              {method === "password" ? <LockKeyhole size={19} aria-hidden="true" /> : <ShieldCheck size={19} aria-hidden="true" />}
            </div>
          </div>

          <div className="mt-6 inline-flex rounded-pill border border-line bg-plum-50/50 p-1 shadow-inner">
            {(["password", "phone"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMethod(item)}
                className={`rounded-pill px-4 py-2 text-[13.5px] font-medium transition ${
                  method === item ? "bg-plum-600 text-white shadow-[0_10px_22px_-14px_rgba(164,0,207,0.65)]" : "text-ink/70 hover:text-plum-700"
                }`}
              >
                {item === "password" ? "Password" : "Phone code"}
              </button>
            ))}
          </div>

          {method === "password" ? (
            <form action={formAction} className="mt-6 flex flex-col gap-4">
              <Field label="Email" name="email" type="email" />
              <Field label="Password" name="password" type="password" />
              <FormError error={state.error} />
              <SubmitButton>Log in</SubmitButton>
            </form>
          ) : (
            <div className="mt-6">
              <PhoneLoginForm />
            </div>
          )}

          <p className="mt-6 border-t border-line pt-5 text-[13.5px] text-mist">
            New here?{" "}
            <Link href="/signup" className="font-medium text-plum-600 hover:text-plum-700">
              Create an account
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
