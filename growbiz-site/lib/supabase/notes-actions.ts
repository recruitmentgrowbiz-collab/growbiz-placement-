"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addApplicationNote(applicationId: string, note: string, revalidatePathTarget: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !note.trim()) return;

  await supabase.from("application_notes").insert({
    application_id: applicationId,
    author_id: user.id,
    note: note.trim(),
  });

  revalidatePath(revalidatePathTarget);
}
