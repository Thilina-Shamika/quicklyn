import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "quicklyn-headless.local",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "quick.rootholdings.com.mv",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
