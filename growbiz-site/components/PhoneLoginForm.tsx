"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PhoneLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    // shouldCreateUser: false is the whole point — this is login for an
    // account that already verified this number in Settings, not a way to
    // create a new one. Without this flag, an unrecognized phone number
    // would silently sign up a brand-new account instead of failing.
    const { error: sendError } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: false },
    });

    setLoading(false);
    if (sendError) {
      setError(
        sendError.message.toLowerCase().includes("not found") || sendError.message.toLowerCase().includes("no user")
          ? "That number isn't linked to any account yet — verify it in Settings after logging in with your password first."
          : sendError.message
      );
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);
    router.refresh();

    if (profile?.role === "employer") router.push("/employer/dashboard");
    else if (profile?.role === "recruiter") router.push("/recruiter");
    else if (profile?.role === "admin") router.push("/admin");
    else router.push("/candidate/dashboard");
  }

  return (
    <div>
      {step === "phone" ? (
        <form onSubmit={sendCode} className="flex flex-col gap-4">
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
            <p className="mt-1.5 text-[12.5px] text-mist">
              Must already be verified in your account's Settings page.
            </p>
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
            {loading ? "Verifying…" : "Log in"}
          </button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-[13px] text-mist hover:text-ink"
          >
            Use a different number
          </button>
        </form>
      )}
    </div>
  );
}
