/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 静的エクスポート用に必須
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "", // リポジトリ名と一致させる
  assetPrefix: "/Photo-publishing-site", // リポジトリ名と一致させる
};

module.exports = nextConfig;