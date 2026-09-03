import { adminData, adminUsers, safetyReports, supportCases } from "@/features/internal/mock/internal";

export async function getAdminDashboard() { return adminData; }
export async function getAdminEmployers() { return adminData.companies; }
export async function getAdminEmployer(id: string) { return adminData.companies.find((c) => c.id === id) ?? null; }
export async function updateEmployerVerification() { return { status: "mock_saved" as const }; }
export async function getAdminJobs() { return adminData.jobs; }
export async function getSafetyReports() { return safetyReports; }
export async function getAdminPlans() { return adminData.plans; }
export async function getAdminPayments() { return [{ id: "pay-1", employer: adminData.companies[0].name, plan: "Growth", reference: "Mock invoice", period: "Current cycle", amount: "Configurable", currency: "INR", status: "Pending", updated: "2026-08-31", notes: "Gateway agnostic placeholder" }]; }
export async function getAdminUsers() { return adminUsers; }
export async function getAdminAnalytics() { return { candidateActivation: "Mock baseline", employerActivation: "Mock baseline", searchToApply: "Mock baseline", timeToShortlist: "Mock baseline", paidConversion: "Mock baseline", recruitmentLeads: "Mock baseline", profileCompletion: "Mock baseline", seoJobQuality: "Mock baseline", reliability: "Mock baseline" }; }
export async function getSupportCases() { return supportCases; }
export async function getContentSections() { return ["Homepage", "Services", "FAQ", "Career Resources", "Contact", "SEO", "Legal"]; }
