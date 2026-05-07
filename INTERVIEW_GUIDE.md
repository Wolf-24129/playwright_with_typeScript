# 🎤 10-Minute Interview Presentation: Playwright Framework

> **Tip:** Practice this guide until it flows naturally. Speak with confidence and pause for questions.

---

## ⏱️ Time Breakdown (10 Minutes Total)

| Section                          | Time  | What to Cover                            |
| -------------------------------- | ----- | ---------------------------------------- |
| 1. Introduction & App Under Test | 1 min | What we're testing, tech stack           |
| 2. Framework Architecture        | 2 min | Folder structure, design patterns        |
| 3. Page Object Model (POM)       | 2 min | Why POM, code walkthrough                |
| 4. Test Structure & Coverage     | 2 min | Test files, scenarios, data-driven tests |
| 5. Configuration & Environment   | 1 min | Config files, env variables, browsers    |
| 6. Reporting & CI/CD             | 1 min | Allure reports, test execution           |
| 7. Key Highlights & Closing      | 1 min | Best practices, your contributions       |

---

## 📌 Section 1: Introduction & App Under Test (1 min)

**Script:**

> "I built an end-to-end automation framework using **Playwright with TypeScript** to test the **SauceDemo e-commerce application**.
>
> The application is a standard e-commerce site with login, product inventory, shopping cart, and checkout flows.
>
> **Tech Stack:** Playwright, TypeScript, Allure Reporting, Page Object Model pattern."

**Key Points:**

- Target: https://www.saucedemo.com
- Framework: Playwright + TypeScript
- Reporting: Allure + HTML
- Pattern: Page Object Model (POM)

---

## 📌 Section 2: Framework Architecture (2 min)

**Script:**

> "Let me walk you through the project structure. We follow a clean, modular architecture:"

**Show/Explain Folder Structure:**

```
playwright-assignment/
├── config/               # Configuration & test data
│   ├── config.ts         # Environment config (URL, timeout, headless)
│   ├── credentials.ts    # User credentials (valid, locked, invalid)
│   └── testData.ts       # Products & login test data arrays
├── pages/                # Page Object Model classes
│   ├── LoginPage.ts      # Login page elements & actions
│   ├── InventoryPage.ts  # Product page elements & actions
│   └── CartPage.ts       # Cart page elements & actions
├── tests/                # Test specifications
│   ├── login.spec.ts     # 15 login tests
│   └── cart.spec.ts      # 11 cart tests
├── utils/                # Reusable utilities
│   └── testUtils.ts      # Common helper functions
├── playwright.config.ts  # Playwright global config
└── package.json          # Scripts & dependencies
```

**Key Points:**

- **Separation of Concerns:** Pages, tests, config, and utilities are separated
- **Scalability:** Easy to add new pages and tests
- **Maintainability:** Changes in UI only require updates in page classes

---

## 📌 Section 3: Page Object Model (POM) (2 min)

**Script:**

> "We use the **Page Object Model** pattern to separate page-specific locators and actions from test logic. This makes tests readable and maintainable."

**Example Walkthrough - `LoginPage.ts`:**

