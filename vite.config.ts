import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Resizes/converts images at build time. Source art lives in src/assets/img
    // at full resolution; the sizes actually shipped are declared per-import in
    // src/assets/images.ts. Output is content-hashed, so it caches immutably.
    imagetools(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  build: {
    // Keep the tech-logo SVGs out of the JS. Inlined as base64 they rode in the
    // initial chunk (+31kB) even though 15 of the 24 are only needed once the
    // Tech Stack panel opens. As hashed files they are fetched same-origin,
    // only when actually shown, and cached immutably by vercel.json.
    assetsInlineLimit: (filePath: string) =>
      filePath.includes("/assets/icons/") ? false : undefined,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
