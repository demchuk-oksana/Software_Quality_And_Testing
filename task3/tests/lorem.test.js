const { test, expect } = require('@playwright/test');

test.describe('Lorem Ipsum Paragraph Generator', () => {
  const testValues = [-1, 0, 5, 10, 20];

  for (const value of testValues) {
    test(`Generate ${value} paragraphs`, async ({ page }) => {
      
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

      // Fill in paragraph count
      await page.fill('input[name="amount"]', value.toString());

      // Click generate and wait for result
      await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"]'),
      ]);

      // Count generated paragraphs
      const paragraphCount = await page.locator('#lipsum p').count();

      const expectedCount = value <= 0 ? 5 : value;
      
      expect(paragraphCount).toBe(expectedCount);
    });
  }
});
