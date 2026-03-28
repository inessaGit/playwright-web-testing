import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { assertVisible } from '../../utils/assertions';

test.describe('Navigation', () => {

  test('nav bar has at least one link with text', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const links = homePage.navBar.locator('a').filter({ hasText: /.+/ });
    const count = await links.count();
    expect(count, 'Navigation should contain at least one labelled link').toBeGreaterThanOrEqual(1);
  });

  test('clicking a nav link navigates to a new URL', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const startUrl = page.url();
    const link = await homePage.firstNavLink();
    if (!link) { test.skip(); return; }
    await link.click();
    await homePage.waitForLoad();
    expect(page.url()).not.toBe(startUrl);
  });

  test('navigated page has a heading', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const link = await homePage.firstNavLink();
    if (!link) { test.skip(); return; }
    await link.click();
    await homePage.waitForLoad();
    const heading = page.locator('h1, h2, h3').first();
    await assertVisible(heading, 'Heading on navigated page');
  });

  test('mobile viewport — navigation is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const homePage = new HomePage(page);
    await homePage.goto();

    const hamburger = page
      .locator('button[aria-label*="menu" i], button[aria-expanded], [class*="hamburger"], [class*="menu-toggle"]')
      .first();

    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(300);
      const navLink = page.locator('nav a, [role="navigation"] a').first();
      const visible = await navLink.isVisible().catch(() => false);
      expect(visible, 'Nav link should be visible after opening mobile menu').toBe(true);
    } else {
      // Docs sites often keep full nav visible even on mobile
      await assertVisible(homePage.navBar, 'Navigation accessible on mobile viewport');
    }
  });

  test('footer is present and has at least one link', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.scrollToBottom();

    const footer = homePage.footer;
    const footerExists = await footer.count() > 0;
    if (!footerExists) { test.skip(); return; }

    await assertVisible(footer, 'Footer');
    const links = footer.locator('a');
    const count = await links.count();
    expect(count, 'Footer should contain at least one link').toBeGreaterThanOrEqual(1);
  });

});
