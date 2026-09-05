// Content sourced from: Website & Job Portal Developer Master Brief v1.0,
// 14B Website Content & Page Copy v2.1, 14C Membership & Monetization Architecture v2.1,
// 11 Finance & Pricing v2.1, 06 Recruitment Operations Delivery SOP v2.0 (Aug 2026).
// Job listings and company names are illustrative placeholder data for the MVP build.

export const nav = [
  { label: "Jobs", href: "/jobs" },
  { label: "Employers", href: "/employers" },
  { label: "Recruitment Services", href: "/recruitment-services" },
  { label: "Career Resources", href: "/career-resources" },
  { label: "Campus", href: "/campus" },
  { label: "About", href: "/about" },
];

export type Job = {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string | null;
  industry: string;
  location: string;
  mode: "On-site" | "Hybrid" | "Remote";
  type: "Full-time" | "Internship" | "Contract";
  experience: string;
  experienceMin: number;
  salary?: string;
  posted: string;
  tags: string[];
  fresherEligible: boolean;
  responsibilities: string[];
  mustHave: string[];
  niceToHave: string[];
  about: string;
  screeningQuestions: string[];
};

export const jobs: Job[] = [
  {
    id: "backend-engineer-bengaluru-2201",
    title: "Backend Engineer",
    company: "Northbridge Fintech",
    industry: "IT Services",
    location: "Bengaluru, Karnataka",
    mode: "Hybrid",
    type: "Full-time",
    experience: "2-4 years",
    experienceMin: 2,
    salary: "₹12L - ₹18L / year",
    posted: "2 days ago",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    fresherEligible: false,
    responsibilities: [
      "Own backend services for the payments reconciliation platform",
      "Design database schemas and API contracts with the product team",
      "Improve service reliability and on-call response for core systems",
      "Review code and mentor two associate engineers",
    ],
    mustHave: ["Node.js or Go in production", "Relational database design", "REST API design"],
    niceToHave: ["AWS or GCP experience", "Exposure to event-driven systems"],
    about:
      "Northbridge Fintech builds reconciliation infrastructure for mid-size banks and NBFCs. Team of 40, Series B funded.",
    screeningQuestions: [
      "How many years of backend engineering experience do you have?",
      "What is your current notice period?",
      "What is your current and expected CTC?",
    ],
  },
  {
    id: "field-sales-executive-pune-0587",
    title: "Field Sales Executive",
    company: "Solara Renewables",
    industry: "Solar / Clean Energy",
    location: "Pune, Maharashtra",
    mode: "On-site",
    type: "Full-time",
    experience: "0-2 years",
    experienceMin: 0,
    salary: "₹3L - ₹4.5L / year + incentives",
    posted: "5 days ago",
    tags: ["Direct Sales", "Fresher Friendly", "Incentives"],
    fresherEligible: true,
    responsibilities: [
      "Generate and follow up on residential solar leads within the assigned territory",
      "Conduct site visits and explain financing options to homeowners",
      "Maintain accurate pipeline records in the CRM",
      "Meet monthly installation targets",
    ],
    mustHave: ["Two-wheeler and valid license", "Comfortable with daily field travel"],
    niceToHave: ["Prior direct sales or door-to-door experience"],
    about: "Solara Renewables installs residential and small-commercial solar systems across Maharashtra.",
    screeningQuestions: [
      "Do you have a two-wheeler and valid driving license?",
      "Are you comfortable with daily field travel within the city?",
      "What is your expected fixed salary?",
    ],
  },
  {
    id: "graduate-trainee-operations-gurugram-3120",
    title: "Graduate Trainee - Operations",
    company: "Veltrix Logistics",
    industry: "Logistics",
    location: "Gurugram, Haryana",
    mode: "On-site",
    type: "Full-time",
    experience: "Fresher",
    experienceMin: 0,
    salary: "₹3.6L / year",
    posted: "1 day ago",
    tags: ["Fresher Friendly", "Graduate Program", "2026 Batch"],
    fresherEligible: true,
    responsibilities: [
      "Rotate across warehouse operations, dispatch planning and vendor coordination",
      "Support daily reporting on fulfilment SLAs",
      "Assist operations managers on process improvement projects",
    ],
    mustHave: ["Bachelor's degree (any stream), 2025 or 2026 graduating batch"],
    niceToHave: ["Excel proficiency", "Prior internship in operations or supply chain"],
    about: "Veltrix Logistics runs regional fulfilment centers for D2C and retail brands across North India.",
    screeningQuestions: [
      "What is your graduation year and stream?",
      "Are you open to a 6-month rotational training period before role confirmation?",
    ],
  },
  {
    id: "senior-product-designer-remote-4410",
    title: "Senior Product Designer",
    company: "Hearth & Co",
    industry: "SaaS",
    location: "Remote (India)",
    mode: "Remote",
    type: "Full-time",
    experience: "4-7 years",
    experienceMin: 4,
    salary: "₹22L - ₹32L / year",
    posted: "1 week ago",
    tags: ["Figma", "Design Systems", "B2B SaaS"],
    fresherEligible: false,
    responsibilities: [
      "Lead end-to-end design for the core workflow product",
      "Own and evolve the design system used across web and mobile",
      "Partner directly with founders on product strategy",
    ],
    mustHave: ["4+ years product design experience", "Strong portfolio of shipped B2B products"],
    niceToHave: ["Prior experience designing 0-to-1 products", "Basic front-end fluency"],
    about: "Hearth & Co builds workflow software for independent contractors. Fully remote team of 18.",
    screeningQuestions: [
      "Please share a portfolio link.",
      "What is your current and expected CTC?",
      "What is your notice period?",
    ],
  },
  {
    id: "customer-support-associate-hubballi-2755",
    title: "Customer Support Associate",
    company: "Anchorline Retail",
    industry: "Retail / E-commerce",
    location: "Hubballi, Karnataka",
    mode: "On-site",
    type: "Full-time",
    experience: "0-1 years",
    experienceMin: 0,
    salary: "₹2.4L - ₹3L / year",
    posted: "3 days ago",
    tags: ["Fresher Friendly", "Kannada + English", "Day Shift"],
    fresherEligible: true,
    responsibilities: [
      "Handle inbound customer queries over chat and phone",
      "Log and escalate unresolved issues to the right team",
      "Maintain resolution-time and satisfaction targets",
    ],
    mustHave: ["Fluent in Kannada and English", "Basic computer literacy"],
    niceToHave: ["Prior BPO or retail experience"],
    about: "Anchorline Retail runs regional e-commerce fulfilment for home and lifestyle brands.",
    screeningQuestions: [
      "Which languages are you fluent in?",
      "Are you available for day-shift, six-day-a-week work?",
    ],
  },
  {
    id: "manufacturing-supervisor-nashik-1890",
    title: "Manufacturing Supervisor",
    company: "Ferro Industries",
    industry: "Manufacturing",
    location: "Nashik, Maharashtra",
    mode: "On-site",
    type: "Full-time",
    experience: "3-6 years",
    experienceMin: 3,
    salary: "₹5.5L - ₹7.5L / year",
    posted: "4 days ago",
    tags: ["Shift Operations", "ISO", "Team Handling"],
    fresherEligible: false,
    responsibilities: [
      "Supervise a 20-member shop-floor team across rotating shifts",
      "Enforce quality and safety compliance on the production line",
      "Report daily output and downtime to the plant manager",
    ],
    mustHave: ["Diploma or degree in mechanical/production engineering", "3+ years shop-floor supervision"],
    niceToHave: ["ISO 9001 audit experience"],
    about: "Ferro Industries manufactures precision metal components for the auto-ancillary sector.",
    screeningQuestions: [
      "How many years of shop-floor supervisory experience do you have?",
      "Are you open to rotating shift schedules?",
    ],
  },
  {
    id: "digital-marketing-executive-ahmedabad-3345",
    title: "Digital Marketing Executive",
    company: "Loom & Leaf Interiors",
    industry: "Sales & Marketing",
    location: "Ahmedabad, Gujarat",
    mode: "On-site",
    type: "Full-time",
    experience: "1-3 years",
    experienceMin: 1,
    salary: "₹3.5L - ₹5L / year",
    posted: "6 days ago",
    tags: ["Performance Marketing", "Meta Ads", "SEO"],
    fresherEligible: false,
    responsibilities: [
      "Plan and run performance campaigns across Meta and Google",
      "Track cost-per-lead and coordinate with the design team on creatives",
      "Report weekly funnel performance to the marketing lead",
    ],
    mustHave: ["1+ years running paid social or search campaigns"],
    niceToHave: ["Experience in home decor, D2C, or retail brands"],
    about: "Loom & Leaf Interiors is a fast-growing home decor brand with 6 showrooms across Gujarat.",
    screeningQuestions: [
      "What is your experience managing a monthly ad budget, and what size?",
      "What is your current and expected CTC?",
    ],
  },
  {
    id: "hr-generalist-noida-9021",
    title: "HR Generalist",
    company: "Brightpath Consulting",
    industry: "Professional Services",
    location: "Noida, Uttar Pradesh",
    mode: "Hybrid",
    type: "Full-time",
    experience: "2-5 years",
    experienceMin: 2,
    salary: "₹6L - ₹9L / year",
    posted: "1 day ago",
    tags: ["HRBP", "Payroll", "Employee Relations"],
    fresherEligible: false,
    responsibilities: [
      "Manage end-to-end employee lifecycle for a 120-member team",
      "Coordinate monthly payroll inputs with finance",
      "Own onboarding, engagement and exit processes",
    ],
    mustHave: ["2+ years as an HR generalist or HRBP", "Working knowledge of payroll compliance"],
    niceToHave: ["Experience with HRMS platforms"],
    about: "Brightpath Consulting is a boutique management consulting firm serving mid-market clients.",
    screeningQuestions: [
      "How many employees have you supported in your current/last HR role?",
      "What is your notice period?",
    ],
  },
  {
    id: "software-intern-hyderabad-6602",
    title: "Software Development Intern",
    company: "Kiln Labs",
    industry: "IT Services",
    location: "Hyderabad, Telangana",
    mode: "On-site",
    type: "Internship",
    experience: "Fresher",
    experienceMin: 0,
    salary: "₹18,000 / month stipend",
    posted: "3 days ago",
    tags: ["Internship", "React", "6-Month"],
    fresherEligible: true,
    responsibilities: [
      "Build and ship small features under senior engineer guidance",
      "Write and maintain unit tests for new code",
      "Participate in daily stand-ups and sprint planning",
    ],
    mustHave: ["Familiarity with JavaScript and one modern framework", "Available for 6 months, full-time"],
    niceToHave: ["Personal or academic projects on GitHub"],
    about: "Kiln Labs is a product engineering studio building tools for early-stage startups.",
    screeningQuestions: [
      "Please share your GitHub or portfolio link.",
      "Can you commit to a 6-month, full-time internship?",
    ],
  },
  {
    id: "regional-account-manager-chennai-7734",
    title: "Regional Account Manager",
    company: "Palmleaf FMCG",
    industry: "FMCG",
    location: "Chennai, Tamil Nadu",
    mode: "On-site",
    type: "Full-time",
    experience: "5-9 years",
    experienceMin: 5,
    salary: "₹9L - ₹13L / year",
    posted: "1 week ago",
    tags: ["Distributor Management", "B2B Sales", "South Zone"],
    fresherEligible: false,
    responsibilities: [
      "Own distributor relationships and secondary sales targets across Tamil Nadu",
      "Lead a team of 4 area sales officers",
      "Drive new distributor onboarding in underpenetrated markets",
    ],
    mustHave: ["5+ years FMCG distribution sales experience", "Tamil and English fluency"],
    niceToHave: ["Experience launching new SKUs in a region"],
    about: "Palmleaf FMCG manufactures packaged food products distributed across South India.",
    screeningQuestions: [
      "How many distributors do you currently manage, and in which region?",
      "What is your current and expected CTC?",
    ],
  },
];

