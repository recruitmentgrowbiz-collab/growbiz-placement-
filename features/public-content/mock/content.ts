import type { CareerResource, ContactEnquiryType } from "@/features/public-content/types";

export const aboutPrinciples = [
  "Recruitment expertise",
  "Technology-enabled workflows",
  "Clear employer and candidate paths",
  "Human accountability around AI",
  "Secure-by-default data access",
  "Flexible hiring models",
  "Operational transparency",
];

export const serviceScope = [
  "IT & non-IT recruitment",
  "Sales & marketing recruitment",
  "Fresher placement",
  "Bulk hiring",
  "Executive search",
  "Staffing",
  "Campus recruitment",
  "RPO",
  "Grow Biz Jobs platform",
];

export const campusAudiences = [
  {
    title: "For Students and Freshers",
    text: "Create a profile, explore internships and fresher roles, and prepare for placement drives.",
    cta: { label: "Search Fresher Jobs", href: "/jobs?experience=fresher" },
  },
  {
    title: "For Institutes",
    text: "Coordinate placement drives, employer access, fresher hiring and readiness support.",
    cta: { label: "Become a Campus Partner", href: "/contact" },
  },
  {
    title: "For Employers",
    text: "Access graduate talent, internships, campus hiring support and early-career shortlists.",
    cta: { label: "Explore Campus Hiring", href: "/recruitment-services#campus-recruitment" },
  },
];

