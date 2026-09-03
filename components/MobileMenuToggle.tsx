"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        className="text-ink lg:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <div
          className="absolute inset-x-0 top-full z-50 border-t border-line bg-paper px-5 pb-5 pt-2 shadow-soft lg:hidden"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </>
  );
}
