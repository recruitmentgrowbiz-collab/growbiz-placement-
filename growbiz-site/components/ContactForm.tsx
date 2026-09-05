"use client";

import { useFormState } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { submitContactForm, type ReportState } from "@/lib/supabase/report-actions";

const reasons = [
  "I want to hire (employer)",
  "I'm looking for a job (candidate)",
  "Campus / institute partnership",
  "Report a suspicious job or payment request",
  "Something else",
];

const initialState: ReportState = { error: null, success: false };

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-start rounded-card border border-line bg-plum-50/60 p-8">
        <CheckCircle2 size={32} className="text-plum-600" />
        <p className="mt-4 font-display text-[18px] font-semibold text-ink">Message received</p>
        <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-mist">
          Our team routes this to the right group — employer, candidate, campus or safety — and
          responds within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-card border border-line p-6">
      <div>
        <label className="text-[13.5px] font-medium text-ink">What's this about?</label>
        <select
          name="reason"
          required
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
          defaultValue=""
        >
          <option value="" disabled>
            Select a reason
          </option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[13.5px] font-medium text-ink">Full name</label>
          <input
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-[13.5px] font-medium text-ink">Email or mobile</label>
          <input
            name="email"
            required
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Company (if applicable)</label>
        <input
          name="company"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
          placeholder="Company name"
        />
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
          placeholder="Tell us what you need"
        />
      </div>
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        className="mt-1 rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700"
      >
        Send Message
      </button>
    </form>
  );
}
