import type { NextConfig } from "next";

// Export 100 % statique : le dossier `out/` se déploie sur n'importe quel
// hébergeur gratuit (Netlify, Vercel, GitHub Pages, Cloudflare Pages…).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
