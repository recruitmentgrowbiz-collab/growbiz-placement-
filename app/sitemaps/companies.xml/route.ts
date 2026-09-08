import { segmentSitemap } from "@/lib/sitemaps";
export const dynamic = "force-dynamic";
export function GET() { return segmentSitemap("companies"); }
