# Contributing to Playwright Automation Framework

This document provides guidelines for extending and maintaining the automation framework.

## 📋 Table of Contents

- [Adding New Tests](#adding-new-tests)
- [Creating Page Objects](#creating-page-objects)
- [Test Naming Conventions](#test-naming-conventions)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Adding New Tests

### Step 1: Create Test File

Create a new `.spec.ts` file in the `tests/` directory:

```typescript
// tests/newFeature.spec.ts
import { test, expect } from '@playwright/test';
import { NewPage } from '../pages/NewPage';

test.describe('New Feature', () => {
  test('TEST-001: Descriptive test name', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Smoke',
    });

    const newPage = new NewPage(page);
    
    // Step 1: Action
    await newPage.someAction();
    
    // Step 2: Verification
    expect(result).toBe(expected);
  });
});
```

### Step 2: Use Existing Page Objects

Import and use page objects instead of creating locators in tests:

```typescript
// ✓ Good
const loginPage = new LoginPage(page);
await loginPage.login(username, password);

// ✗ Bad
await page.locator('#user-name').fill(username);
await page.locator('#password').fill(password);
```

---

## Creating Page Objects

### Step 1: Create Page Class

Create a new page object file in `pages/` directory:

```typescript
// pages/NewPage.ts
import { Page, expect } from '@playwright/test';

export class NewPage {
  readonly elementLocator = this.page.locator('[data-test="element"]');
  readonly button = this.page.locator('[data-test="button"]');

  constructor(private page: Page) {}

  async navigateToPage(): Promise<void> {
    await this.page.goto('/path/to/page');
    await this.page.waitForLoadState('networkidle');
  }

  async performAction(): Promise<void> {
    await this.elementLocator.click();
  }

  async getElement Text(): Promise<string> {
    return await this.elementLocator.textContent() || '';
  }
}
```

### Step 2: Best Practices for Page Objects

#### Use Meaningful Locator Names
```typescript
// ✓ Good
readonly loginButton = this.page.locator('[data-test="login-button"]');

// ✗ Bad
readonly btn = this.page.locator('button');
```

#### Use Readonly Properties
```typescript
// ✓ Good
readonly element = this.page.locator('[data-test="element"]');

// ✗ Bad
element = this.page.locator('[data-test="element"]');
```

#### Encapsulate Complex Interactions
```typescript
// ✓ Good - method encapsulates the interaction
async fillLoginForm(username: string, password: string): Promise<void> {
  await this.usernameField.fill(username);
  await this.passwordField.fill(password);
  await this.loginButton.click();
}

// ✗ Bad - spreading logic across test
await page.locator('#user-name').fill(username);
await page.locator('#password').fill(password);
await page.locator('#login-button').click();
```

---

## Test Naming Conventions

### Test File Naming
```
<feature>.spec.ts

Examples:
- login.spec.ts
- checkout.spec.ts
- profile.spec.ts
```

### Test Case Naming
```
<ID>: <Feature> - <Scenario>

Examples:
- LOGIN-001: Login - Valid credentials
- CART-002: Add to Cart - Multiple products
- CHECKOUT-003: Checkout - Invalid card
```

### Test Groups (describe blocks)
```typescript
test.describe('Feature Name', () => {
  // Tests organized by feature
});
```

---

## Best Practices

### 1. Wait Strategies

```typescript
// ✓ Good - Wait for network
await this.page.waitForLoadState('networkidle');

// ✓ Good - Wait for locator
await this.element.waitFor({ state: 'visible', timeout: 5000 });

// ✗ Bad - Hard wait
await this.page.waitForTimeout(5000);
```

### 2. Assertions

```typescript
// ✓ Good - Specific assertions
expect(await cartPage.getItemCount()).toBe(3);

// ✗ Bad - Generic assertions
expect(true).toBe(true);
```

### 3. Test Data

```typescript
// ✓ Good - Centralized test data
import { credentials } from '../config/testData';
await loginPage.login(credentials.validUser.username, credentials.validUser.password);

// ✗ Bad - Hardcoded test data
await loginPage.login('standard_user', 'secret_sauce');
```

### 4. Error Messages

```typescript
// ✓ Good - Meaningful error context
expect(errorMessage, 'Login error should indicate locked account')
  .toContain('locked out');

// ✗ Bad - No context
expect(errorMessage).toContain('locked out');
```

---

## Common Patterns

### Page Navigation

```typescript
async navigateToPage(): Promise<void> {
  await this.page.goto('/path/to/page');
  await this.page.waitForLoadState('networkidle');
}
```

### Form Filling

```typescript
async fillForm(data: FormData): Promise<void> {
  await this.fieldOne.fill(data.fieldOne);
  await this.fieldTwo.fill(data.fieldTwo);
  await this.submitButton.click();
  await this.page.waitForLoadState('networkidle');
}
```

### Verification Method

```typescript
async isPageLoaded(): Promise<boolean> {
  return await this.pageTitle.isVisible();
}
```

### Getting Element Content

```typescript
async getElementValue(): Promise<string> {
  return await this.element.textContent() || '';
}

async getInputValue(): Promise<string> {
  return await this.inputField.inputValue();
}
```

### Handling Multiple Elements

```typescript
async getListItems(): Promise<string[]> {
  return await this.page.locator('[data-test="list-item"]').allTextContents();
}

async getItemCount(): Promise<number> {
  return await this.page.locator('[data-test="list-item"]').count();
}
```

---

## Running and Debugging

### Debug a Failing Test

```bash
npx playwright test --debug tests/login.spec.ts -g "LOGIN-001"
```

### Run a Single Test

```bash
npx playwright test tests/login.spec.ts -g "LOGIN-001"
```

### Run Tests in Headed Mode

```bash
npm run test:headed
```

### View Test Report

```bash
npm run report:html
```

---

## Code Organization Tips

### Directory Structure
```
pages/
  ├── BasePage.ts          (Optional base class)
  ├── LoginPage.ts
  ├── InventoryPage.ts
  └── CartPage.ts

tests/
  ├── login.spec.ts
  ├── cart.spec.ts
  └── checkout.spec.ts

config/
  ├── credentials.ts
  ├── testData.ts
  ├── config.ts
  └── env.ts

utils/
  ├── testUtils.ts
  └── apiUtils.ts

hooks/
  ├── beforeEach.ts
  └── afterEach.ts
```

---

## CI/CD Integration

All tests automatically run in CI with:
- Multiple browsers (Chromium, Firefox, WebKit)
- Multiple Node versions (16.x, 18.x)
- Automatic retry on failure (2 retries)
- Screenshots/videos on failure
- Allure report generation

See `.github/workflows/playwright.yml` for details.

---

## Checklist for New Tests

- [ ] Test file created in `tests/` directory
- [ ] Uses page objects from `pages/` directory
- [ ] Has test ID (e.g., LOGIN-001)
- [ ] Has severity annotation
- [ ] Has tag annotation (@smoke or @regression)
- [ ] Has numbered steps
- [ ] Uses centralized test data
- [ ] Assertions are meaningful
- [ ] No hardcoded waits (waitForTimeout)
- [ ] Test data is separated from test logic
- [ ] Test can run independently
- [ ] Test cleans up after itself
- [ ] README updated if needed

---

## Questions or Issues?

1. Check existing tests for patterns
2. Review page objects for reusable methods
3. Consult Playwright documentation
4. Run in debug mode to troubleshoot

Happy testing! 🚀
