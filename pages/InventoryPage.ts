import { Page, expect } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge = this.page.locator('.shopping_cart_badge');
  readonly cartLink = this.page.locator('.shopping_cart_link');
  readonly pageTitle = this.page.locator('span:has-text("Products")');
  readonly sortDropdown = this.page.locator('[data-test="product_sort_container"]');

  constructor(private page: Page) {}

  async addProductToCart(productId: string): Promise<void> {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await addButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async removeProductFromCart(productId: string): Promise<void> {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.textContent() || '0';
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isInventoryPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  async getProductPrice(productId: string): Promise<string> {
    const priceLocator = this.page.locator(
      `[data-test="inventory-item-${productId}"] .inventory_item_price`
    );
    return await priceLocator.textContent() || '';
  }

  async getProductName(productId: string): Promise<string> {
    const nameLocator = this.page.locator(
      `[data-test="inventory-item-${productId}"] .inventory_item_name`
    );
    return await nameLocator.textContent() || '';
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }
}
