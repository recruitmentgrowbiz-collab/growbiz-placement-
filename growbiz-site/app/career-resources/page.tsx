import Link from "next/link";
import { FileText, MessageSquare, Wallet, TrendingUp, Users, BadgeCheck } from "lucide-react";
import { Container, Kicker, PrimaryButton } from "@/components/ui";
import { CareerPlusCheckout } from "@/components/candidate/CareerPlusCheckout";
import { ResumeFeedbackPanel } from "@/components/candidate/ResumeFeedbackPanel";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Career Resources",
  description:
    "Resume tips, interview preparation, salary conversations and skill roadmaps to help you move your career forward.",
};

const topics = [
  {
    icon: FileText,
    title: "Resume tips",
    text: "Lead with outcomes, not duties — quantify what changed because you did the work, and keep it to one page for under 8 years of experience.",
  },
  {
    icon: MessageSquare,
    title: "Interview preparation",
    text: "Prepare two or three specific stories that show how you handled a real problem — structure, decision, result — rather than generic strengths.",
  },
  {
    icon: Wallet,
    title: "Salary conversations",
    text: "Anchor on the market range for the role and your evidence of impact, not your current salary. Let the employer name a number first where possible.",
  },
  {
    icon: TrendingUp,
    title: "Skill roadmaps",
    text: "Pick one skill gap that shows up in the job descriptions you actually want, and build a small project around it rather than collecting certificates.",
  },
  {
    icon: Users,
    title: "Workplace success",
    text: "In your first 90 days, focus on understanding how decisions get made and who to loop in — technical skill rarely fails people first.",
  },
];

export default async function CareerResourcesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let expiresAt: string | null = null;
  if (user) {
    const { data: candidate } = await supabase
      .from("candidates")
      .select("career_plus_expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    expiresAt = candidate?.career_plus_expires_at ?? null;
  }
  const isActive = !!expiresAt && new Date(expiresAt) > new Date();

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Career resources</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              Build a Stronger Career Profile
            </h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">
              Practical guidance on resumes, interviews, salary conversations and skill-building —
              free, whether or not you apply to a job through Grow Biz.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-card border border-line p-5">
                <Icon size={20} className="text-plum-600" />
                <h3 className="mt-3.5 font-display text-[16px] font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="career-plus" className="scroll-mt-24 py-16 md:py-20">
        <Container className="grid gap-10 rounded-card border border-line bg-plum-50/60 p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <Kicker>Optional membership</Kicker>
            <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight text-ink md:text-[30px]">
              Stand Out With Better Career Preparation
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mist">
              Career Plus is an optional support membership for active jobseekers. Improve your
              profile, get AI-assisted resume feedback, receive priority job alerts and understand
              where your skills can be strengthened.
            </p>
            <p className="mt-3 max-w-lg text-[13.5px] text-mist">
              Career Plus never affects an employer's hiring decision — it's visibility and
              preparation support only, and it's never required to apply for a job.
            </p>
            {isActive ? (
              <p className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-green-700">
                <BadgeCheck size={16} /> Active until {new Date(expiresAt!).toLocaleDateString()}
              </p>
            ) : user ? (
              <div className="mt-6">
                <CareerPlusCheckout isActive={false} />
              </div>
            ) : (
              <div className="mt-6">
                <PrimaryButton href="/candidate/signup">Create a free profile to activate</PrimaryButton>
              </div>
            )}
            {isActive && <ResumeFeedbackPanel />}
          </div>
          <div className="rounded-card border border-line bg-white p-6">
            <p className="font-display text-[22px] font-bold text-ink">₹1,999 / year</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] text-ink/80">
              <li>Profile boost (visibility only)</li>
              <li>AI-assisted resume feedback</li>
              <li>Priority job alerts</li>
              <li>Skill-gap report</li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
