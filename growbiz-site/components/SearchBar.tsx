"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search, MapPin } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-card border border-line bg-white p-2 shadow-soft sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 sm:border-r sm:border-line">
        <Search size={18} className="shrink-0 text-mist" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Job title, skill or company"
          className="w-full bg-transparent text-[14.5px] text-ink placeholder:text-mist/70 focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5">
        <MapPin size={18} className="shrink-0 text-mist" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full bg-transparent text-[14.5px] text-ink placeholder:text-mist/70 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-pill bg-plum-600 px-5 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-plum-700"
      >
        Search Jobs
      </button>
    </form>
  );
}
