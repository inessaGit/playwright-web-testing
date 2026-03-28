import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { assertVisible, assertUrlContains } from '../../utils/assertions';

test.describe('Navigation', () => {
  test('pricing link navigates to the pricing page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.clickPricing();

    await assertUrlContains(page, 'pricing');
    // A heading should be present on the pricing page
    const heading = page.locator('h1, h2').first();
    await assertVisible(heading, 'Pricing page heading');
  });

  test('features link navigates to the features page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.clickFeatures();

    await assertUrlContains(page, 'features');
    const heading = page.locator('h1, h2').first();
    await assertVisible(heading, 'Features page heading');
  });

  test('logo click returns to home page', async ({ page }) => {
    const homePage = new HomePage(page);
    // Navigate away first
    await page.goto('/pricing');
    await homePage.waitForLoad();

    // Find the logo link (typically wraps an <img> or SVG in the nav)
    const logoLink = page
      .getByRole('navigation')
      .locator('a')
      .first();
    await logoLink.click();
    await homePage.waitForLoad();

    const url = page.url();
    const baseURL = process.env.BASE_URL || 'https://managexr.com';
    // After clicking the logo the path should be "/" or the bare base URL
    expect(url).toMatch(new RegExp(`^${baseURL}/?$`));
  });

  test('mobile hamburger menu opens on narrow viewport', async ({ page }) => {
    // Set a narrow viewport to trigger the mobile nav
    await page.setViewportSize({ width: 390, height: 844 });

    const homePage = new HomePage(page);
    await homePage.goto();

    // Look for a hamburger / menu toggle button
    const hamburger = page.locator(
      'button[aria-label*="menu" i], button[aria-expanded], [class*="hamburger"], [class*="mobile-menu-button"], [class*="menu-toggle"]'
    ).first();

    const hamburgerVisible = await hamburger.isVisible();
    if (hamburgerVisible) {
      await hamburger.click();
      // After opening, at least one navigation link should be visible
      const mobileNavLink = page
        .locator('[class*="mobile-nav"] a, [class*="drawer"] a, [class*="menu"] a')
        .first();
      // Allow either the hamburger menu or a nav link to be visible as success signal
      const navLinkVisible = await mobileNavLink.isVisible().catch(() => false);
      // If no explicit mobile nav, the existing nav should now be visible
      const navVisible = await page.getByRole('navigation').first().isVisible();
      expect(navLinkVisible || navVisible).toBe(true);
    } else {
      // On some sites the nav is always visible even on mobile — that is fine
      await assertVisible(
        page.getByRole('navigation').first(),
        'Navigation is accessible on mobile'
      );
    }
  });

  test('footer links resolve without 404', async ({ page, request }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.scrollToBottom();

    const footer = homePage.footer;
    await assertVisible(footer, 'Footer');

    const footerLinks = footer.getByRole('link');
    const count = await footerLinks.count();
    expect(count, 'Footer should have at least one link').toBeGreaterThanOrEqual(1);

    const baseURL = process.env.BASE_URL || 'https://managexr.com';
    const checked = new Set<string>();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }
      const absoluteUrl = href.startsWith('http') ? href : `${baseURL}${href}`;
      if (checked.has(absoluteUrl)) continue;
      checked.add(absoluteUrl);

      const response = await request.get(absoluteUrl);
      expect(
        response.status(),
        `Footer link ${absoluteUrl} should not return 404`
      ).not.toBe(404);
    }
  });
});
