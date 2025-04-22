const { test, expect } = require('@playwright/test');

test.describe('Lorem Ipsum Character Generator via Bytes', () => {
  const testValues = [-1, 0, 100, 140, 141];

  for (const value of testValues) {
    test(`Generate ${value} characters (bytes)`, async ({ page }) => {
      
      // Block cookie/consent requests
      await page.route('**/*', (route, request) => {
        const url = request.url().toLowerCase();
        if (url.includes('cookie') || url.includes('consent')) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page.goto('https://www.lipsum.com/');

      // Click the "bytes" radio button
      await page.locator('input[type="radio"][name="what"][value="bytes"]').check();

      // Fill in the character amount (using "amount" input)
      await page.fill('input[name="amount"]', value.toString());

      // Click "Generate Lorem Ipsum" and wait for navigation
      await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"][name="generate"]'),
      ]);

      // Extract generated text
      const resultText = await page.locator('#lipsum p').innerText();

    // Default fallback content for invalid input (should be longer)
     expect(resultText.length).toBeGreaterThanOrEqual(100);
    });
  }
});
