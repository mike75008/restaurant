import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pas de static export : la route /demo/[recordId] doit être servie à la demande (Vercel).
};

export default nextConfig;
