"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

const appPrefixes = ["/candidate", "/employer/dashboard", "/employer/company", "/employer/jobs", "/employer/applicants", "/employer/candidates", "/employer/interviews", "/employer/team", "/employer/membership", "/employer/recruitment", "/employer/reports", "/employer/settings", "/recruiter", "/admin", "/settings"];

export function RouteFooter() {
  const pathname = usePathname();
  if (appPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;
  return <Footer />;
}
