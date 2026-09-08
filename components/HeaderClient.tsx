"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useDialogFocus } from "@/components/useDialogFocus";
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
  const [scrolled, setScrolled] = useState(false);
  useDialogFocus(open, drawerRef, () => setOpen(false), 1120);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let frame = 0;
    const update = () => { frame = 0; setScrolled(window.scrollY > 12); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <header data-scrolled={scrolled} className="gb-header sticky top-0 z-header border-b border-line">
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
                className={`gb-nav-link relative rounded-control px-3 py-2 text-[14px] font-medium leading-none transition-colors hover:text-plum-600 ${
                  active ? "text-plum-700" : "text-ink/78"
                }`}
              >
                {item.label}
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
              <button className="gb-button min-h-11 whitespace-nowrap rounded-pill border border-line px-3.5 py-2 text-[14px] font-medium text-ink/80 transition-colors hover:border-plum-300 hover:text-plum-600">
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
            className="gb-button gb-button--icon glass-button inline-flex h-11 w-11 items-center justify-center rounded-control border bg-white text-ink transition-colors hover:border-plum-300 hover:text-plum-600"
          >
            <Menu size={21} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && createPortal(
        <div className="fixed inset-0 top-[64px] z-overlay min-[1120px]:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close menu overlay"
            tabIndex={-1}
            className="gb-overlay absolute inset-0 h-full w-full"
            onClick={() => setOpen(false)}
          />
          <aside
            ref={drawerRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="glass-elevated absolute right-0 top-0 flex h-[calc(100dvh-64px)] w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-line bg-paper shadow-lift"
          >
            <div className="flex min-h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="gb-button gb-button--icon glass-button inline-flex h-11 w-11 items-center justify-center rounded-control border bg-white text-ink transition-colors hover:border-plum-300 hover:text-plum-600"
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

            <div className="gb-header-actions mt-auto border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="grid gap-2">
                {state.actions.map((action) => (
                  <ButtonLink key={action.href} href={action.href} variant={action.variant} className="w-full">
                    {action.label}
                  </ButtonLink>
                ))}
                {state.authenticated && (
                  <form action={signOutAction}>
                    <button className="gb-button min-h-11 w-full rounded-pill border border-line px-5 py-3 text-[15px] font-medium text-ink/80 transition-colors hover:border-plum-300 hover:text-plum-600">
                      Log out
                    </button>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>, document.body
      )}
    </header>
  );
}
