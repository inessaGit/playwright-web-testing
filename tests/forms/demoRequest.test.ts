import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';
import { assertVisible } from '../../utils/assertions';
import { invalidFormData } from '../../fixtures/testData';

test.describe('Demo Request Form', () => {
  test('form renders all required fields', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();

    // The page should contain a form
    await assertVisible(contactPage.form, 'Demo request form');

    // Check that standard input fields are present (the form may use HubSpot
    // or similar embed, so we look broadly for input elements)
    const inputs = page.locator('input[type="text"], input[type="email"], input:not([type])');
    const inputCount = await inputs.count();
    expect(inputCount, 'Form should have at least one text/email input').toBeGreaterThanOrEqual(1);

    // Submit button must exist
    await assertVisible(contactPage.submitButton, 'Form submit button');
  });

  test('empty submit attempt shows validation feedback', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();

    // Click submit without filling in anything
    await contactPage.submitButton.click();

    // Look for native browser validity (invalid pseudo-class) OR explicit error messages
    const invalidField = page.locator(':invalid').first();
    const errorMessage = page.locator(
      '[role="alert"], .error, [class*="error"], [class*="invalid-feedback"], [aria-describedby]'
    ).first();

    const nativeInvalid = await invalidField.isVisible().catch(() => false);
    const errorVisible = await errorMessage.isVisible().catch(() => false);

    expect(
      nativeInvalid || errorVisible,
      'An empty form submit should trigger native :invalid state or visible error messages'
    ).toBe(true);
  });

  test('invalid email shows an error or prevents submission', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();

    // Fill name so it does not trigger a "name required" error first
    const nameVisible = await contactPage.nameField.isVisible().catch(() => false);
    if (nameVisible) {
      await contactPage.nameField.fill('Test User');
    }

    // Type an invalid email and blur
    const emailVisible = await contactPage.emailField.isVisible().catch(() => false);
    if (emailVisible) {
      await contactPage.emailField.fill(invalidFormData.email);
      await contactPage.emailField.blur();

      // Wait briefly for inline validation
      await page.waitForTimeout(300);

      // Check native validity API
      const isInvalid = await contactPage.emailField.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );

      // Check for visible error element
      const errorEl = page.locator(
        '[role="alert"], [class*="error"], [class*="invalid"], [aria-invalid="true"]'
      ).first();
      const errorVisible = await errorEl.isVisible().catch(() => false);

      expect(
        isInvalid || errorVisible,
        'Invalid email should fail native validation or show an error message'
      ).toBe(true);
    } else {
      // Skip gracefully if the email field is inside an iframe (e.g., HubSpot)
      test.skip();
    }
  });

  test('form has a clearly labelled submit button', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();

    await assertVisible(contactPage.submitButton, 'Submit button');

    const buttonText = await contactPage.submitButton.textContent();
    const buttonValue = await contactPage.submitButton.getAttribute('value');
    const label = buttonText?.trim() || buttonValue?.trim() || '';

    expect(
      label.length,
      'Submit button should have non-empty label text'
    ).toBeGreaterThan(0);
  });
});
