"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    // Always show the same confirmation regardless of whether the email
    // exists — same anti-enumeration reasoning as signup's duplicate-email
    // handling elsewhere in this app. A real error (rate limit, etc.) still
    // surfaces; "email not found" does not.
    if (resetError && !resetError.message.toLowerCase().includes("not found")) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <section className="py-16 md:py-24">
        <Container className="max-w-md">
          <div className="flex flex-col items-start rounded-card border border-line bg-plum-50/60 p-8">
            <CheckCircle2 size={32} className="text-plum-600" />
            <p className="mt-4 font-display text-[18px] font-semibold text-ink">Check your email</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mist">
              If an account exists for {email}, a password reset link is on its way. It expires
              after a while, so use it soon.
            </p>
            <Link href="/login" className="mt-5 text-[13.5px] font-medium text-plum-600 hover:text-plum-700">
              Back to login
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <Kicker>Account recovery</Kicker>
        <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Reset your password</h1>
        <p className="mt-2 text-[14.5px] text-mist">
          Enter the email on your account and we'll send you a link to set a new password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-[13.5px] font-medium text-ink">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-[13.5px] text-mist">
          <Link href="/login" className="font-medium text-plum-600 hover:text-plum-700">
            Back to login
          </Link>
        </p>
      </Container>
    </section>
  );
}
