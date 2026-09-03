import { getDashboardHref, getNavigationForRole, type HeaderNavigationState } from "@/config/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getHeaderNavigationState(): Promise<HeaderNavigationState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return getNavigationForRole(null);

  const [{ data: profile }, { data: notifications }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id, template, payload, read_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  return {
    ...getNavigationForRole(profile?.role),
    dashboardHref: getDashboardHref(profile?.role),
    notifications: notifications ?? [],
  };
}
