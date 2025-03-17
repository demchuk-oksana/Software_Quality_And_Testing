const { test, expect } = require('@playwright/test');

test('Verify Ukrainian language switch on lipsum.com', async ({ page }) => {
    // Step 1: Go to the website
    await page.goto('https://lipsum.com/');
    
    // Step 2: Click the Ukrainian language link
    await page.click('a[href="http://uk.lipsum.com/"]', { force: true });
    console.log("New URL:", await page.url());

    // Step 4: Wait for the text area to appear
    await page.waitForSelector('p', { state: 'visible', timeout: 10000 });

    // Step 5: Extract and verify text
    const textAreaContent = await page.locator('p').first().textContent();
    console.log("Text found:", textAreaContent);
    await expect(textAreaContent).toContain('риба');
});
