import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
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
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
})