export type Service = {
  slug: string;
  name: string;
  problem: string;
  approach: string;
  handles: string[];
  useCase: string;
};

export const services: Service[] = [
  {
    slug: "corporate-recruitment",
    name: "Corporate Recruitment",
    problem:
      "Internal teams are stretched thin trying to source, screen and coordinate interviews while still running the business.",
    approach:
      "We calibrate every role with the hiring manager before sourcing at scale, then run recruitment alongside your existing team.",
    handles: [
      "Requirement calibration and profile sign-off",
      "Sourcing across our candidate database and external channels",
      "Structured screening and shortlist submission",
      "Interview coordination and feedback follow-up",
    ],
    useCase: "Growing companies with 5-20 hires a month across mixed departments.",
  },
  {
    slug: "it-non-it-recruitment",
    name: "IT & Non-IT Recruitment",
    problem:
      "Technical and operational roles need different sourcing channels, and generic job posts rarely reach the right skill match.",
    approach:
      "Recruiters calibrate role-specific must-haves, then source through the Grow Biz Jobs database, referrals and targeted channels.",
    handles: [
      "Skill- and function-specific screening",
      "Technical or operational competency checks",
      "Salary and notice-period confirmation",
      "Structured candidate submission cards, not raw resumes",
    ],
    useCase: "IT services companies with recurring skilled-role hiring, and non-IT businesses hiring for operations, finance or support.",
  },
  {
    slug: "fresher-graduate-placement",
    name: "Fresher & Graduate Placement",
    problem: "Fresh graduates are hard to evaluate on experience alone, and employers need volume without losing quality.",
    approach:
      "We combine our candidate database with campus partnerships, then screen for aptitude, communication and role fit.",
    handles: [
      "Eligibility screening against your criteria",
      "Assessment coordination where required",
      "Shortlist submission and interview scheduling",
      "Joining follow-up and drop-off tracking",
    ],
    useCase: "Companies building entry-level teams or running structured graduate hiring.",
  },
  {
    slug: "experienced-professional-placement",
    name: "Experienced Professional Placement",
    problem: "Mid-to-senior hires take longer to close and carry more risk if the fit is wrong.",
    approach:
      "We calibrate the target profile with the hiring manager first, then submit structured candidate summaries with recruiter notes.",
    handles: [
      "Targeted, need-based sourcing",
      "Competency-based screening",
      "Compensation alignment and counter-offer risk management",
      "Offer-to-joining support",
    ],
    useCase: "Employers hiring specialist or leadership-adjacent roles where a mismatch is costly.",
  },
  {
    slug: "bulk-hiring",
    name: "Bulk Hiring",
    problem: "Frontline, retail or manufacturing hiring needs volume fast, and one-role-at-a-time recruiting doesn't scale.",
    approach:
      "We run a volume campaign against defined funnel targets, with screening at scale and coordinated hiring events where useful.",
    handles: [
      "Multi-location sourcing",
      "High-volume screening",
      "Hiring drive coordination",
      "Funnel tracking and weekly reporting",
    ],
    useCase: "Retail, manufacturing, hospitality or logistics businesses hiring frontline roles across multiple locations.",
  },
  {
    slug: "sales-marketing-hiring",
    name: "Sales & Marketing Hiring",
    problem: "Sales roles are hard to screen from a resume alone, and unclear incentive structures drive early attrition.",
    approach:
      "We screen for track record, communication and motivation, and require transparent incentive details before publishing the role.",
    handles: [
      "Target and track-record verification",
      "Communication and pitch assessment",
      "Incentive-structure transparency checks",
      "Structured shortlist with fit notes",
    ],
    useCase: "Companies building or scaling sales, business development or marketing teams.",
  },
  {
    slug: "executive-search",
    name: "Executive Search",
    problem: "Leadership hires need discretion, deep vetting and a search process a standard job post can't provide.",
    approach: "We run a milestone-based search: search start, qualified shortlist, and candidate joining.",
    handles: [
      "Confidential, discreet search",
      "Structured leadership assessment",
      "Reference and background alignment",
      "Compensation negotiation support",
    ],
    useCase: "Companies hiring senior leadership or specialist executive roles where confidentiality and precision matter.",
  },
  {
    slug: "contract-temporary-staffing",
    name: "Contract & Temporary Staffing",
    problem: "Seasonal demand, project work or short-term coverage doesn't justify a full hiring process.",
    approach: "We source and screen candidates for defined-term roles with clear engagement terms from the outset.",
    handles: [
      "Short-notice sourcing",
      "Contract-term screening",
      "Onboarding coordination",
      "Engagement-period tracking",
    ],
    useCase: "Businesses with seasonal, project-based or short-term staffing needs.",
  },
  {
    slug: "internship-placement",
    name: "Internship Placement",
    problem: "Employers want low-risk early talent, but internship hiring is often under-resourced internally.",
    approach: "We source through our candidate database and campus partners, matching on availability, skill and learning goals.",
    handles: [
      "Eligibility and availability screening",
      "Structured intern shortlist",
      "Offer coordination",
      "Conversion-to-full-time tracking",
    ],
    useCase: "Companies building an internship pipeline as a low-risk route into full-time hiring.",
  },
  {
    slug: "campus-recruitment",
    name: "Campus Recruitment",
    problem: "Building a direct pipeline into colleges takes time, relationships and coordination most companies don't have in-house.",
    approach: "We run recruitment through our institute partnerships, handling eligibility communication, screening and drive logistics.",
    handles: [
      "Institute coordination",
      "Registration and eligibility management",
      "Assessment and screening",
      "Drive scheduling, offers and joining tracking",
    ],
    useCase: "Companies running structured graduate or fresher hiring tied to specific colleges or regions.",
  },
  {
    slug: "recruitment-process-outsourcing",
    name: "Recruitment Process Outsourcing (RPO)",
    problem: "Scaling hiring needs ongoing recruiter capacity, not one-off project support.",
    approach: "We embed a dedicated recruitment team against your monthly hiring plan, billed as a retainer.",
    handles: [
      "Full-funnel recruiter ownership",
      "SLA-backed delivery",
      "Reporting and governance",
      "Scalable recruiter capacity as volume changes",
    ],
    useCase: "Companies with continuous, high-volume or multi-team hiring who want outsourced recruitment ownership.",
  },
];

