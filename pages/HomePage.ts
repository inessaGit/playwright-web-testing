import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly heroHeading:  Locator;
  readonly navBar:       Locator;
  readonly footer:       Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.locator("h1").first();
    this.navBar      = page.locator("nav, [role=\"navigation\"]").first();
    this.footer      = page.locator("footer, [role=\"contentinfo\"]").first();
  }

  async goto(): Promise<void> {
    await this.page.goto("/docs");
    await this.waitForLoad();
  }

  /**
   * Returns the first nav link that points to a page different from the current one.
   * Prefers internal relative links; skips same-page, hash, and external links.
   */
  async firstNavLink(): Promise<Locator | null> {
    const currentPath = new URL(this.page.url()).pathname;
    const links = this.navBar.locator("a[href]");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href) continue;
      if (href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
      if (href.startsWith("http")) continue; // skip external links — may open new tab
      if (href === currentPath || href === currentPath + "/") continue; // skip current page
      return links.nth(i);
    }
    return null;
  }
}
