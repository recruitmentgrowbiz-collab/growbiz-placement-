import { createAdminClient } from "@/lib/supabase/admin";

function isMissingColumn(error: any, column: string) {
  return error?.code === "42703" || (error?.code === "PGRST204" && String(error.message ?? "").includes(`'${column}'`));
}

function addOneYear(value: string) {
  const expiresAt = new Date(value);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  return expiresAt.toISOString();
}

export async function getCareerPlusExpiresAt(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const candidate = await admin
    .from("candidates")
    .select("career_plus_expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!candidate.error && candidate.data?.career_plus_expires_at) {
    return candidate.data.career_plus_expires_at;
  }

  if (candidate.error && !isMissingColumn(candidate.error, "career_plus_expires_at")) {
    return null;
  }

  const paidPayment = await admin
    .from("payments")
    .select("paid_at, created_at")
    .eq("created_by", userId)
    .eq("plan", "career_plus")
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const paidAt = paidPayment.data?.paid_at ?? paidPayment.data?.created_at;
  return paidAt ? addOneYear(paidAt) : null;
}

export async function hasActiveCareerPlus(userId: string) {
  const expiresAt = await getCareerPlusExpiresAt(userId);
  return !!expiresAt && new Date(expiresAt) > new Date();
}
