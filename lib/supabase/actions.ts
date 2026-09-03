"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type ActionState = { error: string | null };

export async function signUpCandidate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const allowed = await checkRateLimit(`signup:${getClientIp()}`, 5, 3600);
  if (!allowed) return { error: "Too many signup attempts. Please try again in a while." };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "candidate", full_name: fullName } },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Something went wrong. Please try again." };

  // Supabase doesn't throw an error for an already-registered email (to avoid
  // leaking which emails have accounts) — instead it returns a user-like
  // object with an empty identities array and no new session. Without this
  // check, the code below would proceed straight into an RLS violation on
  // the next insert, since there's no valid session to attribute it to.
  if (data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  // Create the matching candidates row (profile row is created by DB trigger).
  await supabase.from("candidates").insert({ user_id: data.user.id });

  redirect("/candidate/dashboard");
}

export async function signUpEmployer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const allowed = await checkRateLimit(`signup:${getClientIp()}`, 5, 3600);
  if (!allowed) return { error: "Too many signup attempts. Please try again in a while." };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const companyName = String(formData.get("companyName") ?? "");
  const website = String(formData.get("website") ?? "");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "employer", full_name: fullName } },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Something went wrong. Please try again." };

  if (data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({ name: companyName, website })
    .select()
    .single();

  if (companyError) return { error: companyError.message };

  await supabase
    .from("company_users")
    .insert({ company_id: company.id, user_id: data.user.id, role: "owner" });

  await supabase.from("memberships").insert({ company_id: company.id, plan: "free" });

  redirect("/employer/dashboard");
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // Keyed by email, not just IP — protects a specific account from credential
  // stuffing even if the attempts come from many different IPs.
  const allowed = await checkRateLimit(`login:${email.toLowerCase()}`, 8, 900);
  if (!allowed) return { error: "Too many login attempts. Please wait a few minutes and try again." };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role === "employer") {
    redirect("/employer/dashboard");
  } else if (profile?.role === "recruiter") {
    redirect("/recruiter");
  } else if (profile?.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/candidate/dashboard");
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
