import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { NotificationBell } from "./NotificationBell";
import { nav } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

export async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardHref = "/candidate/dashboard";
  let notifications: any[] = [];
  if (user) {
    const [{ data: profile }, { data: notifs }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id, template, payload, read_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(15),
    ]);
    notifications = notifs ?? [];
    if (profile?.role === "employer") {
      dashboardHref = "/employer/dashboard";
    } else if (profile?.role === "recruiter") {
      dashboardHref = "/recruiter";
    } else if (profile?.role === "admin") {
      dashboardHref = "/admin";
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14.5px] text-ink/80 transition-colors hover:text-plum-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <>
              <NotificationBell notifications={notifications} />
              <Link
                href={dashboardHref}
                className="rounded-pill px-3.5 py-2 text-[14.5px] text-ink/80 hover:text-plum-600"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="rounded-pill px-3.5 py-2 text-[14.5px] text-ink/80 hover:text-plum-600"
              >
                Settings
              </Link>
              <form action={signOut}>
                <button className="rounded-pill border border-line px-4 py-2 text-[14.5px] font-medium text-ink/80 hover:border-plum-300">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-pill px-3.5 py-2 text-[14.5px] text-ink/80 hover:text-plum-600"
              >
                Login
              </Link>
              <Link
                href="/jobs"
                className="rounded-pill border border-plum-600 px-4 py-2 text-[14.5px] font-medium text-plum-600 transition-colors hover:bg-plum-50"
              >
                Search Jobs
              </Link>
              <Link
                href="/employer/signup"
                className="rounded-pill bg-plum-600 px-4 py-2 text-[14.5px] font-medium text-white transition-colors hover:bg-plum-700"
              >
                Hire Talent
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          {user && <NotificationBell notifications={notifications} />}
          <MobileMenuToggle>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2.5 text-[15px] text-ink/85 hover:bg-plum-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="rounded-pill border border-plum-600 px-4 py-2.5 text-center text-[15px] font-medium text-plum-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="rounded-pill border border-line px-4 py-2.5 text-center text-[15px] font-medium text-ink/80"
                >
                  Settings
                </Link>
                <form action={signOut}>
                  <button className="w-full rounded-pill border border-line px-4 py-2.5 text-center text-[15px] font-medium text-ink/80">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/jobs"
                  className="rounded-pill border border-plum-600 px-4 py-2.5 text-center text-[15px] font-medium text-plum-600"
                >
                  Search Jobs
                </Link>
                <Link
                  href="/employer/signup"
                  className="rounded-pill bg-plum-600 px-4 py-2.5 text-center text-[15px] font-medium text-white"
                >
                  Hire Talent
                </Link>
              </>
            )}
          </div>
          </MobileMenuToggle>
        </div>
      </div>
    </header>
  );
}
