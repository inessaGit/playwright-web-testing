import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PricingPage extends BasePage {
  /** Container elements that represent individual pricing tier cards */
  readonly pricingCards: Locator;
  /** CTA buttons inside pricing cards (e.g., "Get Started", "Contact Sales") */
  readonly pricingCTAButtons: Locator;
  /** Toggle button/switch for monthly vs annual billing */
  readonly billingToggle: Locator;
  /** Text/label that displays the current billing period */
  readonly billingPeriodLabel: Locator;
  /** Main page heading */
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Pricing cards — target common patterns used in pricing section layouts
    this.pricingCards = page.locator(
      '[class*="pricing-card"], [class*="plan-card"], [class*="tier"], [data-testid*="pricing"], section[class*="pricing"] > div, .pricing > div'
    );

    // CTA buttons inside pricing sections
    this.pricingCTAButtons = page.locator(
      '[class*="pricing"] a[href], [class*="pricing"] button, [class*="plan"] a[href], [class*="plan"] button'
    );

    // Monthly/annual billing toggle
    this.billingToggle = page.locator(
      '[role="switch"], input[type="checkbox"][id*="billing"], input[type="checkbox"][id*="annual"], button[aria-label*="annual"], button[aria-label*="monthly"]'
    );

    // Label that changes between "monthly" and "annual"
    this.billingPeriodLabel = page.locator(
      '[class*="billing"], [class*="toggle"], [aria-label*="billing"]'
    );

    this.pageHeading = page.locator('h1, h2').first();
  }

  /**
   * Navigate to the pricing page and wait for load.
   */
  async goto(): Promise<void> {
    await this.page.goto('/pricing');
    await this.waitForLoad();
  }

  /**
   * Returns all visible pricing card locators.
   */
  async getPricingCards(): Promise<Locator[]> {
    await this.pricingCards.first().waitFor({ state: 'visible', timeout: 10_000 });
    const count = await this.pricingCards.count();
    const cards: Locator[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(this.pricingCards.nth(i));
    }
    return cards;
  }

  /**
   * Clicks the billing frequency toggle (monthly <-> annual).
   */
  async toggleBilling(): Promise<void> {
    await this.billingToggle.first().click();
    // Allow price text to re-render
    await this.page.waitForTimeout(300);
  }
}
