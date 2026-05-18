import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  allowedDevOrigins: ["10.151.36.155", "10.193.236.155"],
};

export default nextConfig;
