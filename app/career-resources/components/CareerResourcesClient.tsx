"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui";
import { ResourceCard } from "./ResourceCard";
import { ResourceGuideDrawer } from "./ResourceGuideDrawer";
import type { CareerResource } from "@/features/public-content/types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CareerResourcesClientProps {
  resources: CareerResource[];
}

export function CareerResourcesClient({ resources }: CareerResourcesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Filter for the 4 premium cards
  const premiumCategories = ["Resume", "Interview", "Salary", "Skills"];
  const premiumResources = resources.filter(r => premiumCategories.includes(r.category));
  
  // Ensure we display in the requested order: Resume, Interview, Salary, Skills
  const orderedResources = premiumCategories.map(cat => 
    premiumResources.find(r => r.category === cat)
  ).filter(Boolean) as CareerResource[];

  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Optional route state handling: /career-resources?guide=slug (or we can just use hash)
  // Let's use hash to avoid navigation bugs
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && orderedResources.some(r => r.slug === hash)) {
      setActiveSlug(hash);
    }
  }, [orderedResources]);

  const activeResource = orderedResources.find(r => r.slug === activeSlug) || null;
  const activeIndex = orderedResources.findIndex(r => r.slug === activeSlug);
  const nextResource = activeIndex !== -1 && activeIndex < orderedResources.length - 1 
    ? orderedResources[activeIndex + 1] 
    : orderedResources[0]; // loop back to first if at end

  const handleOpen = (slug: string) => {
    setActiveSlug(slug);
    window.history.pushState(null, "", `#${slug}`);
  };

  const handleClose = () => {
    const closedId = activeResource?.id;
    setActiveSlug(null);
    window.history.pushState(null, "", pathname); // remove hash
    
    // Focus restoration
    if (closedId) {
      setTimeout(() => {
        document.getElementById(`card-${closedId}`)?.focus();
      }, 0);
    }
  };

  const handleNext = (slug: string) => {
    setActiveSlug(slug);
    window.history.pushState(null, "", `#${slug}`);
  };

  return (
    <section id="resources" className="bg-paper py-10 md:py-16">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {orderedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              category={resource.category}
              title={resource.title}
              excerpt={resource.excerpt}
              readTime={resource.readTime || "2 min"}
              onClick={() => handleOpen(resource.slug)}
            />
          ))}
        </div>
      </Container>

      <ResourceGuideDrawer
        isOpen={!!activeResource}
        resource={activeResource}
        onClose={handleClose}
        nextResource={nextResource}
        onNext={handleNext}
      />
    </section>
  );
}
