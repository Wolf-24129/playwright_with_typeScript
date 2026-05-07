# Playwright QA Automation Assignment

This project demonstrates a comprehensive QA automation framework built with Playwright and integrated with Allure Reporting. It provides extensive test coverage for login and shopping cart functionality on [Sauce Labs Demo](https://www.saucedemo.com).

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Installation Steps](#installation-steps)
- [Running Tests](#running-tests)
- [Generating Allure Report](#generating-allure-report)
- [Framework Structure](#framework-structure)
- [Test Coverage](#test-coverage)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)
- [Optional Enhancements Implemented](#optional-enhancements-implemented)

---

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js**: Version 16 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Allure CLI**: Required for report generation
- **Git**: For version control

### Install Allure CLI

Choose one of the following methods based on your system:

#### Windows (npm - Recommended)

```bash
npm install -g allure-commandline
```

#### Windows (Scoop)

```bash
scoop install allure
```

#### Windows (Chocolatey)

```bash
choco install allure
```

#### macOS

```bash
brew install allure
```

#### Linux

```bash
sudo apt-add-repository ppa:qameta/allure
sudo apt-get update
sudo apt-get install allure
```

Verify installation:

```bash
allure --version
```

---

## 📦 Installation Steps

1. **Clone or extract the repository:**

   ```bash
   cd playwright-assignment
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```

---

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run specific test file

```bash
npx playwright test tests/login.spec.ts
npx playwright test tests/cart.spec.ts
```

### Run tests with specific tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### Run tests in headed mode (see browser)

```bash
npx playwright test --headed
```

### Run tests with specific project/browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run single test

```bash
npx playwright test tests/login.spec.ts -g "LOGIN-001"
```

---

## 📊 Generating Allure Report

### Generate Allure Report

```bash
npm run allure:generate
```

This command:

- Processes test results from the `allure-results/` directory
- Generates HTML report in the `allure-report/` directory
- Cleans up previous results

### View Allure Report

```bash
npm run allure:open
```

This command opens the generated Allure report in your default browser.

### Combined: Generate and Open Report

```bash
npm run allure:generate && npm run allure:open
```

---

## 📁 Framework Structure

```
playwright-assignment/
├── config/
│   ├── credentials.ts          # User credentials and base URL
│   └── testData.ts             # Test data for data-driven tests
├── pages/
│   ├── LoginPage.ts            # Page Object Model for login page
│   ├── InventoryPage.ts        # Page Object Model for inventory page
│   └── CartPage.ts             # Page Object Model for cart page
├── tests/
│   ├── login.spec.ts           # Login functionality tests
│   └── cart.spec.ts            # Shopping cart tests
├── allure-results/             # Test execution results (auto-generated)
├── allure-report/              # Generated HTML reports (auto-generated)
├── test-results/               # Playwright HTML reports (auto-generated)
├── playwright.config.ts        # Playwright configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

### Key Directories

#### `config/`

- **credentials.ts**: Centralized credential management for different user types
- **testData.ts**: Test data including product information and login scenarios

#### `pages/`

Implements the **Page Object Model (POM)** pattern:

- Each page has a dedicated class
- Encapsulates all page locators and interactions
- Provides reusable methods for test logic
- Makes tests more maintainable and scalable

#### `tests/`

- **login.spec.ts**: 13 comprehensive login tests
- **cart.spec.ts**: 11 comprehensive cart tests

---

## ✅ Test Coverage

### Login Tests (13 tests)

#### Positive Scenarios

- LOGIN-001: Valid login with correct credentials
- LOGIN-002: Login page title validation
- LOGIN-003: Swag Labs logo visibility

#### Negative Scenarios

- LOGIN-004: Locked out user cannot login
- LOGIN-005: Invalid credentials error handling

#### Edge Cases

- LOGIN-006: Empty username validation
- LOGIN-007: Empty password validation
- LOGIN-008: Empty credentials validation
- LOGIN-009: Error message clearing

#### Data-Driven Tests

- LOGIN-010: Multiple login scenarios (parameterized)

**Assertions Validate:**

- ✓ Page URL
- ✓ Page title
- ✓ Successful navigation
- ✓ Error message text
- ✓ Error UI visibility
- ✓ Form field states

### Cart Tests (11 tests)

#### Add to Cart

- CART-001: Single product addition
- CART-002: Multiple products addition
- CART-003: Cart badge count validation

#### Remove from Cart

- CART-004: Remove from inventory page
- CART-005: Remove from cart page
- CART-006: Remove one from multiple products

#### Navigation & State

- CART-007: Cart page navigation
- CART-008: Continue shopping functionality
- CART-009: Checkout button availability

#### Edge Cases

- CART-010: Empty cart display
- CART-011: Cart persistence after navigation

**Assertions Validate:**

- ✓ Product name in cart
- ✓ Product price in cart
- ✓ Cart item count
- ✓ Cart badge count
- ✓ Page URLs
- ✓ Empty cart state

---

## 🏗️ Design Decisions

### 1. **Page Object Model (POM)**

- **Why**: Separates test logic from UI implementation details
- **Benefit**: Changes to UI only require updates in page objects, not tests
- **Organization**: Each page has its own class with locators and methods

### 2. **Configuration Management**

- **Why**: Centralized credentials and data management
- **Benefit**: Easy to change test data without modifying tests
- **Files**: `config/credentials.ts` and `config/testData.ts`

### 3. **Data-Driven Testing**

- **Why**: Tests multiple scenarios with different data sets
- **Benefit**: Reduces code duplication and improves coverage
- **Implementation**: `loginTestData` array in `testData.ts`

### 4. **Allure Reporting**

- **Why**: Provides detailed, visual test reports
- **Features**: Test descriptions, severity levels, tags, steps, screenshots on failure
- **Integration**: `allure-playwright` reporter in `playwright.config.ts`

### 5. **Meaningful Locators**

- **Why**: Uses data-test attributes instead of generic CSS/XPath
- **Benefit**: More stable tests, less flaky
- **Pattern**: `[data-test="element-name"]`

### 6. **Test Independence**

- **Why**: Each test can run independently without depending on others
- **Implementation**: Each test has its own setup via `beforeEach`
- **Benefit**: Parallel execution support

### 7. **Stable Waits**

- **Why**: Avoids hard-coded `waitForTimeout()`
- **Implementation**: Uses `waitForLoadState()` and locator assertions
- **Benefit**: Tests are more reliable and faster

---

## 📝 Assumptions

1. **Test Environment**: All tests are designed to run against [saucedemo.com](https://www.saucedemo.com)
2. **Valid Credentials**: Standard user credentials (`standard_user` / `secret_sauce`) are always available
3. **Product Availability**: Test products (Backpack, Bike Light, Bolt T-Shirt) are always in inventory
4. **Test Data Stability**: Product names and prices remain consistent
5. **Parallel Execution**: Tests are designed to support parallel execution with proper isolation
6. **No Side Effects**: Tests clean up their own data (cart is cleared between tests via logout)
7. **Network Connectivity**: Tests require stable internet connection to access the application
8. **Allure CLI**: Allure command-line tool is installed globally for report generation

---

## 🎁 Optional Enhancements Implemented

### 1. **Data-Driven Testing** ✓

- Parameterized login tests with multiple user types and credentials
- Centralized test data in `config/testData.ts`
- Reduces code duplication and improves maintainability

### 2. **Smoke vs Regression Tagging** ✓

- Tests tagged with `@smoke` for critical functionality
- Tests tagged with `@regression` for comprehensive coverage
- Severity levels: Critical, High, Medium, Low, Minor
- Easy filtering: `npm test -- --grep @smoke`

### 3. **Allure Test Steps** ✓

- Each test has numbered steps (Step 1, Step 2, etc.)
- Clear and readable in Allure report
- Facilitates debugging and root cause analysis

### 4. **Session Management** ✓

- Proper login/logout for test isolation
- BeforeEach hooks ensure fresh state
- Cart is cleared between tests

### 5. **CI-Ready Setup** ✓

- Configured for parallel execution
- Retry mechanism for flaky tests (2 retries in CI)
- Screenshots and videos on failure
- Trace collection on first retry

### 6. **Separation of Test Data** ✓

- Credentials in `config/credentials.ts`
- Test data in `config/testData.ts`
- Easy to update without modifying test logic

### 7. **Enhanced Locators** ✓

- Uses data-test attributes (most stable)
- Fallback to semantic locators
- Avoids brittle XPath/CSS selectors

### 8. **Comprehensive Assertions** ✓

- URL validation
- Title validation
- Visual element checks
- Text content validation
- State verification

---

## 🔧 Configuration Details

### `playwright.config.ts`

```typescript
{
  testDir: './tests',
  fullyParallel: true,           // Enable parallel execution
  forbidOnly: true,              // Fail if .only() is used in CI
  retries: 2,                    // Retry failed tests in CI
  use: {
    baseURL: 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',  // Capture screenshots on failure
    video: 'retain-on-failure',     // Record video on failure
    trace: 'on-first-retry',        // Trace on first retry
  },
  reporter: [
    'html',              // HTML report
    'allure-playwright', // Allure report
  ],
}
```

---

## 📈 Test Execution Flow

### For Each Test:

1. Browser launches
2. Navigate to login page
3. Login with credentials (from `beforeEach`)
4. Inventory page loads (verified)
5. Execute test-specific actions
6. Verify assertions
7. Browser closes

### Report Generation:

1. Run `npm test` → Creates JSON results in `allure-results/`
2. Run `npm run allure:generate` → Creates HTML report in `allure-report/`
3. Run `npm run allure:open` → Opens report in browser

---

## 🐛 Troubleshooting

### Tests not running

```bash
npm install
npx playwright install
```

### Allure report not generating

```bash
# Verify Allure is installed
allure --version

# If not installed, install globally
npm install -g allure-commandline
```

### Screenshots not appearing

- Ensure tests are failing (screenshots only on failure by default)
- Check `test-results/` directory

### Locators not finding elements

- Wait for page to load: `page.waitForLoadState('networkidle')`
- Check browser console for errors

---

## 📚 Best Practices Implemented

✓ Page Object Model (POM)
✓ DRY principle (Don't Repeat Yourself)
✓ Stable locators (data-test attributes)
✓ Meaningful test names
✓ Independent tests
✓ Proper waits (no hard waits)
✓ Centralized test data
✓ Clear assertion messages
✓ Screenshot on failure
✓ Allure reporting with steps
✓ Parallel execution support
✓ CI/CD ready

---

## 📞 Support

For issues or questions:

1. Check test logs: `test-results/`
2. View Allure report: `npm run allure:open`
3. Check browser trace: Look in `test-results/` for `.zip` files
4. Debug mode: `npx playwright test --debug`

---

## 📄 License

This project is for educational purposes as part of the QA Automation Assignment.

---

**Last Updated**: April 27, 2026
**Framework Version**: Playwright ^1.43.0
**Node Version**: 16+
