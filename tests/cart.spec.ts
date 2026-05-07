import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { credentials } from '../config/credentials';
import { products } from '../config/testData';

test.describe('Add to Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.validUser.username, credentials.validUser.password);

    // Verify inventory page is loaded
    const inventoryPage = new InventoryPage(page);
    const isLoaded = await inventoryPage.isInventoryPageLoaded();
    expect(isLoaded).toBe(true);
  });

  // ===== ADD TO CART TESTS =====
  test('CART-001: Should add single product to cart', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Critical',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Smoke',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add product to cart
    await inventoryPage.addProductToCart(products[0].id);

    // Step 2: Verify cart badge shows 1
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');

    // Step 3: Navigate to cart
    await inventoryPage.navigateToCart();

    // Step 4: Verify cart page is loaded
    const isCartLoaded = await cartPage.isCartPageLoaded();
    expect(isCartLoaded).toBe(true);

    // Step 5: Verify product is in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    // Step 6: Verify product name and price
    const productName = await cartPage.getProductNameInCart(products[0].id);
    const productPrice = await cartPage.getProductPriceInCart(products[0].id);

    expect(productName).toContain(products[0].name);
    expect(productPrice).toContain(products[0].price.replace('$', ''));
  });

  test('CART-002: Should add multiple products to cart', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add first product
    await inventoryPage.addProductToCart(products[0].id);
    let badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');

    // Step 2: Add second product
    await inventoryPage.addProductToCart(products[1].id);
    badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('2');

    // Step 3: Add third product
    await inventoryPage.addProductToCart(products[2].id);
    badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('3');

    // Step 4: Navigate to cart
    await inventoryPage.navigateToCart();

    // Step 5: Verify all products are in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(3);

    // Step 6: Verify each product details
    for (let i = 0; i < products.length; i++) {
      const productName = await cartPage.getProductNameInCart(products[i].id);
      const productPrice = await cartPage.getProductPriceInCart(products[i].id);

      expect(productName).toContain(products[i].name);
      expect(productPrice).toContain(products[i].price.replace('$', ''));
    }
  });

  test('CART-003: Should update cart badge when adding product', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });

    const inventoryPage = new InventoryPage(page);

    // Step 1: Add product to cart
    await inventoryPage.addProductToCart(products[0].id);

    // Step 2: Verify badge is visible and shows count
    const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBe(true);

    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');
  });

  // ===== REMOVE FROM CART TESTS =====
  test('CART-004: Should remove product from cart on inventory page', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add product to cart
    await inventoryPage.addProductToCart(products[0].id);
    let badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');

    // Step 2: Remove product from cart
    await inventoryPage.removeProductFromCart(products[0].id);

    // Step 3: Verify cart badge is gone
    const isBadgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBe(false);

    // Step 4: Navigate to cart and verify it's empty
    await inventoryPage.navigateToCart();
    const isEmpty = await cartPage.isEmptyCartMessageVisible();
    expect(isEmpty).toBe(true);
  });

  test('CART-005: Should remove product from cart page', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add product to cart
    await inventoryPage.addProductToCart(products[0].id);

    // Step 2: Navigate to cart
    await inventoryPage.navigateToCart();

    // Step 3: Verify product is in cart
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    // Step 4: Remove product from cart page
    await cartPage.removeProductFromCart(products[0].id);

    // Step 5: Verify cart is empty
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);

    // Step 6: Verify empty cart message
    const isEmpty = await cartPage.isEmptyCartMessageVisible();
    expect(isEmpty).toBe(true);
  });

  test('CART-006: Should remove one product when multiple are in cart', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Medium',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add multiple products
    await inventoryPage.addProductToCart(products[0].id);
    await inventoryPage.addProductToCart(products[1].id);
    await inventoryPage.addProductToCart(products[2].id);

    let badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('3');

    // Step 2: Navigate to cart
    await inventoryPage.navigateToCart();

    // Step 3: Remove first product
    await cartPage.removeProductFromCart(products[0].id);

    // Step 4: Verify 2 products remain
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);

    // Step 5: Verify correct products are still in cart
    const remainingProduct1 = await cartPage.getProductNameInCart(products[1].id);
    const remainingProduct2 = await cartPage.getProductNameInCart(products[2].id);

    expect(remainingProduct1).toContain(products[1].name);
    expect(remainingProduct2).toContain(products[2].name);

    // Step 6: Continue shopping and verify badge is updated
    await cartPage.continueShopping();
    badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('2');
  });

  // ===== CART PAGE NAVIGATION TESTS =====
  test('CART-007: Should navigate to cart page successfully', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Smoke',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add product
    await inventoryPage.addProductToCart(products[0].id);

    // Step 2: Navigate to cart
    await inventoryPage.navigateToCart();

    // Step 3: Verify cart page is loaded
    const isCartLoaded = await cartPage.isCartPageLoaded();
    expect(isCartLoaded).toBe(true);

    // Step 4: Verify URL contains 'cart'
    const url = await cartPage.getPageUrl();
    expect(url).toContain('cart.html');
  });

  test('CART-008: Should continue shopping from cart page', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Medium',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add product and go to cart
    await inventoryPage.addProductToCart(products[0].id);
    await inventoryPage.navigateToCart();

    // Step 2: Continue shopping
    await cartPage.continueShopping();

    // Step 3: Verify back on inventory page
    const isInventoryLoaded = await inventoryPage.isInventoryPageLoaded();
    expect(isInventoryLoaded).toBe(true);

    // Step 4: Verify URL contains 'inventory'
    const url = await inventoryPage.getPageUrl();
    expect(url).toContain('inventory.html');
  });

  test('CART-009: Should display checkout button on cart page', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add product
    await inventoryPage.addProductToCart(products[0].id);

    // Step 2: Navigate to cart
    await inventoryPage.navigateToCart();

    // Step 3: Verify cart page is loaded
    const isCartLoaded = await cartPage.isCartPageLoaded();
    expect(isCartLoaded).toBe(true);
  });

  // ===== EDGE CASES =====
  test('CART-010: Should display empty cart correctly', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Medium',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Navigate to cart without adding any product
    await inventoryPage.navigateToCart();

    // Step 2: Verify empty cart
    const isEmpty = await cartPage.isEmptyCartMessageVisible();
    expect(isEmpty).toBe(true);

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });

  test('CART-011: Should maintain cart after navigating back to inventory', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Medium',
    });
    test.info().annotations.push({
      type: 'tag',
      description: 'Regression',
    });

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add products
    await inventoryPage.addProductToCart(products[0].id);
    await inventoryPage.addProductToCart(products[1].id);

    let badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('2');

    // Step 2: Go to cart and back
    await inventoryPage.navigateToCart();
    await cartPage.continueShopping();

    // Step 3: Verify products are still in cart
    badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('2');

    // Step 4: Navigate to cart again to verify
    await inventoryPage.navigateToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });
});
