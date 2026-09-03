import { HeaderClient } from "@/components/HeaderClient";
import { getHeaderNavigationState } from "@/lib/header-navigation-state";
import { signOut } from "@/lib/supabase/actions";

export async function Header() {
  const state = await getHeaderNavigationState();
  return <HeaderClient state={state} signOutAction={signOut} />;
}
