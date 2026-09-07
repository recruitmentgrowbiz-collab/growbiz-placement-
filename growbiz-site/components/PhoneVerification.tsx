"use client";

import { useState, FormEvent } from "react";
import { ShieldCheck, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function PhoneVerification({ initialVerifiedPhone }: { initialVerifiedPhone: string | null }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "code_sent">("idle");
  const [verifiedPhone, setVerifiedPhone] = useState(initialVerifiedPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    // updateUser({ phone }) is the mechanism for linking/changing a phone
    // number on an ALREADY-authenticated account — it never creates a new
    // user, so this can't be used to sign up, only to verify an existing
    // account's number.
    const { error: updateError } = await supabase.auth.updateUser({ phone });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setStep("code_sent");
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "phone_change",
    });

    setLoading(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    // Sync the app-facing profile field too, so it also becomes the SMS
    // notification target — a verified number is more trustworthy than
    // whatever was previously typed into the notification preferences field.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ phone }).eq("id", user.id);
    }

    setVerifiedPhone(phone);
    setStep("idle");
    setCode("");
  }

  if (verifiedPhone) {
    return (
      <div className="rounded-card border border-line p-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-green-600" />
          <h3 className="font-display text-[16px] font-semibold text-ink">Phone verified</h3>
        </div>
        <p className="mt-1.5 text-[13.5px] text-mist">
          {verifiedPhone} is verified and can be used to log in instead of your password.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line p-6">
      <div className="flex items-center gap-2.5">
        <Smartphone size={18} className="text-plum-600" />
        <h3 className="font-display text-[16px] font-semibold text-ink">Verify a phone number</h3>
      </div>
      <p className="mt-1.5 text-[13.5px] text-mist">
        Once verified, you can log in with a text-message code instead of your password.
      </p>

      {step === "idle" ? (
        <form onSubmit={sendCode} className="mt-4 flex flex-wrap gap-2.5">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            required
            placeholder="+91 98765 43210"
            className="flex-1 rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-pill bg-plum-600 px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-4 flex flex-wrap items-center gap-2.5">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="6-digit code"
            className="w-40 rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-pill bg-plum-600 px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => setStep("idle")}
            className="text-[13px] text-mist hover:text-ink"
          >
            Use a different number
          </button>
        </form>
      )}

      {error && <p className="mt-2.5 text-[13px] text-red-700">{error}</p>}
    </div>
  );
}
