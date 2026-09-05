"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PhoneSignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    // shouldCreateUser: true is the key difference from the login-only flow —
    // this is the one place a brand new account can be created via phone.
    const { error: sendError } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
        data: { role: "candidate", full_name: fullName },
      },
    });

    setLoading(false);
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setStep("code");
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });

    if (verifyError || !data.user) {
      setLoading(false);
      setError(verifyError?.message ?? "Verification failed.");
      return;
    }

    // Separate request, after the session from verifyOtp() has fully
    // committed — see the route's own comment for why this matters.
    const completeRes = await fetch("/api/auth/complete-phone-signup", { method: "POST" });
    const completeResult = await completeRes.json();

    setLoading(false);
    if (!completeRes.ok) {
      setError(completeResult.error ?? "Something went wrong finishing setup.");
      return;
    }

    router.refresh();
    router.push("/candidate/dashboard");
  }

  return (
    <div>
      {step === "details" ? (
        <form onSubmit={sendCode} className="flex flex-col gap-4">
          <div>
            <label className="text-[13.5px] font-medium text-ink">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[13.5px] font-medium text-ink">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="flex flex-col gap-4">
          <div>
            <label className="text-[13.5px] font-medium text-ink">Enter the code sent to {phone}</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="6-digit code"
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Create free profile"}
          </button>
          <button
            type="button"
            onClick={() => setStep("details")}
            className="text-[13px] text-mist hover:text-ink"
          >
            Use a different number
          </button>
        </form>
      )}
    </div>
  );
}
