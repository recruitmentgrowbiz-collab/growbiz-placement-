"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CareerResource } from "@/features/public-content/types";
import Link from "next/link";

interface ResourceGuideDrawerProps {
  isOpen: boolean;
  resource: CareerResource | null;
  onClose: () => void;
  nextResource: CareerResource | null;
  onNext: (id: string) => void;
}

export function ResourceGuideDrawer({ isOpen, resource, onClose, nextResource, onNext }: ResourceGuideDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock with padding to prevent layout shift
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPadding = window.getComputedStyle(document.body).paddingRight;
      
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = originalPadding;
      };
    }
  }, [isOpen]);

  // Read progress tracking
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(100);
    } else {
      setScrollProgress((scrollTop / maxScroll) * 100);
    }
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [isOpen, resource]);

  const getCtaHref = (category?: string) => {
    if (category === "Resume") return "/jobs"; // SEARCH JOBS
    if (category === "Interview") return "/jobs"; // BROWSE JOBS
    if (category === "Salary") return "/jobs"; // EXPLORE ROLES
    if (category === "Skills") return "/jobs"; // SEARCH JOBS BY SKILL
    return "/jobs";
  };

  const getCtaLabel = (category?: string) => {
    if (category === "Resume") return "SEARCH JOBS ↗";
    if (category === "Interview") return "BROWSE JOBS ↗";
    if (category === "Salary") return "EXPLORE ROLES ↗";
    if (category === "Skills") return "SEARCH JOBS BY SKILL ↗";
    return "SEARCH JOBS ↗";
  };

  return (
    <AnimatePresence>
      {isOpen && resource && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-x-3 top-1/2 z-[101] -translate-y-1/2 sm:inset-x-6 md:left-1/2 md:right-auto md:w-[min(760px,calc(100vw-3rem))] md:-translate-x-1/2">
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.24 }}
            className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-card border border-line bg-white shadow-[0_32px_90px_-42px_rgba(15,23,42,0.65)]"
          >
            {/* Top progress bar */}
            <div className="absolute left-0 top-0 h-[3px] w-full bg-plum-100 z-10">
              <div 
                className="h-full bg-plum-600 transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-line bg-white p-5 md:p-8 pt-6 md:pt-10">
              <div className="pr-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-plum-500" aria-hidden="true" />
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-plum-600">
                    {resource.category}
                  </p>
                </div>
                <h2 id="drawer-title" className="mt-3 font-display text-[26px] font-bold leading-tight text-ink md:text-[32px]">
                  {resource.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-mist">
                  {resource.excerpt}
                </p>
                <p className="mt-3 text-[12px] font-medium text-mist uppercase tracking-widest">
                  {resource.readTime} read
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-mist transition-colors hover:bg-plum-50 hover:text-ink focus:outline-none focus:ring-2 focus:ring-plum-500"
                aria-label="Close guide"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div 
              ref={contentRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 md:p-8"
            >
              <div className="mx-auto max-w-prose space-y-10">
                {resource.sections?.map((section, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-4">
                      <span className="font-display text-[24px] font-bold text-plum-600/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-[18px] font-bold uppercase tracking-[0.04em] text-ink">
                          {section.title}
                        </h3>
                        <p className="mt-3 text-[15.5px] leading-[1.8] text-ink/80">
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* CTA */}
                <div className="mt-12 rounded-2xl border border-plum-200 bg-plum-50/50 p-6 text-center">
                  <h4 className="font-display text-lg font-semibold text-ink">Ready to start?</h4>
                  <div className="mt-4">
                    <Link 
                      href={getCtaHref(resource.category)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-plum-600 px-6 text-[14px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-plum-700 focus:outline-none focus:ring-2 focus:ring-plum-500 focus:ring-offset-2"
                    >
                      {getCtaLabel(resource.category)}
                    </Link>
                  </div>
                </div>

                {/* Next Guide */}
                {nextResource && (
                  <div className="mt-12 border-t border-line pt-8 pb-12">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-mist">
                      Next Guide
                    </p>
                    <button
                      onClick={() => onNext(nextResource.slug)}
                      className="group mt-3 flex w-full items-center justify-between rounded-xl border border-line bg-white p-5 text-left transition-all hover:border-plum-300 hover:bg-plum-50/50 hover:shadow-sm"
                    >
                      <div>
                        <p className="text-[12px] font-medium text-plum-600 uppercase tracking-widest">{nextResource.category}</p>
                        <p className="mt-1 font-display text-[18px] font-semibold text-ink">{nextResource.title}</p>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-50 text-plum-600 transition-transform group-hover:translate-x-1 group-hover:bg-plum-100">
                        <ArrowRight size={20} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
