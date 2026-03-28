# 🎭 Playwright Web Automation — ManageXR

> End-to-end UI test suite using **TypeScript + Playwright** targeting [ManageXR](https://managexr.com) — a real-world XR device management platform. Covers critical user flows: landing page, pricing, navigation, forms, and responsive layout.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Page Object Model](#page-object-model)
- [Visual Regression](#visual-regression)
- [CI/CD Integration](#cicd-integration)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Type-safe test code |
| Playwright | Browser automation (Chromium, Firefox, WebKit) |
| @playwright/test | Built-in test runner |
| Allure Playwright | Rich HTML reports |
| GitHub Actions | CI pipeline |
| dotenv | Environment config |

---

## Project Structure

```
playwright-web-testing/
├── pages/
│   ├── BasePage.ts              # Shared helpers (waitForLoad, scroll, etc.)
│   ├── HomePage.ts              # managexr.com home POM
│   ├── PricingPage.ts           # /pricing POM
│   ├── FeaturesPage.ts          # /features POM
│   └── ContactPage.ts           # Contact/demo request form POM
├── tests/
│   ├── smoke/
│   │   └── homepage.smoke.test.ts    # Critical path smoke tests
│   ├── navigation/
│   │   └── nav.test.ts               # Header nav links, footer links
│   ├── pricing/
│   │   └── pricing.test.ts           # Pricing page content & CTA tests
│   ├── forms/
│   │   └── demoRequest.test.ts       # Demo request form validation
│   ├── responsive/
│   │   └── responsive.test.ts        # Mobile/tablet breakpoint tests
│   └── visual/
│       └── homepage.visual.test.ts   # Screenshot regression tests
├── fixtures/
│   └── testData.ts                   # Static test data
├── utils/
│   ├── assertions.ts                 # Custom assertion helpers
│   └── networkHelpers.ts             # Route interception utils
├── .github/
│   └── workflows/
│       └── playwright-tests.yml
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/inessaGit/playwright-web-testing.git
cd playwright-web-testing

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. Copy environment config
cp .env.example .env
```

---

## Configuration

```env
# .env
BASE_URL=https://managexr.com
HEADLESS=true
SLOW_MO=0
```

### `playwright.config.ts` highlights

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['allure-playwright']],
  use: {
    baseURL: process.env.BASE_URL || 'https://managexr.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
});
```

---

## Running Tests

```bash
# Run all tests (all browsers)
npx playwright test

# Run smoke tests only
npx playwright test tests/smoke/

# Run in headed mode (visible browser)
npx playwright test --headed

# Run specific browser only
npx playwright test --project=chromium

# Run with UI mode (interactive)
npx playwright test --ui

# Generate and open HTML report
npx playwright show-report

# Generate Allure report
npm run allure:generate
npm run allure:open
```

---

## Test Suites

### 🚨 Smoke Tests — `tests/smoke/homepage.smoke.test.ts`

| Test | Assertion |
|------|-----------|
| Page loads successfully | HTTP 200, title contains "ManageXR" |
| Hero section visible | Heading and CTA button present |
| Navigation bar renders | All top-level nav items visible |
| Footer renders | Footer links and copyright present |
| No console errors on load | `console.error` listener captures zero errors |

### 🧭 Navigation Tests

| Test | Assertion |
|------|-----------|
| Pricing link navigates to /pricing | URL match, page heading visible |
| Features link navigates to /features | URL match |
| Logo click returns to home | URL = base URL |
| All footer links resolve (no 404) | Response status 200 for each href |
| Mobile hamburger menu opens | Menu drawer visible on mobile viewport |

### 💰 Pricing Page Tests

| Test | Assertion |
|------|-----------|
| Pricing tiers are displayed | At least 2 pricing cards visible |
| Each tier has a CTA button | Button text contains "Get Started" or "Contact" |
| Monthly/Annual toggle works | Price text changes on toggle |
| Page is accessible (ARIA) | No critical axe violations |

### 📝 Demo Request Form Tests

| Test | Assertion |
|------|-----------|
| Form renders all required fields | Name, email, company, message fields present |
| Submit with empty form shows errors | Validation messages visible |
| Invalid email shows error | Error on blur |
| Valid submission triggers network call | POST request intercepted and validated |

### 📱 Responsive Tests

| Viewport | Tests |
|----------|-------|
| 1920×1080 | Full desktop layout, no overflow |
| 1280×800 | Standard laptop, nav fully visible |
| 768×1024 | Tablet, hamburger menu present |
| 390×844 | iPhone 14, full mobile layout |

---

## Page Object Model

```typescript
// pages/HomePage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly ctaButton: Locator;
  readonly navPricing: Locator;
  readonly navFeatures: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading  = page.locator('h1').first();
    this.ctaButton    = page.getByRole('link', { name: /get started|request demo/i }).first();
    this.navPricing   = page.getByRole('navigation').getByRole('link', { name: /pricing/i });
    this.navFeatures  = page.getByRole('navigation').getByRole('link', { name: /features/i });
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  async clickPricing() {
    await this.navPricing.click();
    await this.page.waitForURL('**/pricing**');
  }
}
```

---

## Visual Regression

```bash
# Generate baseline screenshots
npx playwright test tests/visual/ --update-snapshots

# Run comparison
npx playwright test tests/visual/
```

Snapshots stored in `tests/visual/__snapshots__/` — committed to git as baseline.

---

## CI/CD Integration

```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          BASE_URL: https://managexr.com
          CI: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

*Part of a QA engineer portfolio. Target site: [managexr.com](https://managexr.com) — XR device management platform.*
