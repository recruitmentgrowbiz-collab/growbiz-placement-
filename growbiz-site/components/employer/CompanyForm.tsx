"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/lib/supabase/types";

export function CompanyForm({ company }: { company: Company }) {
  const [name, setName] = useState(company.name);
  const [website, setWebsite] = useState(company.website ?? "");
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [size, setSize] = useState(company.size ?? "");
  const [description, setDescription] = useState(company.description ?? "");
  const [logoUrl, setLogoUrl] = useState(company.logo_url ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(company.logo_url);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLogoChange(file: File | null) {
    setLogoFile(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();

    let newLogoUrl = logoUrl;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `${company.id}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(path, logoFile, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      const { data } = supabase.storage.from("company-logos").getPublicUrl(path);
      newLogoUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("companies")
      .update({ name, website, industry, size, description, logo_url: newLogoUrl || null })
      .eq("id", company.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setLogoUrl(newLogoUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-card border border-line p-6">
      <div>
        <label className="text-[13.5px] font-medium text-ink">Company logo</label>
        <div className="mt-1.5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-card border border-line bg-plum-50/60">
            {logoPreview ? (
              <Image src={logoPreview} alt="Company logo" width={64} height={64} className="h-full w-full object-cover" unoptimized />
            ) : (
              <Building2 size={24} className="text-plum-400" />
            )}
          </div>
          <label className="cursor-pointer rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300">
            Choose image
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <p className="mt-1.5 text-[12.5px] text-mist">PNG, JPG, SVG or WebP. Square works best.</p>
      </div>

      <div>
        <label className="text-[13.5px] font-medium text-ink">Company name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Website</label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[13.5px] font-medium text-ink">Industry</label>
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[13.5px] font-medium text-ink">Company size</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. 11-50"
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-1 w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save company profile"}
      </button>
    </form>
  );
}
