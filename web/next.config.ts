import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;