"use client";

import React from "react";
import { Container, SecondaryButton } from "@/components/ui";
import { Briefcase, Building, Users } from "lucide-react";
import { motion } from "framer-motion";
import { campusAudiences } from "@/features/public-content/mock/content";

export function CampusAudienceSection() {
  const backgrounds = [
    "bg-plum-50/50 border-plum-100", 
    "bg-white border-line", 
    "bg-[#F4F5F8] border-[#E2E5F1]" // soft navy tint
  ];

  const getVisual = (index: number) => {
    if (index === 0) {
      return (
        <div className="mt-8 rounded-xl border border-white bg-white/60 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-plum-100 text-plum-600">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink">Fresher Opportunity</p>
              <p className="text-[12px] text-mist">Graduate Trainee</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="rounded bg-white px-2.5 py-1 text-[11px] font-medium text-ink/70 shadow-sm">Bengaluru</span>
            <span className="rounded bg-white px-2.5 py-1 text-[11px] font-medium text-ink/70 shadow-sm">0–1 Years</span>
          </div>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="mt-8 rounded-xl border border-line bg-gray-50/50 p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
               <Building size={16} className="text-plum-600" />
               <div>
                 <p className="text-[13px] font-semibold text-ink">Campus Drive</p>
                 <p className="text-[11px] text-mist">Partner Institute</p>
               </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Open</span>
          </div>
          <div className="mt-4 border-t border-line pt-3">
            <p className="text-[12px] text-mist flex justify-between">
              <span>Roles Open</span>
              <span className="font-semibold text-ink">4 Roles</span>
            </p>
            <p className="mt-1 text-[12px] text-mist flex justify-between">
              <span>Drive Status</span>
              <span className="font-semibold text-ink">Scheduling</span>
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-8 rounded-xl border border-white bg-white/60 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-plum-600" />
            <p className="text-[13px] font-semibold text-ink">Graduate Talent</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-mist">Candidate Shortlist</span>
            <span className="rounded-full bg-plum-100 px-2 py-0.5 text-[10px] font-semibold text-plum-700">Ready</span>
          </div>
          <div className="flex items-center gap-3 border-t border-line/50 pt-3">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full border-2 border-white bg-plum-200"></div>
              <div className="h-7 w-7 rounded-full border-2 border-white bg-plum-300"></div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-plum-600 text-[10px] font-bold text-white">+1</div>
            </div>
            <span className="text-[12px] font-medium text-ink">3 Profiles Ready</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="border-b border-line py-16 md:py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-3">
          {campusAudiences.map((item, index) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={item.title} 
              className={`flex flex-col justify-between rounded-[20px] border p-7 lg:p-8 transition-transform hover:-translate-y-1 ${backgrounds[index]}`}
            >
              <div>
                <h2 className="font-display text-[22px] font-bold text-ink">{item.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">{item.text}</p>
                {getVisual(index)}
              </div>
              <div className="mt-8">
                <SecondaryButton href={item.cta.href} className="w-full justify-center bg-white hover:border-plum-300 hover:text-plum-700">
                  {item.cta.label}
                </SecondaryButton>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

