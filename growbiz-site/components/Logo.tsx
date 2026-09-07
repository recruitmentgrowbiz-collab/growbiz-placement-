export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <circle cx="8" cy="21" r="3.2" fill="#5B2A82" />
        <circle cx="21" cy="21" r="3.2" fill="#5B2A82" fillOpacity="0.55" />
        <circle cx="14.5" cy="8" r="3.4" fill="#5B2A82" />
        <path d="M10.4 19 13 11.5" stroke="#5B2A82" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M18.7 19 16 11.5" stroke="#5B2A82" strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" />
      </svg>
      <span className="font-display font-bold text-[19px] leading-none text-ink tracking-tight">
        Grow Biz
      </span>
    </span>
  );
}
