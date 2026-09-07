import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Twilio signs status callbacks with X-Twilio-Signature: base64(HMAC-SHA1(
 * authToken, fullUrl + sortedConcatenatedParams)). The URL must be EXACTLY
 * what Twilio requested (including https://), which is why this trusts
 * NEXT_PUBLIC_APP_URL rather than reading it off the request — a request
 * behind a proxy can report a different scheme/host than what Twilio hit.
 * https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
function verifyTwilioSignature(url: string, params: Record<string, string>, signature: string, authToken: string): boolean {
  const sortedKeys = Object.keys(params).sort();
  const data = sortedKeys.reduce((acc, key) => acc + key + params[key], url);
  const expected = crypto.createHmac("sha1", authToken).update(data).digest("base64");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

const statusMap: Record<string, "sent" | "delivered" | "bounced" | "failed"> = {
  queued: "sent",
  sent: "sent",
  delivered: "delivered",
  failed: "failed",
  undelivered: "failed",
};

export async function POST(req: NextRequest) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json({ error: "TWILIO_AUTH_TOKEN not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const signature = req.headers.get("x-twilio-signature");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const fullUrl = `${appUrl}/api/webhooks/twilio`;

  if (!signature || !verifyTwilioSignature(fullUrl, params, signature, authToken)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const messageSid = params.MessageSid;
  const newStatus = statusMap[params.MessageStatus];

  if (messageSid && newStatus) {
    const admin = createAdminClient();
    await admin
      .from("notification_deliveries")
      .update({
        status: newStatus,
        error_message: params.ErrorMessage ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("provider_message_id", messageSid)
      .eq("channel", "sms");
  }

  return NextResponse.json({ received: true });
}
