import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents the Claude Code docs landing page.
 * Kept as ContactPage for import compatibility.
 */
export class ContactPage extends BasePage {
  readonly mainContent:   Locator;
  readonly codeBlocks:    Locator;
  readonly headings:      Locator;
  readonly internalLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.mainContent   = page.locator('main, [role="main"], article').first();
    this.codeBlocks    = page.locator('pre code, pre, code');
    this.headings      = page.locator('h1, h2, h3');
    this.internalLinks = page.locator('a[href^="/"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/docs');
    await this.waitForLoad();
  }
}
