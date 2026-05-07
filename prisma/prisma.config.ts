import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "mysql://asterisk:Hsterisk.2024@192.168.6.210:3306/asterisk",
  },
});
