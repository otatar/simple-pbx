import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  ssr: {
    // Do NOT bundle Prisma Client or its internal files
    //external: ["@prisma/client", "@prisma/adapter-mariadb", "~/prisma/generated/client"],
  },
});
