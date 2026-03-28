import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface DemoFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export class ContactPage extends BasePage {
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly companyField: Locator;
  readonly messageField: Locator;
  readonly submitButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    super(page);

    // Form fields — target by common label text, placeholder, or name attributes
    this.nameField = page
      .locator('input[name*="name"], input[placeholder*="name" i], input[id*="name"]')
      .first();

    this.emailField = page
      .locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]')
      .first();

    this.companyField = page
      .locator(
        'input[name*="company"], input[placeholder*="company" i], input[id*="company"], input[name*="organization"]'
      )
      .first();

    this.messageField = page
      .locator(
        'textarea[name*="message"], textarea[placeholder*="message" i], textarea[id*="message"], textarea'
      )
      .first();

    this.submitButton = page
      .locator('button[type="submit"], input[type="submit"]')
      .first();

    this.form = page.locator('form').first();
  }

  /**
   * Navigate to the contact / demo-request page and wait for load.
   * ManageXR uses both /contact and /request-demo paths.
   */
  async goto(): Promise<void> {
    await this.page.goto('/request-demo');
    await this.waitForLoad();
  }

  /**
   * Fill in every visible form field with the provided data.
   */
  async fillForm(data: DemoFormData): Promise<void> {
    await this.nameField.fill(data.name);
    await this.emailField.fill(data.email);
    await this.companyField.fill(data.company);
    await this.messageField.fill(data.message);
  }

  /**
   * Click the submit button.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Returns all visible validation error elements after a failed submit.
   * Targets common patterns: [role=alert], .error, [class*="error"], etc.
   */
  async getValidationErrors(): Promise<Locator> {
    return this.page.locator(
      '[role="alert"], .error-message, [class*="error"], [class*="invalid"], [aria-invalid="true"] + *'
    );
  }
}
