import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rsg5uys7zq.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "d1za1h12no9co6.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d5mhfgomyfg7p.cloudfront.net"
      },
      {
        protocol: "https",
        hostname: "dc1foe9a4vvf0.cloudfront.net"
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
