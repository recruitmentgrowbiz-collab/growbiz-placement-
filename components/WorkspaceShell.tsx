"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useDialogFocus } from "@/components/useDialogFocus";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useRef, useState } from "react";

export type WorkspaceNavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
};

export function WorkspaceShell({
  title,
  subtitle,
  nav,
  children,
  tone = "light",
}: {
  title: string;
  subtitle?: string;
  nav: WorkspaceNavItem[];
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  useDialogFocus(open, drawerRef, () => setOpen(false), 1024);

  useEffect(() => setOpen(false), [pathname]);


  return (
    <div className="min-h-screen bg-plum-50/30">
      <div className={`border-b border-line ${tone === "dark" ? "bg-plum-900 text-white" : "bg-white text-ink"} lg:hidden`}>
        <div className="flex min-h-16 items-center justify-between gap-3 px-5">
          <div className="min-w-0">
            <p className="truncate font-display text-[17px] font-bold">{title}</p>
            {subtitle && <p className={`truncate text-[12.5px] ${tone === "dark" ? "text-white/62" : "text-mist"}`}>{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Open workspace menu"
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={() => setOpen(true)}
            className={`gb-button gb-button--icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border transition-colors ${tone === "dark" ? "border-white/18 text-white hover:bg-white/10" : "border-line text-ink hover:border-plum-300 hover:text-plum-700"}`}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && createPortal(
        <div className="fixed inset-0 z-overlay lg:hidden">
          <button type="button" aria-label="Close workspace menu overlay" tabIndex={-1} className="gb-overlay absolute inset-0 h-full w-full" onClick={() => setOpen(false)} />
          <aside ref={drawerRef} id={drawerId} role="dialog" aria-modal="true" aria-label="Workspace navigation" className="glass-elevated absolute right-0 top-0 flex h-dvh w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-line bg-paper shadow-lift">
            <div className="flex min-h-16 items-center justify-between gap-3 border-b border-line px-5">
              <div className="min-w-0">
                <p className="truncate font-display text-[17px] font-bold text-ink">{title}</p>
                {subtitle && <p className="truncate text-[12.5px] text-mist">{subtitle}</p>}
              </div>
              <button ref={closeRef} type="button" aria-label="Close workspace menu" onClick={() => setOpen(false)} className="gb-button gb-button--icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line bg-white text-ink">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <WorkspaceNav nav={nav} />
          </aside>
        </div>, document.body
      )}

      <div className="mx-auto grid max-w-content lg:grid-cols-[238px_1fr] lg:px-8">
        <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] overflow-y-auto border-r border-line bg-white/75 py-6 lg:block">
          <div className="px-5">
            <p className="font-display text-[18px] font-bold text-ink">{title}</p>
            {subtitle && <p className="mt-1 truncate text-[12.5px] text-mist">{subtitle}</p>}
          </div>
          <WorkspaceNav nav={nav} />
        </aside>
        <main className="min-w-0 px-5 py-8 md:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function WorkspaceNav({ nav }: { nav: WorkspaceNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace navigation" className="grid gap-1 px-3 py-4 lg:mt-4 lg:py-0">
      {nav.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`gb-sidebar-link flex min-h-11 items-center gap-3 rounded-control px-3 text-[14px] font-medium transition-colors ${active ? "bg-plum-600 text-white" : "text-ink/75 hover:bg-plum-50 hover:text-plum-700"}`}>
            {Icon && <Icon size={17} aria-hidden />}
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
