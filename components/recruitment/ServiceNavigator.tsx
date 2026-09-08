"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, Building2, Check, GraduationCap, Layers3, LockKeyhole, SearchCheck, UsersRound } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
import type { Service } from "@/lib/data";
import styles from "./ServiceNavigator.module.css";

const groups = [
  { title: "Core Recruitment", short: "Core", slugs: ["corporate-recruitment", "it-non-it-recruitment", "experienced-professional-placement"], icon: SearchCheck },
  { title: "Specialized Hiring", short: "Specialized", slugs: ["sales-marketing-hiring", "executive-search"], icon: Building2 },
  { title: "High-Volume & Staffing", short: "High-Volume", slugs: ["bulk-hiring", "contract-temporary-staffing"], icon: UsersRound },
  { title: "Campus & Early Careers", short: "Campus", slugs: ["fresher-graduate-placement", "internship-placement", "campus-recruitment"], icon: GraduationCap },
  { title: "Outsourced Recruitment", short: "RPO", slugs: ["recruitment-process-outsourcing"], icon: Layers3 },
];

const previews: Record<string, { title: string; mode: "pipeline" | "profiles" | "timeline"; rows: [string, string][] }> = {
  "corporate-recruitment": { title: "Candidate pipeline", mode: "pipeline", rows: [["Role calibration", "Agreed brief"], ["Candidate screening", "Recruiter review"], ["Structured shortlist", "Ready for interview"]] },
  "it-non-it-recruitment": { title: "Role & skill match", mode: "profiles", rows: [["Software developer", "Technical competency"], ["Operations specialist", "Functional expertise"]] },
  "experienced-professional-placement": { title: "Experience-led shortlist", mode: "profiles", rows: [["Specialist profile", "Competency reviewed"], ["Senior professional", "Recruiter notes attached"]] },
  "sales-marketing-hiring": { title: "Sales & marketing shortlist", mode: "profiles", rows: [["Business development", "Track record reviewed"], ["Marketing specialist", "Communication assessed"]] },
  "executive-search": { title: "Confidential shortlist", mode: "profiles", rows: [["Executive profile A", "Leadership assessment"], ["Executive profile B", "Discreet review"]] },
  "bulk-hiring": { title: "Multi-role hiring board", mode: "pipeline", rows: [["Retail team", "Sourcing"], ["Logistics team", "Screening"], ["Manufacturing team", "Hiring drive"]] },
  "contract-temporary-staffing": { title: "Assignment timeline", mode: "timeline", rows: [["Defined-term brief", "Engagement agreed"], ["Candidate onboarding", "Start date aligned"], ["Assignment period", "Progress tracked"]] },
  "fresher-graduate-placement": { title: "Graduate shortlist", mode: "profiles", rows: [["Graduate profile A", "Eligibility reviewed"], ["Graduate profile B", "Aptitude screened"]] },
  "internship-placement": { title: "Early-career opportunities", mode: "profiles", rows: [["Internship brief", "Skills & learning goals"], ["Intern profile", "Availability aligned"]] },
  "campus-recruitment": { title: "Campus hiring workflow", mode: "timeline", rows: [["Institute coordination", "Eligibility shared"], ["Assessment & screening", "Shortlist prepared"], ["Campus drive", "Offers & joining"]] },
  "recruitment-process-outsourcing": { title: "Recruitment ownership", mode: "timeline", rows: [["Scope & milestones", "Hiring plan aligned"], ["Sourcing & screening", "Recruiter ownership"], ["Candidate progress", "Reporting & governance"]] },
};

function ServicePreview({ slug }: { slug: string }) {
  const preview = previews[slug];
  if (!preview) return null;
  return (
    <figure className={styles.preview} aria-label={`${preview.title}, illustrative workflow`}>
      <figcaption className={styles.previewCaption}><span>WORKSPACE PREVIEW</span><span>Illustrative</span></figcaption>
      <div className={styles.previewHeading}>
        <span className={styles.previewDot} aria-hidden="true" />
        <p>{preview.title}</p>
        {slug === "executive-search" && <LockKeyhole size={15} aria-hidden="true" />}
      </div>
      <div className={styles[preview.mode]}>
        {preview.rows.map(([label, status], index) => (
          <div key={label} className={`${styles.previewRow} glass-soft`}>
            <span className={styles.previewMarker} aria-hidden="true">{preview.mode === "profiles" ? <UsersRound size={17} /> : String(index + 1).padStart(2, "0")}</span>
            <div><p>{label}</p><span className={styles.status}>{status}</span></div>
            <Check size={14} className="text-plum-600" aria-hidden="true" />
          </div>
        ))}
      </div>
      <p className={styles.previewFoot}>A clear view of the next hiring step <ArrowRight size={13} aria-hidden="true" /></p>
    </figure>
  );
}

