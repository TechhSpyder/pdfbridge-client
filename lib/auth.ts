import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { organization, emailOTP } from "better-auth/plugins";

// Better-Auth instance for the Next.js process
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3000"],
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
    emailOTP({
      async sendVerificationOTP(data, request) {
        // In the client, we use the same log logic as the API for now,
        // but we've synchronized RESEND_API_KEY so it can eventually send emails directly.
        console.log(`[CLIENT-AUTH] OTP for ${data.email}: ${data.otp}`);
      },
      sendVerificationOnSignUp: true,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const freePlan = await prisma.plan.findFirst({
            where: { name: "Free" },
          });

          if (freePlan) {
            const org = await prisma.organization.create({
              data: {
                name: "My Workspace",
                planId: freePlan.id,
              },
            });

            await prisma.membership.create({
              data: {
                userId: user.id,
                organizationId: org.id,
                role: "OWNER",
              },
            });
          }
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
