import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Monorepo: correct file tracing when the repo root is not the app root (Vercel/Docker). */
  outputFileTracingRoot: path.join(__dirname, ".."),
  /** Old SaaS marketing routes now point at the services studio pages. */
  async redirects() {
    return [
      { source: "/features", destination: "/services", permanent: true },
      { source: "/pricing", destination: "/services", permanent: true },
      { source: "/waitlist", destination: "/contact", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "randomuser.me", pathname: "/**" },
    ],
  },
};

export default nextConfig;
