import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

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
    this.pageHeading  = page.locator("h1, h2").first();
    // Broaden to all links on page, since docs uses div-based layout (no <main>/<article>)
    this.contentLinks = page.locator("a[href]").filter({ hasNotText: /^$/ });
    this.paragraphs   = page.locator("p, li");
  }

  async goto(): Promise<void> {
    await this.page.goto("/docs");
    await this.waitForLoad();
  }
}
