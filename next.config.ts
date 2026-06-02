import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // snarkjs and circomlibjs are not bundler-friendly; load them at runtime
  // from node_modules instead of bundling them into route handlers.
  serverExternalPackages: ["snarkjs", "circomlibjs"],
};

export default nextConfig;
