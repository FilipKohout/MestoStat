import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    reactCompiler: true,
    env: {
        INTERNAL_API_URL: process.env.INTERNAL_API_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

export default nextConfig;