export const careerResources: CareerResource[] = [
  {
    "id": "resume-impact",
    "slug": "resume-impact",
    "category": "Resume",
    "title": "How to Write a Resume for Jobs in India",
    "excerpt": "Make your skills and experience easy for a recruiter to check.",
    "readTime": "2 min",
    "featured": true,
    "sections": [
      {
        "title": "Start with the role requirements",
        "text": "Read several relevant job descriptions. Identify the skills you can demonstrate, then put those near the top of your resume. Include your name, reachable contact details and a concise summary that explains your target role and relevant experience. Avoid unsupported ratings such as ?expert? or long lists of tools you have not used."
      },
      {
        "title": "Show evidence, including fresher projects",
        "text": "Describe the task, your contribution and its result. A fresher can use academic projects, internships or volunteering: ?Built a stock tracker in Excel and documented how the team updates it.? Use numbers only when you can explain their source. Keep qualification names, graduation dates and employment dates accurate."
      },
      {
        "title": "Check before applying",
        "text": "Use clear section labels, readable type and consistent dates. Follow the employer?s requested file format and check the exported file on a phone. Tailor the summary and relevant examples for each role; keep all facts consistent with your profile. Do not add identity documents or financial information to a general resume."
      }
    ]
  },
  {
    "id": "interview-stories",
    "slug": "interview-stories",
    "category": "Interview",
    "title": "Prepare for Your First Job Interview",
    "excerpt": "Build clear answers for introductions, projects and role-fit questions.",
    "readTime": "2 min",
    "featured": true,
    "sections": [
      {
        "title": "Answer ?Tell me about yourself?",
        "text": "Use a short sequence: your current situation, relevant experience or project, and why this role interests you. For example: ?I am a commerce graduate. During my internship I reconciled invoice records in Excel. I am looking for an operations role where I can use that attention to detail.? Adapt the example to your own background."
      },
      {
        "title": "Prepare examples you can explain",
        "text": "Choose examples of solving a problem, working with others and learning something unfamiliar. Explain the situation, your task, what you did and what happened. Practice aloud without memorising every sentence. If you do not know an answer, explain what you understand and how you would find the missing information."
      },
      {
        "title": "Ask practical questions",
        "text": "Review the job description and company profile before the interview. Ask about responsibilities, training, work mode and the next steps. Test your connection for a remote interview. Keep applications free: a demand for payment to secure an interview is a reason to stop and report the request."
      }
    ]
  },
  {
    "id": "salary-range",
    "slug": "salary-range",
    "category": "Salary",
    "title": "Discuss Expected CTC and Notice Period Clearly",
    "excerpt": "Separate compensation expectations from your confirmed joining availability.",
    "readTime": "2 min",
    "featured": false,
    "sections": [
      {
        "title": "Clarify the compensation components",
        "text": "When an employer asks about expected CTC, clarify whether the discussion concerns annual CTC, fixed pay or a package including variable pay and benefits. LPA means lakhs per annum; it does not mean monthly take-home pay. Ask for the offer breakdown instead of assuming two headline figures are directly comparable."
      },
      {
        "title": "Explain your expectations honestly",
        "text": "Connect your expectations to the role?s responsibilities and relevant experience. You can ask: ?Could you share the budgeted range and the fixed and variable components?? Do not invent a competing offer or salary history. If a job does not disclose pay, ask the recruiter before making assumptions about the package."
      },
      {
        "title": "Give an accurate notice period",
        "text": "State your contractual notice period and distinguish it from a confirmed last working date. For example: ?My notice period is as stated in my employment terms. I can confirm a joining date after discussing release with my employer.? Do not promise an early joining date that has not been agreed. Freshers can state their actual availability and any examination commitments."
      }
    ]
  },
  {
    "id": "skill-roadmap",
    "slug": "skill-roadmap",
    "category": "Skills",
    "title": "Search for Jobs by Skills, Not Only Job Titles",
    "excerpt": "Use current role requirements to choose what to learn next.",
    "readTime": "2 min",
    "featured": false,
    "sections": [
      {
        "title": "Compare a small set of roles",
        "text": "Collect several relevant job descriptions and note the recurring tools, tasks and experience requirements. Similar work may appear under different titles. Search using a skill you already have, then check the responsibilities, location and work mode. A keyword match alone does not establish suitability."
      },
      {
        "title": "Choose one useful gap",
        "text": "Separate required skills from preferred qualifications. Prioritise a skill that appears repeatedly and supports the work you want to do. Build a small project that shows you can use it: an analysis, a documented workflow or a working application. Describe your own contribution and the limits of the project."
      },
      {
        "title": "Review your evidence",
        "text": "Ask whether you could explain the project in an interview without notes. Update your profile with skills you can demonstrate and revisit your target roles as you learn. Avoid collecting unrelated certificates solely to lengthen a resume."
      }
    ]
  },
  {
    "id": "career-growth",
    "slug": "career-growth",
    "category": "Career Growth",
    "title": "Plan Your Next Career Step",
    "excerpt": "Turn a broad career goal into specific work and learning decisions.",
    "readTime": "2 min",
    "featured": false,
    "sections": [
      {
        "title": "Define what you want to change",
        "text": "Write down the responsibilities you want more of, the skills you want to build and practical constraints such as location or work mode. A more senior title can mean different work in different companies. Compare actual responsibilities before deciding that a particular title is your only next step."
      },
      {
        "title": "Look for evidence of readiness",
        "text": "Keep a record of completed work, feedback and responsibilities you have taken on. Identify one gap between your current work and a target role. Discuss relevant learning or project opportunities with your manager where appropriate, or create a project that demonstrates the missing skill."
      },
      {
        "title": "Revisit the plan",
        "text": "Review your progress against the goal and adjust your applications to the evidence you have built. Career preparation can help you explain your fit, but an employer decides whom to interview and hire. Use free resources first; optional support should have a clearly agreed scope."
      }
    ]
  },
  {
    "id": "first-month",
    "slug": "first-month",
    "category": "Workplace",
    "title": "Prepare for Your First Month at Work",
    "excerpt": "Understand expectations, communication and the work you will own.",
    "readTime": "2 min",
    "featured": false,
    "sections": [
      {
        "title": "Confirm practical arrangements",
        "text": "Before joining, confirm the reporting contact, start time, location or remote setup and the documents requested through the employer?s official process. Ask questions if an instruction is unclear. Do not send sensitive information to an unverified contact or pay for a promised job."
      },
      {
        "title": "Agree on early priorities",
        "text": "Ask your manager what you should understand and deliver first. Learn how the team records work, asks for help and reviews progress. Keep notes on unfamiliar terms and processes. When a task is unclear, repeat your understanding and confirm the expected result before proceeding."
      },
      {
        "title": "Ask for feedback",
        "text": "Share progress and blockers early. Request specific feedback on completed work and use it to improve the next task. Maintain a simple record of what you have learned and delivered; accurate examples will also help with future performance and career conversations."
      }
    ]
  }
];

export const careerPlusBenefits = [
  "Resume support",
  "Interview preparation",
  "Profile visibility support",
  "Career readiness guidance",
  "Skill-gap suggestions later",
  "Career assistant later",
];

export const contactTypes: { id: ContactEnquiryType; label: string; description: string }[] = [
  { id: "Employer", label: "I'm an Employer", description: "Hiring, job posting or recruitment support." },
  { id: "Candidate", label: "I'm a Candidate", description: "Job search, applications or profile help." },
  { id: "Institute", label: "I represent an Institute", description: "Campus drives and partnership enquiries." },
  { id: "General", label: "General Enquiry", description: "Other Grow Biz questions." },
];

export const reportTypes = [
  "Suspicious payment request",
  "Fake company/job",
  "Misleading information",
  "Abuse/discrimination",
  "Expired/not available",
  "Other",
];

export const legalShells = {
  privacy: ["Overview", "Data collected", "Use of information", "Candidate data", "Employer data", "Data rights", "Contact"],
  terms: ["Overview", "Candidate use", "Employer use", "Platform conduct", "Account access", "Contact"],
  refund: ["Overview", "Membership payments", "Recruitment services", "Review process", "Contact"],
  consent: ["Overview", "Profile visibility", "Employer access", "Consent controls", "Contact"],
};
