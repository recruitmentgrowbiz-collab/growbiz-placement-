"use client";

import { useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Doc = {
  id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  created_at: string;
};

const documentTypes = ["Business registration", "GST certificate", "PAN card", "Other"];

export function VerificationDocuments({ companyId, initialDocs }: { companyId: string; initialDocs: Doc[] }) {
  const [docs, setDocs] = useState(initialDocs);
  const [docType, setDocType] = useState(documentTypes[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();

    const path = `${companyId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("verification-documents")
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("company_verification_documents")
      .insert({ company_id: companyId, document_type: docType, file_path: path, file_name: file.name })
      .select()
      .single();

    setUploading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setDocs((prev) => [data as Doc, ...prev]);
    setFile(null);
  }

  async function handleDelete(id: string, filePath: string) {
    const supabase = createClient();
    await supabase.storage.from("verification-documents").remove([filePath]);
    await supabase.from("company_verification_documents").delete().eq("id", id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="rounded-card border border-line p-6">
      <h3 className="font-display text-[16px] font-semibold text-ink">Verification documents</h3>
      <p className="mt-1.5 text-[13.5px] text-mist">
        Submit business registration or GST documents so our team can verify your company.
        Reviewed within one business day.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="rounded-lg border border-line px-3 py-2 text-[13.5px] focus:border-plum-400"
        >
          {documentTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="cursor-pointer rounded-pill border border-line px-4 py-2 text-[13px] font-medium text-ink/80 hover:border-plum-300">
          {file ? file.name : "Choose file"}
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="inline-flex items-center gap-1.5 rounded-pill bg-plum-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
        >
          <Upload size={13} />
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      {error && <p className="mt-2.5 text-[13px] text-red-700">{error}</p>}

      <div className="mt-5 flex flex-col gap-2">
        {docs.length > 0 ? (
          docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2.5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileText size={16} className="shrink-0 text-plum-600" />
                <div className="overflow-hidden">
                  <p className="truncate text-[13.5px] font-medium text-ink">{d.document_type}</p>
                  <p className="truncate text-[12px] text-mist">{d.file_name}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(d.id, d.file_path)}
                className="shrink-0 text-mist hover:text-red-600"
                aria-label="Delete document"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-[13px] text-mist">No documents submitted yet.</p>
        )}
      </div>
    </div>
  );
}
