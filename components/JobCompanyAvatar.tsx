"use client";

import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg";

const tints = [
  "bg-plum-50 text-plum-700 ring-plum-100",
  "bg-[#FDF2FF] text-[#A400CF] ring-[#EEC1FA]",
  "bg-slate-100 text-slate-700 ring-slate-200",
  "bg-[#F9E6FF] text-[#63007E] ring-[#E191F6]/45",
];

const sizes: Record<AvatarSize, string> = {
  sm: "h-11 w-11 text-[13px]",
  md: "h-14 w-14 text-[15px]",
  lg: "h-16 w-16 text-[17px]",
};

export function JobCompanyAvatar({ company, logoUrl, size = "md" }: { company: string; logoUrl?: string; size?: AvatarSize }) {
  const tint = tints[hashCompany(company) % tints.length];
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-card ring-1 ${sizes[size]} ${tint}`}>
      {logoUrl ? <Image src={logoUrl} alt="" width={64} height={64} className="h-full w-full object-cover" /> : <span className="font-display font-bold">{initials || "GB"}</span>}
    </span>
  );
}

function hashCompany(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash;
}
