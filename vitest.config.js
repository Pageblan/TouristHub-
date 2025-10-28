// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,               // <<< enable test globals: test, expect, vi
    setupFiles: './vitest.setup.js',
    // optionally: increase test timeout if needed
    // timeout: 5000
  },
});
