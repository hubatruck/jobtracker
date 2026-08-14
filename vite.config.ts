import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { execSync } from "node:child_process";
import packageJson from "./package.json" with { type: "json" };

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  base: "/jobtracker/",
  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
    GIT_COMMIT: JSON.stringify(commitHash),
  },
});
