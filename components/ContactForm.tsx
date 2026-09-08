"use client";

import { FormEvent, useState } from "react";
import { contactTypes } from "@/features/public-content/mock/content";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    window.setTimeout(() => setState("success"), 250);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-[13.5px] font-medium text-ink">Name<input required name="name" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink">Email<input required type="email" name="email" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink">Phone optional<input name="phone" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink">Enquiry Type<select required name="enquiryType" defaultValue="" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500"><option value="" disabled>Select type</option>{contactTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}</select></label>
        <label className="text-[13.5px] font-medium text-ink sm:col-span-2">Company/Institute optional<input name="organization" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink sm:col-span-2">Subject<input required name="subject" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink sm:col-span-2">Message<textarea required name="message" rows={5} className="mt-1.5 w-full rounded-card border border-line px-3 py-2 text-[14.5px] focus:border-plum-500" /></label>
      </div>
      {state === "success" && <p role="status" className="mt-4 rounded-card bg-plum-50 p-3 text-[13.5px] text-ink/80">Online enquiry submission is not available yet. Your enquiry has not been sent.</p>}
      {state === "error" && <p role="alert" className="mt-4 rounded-card bg-red-50 p-3 text-[13.5px] text-red-700">Something went wrong. Please try again.</p>}
      <button disabled={state === "submitting"} className="gb-button gb-button--primary mt-5 min-h-11 w-full rounded-control bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70">
        {state === "submitting" ? "Preparing..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
