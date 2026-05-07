import { Page, expect } from '@playwright/test';

export class CartPage {
  readonly cartContainer = this.page.locator('[data-test="cart-contents-container"]');
  readonly cartItems = this.page.locator('.cart_item');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  readonly pageTitle = this.page.locator('text=Your Cart');

  constructor(private page: Page) {}

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async isCartPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  async getProductNameInCart(productId: string): Promise<string> {
    const productLocator = this.page.locator(
      `.cart_item:has([data-test="remove-${productId}"]) .inventory_item_name`
    );
    return await productLocator.textContent() || '';
  }

  async getProductPriceInCart(productId: string): Promise<string> {
    const priceLocator = this.page.locator(
      `.cart_item:has([data-test="remove-${productId}"]) .inventory_item_price`
    );
    return await priceLocator.textContent() || '';
  }

  async removeProductFromCart(productId: string): Promise<void> {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  async isEmptyCartMessageVisible(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }
}