```typescript
export class LoginPage {
  // 1. Locators (selectors)
  readonly usernameField = this.page.locator("#user-name");
  readonly passwordField = this.page.locator("#password");
  readonly loginButton = this.page.locator("#login-button");
  readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(private page: Page) {}

  // 2. Actions (methods)
  async navigateToLoginPage(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  // 3. Assertions helpers
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

**Why POM is Important:**

- If the login button ID changes, update only `LoginPage.ts` — not 15 tests
- Tests read like plain English: `loginPage.login(user, pass)`
- Reusability across multiple test files

**Mention Other Pages:**

- `InventoryPage` handles add/remove products, cart badge, navigation
- `CartPage` handles cart items, checkout, continue shopping

---

## 📌 Section 4: Test Structure & Coverage (2 min)

**Script:**

> "Our test suite is organized by feature with comprehensive positive, negative, and edge case coverage."

### Login Tests (`login.spec.ts`) — 15 Tests

| Category        | Tests                                                         |
| --------------- | ------------------------------------------------------------- |
| **Positive**    | Valid login, page title, logo visibility                      |
| **Negative**    | Locked user, invalid credentials                              |
| **Edge Cases**  | Empty username, empty password, both empty, error persistence |
| **Data-Driven** | 6 scenarios from `loginTestData` array                        |

**Show a Test Example:**

```typescript
test("LOGIN-001: Should login successfully with valid credentials", async ({
  page,
}) => {
  test.info().annotations.push({ type: "severity", description: "Critical" });
  test.info().annotations.push({ type: "tag", description: "Smoke" });

  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();

  const isLoaded = await loginPage.isLoginPageLoaded();
  expect(isLoaded).toBe(true);

  await loginPage.fillUsername(credentials.validUser.username);
  await loginPage.fillPassword(credentials.validUser.password);
  await loginPage.clickLoginButton();

  await expect(page).toHaveURL(/inventory/);
});
```

### Cart Tests (`cart.spec.ts`) — 11 Tests

| Category        | Tests                                                |
| --------------- | ---------------------------------------------------- |
| **Add to Cart** | Single product, multiple products, cart badge update |
| **Remove**      | From inventory page, from cart page, one of many     |
| **Navigation**  | Cart page, continue shopping, checkout button        |
| **Edge Cases**  | Empty cart, cart persistence after navigation        |

**Highlight Best Practices:**

- **Annotations:** Severity and tags for reporting (Critical, Smoke, Regression)
- **beforeEach hook:** Login before every cart test (DRY principle)
- **Data-driven:** `loginTestData.forEach()` runs 6 scenarios dynamically
- **Assertions:** URL checks, visibility checks, text content validation

---

## 📌 Section 5: Configuration & Environment (1 min)

**Script:**

> "Configuration is environment-agnostic. We support local runs and CI/CD through environment variables."

**Show `config/config.ts`:**

```typescript
export const config = {
  baseURL: process.env.BASE_URL || "https://www.saucedemo.com",
  timeout: parseInt(process.env.TIMEOUT || "30000"),
  headless: process.env.HEADLESS !== "false",
  retries: parseInt(process.env.RETRIES || "0"),
  workers: parseInt(process.env.WORKERS || "4"),
};
```

**Show `playwright.config.ts`:**

```typescript
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["allure-playwright"]],
  use: {
    baseURL: process.env.BASE_URL || "https://www.saucedemo.com",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
};
```

**Key Points:**

- Environment variables for flexibility (`BASE_URL`, `HEADLESS`, `CI`)
- Parallel execution locally (`workers: 4`), sequential in CI (`workers: 1`)
- Auto-screenshot/video/trace on failure for debugging
- Multi-browser support ready (chromium, firefox, webkit)

---

## 📌 Section 6: Reporting & Test Execution (1 min)

**Script:**

> "We have rich reporting with both HTML and Allure, plus convenient npm scripts for different execution modes."

**Show `package.json` Scripts:**

```json
{
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:chromium": "playwright test --project=chromium",
  "test:smoke": "playwright test --grep @smoke",
  "test:regression": "playwright test --grep @regression",
  "test:login": "playwright test tests/login.spec.ts",
  "test:parallel": "playwright test --workers=4",
  "allure:report": "npm run allure:generate && npm run allure:open",
  "report:html": "npx playwright show-report"
}
```

**Reporting Features:**

- **HTML Report:** Built-in Playwright report with screenshots, videos, traces
- **Allure Report:** Rich dashboards with severity, tags, trends, history
- **Annotations:** Tests tagged as `Smoke`, `Regression`, `Critical`, `High`
- **Artifacts:** Screenshots and videos captured only on failure (efficient storage)

**Execution Modes:**

- Headless for CI, headed for local debugging
- Filter by tags (`@smoke`, `@regression`)
- Run specific test files or projects

---

## 📌 Section 7: Key Highlights & Closing (1 min)

**Script:**

> "To summarize, here are the key strengths of this framework:"

### ✅ Best Practices Implemented

1. **Page Object Model** — Clean separation, easy maintenance
2. **Data-Driven Testing** — External test data arrays for scalability
3. **Environment Configurability** — ENV variables for CI/CD compatibility
4. **Comprehensive Coverage** — Positive, negative, edge cases
5. **Rich Reporting** — Allure + HTML with artifacts
6. **Parallel Execution** — Fast feedback with configurable workers
7. **Type Safety** — TypeScript for robust code
8. **Reusable Utilities** — Common helpers in `testUtils.ts`

### 💡 What Makes It Interview-Ready

- **Scalable:** Add new pages/tests with minimal effort
- **Maintainable:** UI changes isolated to page classes
- **Professional:** Reporting, tagging, annotations, CI-ready
- **Practical:** Real-world e-commerce scenarios

### 🎯 Closing Statement

> "This framework demonstrates my ability to design production-ready automation solutions using industry best practices. I'm confident it can scale to larger applications and integrate seamlessly into CI/CD pipelines."

---

## 🛡️ Possible Interview Questions & Answers

### Q1: Why Playwright over Selenium or Cypress?

**A:** Playwright offers native parallel execution, auto-waiting, multi-browser support, built-in tracing, and faster execution. It handles modern web apps better with less flaky tests.

### Q2: How do you handle test data?

**A:** Test data is externalized in `config/testData.ts` and `config/credentials.ts`. For data-driven tests, we iterate over arrays. In a real project, I'd use a test data manager or API fixtures.

### Q3: How would you run this in CI/CD?

**A:** Set `CI=true`, `HEADLESS=true`, use `workers=1` for stability. Playwright integrates with GitHub Actions, Jenkins, Azure DevOps. Artifacts (screenshots/videos) upload on failure.

### Q4: How do you handle flaky tests?

**A:** Playwright's auto-waiting reduces flakiness. We use `retries` in CI, `networkidle` waits, and stable selectors. Traces and videos help debug when failures occur.

### Q5: How would you extend this framework?

**A:** Add API testing layer with `request` fixture, integrate with TestRail for test management, add visual regression with screenshots, implement database validation helpers.

---

## 📝 Quick Reference Card

| Topic         | One-Liner                          |
| ------------- | ---------------------------------- |
| **Framework** | Playwright + TypeScript            |
| **Pattern**   | Page Object Model (POM)            |
| **App**       | SauceDemo e-commerce               |
| **Tests**     | 26 total (15 login + 11 cart)      |
| **Reporting** | Allure + HTML                      |
| **Parallel**  | Yes, configurable workers          |
| **CI-Ready**  | Yes, env variable driven           |
| **Browsers**  | Chromium (extensible to FF/WebKit) |

---

> **Final Tip:** Open the actual code files during the interview if screen sharing. Walk through `LoginPage.ts` → `login.spec.ts` → `playwright.config.ts` in that order. It tells a cohesive story! 🚀
