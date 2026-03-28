import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly ctaButton: Locator;
  readonly navPricing: Locator;
  readonly navFeatures: Locator;
  readonly navBar: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.locator('h1').first();
    this.ctaButton = page
      .getByRole('link', { name: /get started|request demo/i })
      .first();
    this.navPricing = page
      .getByRole('navigation')
      .getByRole('link', { name: /pricing/i });
    this.navFeatures = page
      .getByRole('navigation')
      .getByRole('link', { name: /features/i });
    this.navBar = page.getByRole('navigation').first();
    this.footer = page.getByRole('contentinfo');
  }

  /**
   * Navigate to the home page and wait for it to load.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  /**
   * Click the Pricing link in the top navigation and wait for navigation.
   */
  async clickPricing(): Promise<void> {
    await this.navPricing.click();
    await this.page.waitForURL('**/pricing**');
    await this.waitForLoad();
  }

  /**
   * Click the Features link in the top navigation and wait for navigation.
   */
  async clickFeatures(): Promise<void> {
    await this.navFeatures.click();
    await this.page.waitForURL('**/features**');
    await this.waitForLoad();
  }
}
