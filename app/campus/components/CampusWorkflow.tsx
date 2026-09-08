"use client";

import React from "react";
import { Container, Kicker } from "@/components/ui";
import { motion } from "framer-motion";

const phases = [
  {
    name: "PREPARE",
    steps: [
      { num: "01", title: "Partner Requirement", desc: "Define role, volume and drive expectations." },
      { num: "02", title: "Student / Institute Coordination", desc: "Align eligible candidate pools and drive logistics." },
    ]
  },
  {
    name: "LAUNCH",
    steps: [
      { num: "03", title: "Role / Opportunity Publishing", desc: "Share approved fresher or internship roles." },
      { num: "04", title: "Screening / Shortlisting", desc: "Review candidates and prepare shortlists." },
    ]
  },
  {
    name: "HIRE",
    steps: [
      { num: "05", title: "Interview / Drive Coordination", desc: "Coordinate interview rounds or campus drive." },
      { num: "06", title: "Hiring / Placement Tracking", desc: "Track selections and joining status." },
    ]
  }
];

export function CampusWorkflow() {
  return (
    <section className="border-b border-line bg-plum-50/30 py-16 md:py-24 overflow-hidden">
      <Container>
        <Kicker>Campus hiring workflow</Kicker>
        <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[34px]">
          A structured pathway for students, institutes and employers
        </h2>

        {/* Desktop / Tablet Horizontal Flow */}
        <div className="mt-16 hidden md:block">
          <div className="grid grid-cols-3 gap-8 relative">
            {/* Background connection line */}
            <div className="absolute top-[3.5rem] left-[10%] right-[10%] h-px bg-plum-200" aria-hidden="true" />
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute top-[3.5rem] left-[10%] right-[10%] h-px bg-plum-600 origin-left"
              aria-hidden="true" 
            />

            {phases.map((phase, pIdx) => (
              <div key={phase.name} className="relative z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-plum-600/70 mb-6">
                  {phase.name}
                </span>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {phase.steps.map((step, sIdx) => (
                    <motion.div 
                      key={step.num}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (pIdx * 2 + sIdx) * 0.15, duration: 0.4 }}
                      className="flex flex-col items-center text-center group"
                    >
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-plum-600 text-plum-600 transition-colors group-hover:bg-plum-600 group-hover:text-white">
                        <span className="font-display text-[12px] font-bold">{step.num}</span>
                      </div>
                      <div className="mt-6 rounded-lg bg-white p-4 border border-line/60 shadow-sm w-full h-full">
                        <h3 className="font-display text-[14px] font-semibold text-ink leading-tight">{step.title}</h3>
                        <p className="mt-2 text-[12px] text-mist leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Flow */}
        <div className="mt-12 md:hidden">
          <div className="space-y-10 relative">
            {/* Background vertical line */}
            <div className="absolute left-[1.3rem] top-2 bottom-4 w-px bg-plum-200" aria-hidden="true" />
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute left-[1.3rem] top-2 bottom-4 w-px bg-plum-600 origin-top"
              aria-hidden="true" 
            />

            {phases.map((phase) => (
              <div key={phase.name} className="relative z-10">
                <span className="ml-14 text-[11px] font-bold uppercase tracking-[0.15em] text-plum-600/70 block mb-6">
                  {phase.name}
                </span>
                <div className="space-y-8">
                  {phase.steps.map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className="relative shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-white border-2 border-plum-600 text-plum-600">
                        <span className="font-display text-[14px] font-bold">{step.num}</span>
                      </div>
                      <div className="rounded-lg bg-white p-4 border border-line/60 shadow-sm w-full">
                        <h3 className="font-display text-[15px] font-semibold text-ink">{step.title}</h3>
                        <p className="mt-1 text-[13.5px] text-mist leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </Container>
    </section>
  );
}

