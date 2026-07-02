import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default defineConfig((configEnv) => {
  const baseConfig = typeof viteConfig === 'function' ? viteConfig({ ...configEnv, command: 'serve' }) : viteConfig;
  return mergeConfig(baseConfig, {
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      exclude: ['**/node_modules/**', '**/dist/**', 'tests-e2e/**'],
    },
  });
});
