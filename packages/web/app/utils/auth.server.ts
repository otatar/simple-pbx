import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [admin()],
});
