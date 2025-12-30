const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SITE_BASE = process.env.SITE_BASE || 'http://127.0.0.1:4000';
const outDir = path.join(__dirname, '..', 'tmp', 'visuals', 'reveal');
fs.mkdirSync(outDir, { recursive: true });

const presentationsDir = path.join(__dirname, '..', '_site', 'presentations');
const files = fs.readdirSync(presentationsDir).filter(f => f.endsWith('.html'));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  for (const file of files) {
    const relative = '/presentations/' + file;
    const url = SITE_BASE + relative;
    const page = await context.newPage();
    console.log('Visiting', url);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (err) {
      console.log(`  WARNING: Timeout or error loading page, skipping: ${err.message}`);
      await page.close();
      continue;
    }
    
    try {
      // Wait for slides container to be attached
      await page.waitForSelector('.reveal .slides', { state: 'attached', timeout: 10000 });
      // Wait for sections to be present
      await page.waitForFunction(
        () => document.querySelectorAll('.slides section').length > 0,
        { timeout: 10000 }
      );
      // Wait a bit for Reveal to fully initialize
      await page.waitForTimeout(500);

      const total = await page.evaluate(() => document.querySelectorAll('.slides section').length);
      console.log(`  Found ${total} slides`);
      const indices = [...new Set([0, Math.floor(total/2), Math.max(0, total-1)])];

      for (const vp of [ { name: 'desktop', width: 1280, height: 800 }, { name: 'mobile', width: 375, height: 667 } ]) {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        for (let i = 0; i < indices.length; i++) {
          const idx = indices[i];
          console.log(`  Navigating to slide ${idx} (${vp.name})`);
          
          // Navigate to slide using Reveal API if available
          await page.evaluate((slideIdx) => {
            if (window.Reveal && typeof Reveal.slide === 'function') {
              Reveal.slide(slideIdx);
            }
          }, idx);
          
          // Wait a bit for the slide transition
          await page.waitForTimeout(500);
          
          // Try to wait for the slide to become present (or just proceed after timeout)
          try {
            await page.waitForSelector('.slides section.present', { timeout: 2000 });
          } catch (e) {
            console.log(`    Note: .present class not found, proceeding anyway`);
          }

          const safeName = relative.replace(/\//g, '_');
          const fileName = `${safeName}-${vp.name}-${String(i+1).padStart(3,'0')}.png`;
          const filePath = path.join(outDir, fileName);
          
          // Try element screenshot first, fall back to full page
          try {
            const el = await page.$('.reveal');
            if (el) {
              await el.screenshot({ path: filePath });
              console.log(`    Saved`, filePath);
            } else {
              throw new Error('reveal element not found');
            }
          } catch (err) {
            const fallback = path.join(outDir, `${safeName}-${vp.name}-${String(i+1).padStart(3,'0')}-full.png`);
            await page.screenshot({ path: fallback, fullPage: true });
            console.log(`    Saved (fullpage fallback)`, fallback);
          }
        }
      }
    } catch (err) {
      console.log(`  ERROR processing page: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  // generate a simple index of files
  const saved = fs.readdirSync(outDir).filter(f => f.endsWith('.png'));
  const report = ['# Reveal visual QA Report', '', `Base URL: ${SITE_BASE}`, '', '## Screenshots', ''];
  for (const s of saved) report.push(`- ${s}`);
  fs.writeFileSync(path.join(outDir, 'report.md'), report.join('\n'));
  console.log('Visual QA complete. Screenshots and report saved to', outDir);
})();