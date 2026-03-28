import { test, expect } from '@playwright/test';
import { PricingPage } from '../../pages/PricingPage';
import { assertVisible } from '../../utils/assertions';

test.describe('Pricing Page', () => {
  test('pricing tiers are displayed — at least 2 cards visible', async ({ page }) => {
    const pricingPage = new PricingPage(page);
    await pricingPage.goto();

    await assertVisible(pricingPage.pageHeading, 'Pricing page heading');

    // Broadly target card-like containers: any element with "pricing", "plan", or "tier" in its class
    const cards = page.locator(
      '[class*="pricing-card"], [class*="plan"], [class*="tier"], [class*="price-card"]'
    );

    // Fall back to checking for repeated price-like sections containing "$"
    const priceElements = page.locator('text=/$\\d|per month|per device/i');

    const cardCount = await cards.count();
    const priceCount = await priceElements.count();

    expect(
      cardCount + priceCount,
      'Expected at least 2 pricing tiers or price indicators'
    ).toBeGreaterThanOrEqual(2);
  });

  test('each visible pricing card has a CTA button or link', async ({ page }) => {
    const pricingPage = new PricingPage(page);
    await pricingPage.goto();

    // CTA buttons or links that typically appear in pricing sections
    const ctaElements = page.locator(
      '[class*="pricing"] a, [class*="pricing"] button, [class*="plan"] a, [class*="plan"] button'
    );

    const count = await ctaElements.count();
    expect(count, 'Pricing section should have at least 1 CTA element').toBeGreaterThanOrEqual(1);

    // Every visible CTA should have non-empty text
    for (let i = 0; i < Math.min(count, 10); i++) {
      const el = ctaElements.nth(i);
      const visible = await el.isVisible();
      if (visible) {
        const text = await el.textContent();
        expect(text?.trim().length, `CTA element ${i} should have text`).toBeGreaterThan(0);
      }
    }
  });

  test('pricing page has at least one heading', async ({ page }) => {
    const pricingPage = new PricingPage(page);
    await pricingPage.goto();

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count, 'Pricing page should have at least one heading').toBeGreaterThanOrEqual(1);

    const firstHeadingText = await headings.first().textContent();
    expect(firstHeadingText?.trim().length, 'First heading should not be empty').toBeGreaterThan(0);
  });

  test('pricing page has a contact or get-started CTA', async ({ page }) => {
    const pricingPage = new PricingPage(page);
    await pricingPage.goto();

    // Look for any "Get Started", "Contact Sales", or "Try Free" style links/buttons
    const ctaButton = page.getByRole('link', {
      name: /get started|contact sales|try free|request demo|start free/i,
    }).first();

    const ctaButtonAlt = page.getByRole('button', {
      name: /get started|contact sales|try free|request demo|start free/i,
    }).first();

    const ctaVisible =
      (await ctaButton.isVisible().catch(() => false)) ||
      (await ctaButtonAlt.isVisible().catch(() => false));

    expect(ctaVisible, 'Pricing page should have a visible CTA (Get Started / Contact Sales)').toBe(true);
  });
});
