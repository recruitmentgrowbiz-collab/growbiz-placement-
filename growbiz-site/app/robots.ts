import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/candidate/dashboard",
        "/employer/dashboard",
        "/admin",
        "/recruiter",
        "/login",
        "/signup",
      ],
    },
    sitemap: "https://jobs.thegrowbiz.online/sitemap.xml",
  };
}
