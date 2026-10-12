import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './browser',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    viewport: { width: 1280, height: 720 },
    headless: true,
    launchOptions: process.env.MEMORA_CHROMIUM_PATH ? { executablePath: process.env.MEMORA_CHROMIUM_PATH } : {},
  },
  webServer: {
    command: 'node scripts/dev-server.js',
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
});
