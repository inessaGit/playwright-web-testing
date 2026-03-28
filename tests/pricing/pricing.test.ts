import { test, expect } from '@playwright/test';
import { PricingPage } from '../../pages/PricingPage';
import { assertVisible } from '../../utils/assertions';

test.describe('Docs Sections', () => {

  test('docs page has a visible heading', async ({ page }) => {
    const docsPage = new PricingPage(page);
    await docsPage.goto();
    await assertVisible(docsPage.pageHeading, 'Docs page heading');
  });

  test('docs page heading is non-empty', async ({ page }) => {
    const docsPage = new PricingPage(page);
    await docsPage.goto();
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count, 'Should have at least one heading').toBeGreaterThanOrEqual(1);
    const text = await headings.first().textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('docs page has navigable content links', async ({ page }) => {
    const docsPage = new PricingPage(page);
    await docsPage.goto();
    const count = await docsPage.contentLinks.count();
    expect(count, 'Content should contain at least one link').toBeGreaterThanOrEqual(1);
  });

  test('docs page has text paragraphs', async ({ page }) => {
    const docsPage = new PricingPage(page);
    await docsPage.goto();
    // Docs pages may use div-based layouts instead of <p> — fallback to body text length
    const pCount = await docsPage.paragraphs.count();
    if (pCount === 0) {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.trim().length, 'Page should have text content').toBeGreaterThan(100);
    } else {
      expect(pCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('multiple docs pages are reachable — second nav link loads without error', async ({ page }) => {
    const docsPage = new PricingPage(page);
    await docsPage.goto();

    const navLinks = page.locator('nav a[href], [role="navigation"] a[href]');
    const count = await navLinks.count();
    if (count < 2) { test.skip(); return; }

    const href = await navLinks.nth(1).getAttribute('href');
    if (!href || href.startsWith('mailto:')) { test.skip(); return; }

    const target = href.startsWith('http') ? href : `${process.env.BASE_URL || 'https://code.claude.com'}${href}`;
    const response = await page.request.get(target);
    expect(response.status(), `Second nav link (${target}) should not error`).toBeLessThan(400);
  });

});
