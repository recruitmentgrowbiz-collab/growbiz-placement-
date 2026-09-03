export type UserRole =
  | "candidate"
  | "employer_owner"
  | "employer_admin"
  | "employer_recruiter"
  | "employer_viewer"
  | "growbiz_recruiter"
  | "growbiz_admin";

export type User = {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: "active" | "pending" | "suspended" | "deleted";
  createdAt: string;
  updatedAt: string;
};
