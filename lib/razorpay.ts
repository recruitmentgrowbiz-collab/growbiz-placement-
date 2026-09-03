import crypto from "crypto";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

function authHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local."
    );
  }
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed: ${body}`);
  }

  return res.json() as Promise<{ id: string; amount: number; currency: string }>;
}

/**
 * Verifies the HMAC signature Razorpay returns after a successful checkout.
 * This is the ONLY thing that should ever be trusted to confirm a payment —
 * never upgrade entitlements based on a client-side "success" callback alone.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET is not configured.");

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/** Verifies a webhook payload's signature (separate secret from the API key). */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");

  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export const PLAN_PRICES_PAISE: Record<string, number> = {
  starter: 299900, // ₹2,999
  growth: 799900, // ₹7,999
  pro: 1499900, // ₹14,999
};

export const PLAN_ENTITLEMENTS: Record<string, { activeJobs: number; unlocks: number }> = {
  starter: { activeJobs: 5, unlocks: 100 },
  growth: { activeJobs: 15, unlocks: 300 },
  pro: { activeJobs: 40, unlocks: 800 },
};
