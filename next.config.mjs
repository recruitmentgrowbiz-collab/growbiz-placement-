/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.GROWBIZ_BUILD_DIR || (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
  async headers() {
    return ["/candidate/:path*", "/employer/:path*", "/recruiter/:path*", "/admin/:path*", "/login", "/signup", "/settings", "/api/:path*"].map(source => ({
      source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
