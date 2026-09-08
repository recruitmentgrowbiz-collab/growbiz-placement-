"use client";

import { CSSProperties, PointerEvent, useState } from "react";
import { heroCards } from "@/features/homepage/content";

type HeroStyle = CSSProperties & {
  "--gb-parallax-x": string;
  "--gb-parallax-y": string;
};

export function HeroArt() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    setParallax({ x, y });
  }

  const style: HeroStyle = {
    "--gb-parallax-x": `${parallax.x}px`,
    "--gb-parallax-y": `${parallax.y}px`,
  };

  return (
    <div
      className="gb-hero-art relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[440px]"
      aria-hidden="true"
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setParallax({ x: 0, y: 0 })}
    >
      <svg viewBox="0 0 440 440" fill="none" className="h-full w-full">
        <g className="gb-hero-layer gb-hero-bg">
          <circle className="gb-hero-circle" cx="220" cy="220" r="218" fill="rgb(var(--gb-accent-100))" />
          <circle className="gb-hero-orbit" cx="220" cy="220" r="150" fill="none" stroke="rgb(var(--gb-accent-200))" strokeWidth="1" strokeDasharray="3 7" />
        </g>
        <g className="gb-hero-layer gb-hero-lines" stroke="rgb(var(--gb-accent-300))" strokeWidth="2" strokeLinecap="round">
          <path d="M120 300 L220 150 L330 290" />
          <path d="M220 150 L220 260" />
          <path d="M120 300 L220 260 L330 290" />
        </g>
        <g className="gb-hero-layer gb-hero-nodes">
          <circle className="gb-hero-node gb-hero-node--top" cx="220" cy="150" r="26" fill="rgb(var(--gb-magenta-action))" />
          <circle className="gb-hero-node gb-hero-node--left" cx="120" cy="300" r="20" fill="rgb(var(--gb-magenta))" />
          <circle className="gb-hero-node gb-hero-node--right" cx="330" cy="290" r="20" fill="rgb(var(--gb-magenta))" />
          <circle className="gb-hero-node gb-hero-node--center" cx="220" cy="260" r="15" fill="rgb(var(--gb-accent-400))" />
        </g>
      </svg>

      <div className="gb-hero-card gb-hero-card--top glass-soft absolute left-2 top-6 rounded-card border px-3.5 py-2.5 sm:left-[-8px]">
        <p className="text-[12px] font-medium text-ink">{heroCards.job.title}</p>
        <p className="text-[11.5px] text-mist">{heroCards.job.meta}</p>
      </div>

      <div className="gb-hero-card gb-hero-card--bottom glass-soft absolute bottom-8 right-2 rounded-card border px-3.5 py-2.5 sm:right-[-6px]">
        <p className="text-[12px] font-medium text-ink">{heroCards.activity.title}</p>
        <p className="text-[11.5px] text-mist">{heroCards.activity.meta}</p>
      </div>
    </div>
  );
}
