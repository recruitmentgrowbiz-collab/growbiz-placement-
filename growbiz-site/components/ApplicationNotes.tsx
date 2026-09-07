"use client";

import { useState, useTransition } from "react";
import { MessageSquarePlus } from "lucide-react";
import { addApplicationNote } from "@/lib/supabase/notes-actions";

type Note = {
  id: string;
  note: string;
  created_at: string;
  author_id: string;
  authorName?: string | null;
};

export function ApplicationNotes({
  applicationId,
  initialNotes,
  revalidatePathTarget,
}: {
  applicationId: string;
  initialNotes: Note[];
  revalidatePathTarget: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!draft.trim()) return;
    const optimistic: Note = {
      id: `optimistic-${Date.now()}`,
      note: draft.trim(),
      created_at: new Date().toISOString(),
      author_id: "me",
      authorName: "You",
    };
    setNotes((prev) => [optimistic, ...prev]);
    const text = draft.trim();
    setDraft("");
    startTransition(() => addApplicationNote(applicationId, text, revalidatePathTarget));
  }

  return (
    <div className="mt-3 border-t border-line pt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-plum-600 hover:text-plum-700"
      >
        <MessageSquarePlus size={14} />
        Notes ({notes.length})
      </button>

      {open && (
        <div className="mt-2.5 flex flex-col gap-2.5">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-plum-50/50 px-3 py-2 text-[13px] text-ink/80">
              <p>{n.note}</p>
              <p className="mt-1 text-[11.5px] text-mist">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add an internal note…"
              className="flex-1 rounded-lg border border-line px-2.5 py-1.5 text-[13px] focus:border-plum-400"
            />
            <button
              onClick={submit}
              disabled={isPending || !draft.trim()}
              className="rounded-pill bg-plum-600 px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
