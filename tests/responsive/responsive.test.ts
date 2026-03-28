import { test, expect } from '@playwright/test';
import { viewports } from '../../fixtures/testData';

/**
 * For each target viewport, verify that:
 * 1. The page loads and a body element is present.
 * 2. The document body does not overflow horizontally (no scrollbar due to layout breakage).
 * 3. At least one visible heading exists.
 */

for (const vp of viewports) {
  test(`renders correctly at ${vp.width}x${vp.height} (${vp.label})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Body must exist
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for horizontal overflow: scrollWidth > clientWidth means overflow
    const overflowData = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return {
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        htmlScrollWidth: html.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(
      overflowData.htmlScrollWidth,
      `Page at ${vp.width}px should not overflow horizontally (scrollWidth=${overflowData.htmlScrollWidth}, viewport=${overflowData.viewportWidth})`
    ).toBeLessThanOrEqual(overflowData.viewportWidth + 2); // +2px tolerance for sub-pixel rounding

    // At least one heading must be visible
    const heading = page.locator('h1, h2').first();
    await expect(heading, `A heading should be visible at ${vp.label}`).toBeVisible({
      timeout: 10_000,
    });

    // The page title should not be empty
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });
}
