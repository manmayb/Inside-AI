import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    root: import.meta.dirname,
  },
  // Local dev only. For LAN/mobile HMR, add your machine IP — see docs/SETUP.md
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
