import Link from "next/link";

const columns = [
  {
    title: "FOR CANDIDATES",
    links: [
      { label: "Search Jobs", href: "/jobs" },
      { label: "Career Resources", href: "/career-resources" },
      { label: "Career Plus", href: "/career-plus" },
    ],
  },
  {
    title: "FOR EMPLOYERS",
    links: [
      { label: "Hire Talent", href: "/employers" },
      { label: "Recruitment Services", href: "/recruitment-services" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Campus", href: "/campus" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "TRUST & LEGAL",
    links: [
      { label: "Report / Safety", href: "/report" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Candidate Consent", href: "/candidate-consent" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-plum-900 text-white/85">
      <div className="mx-auto max-w-content px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr]">
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
              Connecting Talent With Opportunity.
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
          <p>&copy; 2026 Grow Biz Recruitment &amp; Placement. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/report" className="hover:text-white/80">Report / Safety</Link>
            <Link href="/privacy" className="hover:text-white/80">Privacy</Link>
            <Link href="/terms" className="hover:text-white/80">Terms</Link>
            <Link href="/contact" className="hover:text-white/80">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
