"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignedFileLink({
  path,
  bucket,
  label,
  emptyLabel = "No file uploaded",
}: {
  path: string | null;
  bucket: string;
  label: string;
  emptyLabel?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (!path) {
    return <span className="text-[13px] text-mist">{emptyLabel}</span>;
  }

  async function openFile() {
    setLoading(true);
    setError(false);
    const supabase = createClient();
    const { data, error: signError } = await supabase.storage.from(bucket).createSignedUrl(path as string, 60);

    setLoading(false);
    if (signError || !data) {
      setError(true);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={openFile}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-plum-600 hover:text-plum-700 disabled:opacity-60"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
      {loading ? "Opening…" : label}
      {error && <span className="text-red-600"> — not authorized</span>}
    </button>
  );
}

export function ResumeLink({ resumePath }: { resumePath: string | null }) {
  return (
    <SignedFileLink path={resumePath} bucket="resumes" label="View resume" emptyLabel="No resume uploaded" />
  );
}
