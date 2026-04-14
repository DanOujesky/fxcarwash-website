import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  external: [
    "puppeteer",
    "@prisma/client",
    ".prisma/client",
    "pg",
    "pg-native",
  ],
  esbuildOptions(options) {
    options.alias = {
      "@shared": "../shared/src",
    };
  },
});
