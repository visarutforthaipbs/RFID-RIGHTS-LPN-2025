import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Only wrap with next-pwa in production to avoid
// "Webpack is configured while Turbopack is not" warning during dev
let config = nextConfig;
if (process.env.NODE_ENV !== "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
  });
  config = withPWA(nextConfig);
}

export default config;
