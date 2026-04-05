import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({ 
      hot: !process.env.VITEST,
      compilerOptions: {
        dev: true
      }
    })
  ],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  define: {
    // Ensure proper browser environment detection
    'import.meta.env.SSR': false,
    'import.meta.env.MODE': '"test"',
    'global': 'globalThis'
  },
  resolve: {
    conditions: ['browser']
  }
});