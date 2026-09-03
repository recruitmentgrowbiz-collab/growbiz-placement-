"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markAllNotificationsRead() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  revalidatePath("/", "layout");
}

export async function markNotificationRead(notificationId: string) {
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);
  revalidatePath("/", "layout");
}

export async function updateNotificationSettings(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const phone = String(formData.get("phone") ?? "").trim();
  const emailEnabled = formData.get("emailEnabled") === "on";
  const smsEnabled = formData.get("smsEnabled") === "on";

  await supabase.from("profiles").update({ phone: phone || null }).eq("id", user.id);

  await supabase.from("notification_preferences").upsert({
    user_id: user.id,
    email_enabled: emailEnabled,
    sms_enabled: smsEnabled,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/settings");
  return { error: null };
}

/**
 * Self-service account deletion. Records the request first (an audit trail
 * that deliberately survives the user's own deletion — see the migration),
 * then uses the service-role admin API to actually delete the auth user.
 * Every table with user data cascades via "on delete cascade" FKs back to
 * auth.users, so this one call is sufficient to remove everything.
 */
export async function deleteMyAccount(reason: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  await supabase.from("account_deletion_requests").insert({ user_id: user.id, reason });

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) return { error: error.message };
  } catch (err: any) {
    return {
      error:
        "Account deletion isn't fully configured yet (needs SUPABASE_SERVICE_ROLE_KEY). Your request has been recorded — contact support to complete it manually.",
    };
  }

  await supabase.auth.signOut();
  return { error: null };
}
