"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";
import { isNavItemActive, publicNav, type HeaderNavigationState } from "@/config/navigation";

export function HeaderClient({
  state,
  signOutAction,
}: {
  state: HeaderNavigationState;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const drawerId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-header border-b border-line bg-paper/95 shadow-[0_1px_0_rgba(231,225,239,0.65)] backdrop-blur supports-[backdrop-filter]:bg-paper/88">
      <div className="mx-auto flex min-h-[64px] max-w-content items-center justify-between gap-3 px-4 xs:px-5 md:px-8 xl:px-6">
        <Link href="/" aria-label="Grow Biz home" className="shrink-0 rounded-control">
          <Logo />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 min-[1120px]:flex">
          {publicNav.map((item) => {
            const active = isNavItemActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-control px-3 py-2 text-[14px] font-medium leading-none transition-colors hover:text-plum-600 ${
                  active ? "text-plum-700" : "text-ink/78"
                }`}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-plum-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 min-[1120px]:flex">
          {state.authenticated && <NotificationBell notifications={state.notifications as any[]} />}
          {state.actions.map((action) => (
            <ButtonLink key={action.href} href={action.href} variant={action.variant} size="sm">
              {action.label}
            </ButtonLink>
          ))}
          {state.authenticated && (
            <form action={signOutAction}>
              <button className="min-h-10 whitespace-nowrap rounded-pill border border-line px-3.5 py-2 text-[14px] font-medium text-ink/80 transition-colors hover:border-plum-300 hover:text-plum-600">
                Log out
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center gap-2 min-[1120px]:hidden">
          {state.authenticated && <NotificationBell notifications={state.notifications as any[]} />}
          {!state.authenticated && (
            <ButtonLink href="/employers" size="sm" className="hidden xs:inline-flex">
              Hire Talent
            </ButtonLink>
          )}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-line bg-white text-ink transition-colors hover:border-plum-300 hover:text-plum-600"
          >
            <Menu size={21} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[64px] z-overlay min-[1120px]:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 h-full w-full bg-ink/24"
            onClick={() => setOpen(false)}
          />
          <aside
            ref={drawerRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute right-0 top-0 flex h-[calc(100dvh-64px)] w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-line bg-paper shadow-lift"
          >
            <div className="flex min-h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-line bg-white text-ink transition-colors hover:border-plum-300 hover:text-plum-600"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile primary navigation" className="flex flex-col gap-1 p-4">
              {publicNav.map((item) => {
                const active = isNavItemActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-control border px-3.5 text-[15px] font-medium transition-colors ${
                      active
                        ? "border-plum-200 bg-plum-50 text-plum-700"
                        : "border-transparent text-ink/82 hover:bg-plum-50 hover:text-plum-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-line p-4">
              <div className="grid gap-2">
                {state.actions.map((action) => (
                  <ButtonLink key={action.href} href={action.href} variant={action.variant} className="w-full">
                    {action.label}
                  </ButtonLink>
                ))}
                {state.authenticated && (
                  <form action={signOutAction}>
                    <button className="min-h-11 w-full rounded-pill border border-line px-5 py-3 text-[15px] font-medium text-ink/80 transition-colors hover:border-plum-300 hover:text-plum-600">
                      Log out
                    </button>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
