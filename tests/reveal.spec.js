const { test, expect } = require('@playwright/test');

const presentations = [
  '/presentations/19-07-tts-profile.html',
  '/presentations/20-03-05-drupal-intro.html',
  '/presentations/20-12-04-drupal-multisite.html',
  '/presentations/2019-Feb-SLG.html',
  '/presentations/DC19-DevOps-Multisite.html'
];

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 667 }
];

for (const vp of viewports) {
  test.describe(`${vp.name} visual checks`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
    });

    for (const p of presentations) {
      test(`${p} - snapshot`, async ({ page }) => {
        await page.goto(p, { waitUntil: 'networkidle' });
        // ensure reveal root exists
        const hasReveal = await page.$('.reveal') !== null;
        expect(hasReveal).toBeTruthy();

        // simple diagnostic: verify Reveal API initializes (best-effort)
        const revealInitialized = await page.evaluate(() => !!window.Reveal);
        test.info().annotations.push({ type: 'note', description: `Reveal API present: ${revealInitialized}` });

        // capture present slide element when possible
        const el = await page.$('.reveal');
        let screenshot;
        if (el) {
          try {
            screenshot = await el.screenshot({ timeout: 30000 });
          } catch (err) {
            // fallback to full-page when element screenshot fails
            screenshot = await page.screenshot({ fullPage: true });
          }
        } else {
          screenshot = await page.screenshot({ fullPage: true });
        }

        // snapshot name uses sanitized path and viewport
        const name = `${p.replace(/\//g, '_')}-${vp.name}.png`;
        expect(screenshot).toMatchSnapshot(name);
      });
    }
  });
}
