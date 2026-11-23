import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/trip" : "",
  },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/trip",
        assetPrefix: "/trip",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
