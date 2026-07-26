/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages only serves static files. The workflow supplies a base path
  // for project sites (for example, /portfolio) and leaves it empty locally.
  output: "export",
  basePath: process.env.PAGES_BASE_PATH || "",
  trailingSlash: true,
  images: {
    // Static export has no Next.js image optimization server at runtime.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
};

export default nextConfig;
