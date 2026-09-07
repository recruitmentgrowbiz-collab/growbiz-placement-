"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import type { Job } from "@/lib/data";

const modes = ["On-site", "Hybrid", "Remote"] as const;

export function JobsBrowser({
  jobs,
  totalCount,
  page,
  pageSize,
}: {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const selectedModes = params.get("mode")?.split(",") ?? [];
  const fresherOnly = params.get("fresher") === "true";

  function navigate(next: Record<string, string | null>) {
    const updated = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) updated.set(key, value);
      else updated.delete(key);
    }
    // Any filter change starts back at page 1 — staying on page 4 of a
    // now-different result set would just show confusing leftovers.
    if (!("page" in next)) updated.delete("page");
    router.push(`/jobs?${updated.toString()}`);
  }

  function toggleMode(mode: string) {
    const next = selectedModes.includes(mode)
      ? selectedModes.filter((m) => m !== mode)
      : [...selectedModes, mode];
    navigate({ mode: next.length ? next.join(",") : null });
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-14 md:py-16">
          <Kicker>Job search</Kicker>
          <h1 className="mt-4 max-w-xl text-balance font-display text-[32px] font-bold leading-tight text-ink md:text-[40px]">
            Find Jobs That Match Your Skills, Experience and Goals.
          </h1>
          <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-mist">
            Explore opportunities across growing companies, build your profile and stay updated
            with personalized job alerts.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ q: q || null, location: location || null });
            }}
            className="mt-7 flex flex-col gap-2 rounded-card border border-line bg-white p-2 shadow-soft sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 sm:border-r sm:border-line">
              <Search size={18} className="shrink-0 text-mist" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title, skill or company"
                className="w-full bg-transparent text-[14.5px] focus:outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5">
              <MapPin size={18} className="shrink-0 text-mist" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-[14.5px] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700"
            >
              Search
            </button>
          </form>
        </Container>
      </section>

      <section className="py-12">
        <Container className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
              <SlidersHorizontal size={15} /> Filters
            </div>

            <div className="mt-5">
              <p className="text-[13px] font-medium text-mist">Work mode</p>
              <div className="mt-2.5 flex flex-col gap-2">
                {modes.map((mode) => (
                  <label key={mode} className="flex items-center gap-2 text-[14px] text-ink/80">
                    <input
                      type="checkbox"
                      checked={selectedModes.includes(mode)}
                      onChange={() => toggleMode(mode)}
                      className="h-4 w-4 rounded border-line accent-plum-600"
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-2 text-[14px] text-ink/80">
                <input
                  type="checkbox"
                  checked={fresherOnly}
                  onChange={(e) => navigate({ fresher: e.target.checked ? "true" : null })}
                  className="h-4 w-4 rounded border-line accent-plum-600"
                />
                Fresher friendly only
              </label>
            </div>
          </aside>

          <div>
            <p className="text-[14px] text-mist">{totalCount} jobs found</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            {jobs.length === 0 && (
              <div className="mt-10 rounded-card border border-dashed border-line p-10 text-center">
                <p className="font-medium text-ink">No jobs match those filters yet</p>
                <p className="mt-1 text-[14px] text-mist">
                  Try clearing a filter, or set up a job alert so we notify you when a match is posted.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => navigate({ page: String(page - 1) })}
                  className="inline-flex items-center gap-1 rounded-pill border border-line px-3.5 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                <span className="text-[13.5px] text-mist">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => navigate({ page: String(page + 1) })}
                  className="inline-flex items-center gap-1 rounded-pill border border-line px-3.5 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
