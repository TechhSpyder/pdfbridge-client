import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { organization, emailOTP } from "better-auth/plugins";

// Better-Auth instance for the Next.js process
export const auth = betterAuth({
  database: !prisma ? undefined : prismaAdapter(prisma as any, {
    provider: "postgresql",
  }),


  trustedOrigins: ["http://localhost:3000"],
  baseURL: "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  plugins: [
    organization(),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
