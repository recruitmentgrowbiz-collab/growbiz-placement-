import Link from "next/link";
import Image from "next/image";
import { MapPin, Briefcase, Clock, Building2 } from "lucide-react";
import { Job } from "@/lib/data";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-card border border-line bg-white p-5 transition-all hover:border-plum-300 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-plum-50/60">
            {job.companyLogoUrl ? (
              <Image
                src={job.companyLogoUrl}
                alt={`${job.company} logo`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <Building2 size={18} className="text-plum-400" />
            )}
          </div>
          <div>
            <h3 className="font-display text-[17px] font-semibold text-ink group-hover:text-plum-600">
              {job.title}
            </h3>
            <p className="mt-0.5 text-[14.5px] text-mist">{job.company}</p>
          </div>
        </div>
        {job.fresherEligible && (
          <span className="shrink-0 rounded-pill bg-gold-500/10 px-2.5 py-1 text-[12px] font-medium text-gold-600">
            Fresher friendly
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px] text-mist">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={14} /> {job.mode} · {job.type}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} /> {job.experience}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-line px-2.5 py-1 text-[12.5px] text-ink/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[13px] text-mist">{job.posted}</span>
      </div>

      {job.salary && (
        <p className="mt-3 text-[14px] font-medium text-plum-700">{job.salary}</p>
      )}
    </Link>
  );
}
