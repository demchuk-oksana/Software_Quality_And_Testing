const { test, expect, chromium } = require('@playwright/test');

test('Verify average number of paragraphs containing the word "lorem"', async () => {
  // Launch the browser and create a new context
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const page = await context.newPage();

  // Function to handle generation, redirection, and counting paragraphs containing "lorem"
  const getLoremCount = async () => {
    // Intercept requests to block cookies-related requests (e.g., blocking certain domains or cookies)
    await page.route('**/*', (route, request) => {
      if (request.url().includes('cookie') || request.url().includes('consent')) {
        route.abort(); // Block any request related to cookies/consent
      } else {
        route.continue(); // Allow all other requests to proceed
      }
    });

    // Go to the main Lipsum page
    await page.goto('https://lipsum.com/', { waitUntil: 'domcontentloaded' });

    // Click the 'Generate' button to trigger the redirection
    await page.locator("[type=submit]").click(); 

    // Wait for paragraphs to appear on the new page
    await page.waitForSelector('#lipsum p', { timeout: 10000 });

    // Get all paragraphs inside the #lipsum div and count those containing the word "lorem"
    const paragraphs = await page.$$eval('#lipsum p', (paragraphs) =>
      paragraphs.filter(p => p.textContent.toLowerCase().includes('lorem')).length
    );

    return paragraphs;
  };

  let totalLoremCount = 0;
  const iterations = 10;

  // Run the generation and check process 10 times
  for (let i = 0; i < iterations; i++) {
    const count = await getLoremCount();  // Call the function to handle everything
    totalLoremCount += count;
  }

  // Calculate the average
  const average = totalLoremCount / iterations;

  // Fail the test if the average number of paragraphs with "lorem" is less than 3
  expect(average).toBeGreaterThanOrEqual(3);

  await browser.close();
});
