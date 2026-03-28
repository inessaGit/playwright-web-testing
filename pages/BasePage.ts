import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the page to reach a stable load state (networkidle).
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('load');
  }

  /**
   * Scrolls to the bottom of the page by evaluating window.scrollTo.
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    );
    // Give the browser a moment to settle after scrolling
    await this.page.waitForTimeout(500);
  }

  /**
   * Returns the current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Waits for a CSS selector to be visible on the page.
   * @param selector - CSS selector string
   * @param timeout  - Optional timeout in ms (defaults to 10 000)
   */
  async waitForSelector(selector: string, timeout = 10_000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }
}
