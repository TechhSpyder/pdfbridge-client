import type { NextConfig } from "next";
import type { RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client-blog"],
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

          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://sandbox-cdn.paddle.com https://*.paddle.com https://*.pdfbridge.xyz https://*.vercel-scripts.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com https://public.profitwell.com",
              "script-src-elem 'self' 'unsafe-inline' https://cdn.paddle.com https://sandbox-cdn.paddle.com https://*.paddle.com https://*.pdfbridge.xyz https://*.vercel-scripts.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com https://public.profitwell.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://sandbox-cdn.paddle.com https://cdn.paddle.com https://*.hcaptcha.com https://hcaptcha.com",
              "img-src 'self' data: https://challenges.cloudflare.com https://*.paddle.com https://cdn.paddle.com https://images.unsplash.com https://avatars.githubusercontent.com https://res.cloudinary.com https://*.hcaptcha.com https://hcaptcha.com https://global.localizecdn.com https://upload.wikimedia.org https://developer.xero.com https://upload.wikimedia.org https://developer.xero.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:3001 http://localhost:3003 https://challenges.cloudflare.com https://*.paddle.com https://api.paddle.com https://sandbox-checkout-service.paddle.com https://checkout-service.paddle.com https://*.pdfbridge.xyz https://pdfbridge-api-1.onrender.com https://vitals.vercel-insights.com https://*.hcaptcha.com https://hcaptcha.com https://*.profitwell.com https://paddlecfe.report-uri.com https://*.ingest.sentry.io https://global.localizecdn.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://api.devnet.solana.com https://api.mainnet-beta.solana.com https://*.solana.com https://*.alchemy.com wss://*.alchemy.com wss://*.solana.com https://price.jup.ag",
              "frame-src 'self' https://sandbox-buy.paddle.com https://buy.paddle.com https://checkout.paystack.com https://pdfbridge.lemonsqueezy.com https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com https://checkout.paddle.com https://*.paddle.com",
              "worker-src 'self' blob:",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ingest/static/:path*",
          destination: "https://eu-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/ingest/:path*",
          destination: "https://eu.i.posthog.com/:path*",
        },
        {
          source: "/ingest/decide",
          destination: "https://eu.i.posthog.com/decide",
        },
      ],
    };
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
  turbopack: {
    resolveAlias: {
      // @solana-mobile/wallet-standard-mobile (pulled in transitively via
      // @solana/wallet-adapter-react) hard-imports this mobile-only package
      // as a peer dep. We don't use mobile wallet adapter — stub it out.
      "@solana-mobile/mobile-wallet-adapter-protocol": {
        browser: "./lib/stubs/mobile-wallet-adapter-protocol.js",
        default: "./lib/stubs/mobile-wallet-adapter-protocol.js",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
