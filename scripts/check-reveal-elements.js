const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SITE_BASE = process.env.SITE_BASE || 'http://127.0.0.1:4000';
const presentationsDir = path.join(__dirname, '..', '_site', 'presentations');
const files = fs.readdirSync(presentationsDir).filter(f => f.endsWith('.html'));

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const results = [];

  for (const file of files) {
    const relative = '/presentations/' + file;
    const url = SITE_BASE + relative;
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const hasReveal = await page.$('.reveal') !== null;

    const slideCount = await page.evaluate(() => {
      const s = document.querySelectorAll('.slides section');
      return s ? s.length : 0;
    });

    const revealExists = !!(await page.evaluate(() => !!window.Reveal));

    const dukeBg = await page.evaluate(() => {
      const el = document.querySelector('aside.controls');
      if (!el) return null;
      const style = window.getComputedStyle(el, '::before');
      return style ? style.getPropertyValue('background-image') : null;
    });

    results.push({ file, url, hasReveal, revealExists, slideCount, dukeBg });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();