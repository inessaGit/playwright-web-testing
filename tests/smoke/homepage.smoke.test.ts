import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { assertVisible } from '../../utils/assertions';

test.describe('Smoke — Docs Home Page', () => {

  test('page loads with HTTP 200', async ({ request }) => {
    const base = process.env.BASE_URL || 'https://code.claude.com';
    const response = await request.get(`${base}/docs`);
    expect(response.status()).toBe(200);
  });

  test('page title contains "Claude"', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const title = await homePage.getTitle();
    expect(title).toMatch(/claude/i);
  });

  test('h1 heading is visible and non-empty', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await assertVisible(homePage.heroHeading, 'H1 heading');
    const text = await homePage.heroHeading.textContent();
    expect(text?.trim().length, 'h1 should not be empty').toBeGreaterThan(0);
  });

  test('navigation bar renders with at least one link', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await assertVisible(homePage.navBar, 'Navigation bar');
    const count = await homePage.navBar.locator('a').count();
    expect(count, 'Nav should contain at least one link').toBeGreaterThanOrEqual(1);
  });

  test('page has non-empty body content', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const text = await page.locator('body').textContent();
    expect(text?.trim().length, 'Body should have content').toBeGreaterThan(50);
  });

});
