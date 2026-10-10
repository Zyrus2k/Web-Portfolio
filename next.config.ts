import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.BUILD_OFFLINE === "true" ? { output: "export", assetPrefix: "./" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
