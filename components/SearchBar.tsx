"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (experience) params.set("experience", experience);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search jobs"
      className="gb-search-surface flex flex-col gap-2 rounded-card border border-line bg-white p-2 shadow-soft lg:grid lg:grid-cols-[1.1fr_0.85fr_0.65fr_auto] lg:items-center"
    >
      <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 sm:border-r sm:border-line">
        <Search size={18} className="shrink-0 text-mist" aria-hidden="true" />
        <label htmlFor="hero-job-search" className="sr-only">Job title, skill or company</label>
        <input
          id="hero-job-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Job title, skill or company"
          className="min-h-10 w-full bg-transparent text-[14.5px] text-ink placeholder:text-mist/70"
        />
      </div>
      <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 sm:border-r sm:border-line">
        <MapPin size={18} className="shrink-0 text-mist" aria-hidden="true" />
        <label htmlFor="hero-location-search" className="sr-only">Location</label>
        <input
          id="hero-location-search"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="min-h-10 w-full bg-transparent text-[14.5px] text-ink placeholder:text-mist/70"
        />
      </div>
      <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5">
        <Briefcase size={18} className="shrink-0 text-mist" aria-hidden="true" />
        <label htmlFor="hero-experience-search" className="sr-only">Experience</label>
        <select
          id="hero-experience-search"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="min-h-10 w-full bg-transparent text-[14.5px] text-ink"
        >
          <option value="">Any experience</option>
          <option value="fresher">Fresher</option>
          <option value="0-2">0-2 years</option>
          <option value="2-5">2-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10plus">10+ years</option>
        </select>
      </div>
      <button
        type="submit"
        className="gb-button gb-button--primary min-h-11 rounded-control px-5 py-3 text-[14.5px] font-medium text-white transition-colors"
      >
        Search Jobs
      </button>
    </form>
  );
}
