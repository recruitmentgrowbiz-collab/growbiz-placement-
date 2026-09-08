"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { BriefcaseBusiness, Check, ShieldCheck, UsersRound } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { signUpEmployer, type ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export default function EmployerSignupPage() {
  const [state, formAction] = useFormState(signUpEmployer, initialState);

  return (
    <section className="bg-plum-50/45 py-10 md:py-16">
      <Container className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <aside className="relative overflow-hidden rounded-card bg-plum-900 p-7 text-white shadow-[0_28px_70px_-42px_rgba(15,23,42,0.7)] md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(201,13,255,0.2),transparent_38%)]" />
          <div className="relative">
            <Kicker><span className="text-plum-200">Employer hiring workspace</span></Kicker>
            <h1 className="mt-5 max-w-md font-display text-[34px] font-bold leading-tight md:text-[42px]">Set up your employer account</h1>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/72">
              You'll be able to submit business verification and post your first job right after.
            </p>

            <div className="mt-8 rounded-card border border-white/10 bg-white/[0.045] p-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <BriefcaseBusiness size={20} className="text-plum-200" aria-hidden="true" />
                <p className="font-display text-[17px] font-semibold">Hiring setup</p>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ["Business verification", ShieldCheck],
                  ["Post your first job", BriefcaseBusiness],
                  ["Manage applicants", UsersRound],
                ].map(([label, Icon]) => (
                  <div key={label as string} className="flex items-center justify-between rounded-card bg-white/[0.055] px-4 py-3 text-[13.5px] text-white/78">
                    <span className="flex items-center gap-2"><Icon size={15} className="text-plum-200" aria-hidden="true" />{label as string}</span>
                    <Check size={15} className="text-plum-200" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-card border border-line bg-white p-6 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.42),0_1px_0_rgba(255,255,255,0.9)_inset] md:p-8">
          <Kicker>Employer account</Kicker>
          <h2 className="mt-4 font-display text-[24px] font-bold text-ink">Create your hiring login</h2>
          <p className="mt-2 text-[14.5px] text-mist">Use your work details so Grow Biz can connect your account to employer verification.</p>

          <form action={formAction} className="mt-7 flex flex-col gap-4">
            <Field label="Your full name" name="fullName" />
            <Field label="Work email" name="email" type="email" />
            <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
            <Field label="Company name" name="companyName" />
            <Field label="Company website" name="website" required={false} placeholder="https://" />
            <FormError error={state.error} />
            <SubmitButton>Create employer account</SubmitButton>
          </form>

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[13.5px] text-mist">
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
          </div>
        </div>
      </Container>
    </section>
  );
}
