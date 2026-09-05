"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The Supabase client parses the recovery token out of the URL and
    // establishes a temporary session automatically on load — this just
    // waits a tick to confirm a session actually landed before showing the
    // form, rather than letting someone submit against no session at all.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
      if (!data.session) {
        setError("This reset link is invalid or has expired. Request a new one from the login page.");
      }
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/login");
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <Kicker>Account recovery</Kicker>
        <h1 className="mt-4 font-display text-[28px] font-bold text-ink">Set a new password</h1>
        <p className="mt-2 text-[14.5px] text-mist">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-[13.5px] font-medium text-ink">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              disabled={!ready}
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-[13.5px] font-medium text-ink">Confirm new password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              minLength={8}
              disabled={!ready}
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none disabled:opacity-60"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading || !ready}
            className="rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Set new password"}
          </button>
        </form>
      </Container>
    </section>
  );
}