export type EmployerPlan = {
  name: string;
  price: string;
  billing: string;
  activeJobs: string;
  recruiterSeats: string;
  candidateUnlocks: string;
  pipeline: string;
  aiShortlist: string;
  featuredJobs: string;
  reports: string;
  support: string;
  managedRecruitment: string;
  highlight?: boolean;
};

export const employerPlans: EmployerPlan[] = [
  {
    name: "Free",
    price: "₹0",
    billing: "Trial access",
    activeJobs: "1",
    recruiterSeats: "1",
    candidateUnlocks: "0-10 (trial)",
    pipeline: "Basic",
    aiShortlist: "Limited",
    featuredJobs: "Paid add-on",
    reports: "Basic",
    support: "Standard",
    managedRecruitment: "Add-on: 10% success fee",
  },
  {
    name: "Starter",
    price: "₹2,999",
    billing: "/month (₹29,999/year)",
    activeJobs: "5",
    recruiterSeats: "1",
    candidateUnlocks: "100/month",
    pipeline: "Yes",
    aiShortlist: "Basic",
    featuredJobs: "1 credit",
    reports: "Basic",
    support: "Standard",
    managedRecruitment: "Add-on: 10% success fee",
  },
  {
    name: "Growth",
    price: "₹7,999",
    billing: "/month (₹79,999/year)",
    activeJobs: "15",
    recruiterSeats: "3",
    candidateUnlocks: "300/month",
    pipeline: "Yes",
    aiShortlist: "Yes",
    featuredJobs: "3 credits",
    reports: "Advanced",
    support: "Priority",
    managedRecruitment: "Preferred success-fee pricing",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹14,999",
    billing: "/month (₹149,999/year)",
    activeJobs: "40",
    recruiterSeats: "5",
    candidateUnlocks: "800/month",
    pipeline: "Advanced",
    aiShortlist: "Yes",
    featuredJobs: "10 credits",
    reports: "Advanced",
    support: "Priority",
    managedRecruitment: "Preferred success-fee pricing",
  },
  {
    name: "Enterprise",
    price: "Custom",
    billing: "Order form",
    activeJobs: "Custom",
    recruiterSeats: "Custom",
    candidateUnlocks: "Custom",
    pipeline: "Advanced",
    aiShortlist: "Custom",
    featuredJobs: "Custom",
    reports: "Custom",
    support: "Dedicated",
    managedRecruitment: "Integrated / RPO",
  },
];

