import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Resend signs webhooks using the Svix format: headers svix-id, svix-timestamp,
 * svix-signature, verified against RESEND_WEBHOOK_SECRET (starts with "whsec_").
 * Implemented manually rather than pulling in the svix package, since the
 * scheme is simple and this avoids one more dependency for one webhook route.
 * https://resend.com/docs/dashboard/webhooks/verify-webhooks-requests
 */
function verifySvixSignature(
  payload: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string
): boolean {
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${headers.id}.${headers.timestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  // svix-signature can contain multiple space-separated "v1,<sig>" entries
  // (used during secret rotation) — a match on any of them is valid.
  return headers.signature
    .split(" ")
    .map((s) => s.replace(/^v1,/, ""))
    .some((sig) => {
      try {
        return crypto.timingSafeEqual(Buffer.from(sig, "base64"), Buffer.from(expected, "base64"));
      } catch {
        return false;
      }
    });
}

const statusMap: Record<string, "sent" | "delivered" | "bounced" | "failed"> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "bounced",
  "email.delivery_delayed": "sent",
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "RESEND_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const valid = verifySvixSignature(rawBody, { id: svixId, timestamp: svixTimestamp, signature: svixSignature }, secret);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const newStatus = statusMap[event.type];
  const messageId = event.data?.email_id;

  if (newStatus && messageId) {
    const admin = createAdminClient();
    await admin
      .from("notification_deliveries")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("provider_message_id", messageId)
      .eq("channel", "email");
  }

  return NextResponse.json({ received: true });
}
