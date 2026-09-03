import { redirect } from "next/navigation";

export default function EmployerJobAlias({ params }: { params: { id: string } }) {
  redirect(`/employer/dashboard/jobs/${params.id}`);
}
