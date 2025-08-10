import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type UserConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __dirname = dirname(fileURLToPath(import.meta.url));

const libraryConfig: UserConfig = {
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "react-window",
      fileName: "react-window",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
  plugins: [react()],
};

const websiteConfig: UserConfig = {
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      "react-window": resolve(__dirname, "lib"),
    },
  },
};

let config: UserConfig = {};
switch (process.env.TARGET) {
  case "lib": {
    config = libraryConfig;
    break;
  }
  default: {
    config = websiteConfig;
    break;
  }
}

// https://vite.dev/config/
export default defineConfig(config);
