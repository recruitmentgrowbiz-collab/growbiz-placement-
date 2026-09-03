"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, MapPin, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { Container, Kicker, SecondaryButton } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import type { ExperienceFilter, FreshnessFilter, JobsQuery, JobsResult, JobSort, JobType, WorkMode } from "@/features/jobs/types";
import { EXPERIENCE_OPTIONS, FRESHNESS_OPTIONS, JOB_TYPES, SORT_OPTIONS, WORK_MODES } from "@/features/jobs/utils/filters";

type FilterOptions = { industries: string[] };
type FilterDraft = Required<Pick<JobsQuery, "experience" | "mode" | "type" | "industry">> & {
  freshness?: FreshnessFilter;
  salaryMin?: number;
};

const salaryOptions = [
  { label: "Rs 3L+", value: 300000 },
  { label: "Rs 6L+", value: 600000 },
  { label: "Rs 10L+", value: 1000000 },
  { label: "Rs 20L+", value: 2000000 },
];

export function JobsBrowser({
  result,
  query,
  filterOptions,
}: {
  result: JobsResult;
  query: JobsQuery;
  filterOptions: FilterOptions;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(query.q ?? "");
  const [location, setLocation] = useState(query.location ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(() => makeDraft(query));

  useEffect(() => {
    setQ(query.q ?? "");
    setLocation(query.location ?? "");
    setDraft(makeDraft(query));
  }, [query]);

  const activeFilters = useMemo(() => getActiveFilters(query), [query]);

  function navigate(next: Record<string, string | null>, resetPage = true) {
    const updated = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) updated.set(key, value);
      else updated.delete(key);
    }
    if (resetPage) updated.delete("page");
    const qs = updated.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    navigate({ q: q.trim() || null, location: location.trim() || null });
  }

  function applyDraft(nextDraft = draft) {
    navigate({
      experience: nextDraft.experience.join(",") || null,
      mode: nextDraft.mode.join(",") || null,
      type: nextDraft.type.join(",") || null,
      industry: nextDraft.industry.join(",") || null,
      freshness: nextDraft.freshness ?? null,
      salaryMin: nextDraft.salaryMin ? String(nextDraft.salaryMin) : null,
    });
    setDrawerOpen(false);
  }

  function clearAll() {
    setQ("");
    setLocation("");
    router.push("/jobs");
  }

  const context = query.q || query.location
    ? `Jobs matching ${query.q ? `"${query.q}"` : "your search"}${query.location ? ` in ${query.location}` : ""}`
    : "Explore current openings across Grow Biz Jobs";

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-10 md:py-12">
          <Kicker>Job search</Kicker>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-[32px] font-bold leading-tight text-ink md:text-[42px]">
            Find Jobs That Match Your Skills, Experience and Goals.
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-mist">
            Search by role, skill, company, location and experience. Applying to jobs on Grow Biz Jobs is free.
          </p>

          <form onSubmit={submitSearch} role="search" aria-label="Search jobs" className="mt-7 grid gap-2 rounded-card border border-line bg-white p-2 shadow-soft md:grid-cols-[1.25fr_0.9fr_0.75fr_auto] md:items-center">
            <SearchField id="jobs-q" label="Job title, skill or company" icon={<Search size={18} aria-hidden="true" />} value={q} onChange={setQ} placeholder="Job title, skill or company" />
            <SearchField id="jobs-location" label="Location" icon={<MapPin size={18} aria-hidden="true" />} value={location} onChange={setLocation} placeholder="Location" />
            <label className="flex min-h-12 items-center rounded-lg px-3 text-[14.5px] text-ink md:border-l md:border-line">
              <span className="sr-only">Experience</span>
              <select value={query.experience?.[0] ?? ""} onChange={(e) => navigate({ experience: e.target.value || null })} className="w-full bg-transparent text-ink focus:outline-none">
                <option value="">Any experience</option>
                {EXPERIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <button type="submit" className="min-h-11 rounded-pill bg-plum-600 px-5 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-plum-700">
              Search Jobs
            </button>
          </form>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-5">
        <Container className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[14.5px] font-medium text-ink">{result.total} jobs found</p>
            <p className="mt-0.5 text-[13.5px] text-mist">{context}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDrawerOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-line px-3.5 text-[14px] font-medium text-ink/80 transition-colors hover:border-plum-300 lg:hidden">
              <Filter size={16} aria-hidden="true" /> Filters {activeFilters.length ? `(${activeFilters.length})` : ""}
            </button>
            <label className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-line bg-white px-3.5 text-[14px] text-ink/80">
              Sort
              <select value={query.sort ?? "relevant"} onChange={(e) => navigate({ sort: e.target.value }, false)} className="bg-transparent font-medium text-ink focus:outline-none">
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-8 md:py-10">
        <Container className="grid gap-8 lg:grid-cols-[270px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel draft={draft} setDraft={setDraft} filterOptions={filterOptions} onApply={applyDraft} onReset={clearAll} compact={false} />
          </aside>

          <div className="min-w-0">
            {activeFilters.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <button key={`${filter.key}-${filter.value}`} onClick={() => navigate({ [filter.key]: filter.nextValue })} className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-plum-200 bg-white px-3 text-[13px] font-medium text-plum-700">
                    {filter.label} <X size={14} aria-hidden="true" />
                  </button>
                ))}
                <button onClick={clearAll} className="min-h-9 rounded-pill px-3 text-[13px] font-medium text-ink/65 hover:text-plum-700">Clear All</button>
              </div>
            )}

            {result.items.length > 0 ? (
              <div className="grid gap-4">
                {result.items.map((job) => <JobCard key={job.id} job={job} showSave />)}
              </div>
            ) : (
              <EmptyJobs onReset={clearAll} />
            )}

            <Pagination page={result.page} totalPages={result.totalPages} navigate={navigate} />

            <div className="mt-10 rounded-card border border-line bg-white p-5">
              <div className="flex gap-3">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-plum-600" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-[17px] font-semibold text-ink">Candidate trust on Grow Biz Jobs</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-mist">
                    Applying to jobs is free. Grow Biz does not guarantee placement, and optional career services are separate from employer hiring decisions. Report suspicious jobs or payment requests whenever something feels wrong.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {drawerOpen && (
        <MobileFilterDrawer
          draft={draft}
          setDraft={setDraft}
          filterOptions={filterOptions}
          total={result.total}
          onApply={() => applyDraft()}
          onReset={clearAll}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}

function SearchField({ id, label, icon, value, onChange, placeholder }: { id: string; label: string; icon: React.ReactNode; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label htmlFor={id} className="flex min-h-12 items-center gap-2.5 rounded-lg px-3 text-[14.5px] text-mist md:border-r md:border-line">
      {icon}
      <span className="sr-only">{label}</span>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" className="w-full bg-transparent text-ink placeholder:text-mist/70 focus:outline-none" />
    </label>
  );
}

function FilterPanel({ draft, setDraft, filterOptions, onApply, onReset, compact }: { draft: FilterDraft; setDraft: (draft: FilterDraft) => void; filterOptions: FilterOptions; onApply: () => void; onReset: () => void; compact: boolean }) {
  return (
    <div className={`${compact ? "" : "sticky top-24 rounded-card border border-line bg-white p-5 shadow-soft"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-ink"><SlidersHorizontal size={16} aria-hidden="true" /> Filters</div>
        <button onClick={onReset} className="text-[13px] font-medium text-plum-600 hover:text-plum-700">Reset</button>
      </div>
      <div className="mt-5 grid gap-6">
        <CheckGroup title="Experience" options={EXPERIENCE_OPTIONS} values={draft.experience} onChange={(experience) => setDraft({ ...draft, experience })} />
        <CheckGroup title="Work mode" options={WORK_MODES.map((value) => ({ label: value, value }))} values={draft.mode} onChange={(mode) => setDraft({ ...draft, mode })} />
        <CheckGroup title="Job type" options={JOB_TYPES.map((value) => ({ label: value, value }))} values={draft.type} onChange={(type) => setDraft({ ...draft, type })} />
        <CheckGroup title="Industry" options={filterOptions.industries.map((value) => ({ label: value, value }))} values={draft.industry} onChange={(industry) => setDraft({ ...draft, industry })} />
        <RadioGroup title="Freshness" options={FRESHNESS_OPTIONS} value={draft.freshness ?? ""} onChange={(freshness) => setDraft({ ...draft, freshness: freshness as FreshnessFilter || undefined })} />
        <RadioGroup title="Salary" options={salaryOptions.map((o) => ({ label: o.label, value: String(o.value) }))} value={draft.salaryMin ? String(draft.salaryMin) : ""} onChange={(salaryMin) => setDraft({ ...draft, salaryMin: salaryMin ? Number(salaryMin) : undefined })} />
      </div>
      {!compact && <button onClick={onApply} className="mt-6 min-h-11 w-full rounded-pill bg-plum-600 px-5 text-[14.5px] font-medium text-white hover:bg-plum-700">Apply Filters</button>}
    </div>
  );
}

function CheckGroup<T extends string>({ title, options, values, onChange }: { title: string; options: { label: string; value: T }[]; values: T[]; onChange: (values: T[]) => void }) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold text-ink">{title}</legend>
      <div className="mt-2.5 grid gap-1.5">
        {options.map((option) => (
          <label key={option.value} className="flex min-h-9 cursor-pointer items-center gap-2.5 rounded-control px-1 text-[14px] text-ink/78 hover:bg-plum-50">
            <input type="checkbox" checked={values.includes(option.value)} onChange={(e) => onChange(e.target.checked ? [...values, option.value] : values.filter((v) => v !== option.value))} className="h-4 w-4 rounded border-line accent-plum-600" />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RadioGroup({ title, options, value, onChange }: { title: string; options: { label: string; value: string }[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold text-ink">{title}</legend>
      <div className="mt-2.5 grid gap-1.5">
        <label className="flex min-h-9 cursor-pointer items-center gap-2.5 rounded-control px-1 text-[14px] text-ink/78 hover:bg-plum-50">
          <input type="radio" checked={!value} onChange={() => onChange("")} className="h-4 w-4 accent-plum-600" /> Any
        </label>
        {options.map((option) => (
          <label key={option.value} className="flex min-h-9 cursor-pointer items-center gap-2.5 rounded-control px-1 text-[14px] text-ink/78 hover:bg-plum-50">
            <input type="radio" checked={value === option.value} onChange={() => onChange(option.value)} className="h-4 w-4 accent-plum-600" />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MobileFilterDrawer(props: { draft: FilterDraft; setDraft: (draft: FilterDraft) => void; filterOptions: FilterOptions; total: number; onApply: () => void; onReset: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && props.onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [props]);

  return (
    <div className="fixed inset-0 z-overlay lg:hidden">
      <button aria-label="Close filters overlay" className="absolute inset-0 h-full w-full bg-ink/25" onClick={props.onClose} />
      <aside role="dialog" aria-modal="true" aria-label="Job filters" className="absolute right-0 top-0 flex h-dvh w-[min(90vw,370px)] flex-col overflow-y-auto border-l border-line bg-paper shadow-lift">
        <div className="flex min-h-16 items-center justify-between border-b border-line px-5">
          <p className="font-display text-[18px] font-semibold text-ink">Filters</p>
          <button ref={closeRef} onClick={props.onClose} aria-label="Close filters" className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-line bg-white text-ink"><X size={20} aria-hidden="true" /></button>
        </div>
        <div className="p-5">
          <FilterPanel {...props} compact />
        </div>
        <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-3 border-t border-line bg-paper p-4">
          <button onClick={props.onReset} className="min-h-11 rounded-pill border border-line bg-white px-4 text-[14.5px] font-medium text-ink/80">Reset</button>
          <button onClick={props.onApply} className="min-h-11 rounded-pill bg-plum-600 px-4 text-[14.5px] font-medium text-white">Show {props.total} Jobs</button>
        </div>
      </aside>
    </div>
  );
}

function EmptyJobs({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-white p-8 text-center">
      <p className="font-display text-[20px] font-semibold text-ink">No jobs match these filters.</p>
      <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-mist">Try a broader role, location or experience range.</p>
      <button onClick={onReset} className="mt-5 min-h-11 rounded-pill bg-plum-600 px-5 text-[14.5px] font-medium text-white hover:bg-plum-700">Search All Jobs</button>
    </div>
  );
}

function Pagination({ page, totalPages, navigate }: { page: number; totalPages: number; navigate: (next: Record<string, string | null>, reset?: boolean) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from(new Set([1, page - 1, page, page + 1, totalPages].filter((p) => p >= 1 && p <= totalPages)));
  return (
    <nav aria-label="Job results pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button disabled={page <= 1} onClick={() => navigate({ page: String(page - 1) }, false)} className="inline-flex min-h-10 items-center gap-1 rounded-pill border border-line bg-white px-3.5 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15} aria-hidden="true" /> Previous</button>
      <div className="hidden gap-1 sm:flex">
        {pages.map((p) => <button key={p} aria-current={p === page ? "page" : undefined} onClick={() => navigate({ page: String(p) }, false)} className={`h-10 min-w-10 rounded-pill border px-3 text-[13.5px] font-medium ${p === page ? "border-plum-600 bg-plum-600 text-white" : "border-line bg-white text-ink/75 hover:border-plum-300"}`}>{p}</button>)}
      </div>
      <span className="px-2 text-[13.5px] text-mist sm:hidden">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => navigate({ page: String(page + 1) }, false)} className="inline-flex min-h-10 items-center gap-1 rounded-pill border border-line bg-white px-3.5 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={15} aria-hidden="true" /></button>
    </nav>
  );
}

function makeDraft(query: JobsQuery): FilterDraft {
  return {
    experience: query.experience ?? [],
    mode: query.mode ?? [],
    type: query.type ?? [],
    industry: query.industry ?? [],
    freshness: query.freshness,
    salaryMin: query.salaryMin,
  };
}

function getActiveFilters(query: JobsQuery) {
  const filters: { key: string; value: string; label: string; nextValue: string | null }[] = [];
  const addMany = (key: keyof JobsQuery, values: string[] = []) => values.forEach((value) => filters.push({ key, value, label: labelFor(key, value), nextValue: values.filter((v) => v !== value).join(",") || null }));
  if (query.q) filters.push({ key: "q", value: query.q, label: query.q, nextValue: null });
  if (query.location) filters.push({ key: "location", value: query.location, label: query.location, nextValue: null });
  addMany("experience", query.experience);
  addMany("mode", query.mode);
  addMany("type", query.type);
  addMany("industry", query.industry);
  if (query.freshness) filters.push({ key: "freshness", value: query.freshness, label: labelFor("freshness", query.freshness), nextValue: null });
  if (query.salaryMin) filters.push({ key: "salaryMin", value: String(query.salaryMin), label: salaryOptions.find((o) => o.value === query.salaryMin)?.label ?? "Salary filter", nextValue: null });
  return filters;
}

function labelFor(key: keyof JobsQuery | string, value: string) {
  if (key === "experience") return EXPERIENCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
  if (key === "freshness") return FRESHNESS_OPTIONS.find((o) => o.value === value)?.label ?? value;
  return value;
}
