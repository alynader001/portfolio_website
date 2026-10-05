import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/cv", destination: "/resume.pdf", permanent: true },
      { source: "/resume", destination: "/resume.pdf", permanent: true },
      { source: "/projects", destination: "/#projects", permanent: true },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
