export default {
  reactStrictMode: false, // Optional, up to you
  trailingSlash: true, // Adds trailing slashes to URLs
  distDir: "out", // Optional, but ok if you want custom build dir (make sure you're using it correctly)
  assetPrefix: "/", // Default is fine; useful with CDN
  images: { unoptimized: true }, // Skips Image Optimization (useful on server without sharp)
  output: "standalone", // ✅ This is the key! Perfect for server deployment (Next.js bundles dependencies)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
