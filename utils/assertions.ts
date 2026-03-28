import { Page, Locator, expect, APIRequestContext } from '@playwright/test';

/**
 * Attaches a console.error listener to the page and asserts that no errors
 * were logged during the test execution window.
 *
 * Usage: call BEFORE navigation, then await the returned checker after actions.
 */
export function collectConsoleErrors(page: Page): () => void {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return () => {
    if (errors.length > 0) {
      throw new Error(
        `Expected no console errors but found ${errors.length}:\n${errors.join('\n')}`
      );
    }
  };
}

/**
 * Asserts that no console.error messages were emitted by the page.
 * Registers the listener, navigates (via the provided callback), then checks.
 *
 * @param page        - Playwright Page instance
 * @param navigateFn  - Async function that triggers navigation / actions
 */
export async function assertNoConsoleErrors(
  page: Page,
  navigateFn: () => Promise<void>
): Promise<void> {
  const checkErrors = collectConsoleErrors(page);
  await navigateFn();
  checkErrors();
}

/**
 * Performs a GET request for `url` and asserts the HTTP response is 2xx.
 *
 * @param request - Playwright APIRequestContext (from `test` fixture)
 * @param url     - Absolute URL to check
 */
export async function assertResponseOk(
  request: APIRequestContext,
  url: string
): Promise<void> {
  const response = await request.get(url);
  expect(
    response.ok(),
    `Expected ${url} to return 2xx but got ${response.status()}`
  ).toBeTruthy();
  await response.dispose();
}

/**
 * Asserts that a locator is visible on the page, with a descriptive label
 * included in the failure message.
 *
 * @param locator - Playwright Locator to check
 * @param label   - Human-readable description for error messages
 * @param timeout - Optional timeout in ms (defaults to 10 000)
 */
export async function assertVisible(
  locator: Locator,
  label: string,
  timeout = 10_000
): Promise<void> {
  await expect(locator, `"${label}" should be visible`).toBeVisible({
    timeout,
  });
}

/**
 * Asserts that the page URL contains the expected substring.
 *
 * @param page     - Playwright Page instance
 * @param fragment - Substring expected in the current URL
 */
export async function assertUrlContains(
  page: Page,
  fragment: string
): Promise<void> {
  await expect(page, `URL should contain "${fragment}"`).toHaveURL(
    new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );
}
