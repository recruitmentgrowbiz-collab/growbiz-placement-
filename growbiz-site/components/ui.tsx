import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-content px-5 md:px-8 ${className}`}>{children}</div>;
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
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-plum-700 ${className}`}
    >
      {children}
    </Link>
  );
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
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-pill border border-plum-600 px-5 py-3 text-[15px] font-medium text-plum-600 transition-colors hover:bg-plum-50 ${className}`}
    >
      {children}
    </Link>
  );
}

export function GhostLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[14.5px] font-medium text-plum-600 hover:text-plum-700">
      {children}
      <ArrowUpRight size={15} />
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
