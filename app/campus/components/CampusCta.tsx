"use client";

import React from "react";
import { Container, PrimaryButton, SecondaryButton } from "@/components/ui";
import { Calendar, Users, Building, CheckCircle2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function CampusCta() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="overflow-hidden rounded-[24px] bg-ink relative shadow-xl">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
          
          <div className="grid gap-12 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <h2 className="font-display text-[28px] font-bold text-white md:text-[36px] leading-tight">
                Build a campus hiring pathway with Grow Biz.
              </h2>
              <p className="mt-4 max-w-md text-[16px] text-white/70 leading-relaxed">
                Connect graduate talent with early-career opportunities through a structured, transparent process.
              </p>
              
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {/* Default PrimaryButton is magenta (plum-600) */}
                <PrimaryButton href="/contact">
                  Start a Partnership
                </PrimaryButton>
                <SecondaryButton 
                  href="/jobs?experience=fresher" 
                  className="!border-white/20 !bg-transparent !text-white hover:!bg-white/10 hover:!border-white/40"
                >
                  Search Fresher Jobs
                </SecondaryButton>
              </div>

              {/* Trust Strip */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                {["Fresher Roles", "Internships", "Campus Drives", "Graduate Hiring"].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-[12px] font-medium text-white/50 uppercase tracking-wide">
                    <CheckCircle2 size={12} className="text-plum-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Illustrative UI */}
            <div className="relative z-10 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[340px] rounded-xl border border-white/10 bg-[#0f172a]/80 p-5 shadow-2xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-plum-600/20 text-plum-400">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-white">Campus Drive</p>
                      <p className="text-[12px] text-white/50">Institute Partner</p>
                    </div>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-plum-500 animate-pulse" />
                </div>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70">
                      <Users size={15} />
                      <span className="text-[13px]">Eligible Students</span>
                    </div>
                    <span className="text-[13px] font-semibold text-white">48 Profiles</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70">
                      <Briefcase size={15} />
                      <span className="text-[13px]">Roles Published</span>
                    </div>
                    <span className="text-[13px] font-semibold text-white">6 Roles</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar size={15} />
                      <span className="text-[13px]">Drive Status</span>
                    </div>
                    <span className="rounded bg-plum-600/20 px-2 py-0.5 text-[11px] font-semibold text-plum-300">
                      Scheduled
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
