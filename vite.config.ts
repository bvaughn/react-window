import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "react-window",
      // the proper extensions will be added
      fileName: "react-window",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },

  plugins: [react(), svgr(), tailwindcss()],

  resolve: {
    alias: {
      "react-window": resolve(__dirname, "lib"),
    },
  },
});
