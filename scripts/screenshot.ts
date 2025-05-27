import { chromium, devices, type BrowserContextOptions } from 'playwright';

(async () => {
  const urlToScreenshot = 'https://toyotacarrental.com.ph/';
  const dateSuffix = new Date().toISOString().split('T')[0];

  const browser = await chromium.launch();

  // Helper function to take screenshot with given context options and filename prefix
  async function takeScreenshot(contextOptions: BrowserContextOptions, prefix: string) {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    const response = await page.goto(urlToScreenshot, { waitUntil: 'load' });

    if (!response || response.status() !== 200) {
      console.error(`${prefix} - Failed to load page. Status: ${response?.status()}`);
      await context.close();
      return;
    }

    console.log(`${prefix} - Page loaded with status: ${response.status()}`);

    const filename = `screenshots/${prefix}_${urlToScreenshot.replace(/https?:\/\//, '').replace(/[\/:?&=]/g, '_')}_${dateSuffix}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Saved ${prefix} screenshot as ${filename}`);

    await context.close();
  }

  try {
    await takeScreenshot({ viewport: { width: 1280, height: 720 } }, 'desktop');
    await takeScreenshot(devices['iPhone 12 Pro'], 'mobile');
    await takeScreenshot({ viewport: { width: 1920, height: 1080 } }, 'full_desktop');

    await browser.close();
  } catch (error) {
    console.error('Error taking screenshots:', error);
  }
})();