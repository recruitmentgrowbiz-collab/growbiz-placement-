"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { JobCompanyAvatar } from "@/components/JobCompanyAvatar";

export function JobStickyHeader({
  title,
  company,
  companyHref,
  logoUrl,
  location,
  mode,
  type,
  experience,
  closed,
  jobHref,
}: {
  title: string;
  company: string;
  companyHref: string;
  logoUrl?: string;
  location: string;
  mode: string;
  type: string;
  experience: string;
  closed: boolean;
  jobHref: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed inset-x-0 top-0 z-[60] border-b border-line bg-white/82 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.55)] backdrop-blur-xl transition duration-200 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
      <div className="absolute inset-0 -z-10 bg-white/72" aria-hidden="true" />
      <div className="mx-auto flex max-w-content items-center gap-4 px-5 py-3 md:px-8">
        <JobCompanyAvatar company={company} logoUrl={logoUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-[17px] font-semibold text-ink md:text-[19px]">{title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-mist">
            <Link href={companyHref} className="font-medium text-ink/72 hover:text-plum-700">{company}</Link>
            <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden="true" />{location}</span>
            <span className="hidden items-center gap-1 sm:inline-flex"><Briefcase size={13} aria-hidden="true" />{mode} - {type}</span>
            <span className="hidden items-center gap-1 md:inline-flex"><Clock size={13} aria-hidden="true" />{experience}</span>
          </div>
        </div>
        <Link
          href={closed ? "/jobs" : `/candidate/signup?returnTo=${encodeURIComponent(jobHref)}`}
          aria-disabled={closed}
          className={`gb-button inline-flex min-h-11 shrink-0 items-center justify-center rounded-pill px-6 text-[14.5px] font-semibold transition hover:-translate-y-0.5 md:px-8 ${
            closed ? "pointer-events-none bg-line text-ink/55" : "gb-button--primary bg-plum-600 text-white shadow-[0_16px_32px_-18px_rgba(184,0,222,0.72)] hover:bg-plum-700"
          }`}
        >
          {closed ? "Browse Jobs" : "Apply"}
        </Link>
      </div>
    </div>
  );
}
