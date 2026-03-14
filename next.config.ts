import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  output: process.env.NEXT_BUILD_TARGET === "desktop" ? "standalone" : undefined,
  images: process.env.NEXT_BUILD_TARGET === "desktop" ? { unoptimized: true } : undefined,
};

export default nextConfig;