export function ServiceNavigator({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState("corporate-recruitment");
  const [enhanced, setEnhanced] = useState(false);
  const category = groups.findIndex((group) => group.slugs.includes(selected));

  useEffect(() => {
    setEnhanced(true);
    const syncHash = () => {
      const slug = window.location.hash.slice(1);
      if (services.some((service) => service.slug === slug)) setSelected(slug);
      else if (!slug) setSelected("corporate-recruitment");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [services]);

  function selectService(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (selected !== slug) {
      window.history.pushState(null, "", `#${slug}`);
      setSelected(slug);
    }
  }

  return (
    <div className={styles.navigator} data-enhanced={enhanced}>
      <div className={styles.rail}>
        <div className={styles.railIntro}><span>EXPLORE OUR SERVICES</span><span>11</span></div>
        <nav aria-label="Service categories" className={styles.categories}>
          {groups.map((group, index) => (
            <a key={group.title} href={`#${group.slugs[0]}`} aria-label={group.title} aria-current={category === index ? "true" : undefined} onClick={(event) => selectService(event, group.slugs[0])}>{group.short}<span>{group.slugs.length}</span></a>
          ))}
        </nav>
        <nav aria-label="Recruitment services" className={styles.serviceLinks}>
          {groups.map(({ title, slugs, icon: Icon }, index) => (
            <div key={title} className={styles.group} data-active={category === index}>
              <p className={styles.groupTitle}><Icon size={17} aria-hidden="true" />{title}</p>
              {slugs.map((slug) => {
                const service = services.find((item) => item.slug === slug);
                return service && (
                  <a key={slug} href={`#${slug}`} aria-current={selected === slug ? "true" : undefined} aria-controls={slug} onClick={(event) => selectService(event, slug)} className={`${styles.serviceLink} ${selected === slug ? "glass-soft" : ""}`}>
                    <span>{service.name}</span><ArrowRight size={15} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.details}>
        <p className="sr-only" role="status">Selected service: {services.find((service) => service.slug === selected)?.name}</p>
        {groups.flatMap((group) => group.slugs.map((slug) => {
          const service = services.find((item) => item.slug === slug);
          if (!service) return null;
          return (
            <article key={slug} id={slug} aria-labelledby={`${slug}-title`} hidden={enhanced && selected !== slug} className={styles.detail}>
              <div className={styles.detailTopline}><span>{group.title}</span><span>{String(services.findIndex((item) => item.slug === slug) + 1).padStart(2, "0")} / 11</span></div>
              <h3 id={`${slug}-title`} className={styles.title}>{service.name}</h3>
              <p className={styles.value}>{service.handles[0]}</p>
              <div className={styles.story}>
                <div className={styles.storyCopy}>
                  <div><h4>Problem</h4><p>{service.problem}</p></div>
                  <div><h4>Approach</h4><p>{service.approach}</p></div>
                </div>
                <ServicePreview slug={slug} />
              </div>
              <div className={styles.handles}>
                <h4>What Grow Biz handles</h4>
                <ul>{service.handles.map((item) => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>
              </div>
              <div className={styles.useCase}><span aria-hidden="true"><Building2 size={19} /></span><div><h4>Ideal use case</h4><p>{service.useCase}</p></div></div>
              <div className={styles.actions}>
                <PrimaryButton href="/contact">Share Hiring Requirement <ArrowRight size={16} aria-hidden="true" /></PrimaryButton>
                {slug === "campus-recruitment" && <SecondaryButton href="/campus">Explore Campus Hiring</SecondaryButton>}
              </div>
            </article>
          );
        }))}
      </div>
    </div>
  );
}
