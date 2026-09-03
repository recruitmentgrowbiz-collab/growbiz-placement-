import { heroCards } from "@/features/homepage/content";

export function HeroArt() {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] md:block lg:max-w-[440px]" aria-hidden="true">
      <svg viewBox="0 0 440 440" fill="none" className="h-full w-full">
        <circle cx="220" cy="220" r="218" fill="#F0E6F8" />
        <circle cx="220" cy="220" r="150" fill="none" stroke="#DEC7EF" strokeWidth="1" strokeDasharray="3 7" />
        <path d="M120 300 L220 150 L330 290" stroke="#C39EE0" strokeWidth="2" strokeLinecap="round" />
        <path d="M220 150 L220 260" stroke="#C39EE0" strokeWidth="2" strokeLinecap="round" />
        <path d="M120 300 L220 260 L330 290" stroke="#C39EE0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="220" cy="150" r="26" fill="#5B2A82" />
        <circle cx="120" cy="300" r="20" fill="#7F3FA8" />
        <circle cx="330" cy="290" r="20" fill="#7F3FA8" />
        <circle cx="220" cy="260" r="15" fill="#A56FCB" />
      </svg>

      <div className="absolute left-[-8px] top-6 animate-rise rounded-card border border-line bg-white px-3.5 py-2.5 shadow-soft">
        <p className="text-[12px] font-medium text-ink">{heroCards.job.title}</p>
        <p className="text-[11.5px] text-mist">{heroCards.job.meta}</p>
      </div>

      <div className="absolute bottom-8 right-[-6px] animate-rise rounded-card border border-line bg-white px-3.5 py-2.5 shadow-soft">
        <p className="text-[12px] font-medium text-ink">{heroCards.activity.title}</p>
        <p className="text-[11.5px] text-mist">{heroCards.activity.meta}</p>
      </div>
    </div>
  );
}
