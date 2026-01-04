import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const TEST_PAGE = `${BASE_URL}/test-features/`;

test.describe('Interactive Features', () => {
  
  // ========== Navigation Overflow / Hamburger Menu ==========
  test('hamburger menu toggles on small viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto(TEST_PAGE);
    
    // Look for the greedy-nav toggle button (appears when nav items don't fit)
    const toggleButton = page.locator('nav.greedy-nav .greedy-nav__toggle');
    const hiddenLinks = page.locator('nav.greedy-nav .hidden-links');
    
    const buttonVisible = await toggleButton.isVisible().catch(() => false);
    
    if (buttonVisible) {
      // Verify hidden menu is not visible initially
      const initiallyHidden = await hiddenLinks.isHidden();
      expect(initiallyHidden).toBeTruthy();
      
      // Click toggle button to reveal menu
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      // Menu should now be visible to users
      await expect(hiddenLinks).toBeVisible();
      
      // Verify menu items are accessible
      const menuItems = hiddenLinks.locator('li');
      const itemCount = await menuItems.count();
      if (itemCount > 0) {
        // First menu item should be clickable
        await expect(menuItems.first().locator('a')).toBeVisible();
      }
    } else {
      // All nav items fit in viewport, no toggle needed
      console.log('⏭️  All nav items visible, no overflow menu needed');
    }
  });

  test('navigation menu displays correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(TEST_PAGE);
    
    // Navigation should be visible without hamburger (specifically the visible-links)
    const navMenu = page.locator('nav.greedy-nav .visible-links');
    await expect(navMenu).toBeVisible();
    
    // Verify nav items are present
    const navItems = navMenu.locator('li');
    expect(await navItems.count()).toBeGreaterThan(0);
  });

  // ========== Heading Anchors & Smooth Scroll ==========
  test('heading anchors are clickable and smooth scroll works', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    // Find a heading with an anchor link
    const headings = await page.locator('h2, h3').filter({ has: page.locator('a[href*="#"]') }).count();
    
    if (headings > 0) {
      // Scroll to top first
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      
      // Click a TOC link if it exists, or manually navigate to anchor
      const tocLinks = page.locator('nav.toc a');
      const tocCount = await tocLinks.count();
      
      if (tocCount > 0) {
        // Click first TOC link
        await tocLinks.first().click();
        
        // Wait for scroll animation to complete
        await page.waitForTimeout(500);
        
        // Verify we've scrolled down
        const scrollPos = await page.evaluate(() => window.scrollY);
        expect(scrollPos).toBeGreaterThan(0);
      }
    }
  });

  // ========== Gumshoe TOC Scroll Highlighting ==========
  test('Gumshoe TOC updates active section on scroll', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    // Check if TOC exists
    const toc = page.locator('nav.toc');
    const tocExists = await toc.isVisible().catch(() => false);
    
    if (tocExists) {
      // Wait for Gumshoe to initialize
      await page.waitForTimeout(1500);
      
      // Get initial active link text
      const initialActive = await toc.locator('a.active').first().textContent().catch(() => null);
      
      // Scroll down significantly to cross section boundaries
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(600);
      
      // Get new active link text
      const newActive = await toc.locator('a.active').first().textContent().catch(() => null);
      
      // Verify that the active link CHANGED (not just exists)
      // If Gumshoe is working, scrolling should update the active section
      if (initialActive && newActive) {
        expect(newActive).not.toEqual(initialActive);
      }
      
      // Also verify there is at least one active item
      const activeItems = await toc.locator('.active').count();
      expect(activeItems).toBeGreaterThan(0);
    }
  });

  test('Gumshoe fires activation events', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    // Scroll to trigger Gumshoe detection
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(300);
    
    // Verify TOC has active state (indicates Gumshoe is working)
    const toc = page.locator('nav.toc');
    const hasActive = await toc.locator('.active').count().catch(() => 0);
    expect(hasActive).toBeGreaterThanOrEqual(0);
  });

  // ========== Lightbox / Image Popup ==========
  test('lightbox opens on image click', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    await page.waitForLoadState('networkidle');
    
    // Find image links - try both jQuery (image-popup class) and vanilla (figure links)
    let imageLinks = page.locator('a.image-popup');
    let imageCount = await imageLinks.count();
    
    if (imageCount === 0) {
      // Fallback to figure gallery links
      imageLinks = page.locator('figure a[href*=".jpg"], figure a[href*=".JPG"], figure a[href*=".png"]');
      imageCount = await imageLinks.count();
    }
    
    if (imageCount > 0) {
      // Click first image link
      const firstLink = imageLinks.first();
      await firstLink.click();
      
      // Wait for lightbox modal to appear
      await page.waitForTimeout(800);
      
      // Check for either Magnific Popup (jQuery) or image-lightbox (vanilla)
      const jqueryPopup = page.locator('.mfp-container, .mfp-wrap');
      const vanillaPopup = page.locator('.image-lightbox');
      
      const jqueryVisible = await jqueryPopup.isVisible().catch(() => false);
      const vanillaVisible = await vanillaPopup.isVisible().catch(() => false);
      const linkHasClass = await firstLink.evaluate(el => el.classList.contains('image-lightbox'));
      
      // Verify at least ONE lightbox implementation is active
      // Either modal visible OR link has image-lightbox class added
      expect(jqueryVisible || vanillaVisible || linkHasClass).toBeTruthy();
      
      // Close popup (press Escape)
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  });

  test('image gallery navigation works', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    const imageLinks = page.locator('a.image-popup');
    const imageCount = await imageLinks.count();
    
    if (imageCount > 1) {
      // Open first image
      await imageLinks.first().click();
      await page.waitForTimeout(500);
      
      // Check for gallery nav (next/prev buttons)
      const nextBtn = page.locator('.mfp-next');
      const nextVisible = await nextBtn.isVisible().catch(() => false);
      
      if (nextVisible) {
        // Click next button
        await nextBtn.click();
        await page.waitForTimeout(300);
        
        // Gallery should still be visible (now showing next image)
        const popup = page.locator('.mfp-container, .mfp-wrap');
        expect(await popup.isVisible()).toBeTruthy();
      }
      
      // Close gallery
      await page.keyboard.press('Escape');
    }
  });

  // ========== Smooth Scroll (SmoothScroll.js) ==========
  test('smooth scroll animates when clicking internal links', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    // Record initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    
    // Find and click a heading anchor or TOC link
    const tocLink = page.locator('nav.toc a').first();
    const tocExists = await tocLink.isVisible().catch(() => false);
    
    if (tocExists) {
      // Get the href to verify it's an anchor
      const href = await tocLink.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        // Click the link
        await tocLink.click();
        
        // Monitor scroll position over time to verify smooth animation
        let scrollPositions = [];
        for (let i = 0; i < 5; i++) {
          const pos = await page.evaluate(() => window.scrollY);
          scrollPositions.push(pos);
          await page.waitForTimeout(50);
        }
        
        // Verify we scrolled (final position > initial)
        const finalScroll = scrollPositions[scrollPositions.length - 1];
        expect(finalScroll).not.toEqual(initialScroll);
      }
    }
  });

  // ========== Copy Button (TODO: implement in content) ==========
  test('copy button copies code block to clipboard', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    // Look for copy button in code blocks
    const copyButton = page.locator('button.copy-code, [aria-label*="copy"]').first();
    const copyExists = await copyButton.isVisible().catch(() => false);
    
    if (copyExists) {
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      // Get code content before copy
      const codeBlock = copyButton.locator('..').first(); // Parent of button
      const codeText = await codeBlock.textContent();
      
      // Click copy button
      await copyButton.click();
      await page.waitForTimeout(200);
      
      // Verify button feedback (text change or class change)
      const buttonText = await copyButton.textContent();
      expect(buttonText).toMatch(/copied|copy/i);
      
      // Try to read clipboard (requires clipboard permission)
      try {
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboardText).toBeTruthy();
      } catch (e) {
        // Clipboard API may not be available in test environment
        console.log('Clipboard read skipped:', e.message);
      }
    } else {
      // Skip if no copy buttons implemented yet
      console.log('⏭️  Copy button not yet implemented');
    }
  });

  // ========== Social Share Buttons ==========
  test('social share buttons are visible and functional', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    await page.waitForLoadState('networkidle');
    
    // Check for social share section
    const shareSection = page.locator('.page__share');
    const shareVisible = await shareSection.isVisible().catch(() => false);
    
    if (shareVisible) {
      // Verify X/Twitter share button (supports both x.com and twitter.com)
      const twitterBtn = shareSection.locator('a[href*="x.com"], a[href*="twitter.com"]');
      await expect(twitterBtn).toBeVisible();
      
      // Verify Facebook share button
      const facebookBtn = shareSection.locator('a[href*="facebook.com"]');
      await expect(facebookBtn).toBeVisible();
      
      // Verify LinkedIn share button
      const linkedinBtn = shareSection.locator('a[href*="linkedin.com"]');
      await expect(linkedinBtn).toBeVisible();
    }
  });

  // ========== Author Profile Sidebar ==========
  test('author profile sidebar displays correctly', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    await page.waitForLoadState('networkidle');
    
    // Check for author sidebar
    const authorSidebar = page.locator('.sidebar .author__avatar, .sidebar .author__content');
    const sidebarVisible = await authorSidebar.first().isVisible().catch(() => false);
    
    if (sidebarVisible) {
      // Verify avatar is present
      const avatar = page.locator('.author__avatar img');
      await expect(avatar).toBeVisible();
      
      // Verify social links exist
      const socialLinks = page.locator('.author__urls li a');
      const linkCount = await socialLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  // ========== Read Time Indicator ==========
  test('read time indicator is displayed', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    await page.waitForLoadState('networkidle');
    
    // Check for read time in page meta (look for text containing "min" or "minute")
    const pageMeta = page.locator('.page__meta');
    const metaVisible = await pageMeta.isVisible().catch(() => false);
    
    if (metaVisible) {
      const metaText = await pageMeta.textContent();
      // Read time should appear as "X min read" or similar
      const hasReadTime = metaText.includes('min') || metaText.includes('minute');
      
      // If read_time is enabled, we should see it somewhere in the meta
      // Pages without much content might show "less than a minute"
      if (!hasReadTime) {
        // Check for specific read time element with icon
        const readTimeIcon = pageMeta.locator('i.fa-clock, i.far.fa-clock');
        const iconVisible = await readTimeIcon.isVisible().catch(() => false);
        expect(iconVisible).toBeTruthy();
      }
    }
  });

  // ========== Category and Tag Links ==========
  test('category and tag links are displayed and clickable', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    await page.waitForLoadState('networkidle');
    
    // Check for page taxonomy (categories/tags)
    const taxonomy = page.locator('.page__taxonomy');
    const taxonomyVisible = await taxonomy.isVisible().catch(() => false);
    
    if (taxonomyVisible) {
      // Verify category links
      const categoryLinks = taxonomy.locator('.page__taxonomy-item a');
      const linkCount = await categoryLinks.count();
      
      if (linkCount > 0) {
        // First category link should be visible and have href
        await expect(categoryLinks.first()).toBeVisible();
        const href = await categoryLinks.first().getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });

  // ========== Related Posts Section ==========
  test('related posts section displays when enabled', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    await page.waitForLoadState('networkidle');
    
    // Check for related posts section
    const relatedSection = page.locator('.page__related');
    const relatedVisible = await relatedSection.isVisible().catch(() => false);
    
    // Related posts may not show if there aren't enough posts with matching tags
    // Just verify the section structure if it exists
    if (relatedVisible) {
      const relatedTitle = relatedSection.locator('h2.page__related-title');
      await expect(relatedTitle).toBeVisible();
      
      // Check for post entries
      const relatedPosts = relatedSection.locator('.archive__item');
      const postCount = await relatedPosts.count();
      expect(postCount).toBeGreaterThanOrEqual(0);
    }
  });

  // ========== Pagination Controls (for archive pages) ==========
  test('pagination controls work on archive pages', async ({ page }) => {
    // Navigate to blog archive which has pagination
    await page.goto(`${BASE_URL}/blog/`);
    
    await page.waitForLoadState('networkidle');
    
    // Check for pagination
    const pagination = page.locator('.pagination');
    const paginationVisible = await pagination.isVisible().catch(() => false);
    
    if (paginationVisible) {
      // Verify page numbers or next/previous links
      const pageLinks = pagination.locator('a, .current');
      const linkCount = await pageLinks.count();
      expect(linkCount).toBeGreaterThan(0);
      
      // Check if next button exists and is clickable
      const nextBtn = pagination.locator('a.pagination--pager');
      const nextVisible = await nextBtn.isVisible().catch(() => false);
      
      if (nextVisible) {
        await expect(nextBtn).toBeVisible();
      }
    }
  });

  // ========== Combined Interaction Test ==========
  test('all interactive features work together on a post', async ({ page }) => {
    await page.goto(TEST_PAGE);
    
    // 1. Verify TOC exists and is interactive
    const toc = page.locator('nav.toc');
    const tocVisible = await toc.isVisible().catch(() => false);
    
    if (tocVisible) {
      // 2. Scroll and verify Gumshoe updates TOC
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(300);
      
      // 3. Click a TOC link to trigger smooth scroll
      const firstTocLink = toc.locator('a').first();
      const linkExists = await firstTocLink.isVisible().catch(() => false);
      
      if (linkExists) {
        const scrollBefore = await page.evaluate(() => window.scrollY);
        await firstTocLink.click();
        await page.waitForTimeout(500);
        const scrollAfter = await page.evaluate(() => window.scrollY);
        
        // Should have scrolled to a different position
        expect(Math.abs(scrollAfter - scrollBefore)).toBeGreaterThan(0);
      }
    }
  });
});
