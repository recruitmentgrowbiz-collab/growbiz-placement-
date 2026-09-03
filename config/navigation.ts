import type { UserRole } from "@/features/auth/types";

export type NavItem = {
  label: string;
  href: string;
  match?: string[];
};

export const publicNav: NavItem[] = [
  { label: "Jobs", href: "/jobs", match: ["/jobs"] },
  { label: "Employers", href: "/employers", match: ["/employers", "/employer", "/companies"] },
  { label: "Recruitment Services", href: "/recruitment-services", match: ["/recruitment-services"] },
  { label: "Career Resources", href: "/career-resources", match: ["/career-resources", "/career-plus"] },
  { label: "Campus", href: "/campus", match: ["/campus"] },
  { label: "About", href: "/about", match: ["/about"] },
];

export type HeaderAction = NavItem & {
  variant: "primary" | "secondary" | "ghost";
};

export type HeaderNavigationState = {
  authenticated: boolean;
  dashboardHref?: string;
  notifications: unknown[];
  actions: HeaderAction[];
};

export const publicHeaderActions: HeaderAction[] = [
  { label: "Login", href: "/login", variant: "ghost", match: ["/login", "/signup"] },
  { label: "Search Jobs", href: "/jobs", variant: "secondary", match: ["/jobs"] },
  { label: "Hire Talent", href: "/employers", variant: "primary", match: ["/employers", "/employer"] },
];

export function getNavigationForRole(role?: string | null): HeaderNavigationState {
  if (!role) {
    return { authenticated: false, notifications: [], actions: publicHeaderActions };
  }

  const dashboardHref = getDashboardHref(role);
  const dashboardLabel =
    dashboardHref === "/recruiter" ? "Recruiter Workspace" : dashboardHref === "/admin" ? "Admin Dashboard" : "Dashboard";

  return {
    authenticated: true,
    dashboardHref,
    notifications: [],
    actions: [
      { label: dashboardLabel, href: dashboardHref, variant: "primary", match: [dashboardHref] },
      { label: "Settings", href: "/settings", variant: "ghost", match: ["/settings"] },
    ],
  };
}

export function isNavItemActive(pathname: string, item: NavItem) {
  const matches = item.match ?? [item.href];
  return matches.some((match) => pathname === match || pathname.startsWith(`${match}/`));
}

export const dashboardRoutes: Partial<Record<UserRole, string>> = {
  candidate: "/candidate/dashboard",
  employer_owner: "/employer/dashboard",
  employer_admin: "/employer/dashboard",
  employer_recruiter: "/employer/dashboard",
  employer_viewer: "/employer/dashboard",
  growbiz_recruiter: "/recruiter",
  growbiz_admin: "/admin",
};

export function getDashboardHref(role?: string | null) {
  if (role === "employer") return "/employer/dashboard";
  if (role === "recruiter") return "/recruiter";
  if (role === "admin") return "/admin";
  return dashboardRoutes[role as UserRole] ?? "/candidate/dashboard";
}
