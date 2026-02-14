import type { NextConfig } from "next";
import type { RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: [
          //     "default-src 'self'",
          //     // Scripts
          //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://sandbox-cdn.paddle.com https://*.paddle.com https://*.clerk.accounts.dev https://*.pdfbridge.xyz https://*.vercel-scripts.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com",

          //     // Styles (THIS FIXES YOUR ERROR)
          //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://sandbox-cdn.paddle.com https://cdn.paddle.com https://*.hcaptcha.com https://hcaptcha.com",

          //     // Images
          //     "img-src 'self' data: https://challenges.cloudflare.com https://*.paddle.com https://cdn.paddle.com https://*.clerk.com https://images.unsplash.com https://res.cloudinary.com https://*.hcaptcha.com https://hcaptcha.com",

          //     // Fonts
          //     "font-src 'self' https://fonts.gstatic.com",

          //     // API / XHR
          //     "connect-src 'self' http://localhost:3001 https://challenges.cloudflare.com https://*.paddle.com https://api.paddle.com https://sandbox-checkout-service.paddle.com https://checkout-service.paddle.com https://*.clerk.accounts.dev https://*.pdfbridge.xyz https://pdfbridge-api-1.onrender.com https://vitals.vercel-insights.com https://*.hcaptcha.com https://hcaptcha.com",

          //     // Iframes (CRITICAL)
          //     "frame-src 'self' https://sandbox-buy.paddle.com https://buy.paddle.com https://checkout.paystack.com https://pdfbridge.lemonsqueezy.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com",

          //     // Workers
          //     "worker-src 'self' blob:",

          //     // Security & Form handling
          //     "base-uri 'self'",
          //     "form-action 'self'",
          //   ].join("; "),
          // },

          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.paddle.com https://sandbox-cdn.paddle.com https://*.paddle.com` https://*.clerk.accounts.dev https://*.pdfbridge.xyz https://*.vercel-scripts.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com https://cdn.paddle.com https://*.paddle.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.hcaptcha.com https://hcaptcha.com; img-src 'self' data: https://*.clerk.com https://images.unsplash.com https://res.cloudinary.com https://*.hcaptcha.com https://hcaptcha.com https://cdn.paddle.com https://*.paddle.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:3001 https://*.clerk.accounts.dev https://*.pdfbridge.xyz https://pdfbridge-api-1.onrender.com https://vitals.vercel-insights.com https://*.hcaptcha.com https://hcaptcha.com https://*.paddle.com https://api.paddle.com; frame-src 'self' https://checkout.paystack.com https://*.pdfbridge.xyz https://pdfbridge.lemonsqueezy.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com https://checkout.paddle.com https://*.paddle.com;",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  turbopack: {},
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
