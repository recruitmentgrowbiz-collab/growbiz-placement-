import { createAdminClient } from "./supabase/admin";

const TWILIO_API_BASE = "https://api.twilio.com/2010-04-01";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function getUserContact(userId: string): Promise<{ phone: string | null }> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("profiles").select("phone").eq("id", userId).single();
    return { phone: data?.phone ?? null };
  } catch {
    return { phone: null };
  }
}

async function getPreferences(userId: string): Promise<{ email: boolean; sms: boolean }> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("notification_preferences")
      .select("email_enabled, sms_enabled")
      .eq("user_id", userId)
      .maybeSingle();
    // No row yet means defaults apply: email on, SMS off.
    return {
      email: data?.email_enabled ?? true,
      sms: data?.sms_enabled ?? false,
    };
  } catch {
    return { email: true, sms: false };
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
      channel: "sms",
      recipient: row.recipient,
      template: row.template,
      status: row.status,
      provider_message_id: row.providerMessageId ?? null,
      error_message: row.errorMessage ?? null,
    });
  } catch {
    // Best-effort logging — must never be why the actual SMS send appears to fail.
  }
}

/**
 * Checks the user's notification preferences before sending — never throws,
 * so a missing phone number, disabled preference, or Twilio outage never
 * breaks the action that triggered it. In-app notifications (the bell icon)
 * remain the reliable channel regardless of what happens here.
 */
export async function notifyBySms(userId: string, message: string) {
  const [{ phone }, prefs] = await Promise.all([getUserContact(userId), getPreferences(userId)]);

  if (!phone || !prefs.sms) {
    await recordDelivery({
      userId,
      recipient: phone,
      template: message.slice(0, 60),
      status: "skipped",
      errorMessage: !phone ? "No phone number on file" : "SMS notifications disabled",
    });
    return;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    await recordDelivery({
      userId,
      recipient: phone,
      template: message.slice(0, 60),
      status: "skipped",
      errorMessage: "Twilio not configured",
    });
    return;
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const res = await fetch(`${TWILIO_API_BASE}/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: message,
        // Twilio calls this with delivered/failed/undelivered status updates
        // as the message actually makes it to the carrier — see /api/webhooks/twilio.
        StatusCallback: `${APP_URL}/api/webhooks/twilio`,
      }),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      await recordDelivery({
        userId,
        recipient: phone,
        template: message.slice(0, 60),
        status: "failed",
        errorMessage: body?.message ?? `Twilio returned ${res.status}`,
      });
      return;
    }

    await recordDelivery({
      userId,
      recipient: phone,
      template: message.slice(0, 60),
      status: "sent",
      providerMessageId: body?.sid ?? null,
    });
  } catch (err: any) {
    console.error("Twilio SMS send failed:", err);
    await recordDelivery({
      userId,
      recipient: phone,
      template: message.slice(0, 60),
      status: "failed",
      errorMessage: err?.message ?? "Unknown error",
    });
  }
}
