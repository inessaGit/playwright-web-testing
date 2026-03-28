import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents any docs section page.
 * Kept as PricingPage for import compatibility.
 */
export class PricingPage extends BasePage {
  readonly pageHeading:  Locator;
  readonly contentLinks: Locator;
  readonly paragraphs:   Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading  = page.locator('h1, h2').first();
    this.contentLinks = page.locator('main a[href], article a[href], [role="main"] a[href]');
    this.paragraphs   = page.locator('main p, article p, [role="main"] p');
  }

  async goto(): Promise<void> {
    await this.page.goto('/docs');
    await this.waitForLoad();
  }
}
