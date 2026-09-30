import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./frontend/tests",
  timeout: 60000,
  use: { headless: true },
  reporter: "list",
  webServer: { command: "npm run dev", url: "http://localhost:5173", reuseExistingServer: !process.env.CI },
});
