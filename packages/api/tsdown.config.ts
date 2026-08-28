import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.ts"],
  root: "src",
  outDir: "dist",
  format: "esm",
  platform: "node",
  unbundle: true,
  dts: true,
  clean: true,
});
