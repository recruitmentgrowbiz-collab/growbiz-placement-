export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <svg viewBox="0 0 440 440" fill="none" className="h-full w-full" aria-hidden="true">
        <circle cx="220" cy="220" r="218" fill="#F0E6F8" />
        <circle cx="220" cy="220" r="150" fill="none" stroke="#DEC7EF" strokeWidth="1" strokeDasharray="3 7" />

        <path d="M120 300 L220 150 L330 290" stroke="#C39EE0" strokeWidth="2" strokeLinecap="round" />
        <path d="M220 150 L220 260" stroke="#C39EE0" strokeWidth="2" strokeLinecap="round" />
        <path d="M120 300 L220 260 L330 290" stroke="#C39EE0" strokeWidth="2" strokeLinecap="round" />

        <circle cx="220" cy="150" r="26" fill="#5B2A82" />
        <circle cx="120" cy="300" r="20" fill="#7F3FA8" />
        <circle cx="330" cy="290" r="20" fill="#7F3FA8" />
        <circle cx="220" cy="260" r="15" fill="#A56FCB" />

        <circle cx="220" cy="150" r="26" fill="none" stroke="#301648" strokeOpacity="0.08" strokeWidth="1" />
      </svg>

      <div className="absolute left-[-8px] top-6 animate-rise rounded-card border border-line bg-white px-3.5 py-2.5 shadow-soft" style={{ animationDelay: "0.15s" }}>
        <p className="text-[12px] font-medium text-ink">Backend Engineer</p>
        <p className="text-[11.5px] text-mist">Bengaluru · ₹12L-18L</p>
      </div>

      <div className="absolute bottom-8 right-[-6px] animate-rise rounded-card border border-line bg-white px-3.5 py-2.5 shadow-soft" style={{ animationDelay: "0.3s" }}>
        <p className="text-[12px] font-medium text-ink">142 candidates shortlisted</p>
        <p className="text-[11.5px] text-mist">this week across active roles</p>
      </div>
    </div>
  );
}
