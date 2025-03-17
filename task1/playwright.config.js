const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    headless: true, // Run in headless mode
    screenshot: 'only-on-failure', // Take screenshots on failure
    video: 'on', // Record video
  },
});
