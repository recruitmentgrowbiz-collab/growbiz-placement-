"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { updateNotificationSettings, deleteMyAccount } from "@/lib/supabase/notification-actions";

export function SettingsForm({
  initialPhone,
  initialEmailEnabled,
  initialSmsEnabled,
}: {
  initialPhone: string;
  initialEmailEnabled: boolean;
  initialSmsEnabled: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await updateNotificationSettings(new FormData(e.currentTarget));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-card border border-line p-6">
      <div>
        <label className="text-[13.5px] font-medium text-ink">Phone number</label>
        <input
          name="phone"
          type="tel"
          defaultValue={initialPhone}
          placeholder="+91 98765 43210"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
        <p className="mt-1.5 text-[12.5px] text-mist">Needed for SMS notifications. Include country code.</p>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-[14.5px] font-medium text-ink">Email notifications</span>
            <span className="block text-[12.5px] text-mist">
              Application updates, verification decisions and placements
            </span>
          </span>
          <input
            name="emailEnabled"
            type="checkbox"
            defaultChecked={initialEmailEnabled}
            className="h-5 w-5 shrink-0 rounded border-line accent-plum-600"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-[14.5px] font-medium text-ink">SMS notifications</span>
            <span className="block text-[12.5px] text-mist">Same updates, sent as a text message</span>
          </span>
          <input
            name="smsEnabled"
            type="checkbox"
            defaultChecked={initialSmsEnabled}
            className="h-5 w-5 shrink-0 rounded border-line accent-plum-600"
          />
        </label>
      </div>

      <p className="text-[12.5px] text-mist">
        In-app notifications (the bell icon) can't be turned off — they're the reliable channel
        everything else here is best-effort on top of.
      </p>

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save preferences"}
      </button>
    </form>
  );
}

export function DeleteAccountSection() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteMyAccount("User-initiated deletion from settings page");
    setDeleting(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="mt-8 rounded-card border border-red-200 bg-red-50/50 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-600" />
        <div>
          <p className="text-[14.5px] font-medium text-red-900">Delete account</p>
          <p className="mt-1 text-[13px] leading-relaxed text-red-800/80">
            This permanently deletes your profile, applications, saved jobs and resume. Job
            postings and company data are not affected if you're part of an employer team with
            other members.
          </p>
        </div>
      </div>

      {error && <p className="mt-3 text-[12.5px] text-red-700">{error}</p>}

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-pill border border-red-300 px-4 py-2 text-[13.5px] font-medium text-red-700 hover:bg-red-100"
        >
          Delete my account
        </button>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-pill bg-red-600 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Yes, permanently delete"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-[13.5px] font-medium text-ink/70 hover:text-ink"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
