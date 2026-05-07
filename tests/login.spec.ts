import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { credentials } from "../config/credentials";
import { loginTestData } from "../config/testData";

test.describe("Login Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  // ===== POSITIVE TEST CASES =====
  test("LOGIN-001: Should login successfully with valid credentials", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "Critical",
    });
    test.info().annotations.push({
      type: "tag",
      description: "Smoke",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Verify login page is loaded
    const isLoaded = await loginPage.isLoginPageLoaded();
    expect(isLoaded).toBe(true);

    // Step 2: Enter valid username
    await loginPage.fillUsername(credentials.validUser.username);

    // Step 3: Enter valid password
    await loginPage.fillPassword(credentials.validUser.password);

    // Step 4: Click login button
    await loginPage.clickLoginButton();

    // Step 5: Verify successful login - URL should change to inventory page
    await expect(page).toHaveURL(/inventory/);
    expect(page.url()).toContain("inventory.html");
  });

  test("LOGIN-002: Should display correct page title on login page", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "Minor",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Get page title
    const title = await loginPage.getPageTitle();

    // Step 2: Verify page title is correct
    expect(title).toBe("Swag Labs");
  });

  test("LOGIN-003: Should display Swag Labs logo on login page", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "Minor",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Verify login page is loaded (logo is visible)
    const isLoaded = await loginPage.isLoginPageLoaded();
    expect(isLoaded).toBe(true);
  });

  // ===== NEGATIVE TEST CASES =====
  test("LOGIN-004: Should not login with locked out user", async ({ page }) => {
    test.info().annotations.push({
      type: "severity",
      description: "High",
    });
    test.info().annotations.push({
      type: "tag",
      description: "Regression",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Enter locked out user credentials
    await loginPage.login(
      credentials.lockedUser.username,
      credentials.lockedUser.password,
    );

    // Step 2: Verify error message is displayed
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);

    // Step 3: Verify specific error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(
      "Epic sadface: Sorry, this user has been locked out.",
    );

    // Step 4: Verify user remains on login page
    expect(page.url()).not.toContain("inventory");
  });

  test("LOGIN-005: Should not login with invalid credentials", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "High",
    });
    test.info().annotations.push({
      type: "tag",
      description: "Regression",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Enter invalid username and password
    await loginPage.login(
      credentials.invalidUser.username,
      credentials.invalidUser.password,
    );

    // Step 2: Verify error message is displayed
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);

    // Step 3: Verify error message contains expected text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username and password do not match");

    // Step 4: Verify user remains on login page
    expect(page.url()).not.toContain("inventory");
  });

  // ===== EDGE CASES =====
  test("LOGIN-006: Should display error when username is empty", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "High",
    });
    test.info().annotations.push({
      type: "tag",
      description: "Regression",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Leave username empty and fill password
    await loginPage.fillPassword(credentials.validUser.password);

    // Step 2: Click login button
    await loginPage.clickLoginButton();

    // Step 3: Verify error message is displayed
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);

    // Step 4: Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username is required");
  });

  test("LOGIN-007: Should display error when password is empty", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "High",
    });
    test.info().annotations.push({
      type: "tag",
      description: "Regression",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Fill username but leave password empty
    await loginPage.fillUsername(credentials.validUser.username);

    // Step 2: Click login button
    await loginPage.clickLoginButton();

    // Step 3: Verify error message is displayed
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);

    // Step 4: Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Password is required");
  });

  test("LOGIN-008: Should display error when both username and password are empty", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "Medium",
    });
    test.info().annotations.push({
      type: "tag",
      description: "Regression",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Click login without filling any fields
    await loginPage.clickLoginButton();

    // Step 2: Verify error message is displayed
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);

    // Step 3: Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username is required");
  });

  test("LOGIN-009: Should keep error message visible while typing", async ({
    page,
  }) => {
    test.info().annotations.push({
      type: "severity",
      description: "Low",
    });

    const loginPage = new LoginPage(page);

    // Step 1: Trigger an error first
    await loginPage.clickLoginButton();
    let errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);

    // Step 2: Start typing in username field
    await loginPage.fillUsername("test");

    // Step 3: Error should still be visible (app doesn't clear on typing)
    errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBe(true);
  });

  // ===== DATA-DRIVEN TESTS =====
  loginTestData.forEach((testCase) => {
    test(`LOGIN-010-${testCase.scenario}: Should handle login - ${testCase.scenario}`, async ({
      page,
    }) => {
      test.info().annotations.push({
        type: "severity",
        description: "High",
      });
      test.info().annotations.push({
        type: "tag",
        description: "Regression",
      });

      const loginPage = new LoginPage(page);

      // Step 1: Login with provided credentials
      await loginPage.login(testCase.username, testCase.password);

      if (testCase.expectedSuccess) {
        // Step 2: Verify successful login
        await expect(page).toHaveURL(/inventory/);
      } else {
        // Step 2: Verify error is shown
        const errorVisible = await loginPage.isErrorMessageVisible();
        expect(errorVisible).toBe(true);

        // Step 3: Verify error message contains expected text
        const errorMessage = await loginPage.getErrorMessage();
        if (testCase.expectedError) {
          expect(errorMessage).toContain(testCase.expectedError);
        }

        // Step 4: Verify user remains on login page
        expect(page.url()).not.toContain("inventory");
      }
    });
  });
});
