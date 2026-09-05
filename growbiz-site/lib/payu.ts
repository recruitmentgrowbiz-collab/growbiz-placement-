import crypto from "crypto";

const PAYU_BASE_URL = process.env.PAYU_ENV === "production" ? "https://secure.payu.in" : "https://test.payu.in";

export const PAYU_PAYMENT_URL = `${PAYU_BASE_URL}/_payment`;

export function getPayUCredentials() {
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_SALT;
  if (!key || !salt) {
    throw new Error("PayU is not configured — set PAYU_MERCHANT_KEY and PAYU_SALT.");
  }
  return { key, salt };
}

export function generateTxnId(): string {
  return `gbj_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

type PayUTxnFields = {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
};

/**
 * PayU's documented request-hash sequence: key|txnid|amount|productinfo|
 * firstname|email|udf1..udf5|(5 more empty fields)|SALT. Confirmed against
 * PayU's own "Transaction Error" page, which spells out the exact formula
 * and a worked example when a hash is wrong.
 */
export function generateRequestHash(fields: PayUTxnFields): string {
  const { key, salt } = getPayUCredentials();
  const parts = [
    key,
    fields.txnid,
    fields.amount,
    fields.productinfo,
    fields.firstname,
    fields.email,
    "", // udf1
    "", // udf2
    "", // udf3
    "", // udf4
    "", // udf5
    "", // padding
    "", // padding
    "", // padding
    "", // padding
    "", // padding
    salt,
  ];
  return crypto.createHash("sha512").update(parts.join("|")).digest("hex");
}

/**
 * Response hash mirrors the request sequence in reverse, with `status`
 * inserted right after the salt — same corrected field count as above.
 */
export function verifyResponseHash(fields: PayUTxnFields & { status: string; hash: string }): boolean {
  const { key, salt } = getPayUCredentials();
  const parts = [
    salt,
    fields.status,
    "", // padding
    "", // padding
    "", // padding
    "", // padding
    "", // padding
    "", // udf5
    "", // udf4
    "", // udf3
    "", // udf2
    "", // udf1
    fields.email,
    fields.firstname,
    fields.productinfo,
    fields.amount,
    fields.txnid,
    key,
  ];
  const expected = crypto.createHash("sha512").update(parts.join("|")).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(fields.hash));
  } catch {
    return false; // length mismatch etc. — never let a malformed hash throw past this
  }
}

export const PLAN_PRICES_PAISE: Record<string, number> = {
  starter: 299900, // ₹2,999
  growth: 799900, // ₹7,999
  pro: 1499900, // ₹14,999
};

// ₹1,999/year — matches the figure shown on /pricing and /career-resources.
export const CAREER_PLUS_PRICE_PAISE = 199900;

export const PLAN_ENTITLEMENTS: Record<string, { activeJobs: number; unlocks: number }> = {
  starter: { activeJobs: 5, unlocks: 100 },
  growth: { activeJobs: 15, unlocks: 300 },
  pro: { activeJobs: 40, unlocks: 800 },
};
