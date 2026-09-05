type SupabaseLike = {
  from: (table: string) => any;
};

function isMissingColumn(error: any, column: string) {
  return error?.code === "PGRST204" && String(error.message ?? "").includes(`'${column}'`);
}

export async function insertPaymentRecord(supabase: SupabaseLike, row: Record<string, unknown>) {
  const result = await supabase.from("payments").insert(row);
  if (!isMissingColumn(result.error, "provider_order_id")) {
    return result;
  }

  const { provider_order_id, provider_payment_id, ...rest } = row;
  return supabase.from("payments").insert({
    ...rest,
    razorpay_order_id: provider_order_id,
    razorpay_payment_id: provider_payment_id,
  });
}

export async function findPaymentByOrderId(admin: SupabaseLike, orderId: string) {
  const result = await admin.from("payments").select("*").eq("provider_order_id", orderId).maybeSingle();
  if (!isMissingColumn(result.error, "provider_order_id") && result.data) {
    return result;
  }

  return admin.from("payments").select("*").eq("razorpay_order_id", orderId).maybeSingle();
}

export async function markPaymentPaid(admin: SupabaseLike, id: string, paymentId: string) {
  const result = await admin
    .from("payments")
    .update({ provider_payment_id: paymentId, status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);
  if (!isMissingColumn(result.error, "provider_payment_id")) {
    return result;
  }

  return admin
    .from("payments")
    .update({ razorpay_payment_id: paymentId, status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);
}

export async function markPaymentFailed(admin: SupabaseLike, orderId: string) {
  const result = await admin
    .from("payments")
    .update({ status: "failed" })
    .eq("provider_order_id", orderId)
    .eq("status", "created")
    .select("id");
  if (!isMissingColumn(result.error, "provider_order_id") && result.data?.length) {
    return result;
  }

  return admin
    .from("payments")
    .update({ status: "failed" })
    .eq("razorpay_order_id", orderId)
    .eq("status", "created")
    .select("id");
}
