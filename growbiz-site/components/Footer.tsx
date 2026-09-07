import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  {
    title: "For Employers",
    links: [
      { label: "Post a Job", href: "/employers" },
      { label: "Recruitment Services", href: "/recruitment-services" },
      { label: "Membership Plans", href: "/pricing" },
    ],
  },
  {
    title: "For Candidates",
    links: [
      { label: "Search Jobs", href: "/jobs" },
      { label: "Career Resources", href: "/career-resources" },
      { label: "Career Plus", href: "/career-resources#career-plus" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Campus Partnerships", href: "/campus" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-plum-900 text-white/85">
      <div className="mx-auto max-w-content px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <circle cx="8" cy="21" r="3.2" fill="#DEC7EF" />
                <circle cx="21" cy="21" r="3.2" fill="#DEC7EF" fillOpacity="0.55" />
                <circle cx="14.5" cy="8" r="3.4" fill="#DEC7EF" />
                <path d="M10.4 19 13 11.5" stroke="#DEC7EF" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M18.7 19 16 11.5" stroke="#DEC7EF" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="font-display text-[18px] font-bold text-white">Grow Biz</span>
            </span>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-white/60">
              Connecting Talent With Opportunity. Recruitment, staffing, RPO, campus hiring and a
              growing job marketplace.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[13px] font-medium text-white/50">{col.title}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14.5px] text-white/80 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Grow Biz Recruitment &amp; Placement. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/report" className="hover:text-white/80">Report a suspicious job</Link>
            <Link href="/privacy" className="hover:text-white/80">Privacy</Link>
            <Link href="/terms" className="hover:text-white/80">Terms</Link>
            <Link href="/contact" className="hover:text-white/80">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
