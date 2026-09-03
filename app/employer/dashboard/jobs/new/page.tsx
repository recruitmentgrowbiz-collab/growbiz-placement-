import { EmployerJobEditor } from "@/components/employer/EmployerJobEditor";

export const metadata = { title: "Post a Job | Grow Biz Jobs" };

export default function NewJobPage() {
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Post a Job</h1><p className="mt-2 text-[14.5px] text-mist">Save draft or publish via frontend mock state. Backend persistence is not connected yet.</p><div className="mt-6"><EmployerJobEditor /></div></div>;
}
