# PDFBridge Institutional Dashboard

The premium operative console for **PDFBridge** — Institutional Invoice Infrastructure. High-fidelity financial management built with **Next.js 15**, **React**, and **Tailwind CSS**.

![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green)
![Security: Better--Auth](https://img.shields.io/badge/Security-Better--Auth-blue)

## 🏛️ System Features

- **Institutional Ledger**: Real-time business intelligence and document reconciliation trends.
- **Engine Control Center**: Manage extraction rules, line-item precision, and deterministic execution plans.
- **Dual-Key Management**: Rotate and manage `Test` (Sandbox) and `Live` (Production) cryptographic keys.
- **Premium Aesthetic**: Sophisticated dark-mode design with glowing accents, glassmorphism, and smooth Framer Motion animations.
- **Wallet-Integrated Auth**: Built-in support for Solana SIWS and traditional OIDC via **Better-Auth**.

## 🛠️ Infrastructure Stack

- **Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Auth**: [Better-Auth](https://better-auth.com/) (Web2 + Web3 Wallet Native)
- **State**: TanStack Query (React Query) & Zustand
- **Graphics**: Framer Motion & Lucide Icons
- **Deployment**: Optimized for **Vercel** and **Railway**.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` using the template:
    - `NEXT_PUBLIC_API_URL`: Backend URL (Railway/Local).
    - `BETTER_AUTH_SECRET`: Identity encryption secret.
    - `NEXT_PUBLIC_SOLANA_NETWORK`: devnet/mainnet-beta.

3.  **Run Development Server**:
    ```bash
    pnpm dev
    ```

## 🔍 Institutional Branding

PDFBridge is configured for maximum institutional perception. All metadata is managed dynamically in `app/layout.tsx`. Branded enterprise assets are located in `public/`.

---
© 2026 TechhSpyder Product Studio Ltd.
