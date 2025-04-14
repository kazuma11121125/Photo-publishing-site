/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
      unoptimized: true, // 静的エクスポート用に必須
      
    },
    basePath: "/Photo-publishing-site",
    assetPrefix: "/Photo-publishing-site",
  };
  
  module.exports = nextConfig;