import type { NextConfig } from "next";

// Static export: Firebase Hosting's Spark (free) plan cannot run Next.js SSR/API
// routes (that needs the Blaze plan). All auth/DB access happens client-side via
// the Firebase JS SDK instead, so a static export is sufficient and free-tier friendly.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
