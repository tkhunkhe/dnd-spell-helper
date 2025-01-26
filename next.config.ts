import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/dnd-spell-helper',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
