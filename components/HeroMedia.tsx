import Image from "next/image";

type HeroMediaVariant = "home" | "recruitment" | "career" | "campus";

const media = {
  home: {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=82",
    alt: "Hiring manager and candidate in a professional recruitment discussion",
  },
  recruitment: {
    src: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=82",
    alt: "Recruitment consultant reviewing hiring requirements in a modern office",
  },
  career: {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82",
    alt: "Job seeker using a laptop for resume review and career preparation",
  },
  campus: {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=82",
    alt: "Students collaborating on campus while preparing for early career opportunities",
  },
} satisfies Record<HeroMediaVariant, { src: string; alt: string }>;

export function HeroMedia({ variant }: { variant: HeroMediaVariant }) {
  const item = media[variant];

  return (
    <div className="gb-hero-media relative mt-8 md:mt-10 lg:mt-0">
      <div className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/80 p-2 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.48),0_14px_34px_-28px_rgba(184,0,222,0.34)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-plum-100">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 640px, 42vw"
            className="object-cover"
            priority={variant === "home"}
          />
          <div className="absolute inset-0 bg-plum-600/[0.06]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
