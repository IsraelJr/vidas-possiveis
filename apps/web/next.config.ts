import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@vidas-possiveis/game-engine",
    "@vidas-possiveis/narrative",
    "@vidas-possiveis/persistence"
  ]
};

export default nextConfig;
