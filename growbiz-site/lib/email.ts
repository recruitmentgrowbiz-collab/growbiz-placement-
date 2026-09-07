import { createAdminClient } from "./supabase/admin";

const RESEND_API_BASE = "https://api.resend.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data.user) return null;
    return data.user.email ?? null;
  } catch {
    // Service role key not configured, or lookup failed — email is a nice-to-have
    // on top of in-app notifications, never a hard dependency.
    return null;
  }
}

async function emailNotificationsEnabled(userId: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("notification_preferences")
      .select("email_enabled")
      .eq("user_id", userId)
      .maybeSingle();
    // No row yet means the default applies: email notifications on.
    return data?.email_enabled ?? true;
  } catch {
    return true;
  }
}

async function recordDelivery(row: {
  userId: string;
  recipient: string | null;
  template: string;
  status: "sent" | "failed" | "skipped";
  providerMessageId?: string | null;
  errorMessage?: string | null;
}) {
  try {
    const admin = createAdminClient();
    await admin.from("notification_deliveries").insert({
      user_id: row.userId,
      channel: "email",
      recipient: row.recipient,
      template: row.template,
      status: row.status,
      provider_message_id: row.providerMessageId ?? null,
      error_message: row.errorMessage ?? null,
    });
  } catch {
    // Logging the attempt is itself best-effort — a delivery-tracking
    // failure must never be why the underlying email send appears to fail.
  }
}

/** Fire-and-forget-safe: never throws, so it never breaks the action that calls it. */
export async function notifyByEmail(userId: string, subject: string, html: string) {
  const [email, enabled] = await Promise.all([getUserEmail(userId), emailNotificationsEnabled(userId)]);

  if (!email || !enabled) {
    await recordDelivery({
      userId,
      recipient: email,
      template: subject,
      status: "skipped",
      errorMessage: !email ? "No email on file" : "Email notifications disabled",
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    await recordDelivery({ userId, recipient: email, template: subject, status: "skipped", errorMessage: "RESEND_API_KEY not configured" });
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Grow Biz Jobs <notifications@thegrowbiz.online>";
  const withUnsubscribe = `${html}<p style="margin-top:16px;font-size:12px;"><a href="${APP_URL}/settings" style="color:#6E6479;">Manage notification preferences</a></p>`;

  try {
    const res = await fetch(`${RESEND_API_BASE}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [email], subject, html: withUnsubscribe }),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      await recordDelivery({
        userId,
        recipient: email,
        template: subject,
        status: "failed",
        errorMessage: body?.message ?? `Resend returned ${res.status}`,
      });
      return;
    }

    // This "sent" status means Resend accepted it — real delivery/bounce
    // confirmation comes later via the webhook, correlated by this ID.
    await recordDelivery({
      userId,
      recipient: email,
      template: subject,
      status: "sent",
      providerMessageId: body?.id ?? null,
    });
  } catch (err: any) {
    console.error("Resend email send failed:", err);
    await recordDelivery({
      userId,
      recipient: email,
      template: subject,
      status: "failed",
      errorMessage: err?.message ?? "Unknown error",
    });
  }
}
