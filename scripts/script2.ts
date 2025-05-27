import { chromium, devices, BrowserContextOptions } from 'playwright';

(async () => {
  const urlToScreenshot = 'youtube.com';
  const dateSuffix = new Date().toISOString().split('T')[0];

  const browser = await chromium.launch();

  // Helper function to take screenshot with given context options and filename prefix
  async function takeScreenshot(contextOptions: BrowserContextOptions, prefix: string) {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    await page.goto(urlToScreenshot, { waitUntil: 'load' });
    const filename = `${prefix}_${urlToScreenshot.replace(/https?:\/\//, '').replace(/[\/:?&=]/g, '_')}_${dateSuffix}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Saved ${prefix} screenshot as ${filename}`);
    await context.close();
  }

  try {
    // Desktop viewport
    await takeScreenshot({ viewport: { width: 1280, height: 720 } }, 'desktop');

    // Mobile iPhone 12 Pro device preset
    await takeScreenshot(devices['iPhone 12 Pro'], 'mobile');

    // Full desktop viewport
    await takeScreenshot({ viewport: { width: 1920, height: 1080 } }, 'full_desktop');

    await browser.close();
  } catch (error) {
    console.error('Error taking screenshots with Playwright:', error);
  }
}();
