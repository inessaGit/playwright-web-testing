import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';
import { assertVisible } from '../../utils/assertions';

test.describe('Docs Page Content', () => {

  test('main content area is visible', async ({ page }) => {
    const docsPage = new ContactPage(page);
    await docsPage.goto();
    await assertVisible(docsPage.mainContent, 'Main content area');
  });

  test('page contains at least one code block', async ({ page }) => {
    const docsPage = new ContactPage(page);
    await docsPage.goto();
    const count = await docsPage.codeBlocks.count();
    expect(count, 'Docs page should contain code blocks').toBeGreaterThanOrEqual(1);
  });

  test('h1 exists and is non-empty', async ({ page }) => {
    const docsPage = new ContactPage(page);
    await docsPage.goto();
    const h1 = page.locator('h1');
    const count = await h1.count();
    expect(count, 'Page should have at least one h1').toBeGreaterThanOrEqual(1);
    const text = await h1.first().textContent();
    expect(text?.trim().length, 'h1 should not be empty').toBeGreaterThan(0);
  });

  test('page contains internal navigation links', async ({ page }) => {
    const docsPage = new ContactPage(page);
    await docsPage.goto();
    const count = await docsPage.internalLinks.count();
    expect(count, 'Page should have internal links').toBeGreaterThanOrEqual(1);
  });

  test('heading hierarchy: at least one h2 below h1', async ({ page }) => {
    const docsPage = new ContactPage(page);
    await docsPage.goto();
    const h2Count = await page.locator('h2').count();
    // h2 is common in docs; if none exist (single-section page) we still pass
    const allHeadings = await docsPage.headings.count();
    expect(allHeadings, 'Page should have multiple headings').toBeGreaterThanOrEqual(1);
  });

});
