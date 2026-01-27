# PDFBridge Frontend

The premium developer portal and management console for the PDFBridge API. A high-fidelity, high-performance web application built with **Next.js 15**, **React**, and **Tailwind CSS**.

![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green)
![Design: Premium Dark Mode](https://img.shields.io/badge/Design-Premium%20Dark%20Mode-blueviolet)

## ✨ Key Features

- **Live Dashboard Analytics**: Real-time business intelligence with conversion trends and volume tracking.
- **Interactive API Docs**: Hands-on documentation with integrated API key support and interactive snippets.
- **Dual-Key Management**: Securely manage and rotate `Test` and `Live` API keys.
- **Premium Aesthetic**: Sophisticated dark-mode design with glassmorphism, glowing accents, and smooth Framer Motion animations.
- **SEO Hardened**: Optimized for search engines with dynamic sitemaps, robots.txt, and comprehensive OpenGraph metadata.
- **Tiered Billing**: Integrated Stripe/Lemon Squeezy pricing and usage-based tracking.

## 🛠️ Tech Stack

- **Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Vanilla CSS
- **Animations**: Framer Motion
- **Auth**: Clerk (Custom Integration)
- **State/Data**: React Query (TanStack Query) & Zustand

## 📂 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/modules`: Feature-specific logic (Dashboard, Docs, Auth, Landing).
- `/assets`: Brand assets and styling tokens.
- `/public`: Static SEO configuration and OG images.

## 🚀 Getting Started

1.  **Install Dependencies**:

    ```bash
    pnpm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` with:
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `NEXT_PUBLIC_API_URL`

3.  **Run Development Server**:
    ```bash
    pnpm dev
    ```

## 🔍 SEO & Brand Discovery

PDFBridge is configured for maximum discoverability. All metadata is managed dynamically in `app/layout.tsx` and specific page components. Branded assets for social media are located in `public/og-image.png`.

---

Built by the [PDFBridge Team](https://pdfbridge.xyz)
