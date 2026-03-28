import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { assertVisible } from '../../utils/assertions';

test.describe('Smoke — Home Page', () => {
  test('page loads with HTTP 200', async ({ page, request }) => {
    const baseURL = page.context().browser()?.contexts()[0]?.pages()[0]?.url() || 'https://managexr.com';
    const url = process.env.BASE_URL || 'https://managexr.com';
    const response = await request.get(url);
    expect(response.status()).toBe(200);
  });

  test('page title contains ManageXR', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const title = await homePage.getTitle();
    expect(title).toMatch(/managexr/i);
  });

  test('hero section is visible — heading and CTA button present', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await assertVisible(homePage.heroHeading, 'Hero H1 heading');
    const headingText = await homePage.heroHeading.textContent();
    expect(headingText?.trim().length).toBeGreaterThan(0);

    await assertVisible(homePage.ctaButton, 'Hero CTA button (Get Started / Request Demo)');
  });

  test('navigation bar renders', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await assertVisible(homePage.navBar, 'Top navigation bar');
    // At least one link should be present inside the nav
    const navLinks = homePage.navBar.getByRole('link');
    const linkCount = await navLinks.count();
    expect(linkCount, 'Navigation should contain at least one link').toBeGreaterThanOrEqual(1);
  });

  test('footer renders', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.scrollToBottom();
    await assertVisible(homePage.footer, 'Page footer');

    // Footer should contain at least one link
    const footerLinks = homePage.footer.getByRole('link');
    const linkCount = await footerLinks.count();
    expect(linkCount, 'Footer should contain at least one link').toBeGreaterThanOrEqual(1);
  });
});
