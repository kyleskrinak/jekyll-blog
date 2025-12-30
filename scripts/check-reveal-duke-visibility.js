const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SITE_BASE = process.env.SITE_BASE || 'http://127.0.0.1:4000';
const presentationsDir = path.join(__dirname, '..', '_site', 'presentations');
const files = fs.readdirSync(presentationsDir).filter(f => f.endsWith('.html'));

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 667 }
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const results = [];

  for (const file of files) {
    const relative = '/presentations/' + file;
    const url = SITE_BASE + relative;
    const page = await context.newPage();

    const pageResult = { file, url, viewports: {} };

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'networkidle' });

      const hasReveal = await page.$('.reveal') !== null;
      const slideCount = await page.evaluate(() => document.querySelectorAll('.slides section').length);

      const revealExists = !!(await page.evaluate(() => !!window.Reveal));

      const dukeInfo = await page.evaluate(() => {
        // Only look for the logo on pages using the reveal-duke layout
        const el = document.querySelector('.layout--reveal-duke .reveal');
        if (!el) return { present: false };
        const pseudo = window.getComputedStyle(el, '::before');
        const rect = el.getBoundingClientRect();
        const visibleRect = !(rect.width === 0 && rect.height === 0) && rect.bottom > 0 && rect.right > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth);
        const opacity = parseFloat(pseudo.getPropertyValue('opacity') || '1');
        const display = pseudo.getPropertyValue('display') || 'block';
        const bg = pseudo.getPropertyValue('background-image') || '';
        const width = parseFloat(pseudo.getPropertyValue('width') || '0');
        const height = parseFloat(pseudo.getPropertyValue('height') || '0');
        const visible = visibleRect && display !== 'none' && opacity > 0 && bg !== 'none' && width > 0 && height > 0;
        return { present: true, bg, width, height, opacity, display, visible, elRect: rect };
      });

      pageResult.viewports[vp.name] = { hasReveal, revealExists, slideCount, dukeInfo };
    }

    results.push(pageResult);
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();