export const recruitmentPricing = [
  {
    label: "Managed recruitment (standard)",
    price: "10% of annual CTC",
    note: "One-time success fee, invoiced after the candidate joins. Payable within 15 calendar days.",
  },
  {
    label: "Specialist / difficult roles",
    price: "12.5% of annual CTC",
    note: "Same one-time, post-joining billing terms as standard managed recruitment.",
  },
  {
    label: "Executive search",
    price: "15-18%+ of annual CTC",
    note: "Milestone billing: 30% on search start, 30% on qualified shortlist, 40% on joining.",
  },
  {
    label: "RPO",
    price: "₹50,000 - ₹2,00,000+ / month",
    note: "Monthly retainer, billed in advance for each service month.",
  },
  {
    label: "Bulk hiring",
    price: "₹5,000 - ₹15,000 / joining",
    note: "Invoiced per successful joining or against agreed milestones.",
  },
  {
    label: "Single job post",
    price: "₹499 - ₹1,499",
    note: "100% upfront before the job post is published.",
  },
  {
    label: "Featured job boost",
    price: "₹499 - ₹2,499",
    note: "100% upfront before the boost or campaign is activated.",
  },
];

export const faqs = [
  {
    q: "Is it free for candidates to apply?",
    a: "Yes. Candidates can create a profile, search jobs and apply for opportunities without paying for access. Optional career-support memberships are separate.",
  },
  {
    q: "Can companies hire directly from the platform?",
    a: "Yes. Verified employers can use membership plans to post jobs, manage applicants and access eligible candidate profiles according to plan limits and consent rules.",
  },
  {
    q: "Can Grow Biz handle recruitment for us?",
    a: "Yes. Employers can choose managed recruitment, bulk hiring, executive search, staffing or RPO in addition to the self-service platform.",
  },
  {
    q: "Do you guarantee jobs to candidates?",
    a: "No. Hiring decisions are made by employers. Grow Biz can improve discovery, preparation and recruitment coordination but does not guarantee selection.",
  },
  {
    q: "How are employers verified?",
    a: "The platform verifies company identity and business details before granting full hiring and candidate-database access.",
  },
  {
    q: "Can we upgrade our employer plan later?",
    a: "Yes. Plans support upgrades as hiring volume, candidate-search needs and recruiter seats increase.",
  },
  {
    q: "How do employer recruitment payments work?",
    a: "For standard managed recruitment, there is no monthly or yearly recruitment charge. Grow Biz charges a one-time fee equal to 10% of the hired candidate's annual CTC after the candidate joins, payable within 15 days. Specialist or difficult roles may be 12.5%. Employer memberships are prepaid monthly or annually; RPO is billed monthly in advance; job posts and boosts are paid upfront.",
  },
];
