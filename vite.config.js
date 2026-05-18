import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { generateProjectMap } from './scripts/generate-project-map.mjs'

function projectBrainMapPlugin() {
  const refreshMap = () => generateProjectMap().catch((error) => {
    console.error("Project map generation failed:", error);
  });

  return {
    name: "project-brain-map",
    buildStart() {
      return refreshMap();
    },
    configureServer(server) {
      refreshMap();
      const shouldTrack = (file) =>
        file &&
        !file.includes("node_modules") &&
        !file.includes("dist") &&
        !file.includes(".git");

      server.watcher.on("add", (file) => {
        if (shouldTrack(file)) refreshMap();
      });
      server.watcher.on("change", (file) => {
        if (shouldTrack(file)) refreshMap();
      });
      server.watcher.on("unlink", (file) => {
        if (shouldTrack(file)) refreshMap();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    projectBrainMapPlugin(),
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("posthog-js")) return "analytics";
            if (id.includes("firebase/firestore")) return "firebase-db";
            if (id.includes("firebase/auth")) return "firebase-auth";
            if (id.includes("firebase/app")) return "firebase-core";
            if (id.includes("firebase")) return "firebase";
            if (id.includes("recharts")) return "charts";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("react-router-dom")) return "router";
            return "vendor";
          }
        },
      },
    },
  },
})
