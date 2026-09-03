"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, Flag, Share2, X } from "lucide-react";

const reportReasons = [
  "Suspicious payment request",
  "Misleading information",
  "Fake company or job",
  "Discrimination or abuse",
  "Expired or not available",
  "Other",
];

export function ApplyPanel({
  jobTitle,
  company,
  screeningQuestions,
  jobHref,
  closed = false,
  compact = false,
}: {
  jobTitle: string;
  company: string;
  screeningQuestions: string[];
  jobHref: string;
  closed?: boolean;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const returnTo = encodeURIComponent(jobHref);

  async function shareJob() {
    const url = typeof window === "undefined" ? jobHref : `${window.location.origin}${jobHref}`;
    if (navigator.share) {
      await navigator.share({ title: `${jobTitle} at ${company}`, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    setShareMessage("Link copied");
    window.setTimeout(() => setShareMessage(""), 1800);
  }

  return (
    <>
      <div className={compact ? "grid grid-cols-[auto_1fr] gap-2" : "rounded-card border border-line bg-white p-5 shadow-soft"}>
        {!compact && (
          <>
            <p className="font-display text-[18px] font-semibold text-ink">Apply for this role</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-mist">Applying to jobs on Grow Biz Jobs is free.</p>
          </>
        )}
        <button
          type="button"
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          className={`${compact ? "h-12 w-12" : "mt-5 w-full min-h-11 px-5"} inline-flex items-center justify-center gap-2 rounded-pill border font-medium transition-colors ${saved ? "border-plum-500 bg-plum-50 text-plum-700" : "border-line text-ink/80 hover:border-plum-300"}`}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
          {!compact && (saved ? "Saved" : "Save Job")}
        </button>
        {closed ? (
          <Link href="/jobs" className={`${compact ? "min-h-12" : "mt-3 min-h-11"} inline-flex items-center justify-center rounded-pill bg-plum-600 px-5 text-[15px] font-medium text-white hover:bg-plum-700`}>
            Browse Similar Jobs
          </Link>
        ) : (
          <Link href={`/candidate/signup?returnTo=${returnTo}`} className={`${compact ? "min-h-12" : "mt-3 min-h-11 w-full"} inline-flex items-center justify-center rounded-pill bg-plum-600 px-5 text-[15px] font-medium text-white hover:bg-plum-700`}>
            Apply Now
          </Link>
        )}
        {!compact && (
          <>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={shareJob} className="min-h-10 rounded-pill border border-line px-3 text-[13.5px] font-medium text-ink/80 hover:border-plum-300">
                <Share2 size={15} className="mr-1 inline" aria-hidden="true" /> Share
              </button>
              <button onClick={() => setReportOpen(true)} className="min-h-10 rounded-pill border border-line px-3 text-[13.5px] font-medium text-ink/80 hover:border-plum-300">
                <Flag size={15} className="mr-1 inline" aria-hidden="true" /> Report
              </button>
            </div>
            {shareMessage && <p className="mt-2 text-center text-[12.5px] text-plum-700">{shareMessage}</p>}
            {screeningQuestions.length > 0 && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-[13px] font-medium text-mist">Screening questions may include</p>
                <ul className="mt-2 grid gap-2 text-[13.5px] text-ink/78">
                  {screeningQuestions.slice(0, 3).map((question) => <li key={question}>{question}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      {reportOpen && <ReportDialog jobTitle={jobTitle} onClose={() => setReportOpen(false)} />}
    </>
  );
}

function ReportDialog({ jobTitle, onClose }: { jobTitle: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [noted, setNoted] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(event: FormEvent) {
    event.preventDefault();
    setNoted(true);
  }

  return (
    <div className="fixed inset-0 z-overlay flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="report-title" className="w-full max-w-lg rounded-t-card bg-white p-6 shadow-lift sm:rounded-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="report-title" className="font-display text-[18px] font-semibold text-ink">Report job</h2>
            <p className="mt-1 text-[13.5px] text-mist">{jobTitle}</p>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close report dialog" className="text-mist hover:text-ink"><X size={20} /></button>
        </div>
        {noted ? (
          <div className="mt-6 rounded-card bg-plum-50 p-4 text-[14px] leading-relaxed text-ink/80">
            Report details are ready for the future moderation workflow. No backend report was submitted in this frontend-only step.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <label className="grid gap-1.5 text-[13.5px] font-medium text-ink">
              Reason
              <select required className="rounded-control border border-line px-3 py-2.5 text-[14px] font-normal">
                <option value="">Choose a reason</option>
                {reportReasons.map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-[13.5px] font-medium text-ink">
              Details
              <textarea className="min-h-24 rounded-control border border-line px-3 py-2.5 text-[14px] font-normal" placeholder="Share anything candidates or moderators should know." />
            </label>
            <button className="min-h-11 rounded-pill bg-plum-600 px-5 text-[14.5px] font-medium text-white">Prepare Report</button>
          </form>
        )}
      </div>
    </div>
  );
}
