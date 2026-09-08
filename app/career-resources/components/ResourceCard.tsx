"use client";

import { FileText, MessageSquare, IndianRupee, Sparkles, ArrowRight } from "lucide-react";
import React from "react";

interface ResourceCardProps {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  onClick: () => void;
}

export function ResourceCard({ id, category, title, excerpt, readTime, onClick }: ResourceCardProps) {
  const getVisual = () => {
    switch (category) {
      case "Resume":
        return (
          <div className="relative flex h-full w-full items-center justify-center bg-plum-50">
            <div className="absolute h-24 w-16 -rotate-6 rounded border border-plum-200 bg-white shadow-sm" />
            <div className="absolute h-24 w-16 rotate-3 rounded border border-plum-200 bg-white shadow-sm" />
            <div className="relative flex h-24 w-16 items-center justify-center rounded border border-plum-300 bg-white shadow-md">
              <FileText className="text-plum-600" size={28} />
            </div>
          </div>
        );
      case "Interview":
        return (
          <div className="relative flex h-full w-full items-center justify-center bg-blue-50">
            <div className="absolute -translate-x-4 -translate-y-4 rounded-xl rounded-bl-sm border border-blue-200 bg-white p-3 shadow-sm">
              <div className="h-2 w-8 rounded-full bg-blue-200" />
            </div>
            <div className="relative translate-x-4 translate-y-4 rounded-xl rounded-br-sm border border-blue-300 bg-white p-4 shadow-md">
              <MessageSquare className="text-blue-600" size={28} />
            </div>
          </div>
        );
      case "Salary":
        return (
          <div className="relative flex h-full w-full items-center justify-center bg-emerald-50">
            <div className="absolute h-16 w-16 -rotate-12 rounded-full border border-emerald-200 bg-white shadow-sm" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300 bg-white shadow-md">
              <IndianRupee className="text-emerald-600" size={32} />
            </div>
          </div>
        );
      case "Skills":
      default:
        return (
          <div className="relative flex h-full w-full items-center justify-center bg-amber-50">
            <div className="absolute left-1/4 top-1/4 h-8 w-8 animate-pulse rounded-full border border-amber-200 bg-white shadow-sm" />
            <div className="absolute bottom-1/4 right-1/4 h-12 w-12 rounded-full border border-amber-200 bg-white shadow-sm" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-300 bg-white shadow-md">
              <Sparkles className="text-amber-600" size={32} />
            </div>
          </div>
        );
    }
  };

  return (
    <button
      id={`card-${id}`}
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-line bg-white text-left transition-all hover:-translate-y-1 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-plum-500"
    >
      <div className="h-48 w-full border-b border-line bg-gray-50 overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          {getVisual()}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-plum-600">
            {category}
          </p>
          <span className="text-[12px] font-medium text-mist">{readTime}</span>
        </div>
        <h3 className="mt-3 font-display text-[22px] font-semibold leading-tight text-ink">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-mist flex-1">
          {excerpt}
        </p>
        <div className="mt-5 flex items-center gap-1 text-[13.5px] font-medium text-plum-600">
          READ GUIDE <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
