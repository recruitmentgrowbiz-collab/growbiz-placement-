import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-content px-5 md:px-8 ${className}`}>{children}</div>;
}

type ButtonLinkVariant = "primary" | "secondary" | "ghost" | "primary-glass" | "secondary-glass" | "ghost-glass";

const buttonLinkClasses: Record<ButtonLinkVariant, string> = {
  primary: "gb-button--primary text-white active:bg-plum-800",
  secondary: "gb-button--secondary border border-plum-600 bg-white text-plum-600 active:bg-plum-100",
  ghost: "gb-button--ghost text-ink/80 hover:text-plum-600 active:text-plum-700",
  "primary-glass": "gb-button--primary text-white active:bg-plum-800",
  "secondary-glass": "gb-button--secondary border border-plum-600 text-plum-600 active:bg-plum-100",
  "ghost-glass": "gb-button--ghost-glass text-ink/80 active:text-plum-700",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonLinkVariant;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}) {
  const sizeClass = size === "sm" ? "min-h-11 px-3.5 py-2 text-[14px]" : "min-h-11 px-5 py-3 text-[15px]";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`gb-button inline-flex items-center justify-center gap-1.5 max-w-full whitespace-normal text-center rounded-control font-medium ${sizeClass} ${buttonLinkClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[13.5px] font-medium text-plum-600">
      <span className="h-px w-6 bg-plum-300" />
      {children}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return <ButtonLink href={href} className={className}>{children}</ButtonLink>;
}

export function SecondaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return <ButtonLink href={href} variant="secondary" className={className}>{children}</ButtonLink>;
}

export function GhostLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-1 text-[14.5px] font-medium text-plum-600 hover:text-plum-700">
      {children}
      <ArrowUpRight size={15} className="gb-interaction-arrow" aria-hidden="true" />
    </Link>
  );
}

export function PageHero({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-plum-50/60">
      <Container className="py-16 md:py-20">
        <div className="max-w-2xl animate-rise">
          <Kicker>{kicker}</Kicker>
          <h1 className="mt-4 text-balance font-display text-[36px] font-bold leading-[1.12] text-ink md:text-[46px]">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">{subtitle}</p>
          {children}
        </div>
      </Container>
    </section>
  );
}
